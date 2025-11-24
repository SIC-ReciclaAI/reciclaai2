import base64
import io
import json
import uuid

import keras
import numpy as np
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from PIL import Image

from .auth import create_access_token, get_current_user, get_password_hash, verify_password
from .database import Base, engine, get_db
from .models_sql import PredictionHistory, User
from .schemas import (
    HistoryListResponse,
    ImageRequest,
    LoginRequest,
    PredictionResponse,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

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

@app.on_event("startup")
def on_startup() -> None:
  Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
  return {"message": "Olá, Mundo!"}


@app.post("/auth/register", response_model=UserResponse)
async def register_user(payload: RegisterRequest, db: Session = Depends(get_db)):
  existing_user = db.scalar(select(User).where(User.email == payload.email))
  if existing_user:
    raise HTTPException(status_code=400, detail="E-mail já cadastrado")

  user = User(name=payload.name, email=payload.email, hashed_password=get_password_hash(payload.password))
  db.add(user)
  db.commit()
  db.refresh(user)
  return user


@app.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
  user = db.scalar(select(User).where(User.email == payload.email))
  if not user or not verify_password(payload.password, user.hashed_password):
    raise HTTPException(status_code=400, detail="E-mail ou senha inválidos")

  token = create_access_token({"sub": user.id})
  return TokenResponse(access_token=token, user=user)


@app.get("/auth/me", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
  return current_user


@app.post("/predict")
async def predict(
  request: ImageRequest,
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db),
):
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

    # Redimensiona para 224x224 com melhor qualidade (agora é 380)
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

    # Persiste no histórico
    prediction_id = str(uuid.uuid4())
    history_entry = PredictionHistory(
      id=prediction_id,
      user_id=current_user.id,
      predictions_json=json.dumps(predictions),
      image_data=request.imageData,
    )
    db.add(history_entry)
    db.commit()

    return {"success": True, "id": prediction_id}

  except HTTPException:
    raise
  except Exception as e:
    raise HTTPException(status_code=500, detail=f"Erro interno ao processar imagem: {str(e)}")


@app.get("/predictions/{id}", response_model=PredictionResponse)
async def get_prediction_result(
  id: str,
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db),
):
  """Recupera o resultado de uma predição pelo UUID"""
  history_entry = db.get(PredictionHistory, id)
  if history_entry is None or history_entry.user_id != current_user.id:
    raise HTTPException(status_code=404, detail="Resultado não encontrado")

  return PredictionResponse(
    id=history_entry.id,
    predictions=json.loads(history_entry.predictions_json),
    imageData=history_entry.image_data,
    createdAt=history_entry.created_at,
  )


@app.get("/history", response_model=HistoryListResponse)
async def get_history(
  limit: int = Query(5, ge=1, le=20),
  current_user: User = Depends(get_current_user),
  db: Session = Depends(get_db),
):
  query = (
    select(PredictionHistory)
    .where(PredictionHistory.user_id == current_user.id)
    .order_by(PredictionHistory.created_at.desc())
    .limit(limit)
  )
  histories = list(db.scalars(query).all())

  total_stmt = select(func.count()).where(PredictionHistory.user_id == current_user.id)
  total = db.scalar(total_stmt) or 0

  items = [
    PredictionResponse(
      id=item.id,
      predictions=json.loads(item.predictions_json),
      imageData=item.image_data,
      createdAt=item.created_at,
    )
    for item in histories
  ]
  return HistoryListResponse(total=total, items=items)
