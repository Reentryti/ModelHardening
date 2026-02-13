import argparse
import io
import time
from pathlib import Path
import base64

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Config
IMAGE_SIZE = 224
CLASS_NAMES = [
    "Bean", "Bitter_Gourd", "Bottle_Gourd", "Brinjal", "Broccoli",
    "Cabbage", "Capsicum", "Carrot", "Cauliflower", "Cucumber",
    "Papaya", "Potato", "Pumpkin", "Radish", "Tomato",
]

MEAN = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
STD = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Model loading
def load_model(path: str) -> nn.Module:
    model = models.efficientnet_b0(weights=None)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(0.3, inplace=True),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(256, len(CLASS_NAMES)),
    )
    ckpt = torch.load(path, map_location="cpu", weights_only=False)
    model.load_state_dict(ckpt.get("model_state_dict", ckpt))
    model.eval()
    return model

# Attacks
def fgsm_attack(model: nn.Module, tensor: torch.Tensor, label: int, epsilon: float) -> torch.Tensor:
    inp = tensor.clone().detach().requires_grad_(True)
    loss = F.cross_entropy(model(inp.unsqueeze(0)), torch.tensor([label]))
    model.zero_grad()
    loss.backward()
    return (tensor + epsilon * inp.grad.sign()).detach()

def pgd_attack(model: nn.Module, tensor: torch.Tensor, label: int, epsilon: float, alpha: float = 0.007, steps: int = 10) -> torch.Tensor:
    adv = tensor.clone().detach() + torch.empty_like(tensor).uniform_(-epsilon, epsilon)
    for _ in range(steps):
        adv.requires_grad_(True)
        loss = F.cross_entropy(model(adv.unsqueeze(0)), torch.tensor([label]))
        model.zero_grad()
        loss.backward()
        adv = (adv.detach() + alpha * adv.grad.sign())
        adv = tensor + torch.clamp(adv - tensor, -epsilon, epsilon)
    return adv.detach()

# Utils
def tensor_to_base64(tensor: torch.Tensor) -> str:
    img = (tensor * STD + MEAN).clamp(0, 1)
    img = transforms.ToPILImage()(img)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    return base64.b64encode(buf.getvalue()).decode()

# Prediction Image
def predict_image(model: nn.Module, tensor: torch.Tensor, top_k: int = 5) -> dict:
    t0 = time.perf_counter()
    with torch.no_grad():
        logits = model(tensor.unsqueeze(0))
    elapsed = (time.perf_counter() - t0) * 1000

    probs = F.softmax(logits, dim=1)[0]
    top_probs, top_idx = probs.topk(top_k)

    predictions = [
        {"class_name": CLASS_NAMES[idx], "class_index": int(idx), "confidence": float(prob)}
        for prob, idx in zip(top_probs, top_idx)
    ]
    return {"predictions": predictions, "inference_time_ms": round(elapsed, 2)}

def load_image(image_bytes: bytes) -> torch.Tensor:
    img= Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return transform(img)

# App
app = FastAPI(title="Vegclassify", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

engines: dict[str, nn.Module] = {}

# Endpoints
@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "version": "2.0.0",
        "device": "cpu",
        "models": {k: True for k in engines},
    }

@app.get("/api/models")
def get_models():
    return {"models": list(engines.keys())}

@app.get("/api/classes")
def get_classes():
    return {
        "classes": [{"index": i, "name": n} for i, n in enumerate(CLASS_NAMES)],
        "num_classes": len(CLASS_NAMES),
    }

@app.post("/api/predict")
async def predict(file: UploadFile = File(...), model: str = Form("baseline")):
    if model not in engines:
        return {"error": f"Unknown model: {model}. Available: {list(engines.keys())}"}
    data = load_image(await file.read())
    result = predict_image(engines[model], data)
    result["model"] = model
    return result

@app.post("/api/compare")
async def compare(file: UploadFile = File(...)):
    data = load_image(await file.read())
    results = {}
    for key, mdl in engines.items():
        results[key] = predict_image(mdl, data)
    return {"results": results}

@app.post("/api/robustness")
async def robustness(
    file: UploadFile = File(...),
    fgsm_eps: str = Form("0.03,0.05,0.1"),
    pgd_eps: str = Form("0.03,0.05,0.1"),
):

    data = await file.read()
    tensor = load_image(data)

    fgsm_epsilons = [float(e.strip()) for e in fgsm_eps.split(",") if e.strip()]
    pgd_epsilons = [float(e.strip()) for e in pgd_eps.split(",") if e.strip()]

    # On a besoin du label prédit par le baseline pour générer les attaques
    with torch.no_grad():
        base_logits = engines["baseline"](tensor.unsqueeze(0)) if "baseline" in engines else None
    target_label = int(base_logits.argmax(1)[0]) if base_logits is not None else 0

    # Clean
    clean_image_b64 = tensor_to_base64(tensor)
    clean_preds = {k: predict_image(m, tensor) for k, m in engines.items()}

    # Attaques
    attack_model = engines.get("baseline", list(engines.values())[0])
    scenarios = []

    for eps in fgsm_epsilons:
        adv = fgsm_attack(attack_model, tensor, target_label, eps)
        adv_b64 = tensor_to_base64(adv)
        preds = {k: predict_image(m, adv) for k, m in engines.items()}
        scenarios.append({
            "attack": "FGSM",
            "epsilon": eps,
            "image_b64": adv_b64,
            "predictions": preds,
        })

    for eps in pgd_epsilons:
        adv = pgd_attack(attack_model, tensor, target_label, eps)
        adv_b64 = tensor_to_base64(adv)
        preds = {k: predict_image(m, adv) for k, m in engines.items()}
        scenarios.append({
            "attack": "PGD",
            "epsilon": eps,
            "image_b64": adv_b64,
            "predictions": preds,
        })

    return {
        "clean": {
            "image_b64": clean_image_b64,
            "predictions": clean_preds,
        },
        "scenarios": scenarios,
        "true_label": CLASS_NAMES[target_label],
        "models_used": list(engines.keys()),
    }


# Static files + SPA fallback
static_dir = Path(__file__).parent / "static"

def mount_static():
    if static_dir.exists():
        app.mount("/assets", StaticFiles(directory=static_dir / "assets"), name="assets")

        @app.get("/{path:path}")
        async def spa_fallback(path: str):
            file_path = static_dir / path
            if file_path.is_file():
                return FileResponse(file_path)
            return FileResponse(static_dir / "index.html")

# Entrypoint
def main():
    parser = argparse.ArgumentParser(description="vegclassify CPU server")
    parser.add_argument("--baseline", type=str, help="Baseline model .pth (Phase A)")
    parser.add_argument("--hardened", type=str, help="Hardened model .pth (Phase C)")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--host", type=str, default="127.0.0.1")
    args = parser.parse_args()

    if not args.baseline and not args.hardened:
        parser.error("At least one model required (--baseline or --hardened)")

    if args.baseline:
        print(f"Loading baseline: {args.baseline}")
        engines["baseline"] = load_model(args.baseline)
        print(" baseline loaded")
    if args.hardened:
        print(f"Loading hardened: {args.hardened}")
        engines["hardened"] = load_model(args.hardened)
        print(" hardened loaded")

    mount_static()

    print(f"\n  vegclassify server (CPU)")
    print(f"  http://{args.host}:{args.port}")
    print(f"  models: {list(engines.keys())}\n")

    import uvicorn
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")

if __name__ == "__main__":
    main()
