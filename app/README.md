# Classify Vegetables — Application

Vegetables classification application.
**Python backend** (FastAPI + PyTorch CPU) · **React frontend** · Loads .pth files directly.

## Requirements

| Tools | Version |
|-------|---------|
| Python | ≥ 3.10 |
| Node.js | ≥ 18 (frontend) |

## Installation

### 1. Clone and install Python dependencies

```bash
cd vegclassify
pip install -r backend/requirements.txt
```
> Make sure models are placed on **app/models/** directory

### 3. Build the frontend

```bash
cd frontend
npm run install
npm ci
npm run build
cd ..
```

### 4. Run

```bash
./run.sh

# Or directly
python backend/server.py \
    --baseline models/baseline_model.pth \
    --hardened models/hardened_model.pth \
    --port 8080
```

→ Open **http://localhost:8080**

## Usage

The interface allows you to :
- **Upload an image** of a vegetable
- **Choose the model** : Base, Hardened, or Compare both
- **View results** : top-5 predictions with confidence scores and inference time

In **Compare** mode, the same image is passed through both models side by side.

## API

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/health` | GET | Status, device, loaded models |
| `/api/models` | GET | List of model keys |
| `/api/classes` | GET | 15 vegetable classes |
| `/api/predict` | POST | Inference on one model (`file` + `model`) |
| `/api/compare` | POST | Inférence on both models (`file`) |

## CLI Options

```
python backend/server.py [options]

  --baseline PATH    Initial .pth model
  --hardened PATH    Hardeed .pth model
  --port PORT        Server port (default: 8080)
  --host HOST        Bind address (default: 127.0.0.1)
```

## Development

```bash
# Terminal 1 : backend (manual reload)
python backend/server.py --baseline models/baseline_model.pth --hardened models/hardened_model.pth

# Terminal 2 : frontend hot reload (port 3000, proxy 8080)
cd frontend && npm run dev
```
