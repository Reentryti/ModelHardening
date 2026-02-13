# Robustness and Security of Classification Models

Study of the robustness of classification models against adversarial attacks and evaluation of the effectiveness of different defense strategies.

## Objective

This project aims to:
- Understand the impact of adversarial attacks
- Measure performance degradation after attacks
- Implement and compare multiple defense strategies
- Deploy a hardened model and test its robustness in real-world conditions

---

## Pipeline

1. **Initial Preparation and Training**
   - Dataset loading and preprocessing
   - Training of a baseline classification model
2. **Baseline Evaluation**
   - Computation of standard metrics: Accuracy, Precision, Recall, F1-score
   - Confusion matrix and ROC curves
3. **Adversarial Attack Simulation**
   - Data poisoning
   - FGSM (Fast Gradient Sign Method)
   - PGD (Projected Gradient Descent)
4. **Post-Attack Evaluation**
   - Comparison of metrics before and after each attack
5. **Implementation of Defense Methods**
   - PGD Adversarial Training
6. **Retraining and Evaluation of the Hardened Model**
   - Training with active defense mechanisms
   - Comparison of performance and robustness
7. **Deployment and Final Testing**
  - Model export in ONNX and h5 formats
  - Inference in a C++ application
  - Robustness testing under real-world conditions

---

## Model & Data
- Model Architecture: EfficientNetB0, pretrained on ImageNet
- Framework: PyTorch 2.x
- Dataset:  [Vegetable Image Dataset](https://www.kaggle.com/datasets/misrakahmed/vegetable-image-dataset) - 15 classes, 21k images, pre-split train/validation/test
- Preprocessing techniques:
  - Resize 224x224
  - Random flip, rotation
- Robustness strategy applied: PGD
- Evaluation metrics: Accuracy, Precision, Recall, F1-Score, Confusion Matrix, per-class report
- Export formats: .pth (PyTorch), .onxx(ONNX Runtime deployment)

---

## Attaques et défenses

### Attaques
  - **Data poisoning**: targeted corruption of training data
  - **FGSM**: gradient-based perturbation
  - **PGD**: iterative projected gradient-based attack
  
### Defenses (To be implemented)

---

## Résultats

Model performance is compared across the different stages of the project
(visualizations and detailed results coming soon)Les performances du modele sont comparees aux différentes etapes du projet
