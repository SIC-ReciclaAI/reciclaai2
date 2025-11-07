import base64
import io
import uuid
from typing import Any, Dict

import keras
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

app = FastAPI()

# Configuração CORS
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],  # Permite todas as origens
  allow_credentials=True,
  allow_methods=["*"],  # Permite todos os métodos HTTP
  allow_headers=["*"],  # Permite todos os headers
)

# Definições do modelo
MODEL_PATH = "app/models/trashnet/reciclaAI_model_final.h5"
CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]

# Carrega o modelo uma vez na inicialização
model = keras.models.load_model(MODEL_PATH)

# Cache de resultados (em memória)
predictions_cache: Dict[str, Dict[str, Any]] = {}


class ImageRequest(BaseModel):
  imageData: str


@app.get("/")
async def root():
  return {"message": "Olá, Mundo!"}


@app.post("/predict")
async def predict(request: ImageRequest):
  try:
    # Remove o prefixo data:image/...;base64, se presente
    image_data = request.imageData
    if "," in image_data:
      image_data = image_data.split(",", 1)[1]

    # Validação básica
    if not image_data:
      raise HTTPException(status_code=400, detail="imageData vazio")

    # Decodifica base64
    try:
      image_bytes = base64.b64decode(image_data)
    except Exception:
      raise HTTPException(status_code=400, detail="imageData base64 inválido")

    # Carrega a imagem usando PIL
    try:
      img = Image.open(io.BytesIO(image_bytes))
    except Exception:
      raise HTTPException(status_code=400, detail="Formato de imagem inválido")

    # Converte para RGB se necessário
    if img.mode != "RGB":
      img = img.convert("RGB")

    # Redimensiona para 224x224 com melhor qualidade
    img = img.resize((224, 224), Image.Resampling.LANCZOS)

    # Converte para array numpy e normaliza
    img_array = np.array(img, dtype=np.float32) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Faz a predição com verbose=0 para evitar logs desnecessários
    preds = model.predict(img_array, verbose=0)  # type: ignore

    # Converte para dicionário ordenado por probabilidade
    predictions = {}
    for class_name, prob in zip(CLASSES, preds[0]):
      predictions[class_name] = float(prob)

    # Ordena por probabilidade decrescente
    predictions = dict(sorted(predictions.items(), key=lambda item: item[1], reverse=True))

    # Gera UUID e armazena no cache com a imagem original
    prediction_id = str(uuid.uuid4())
    predictions_cache[prediction_id] = {"predictions": predictions, "imageData": request.imageData}

    return {"success": True, "id": prediction_id}

  except HTTPException:
    raise
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Erro interno ao processar imagem: {str(e)}")


@app.get("/predictions/{id}")
async def get_prediction_result(id: str):
  """Recupera o resultado de uma predição pelo UUID"""
  if id not in predictions_cache:
    raise HTTPException(status_code=404, detail="Resultado não encontrado")

  return predictions_cache[id]
