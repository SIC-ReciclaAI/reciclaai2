"""
Configurações da aplicação ReciclaAI
"""
import os
from pathlib import Path

# Configurações do modelo
MODEL_PATH = Path(__file__).parent / "models" / "trashnet" / "reciclaAI_best_model.h5"
IMG_SIZE = (224, 224)

# Classes de resíduos
CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

# Configurações CORS
CORS_ORIGINS = [
    "http://localhost:3000",
]

# Configurações de Performance
# Define número de threads para TensorFlow (padrão: todos os cores)
TF_NUM_THREADS = int(os.getenv("TF_NUM_THREADS", os.cpu_count() or 4))

# Habilita otimizações XLA (Just-In-Time compilation)
TF_ENABLE_XLA = os.getenv("TF_ENABLE_XLA", "1") == "1"

# Habilita mixed precision (float16) para GPUs compatíveis
TF_ENABLE_MIXED_PRECISION = os.getenv("TF_ENABLE_MIXED_PRECISION", "1") == "1"
