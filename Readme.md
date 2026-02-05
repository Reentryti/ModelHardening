# Robustesse et Sécurité des modéles de classification

Etude de la robustesse des modeles de classification face aux attaques adversariales et évaluation de l'efficatité de différentes méthodes de défense

## Objectif

Ce projet vise à:
- Comprendre l'impact des attaques adversariales
- Mesurer la dégradation des performances après attaque
- Mettre en oeuvre et comparer plusieurs stratégies de défense
- Déployer un modele durci et tester sa robustesse en conditions réelles

---

## Pipeline

1. **Préparation et entrainement initial**
   - Chargement et prétraitement du dataset
   - Entrainement d'un modele de classification de référence
   
2. **Evaluation de base**
   - Calcul des metriques classiques: Accuracy, Precision, Recall, F1-score
   - Matrice de confusion et courbes ROC
   
3. **Simulation d'attaques adversariales**
   - **Data poisoning**
   - **FGSM** (Fast Gradient Sign Method)
   
4. **Evaluation apres attaque**
   - Comparaison des metriques avant / apres chaque attaque
   
5. **Mise en place de méthodes de défense**
   (à venir)
   
6. **Réentrainement et évaluation du modéle durci**
   - Entrainement avec les defenses actives
   - Comparaison des performances et de la robustesse
   
7. **Déploiement et tests finaux**
   - Export du modele aux formats **ONNX** et **h5**
   - Inférence dans une application C++
   - Tests de robustesse en conditions réelles

---

## Modéle & données
- **Type de modele**:
- **Datasets**:
- **Pré-traitement**:
- **Metriques**:
- **Dependances**:
- **Formats d'export**

---

## Attaques et défenses

### Attaques
  - **Data poisoning**: corruption ciblée des données d'entrainement
  - **FGSM**: perturbation basée sur le gradient
  
### Défenses (à venir)

---

## Résultats

Les performances du modele sont comparees aux différentes etapes du projet
(illustration à venir)
