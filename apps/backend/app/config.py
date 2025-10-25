"""
Configurações da aplicação ReciclaAI
"""
from pathlib import Path

# Configurações do modelo
MODEL_PATH = Path(__file__).parent / "models" / "trashnet" / "reciclaAI_best_model.h5"
IMG_SIZE = (224, 224)

# Classes de resíduos
CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

# Configurações CORS
CORS_ORIGINS = [
    "http://localhost:3000",  # Frontend Next.js dev
]

# Configurações da API
API_TITLE = "ReciclaAI API"
API_DESCRIPTION = "API para classificação de resíduos usando IA"
API_VERSION = "1.0.0"
