import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
import json
import os
from app.core.config import CLEANED_DATA_DIR, MODELS_DIR  # Make sure CLEANED_DATA_DIR = "data/cleaned"
import joblib

def load_cleaned_data():
    # Load the file name from session info
    session_file = "session/last_upload.json"
    if not os.path.exists(session_file):
        raise FileNotFoundError("Session info not found.")

    with open(session_file, "r") as f:
        session_info = json.load(f)

    file_name = session_info["file_name"]
    cleaned_file_path = os.path.join(CLEANED_DATA_DIR, f"cleaned_{file_name}")

    if not os.path.exists(cleaned_file_path):
        raise FileNotFoundError("Cleaned data file not found. Please clean the dataset first.")

    return pd.read_csv(cleaned_file_path)


def get_model(name):
    models = {
        "logistic_regression": LogisticRegression(max_iter=1000),
        "random_forest": RandomForestClassifier(),
        "svm": SVC(probability=True),
        "naive_bayes": GaussianNB()
    }
    return models.get(name)

def train_and_evaluate(models_to_train, target_column="Churn"):
    df = load_cleaned_data()
    
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Convert categorical if any
    if y.dtype == 'O':
        y = y.astype('category').cat.codes

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    results = {}

    os.makedirs(MODELS_DIR, exist_ok=True)  # ensure directory exists

    for model_name in models_to_train:
        model = get_model(model_name)
        if model is None:
            continue

        model.fit(X_train, y_train)

        # Save trained model
        model_path = os.path.join(MODELS_DIR, f"{model_name}.pkl")
        joblib.dump(model, model_path)

        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1] if hasattr(model, "predict_proba") else None

        metrics = classification_report(y_test, y_pred, output_dict=True)
        auc = roc_auc_score(y_test, y_prob) if y_prob is not None else None
        cm = confusion_matrix(y_test, y_pred).tolist()

        results[model_name] = {
            "accuracy": metrics["accuracy"],
            "precision": metrics["1"]["precision"],
            "recall": metrics["1"]["recall"],
            "f1_score": metrics["1"]["f1-score"],
            "roc_auc": auc,
            "confusion_matrix": cm
        }

    return results
