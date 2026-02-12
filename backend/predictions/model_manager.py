import os
import joblib
from django.conf import settings

MODEL_DIR = os.path.join(settings.BASE_DIR, 'ml_models')

GLOBAL_MODEL_PATH = os.path.join(
    settings.BASE_DIR,
    "ml_models",
    "global_industry_model.pkl"
)

def load_global_model():
    if os.path.exists(GLOBAL_MODEL_PATH):
        return joblib.load(GLOBAL_MODEL_PATH)
    return None

def get_model_path(user_id):
    return os.path.join(MODEL_DIR, f"user_{user_id}_forecast.pkl")

def save_model(model, user_id):
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)
    joblib.dump(model, get_model_path(user_id))

def load_model(user_id):
    path=get_model_path(user_id)
    if os.path.exists(path):
        return joblib.load(path)
    return None

