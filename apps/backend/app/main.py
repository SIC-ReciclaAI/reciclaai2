import base64
import io
import json
import uuid
from typing import Any, Dict

import numpy as np
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from sqlalchemy.orm import Session

from . import auth as auth_utils
from .database import Base, engine, get_db
from .models_sql import PredictionHistory, User
from . import schemas

# Importações do TensorFlow/Keras
import tensorflow as tf
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D, Input
from tensorflow.keras.models import Model
from tensorflow.keras.applications import EfficientNetB4
from tensorflow.keras.preprocessing.image import ImageDataGenerator


app = FastAPI()

# Cria as tabelas do banco na inicialização
Base.metadata.create_all(bind=engine)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Definições do modelo
MODEL_PATH = "app/models/trashnet/reciclaAI_model_final_effnet_B4.h5"
CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
IMG_SIZE = (380, 380)  # B4 usa 380x380
DROPOUT_RATE = 0.4  # Valor utilizado no treinamento


# Definição do gerador TTA
tta_datagen = ImageDataGenerator(
    zoom_range=0.1,  # Zoom leve de até 10%
    brightness_range=[0.9, 1.1],  # Variação leve de brilho
)
# 1 Original + 1 Espelhada + 4 Aleatórias = 6 Votos
N_AUGMENTATIONS = 4


# Reconstrução do modelo e carregamento de pesos
inputs = Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
base_model = EfficientNetB4(weights=None, include_top=False, input_tensor=inputs)
base_model.trainable = False

# Head do modelo
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(DROPOUT_RATE)(x)
x = Dense(512, activation="relu")(x)
x = Dropout(DROPOUT_RATE)(x)
outputs = Dense(len(CLASSES), activation="softmax")(x)
model = Model(inputs=inputs, outputs=outputs)

# Compilação
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# Carrega os pesos
try:
    model.load_weights(MODEL_PATH)
    print("Modelo B4 carregado com sucesso.")
except Exception as e:  # noqa: BLE001
    print(f"ERRO CRÍTICO ao carregar pesos: {e}")


# Cache de resultados (em memória)
predictions_cache: Dict[str, Dict[str, Any]] = {}


@app.get("/")
async def root():
    return {"message": "API ReciclaAI com EfficientNetB4, TTA e histórico persistente"}


# ---------------------- AUTH ---------------------- #


@app.post("/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail já registrado")

    hashed_password = auth_utils.get_password_hash(payload.password)
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed_password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.TokenResponse)
async def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not auth_utils.verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha inválidos")

    access_token = auth_utils.create_access_token({"sub": user.id})
    return schemas.TokenResponse(access_token=access_token, user=user)  # type: ignore[arg-type]


@app.get("/me", response_model=schemas.UserResponse)
async def get_me(current_user: User = Depends(auth_utils.get_current_user)):
    return current_user


# ---------------------- PREDICTION + HISTÓRICO ---------------------- #


@app.post("/predict")
async def predict(
    request: schemas.ImageRequest,
    current_user: User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Remove o prefixo data:image/...;base64, se presente
        image_data = request.imageData
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]

        # Validação básica
        if not image_data:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="imageData vazio")

        # Decodifica base64
        try:
            image_bytes = base64.b64decode(image_data)
        except Exception:  # noqa: BLE001
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="imageData base64 inválido")

        # Carrega a imagem usando PIL
        try:
            img_pil = Image.open(io.BytesIO(image_bytes))
        except Exception:  # noqa: BLE001
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Formato de imagem inválido")

        # Pré-processamento: RGB e Redimensionamento
        if img_pil.mode != "RGB":
            img_pil = img_pil.convert("RGB")

        img_pil = img_pil.resize(IMG_SIZE, Image.Resampling.LANCZOS)

        # Converte para array [0, 255]
        img_array_original = np.array(img_pil, dtype=np.float32)

        # Lógica do TTA

        # Passo 1: Imagem Espelhada
        img_array_flipped = np.fliplr(img_array_original)

        # Passo 2: Lista de imagens base
        images_to_predict = [img_array_original, img_array_flipped]

        # Passo 3: Gerar e adicionar as imagens aleatórias
        # Expande dimensão para o flow: (1, 380, 380, 3)
        img_for_datagen = np.expand_dims(img_array_original, axis=0)

        i = 0
        # O flow gera lotes infinitos, usamos o loop para pegar N imagens
        for batch in tta_datagen.flow(img_for_datagen, batch_size=1):
            images_to_predict.append(batch[0])  # Adiciona a imagem aumentada
            i += 1
            if i >= N_AUGMENTATIONS:
                break

        # Passo 4: Empilhar todas as imagens em um lote
        img_batch = np.stack(images_to_predict, axis=0)

        # Passo 5: Fazer a predição no lote
        predictions_batch = model.predict(img_batch, verbose=0)

        # Passo 6: Tirar a Média das Predições
        avg_predictions = np.mean(predictions_batch, axis=0)

        # Converte para dicionário
        predictions: Dict[str, float] = {}
        for class_name, prob in zip(CLASSES, avg_predictions):
            predictions[class_name] = float(prob)

        # Ordena por probabilidade decrescente
        predictions = dict(sorted(predictions.items(), key=lambda item: item[1], reverse=True))

        # Gera UUID
        prediction_id = str(uuid.uuid4())

        # Salva no cache em memória (para tela de resultado imediata)
        predictions_cache[prediction_id] = {"predictions": predictions, "imageData": request.imageData}

        # Persiste no banco para o histórico
        history_entry = PredictionHistory(
            id=prediction_id,
            user_id=current_user.id,
            image_data=request.imageData,
            predictions_json=json.dumps(predictions),
        )
        db.add(history_entry)
        db.commit()

        return {"success": True, "id": prediction_id}

    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        print(f"ERRO NO BACKEND: {e}")  # Log útil
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Erro interno ao processar imagem: {str(e)}")


@app.get("/predictions/{id}", response_model=schemas.PredictionResponse)
async def get_prediction_result(
    id: str,
    current_user: User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    """Recupera o resultado de uma predição pelo UUID."""
    # Primeiro tenta no cache em memória
    cached = predictions_cache.get(id)

    history_entry = db.get(PredictionHistory, id)
    if history_entry is None or history_entry.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resultado não encontrado")

    predictions_dict: Dict[str, float]
    if cached is not None:
        predictions_dict = cached["predictions"]
        image_data = cached["imageData"]
    else:
        predictions_dict = json.loads(history_entry.predictions_json)
        image_data = history_entry.image_data

    return schemas.PredictionResponse(
        id=history_entry.id,
        predictions=predictions_dict,
        imageData=image_data,
        createdAt=history_entry.created_at,
    )


@app.get("/history", response_model=schemas.HistoryListResponse)
async def get_history(
    limit: int = 5,
    current_user: User = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db),
):
    """Lista o histórico de predições do usuário autenticado."""
    q = (
        db.query(PredictionHistory)
        .filter(PredictionHistory.user_id == current_user.id)
        .order_by(PredictionHistory.created_at.desc())
    )

    total = q.count()
    items_db = q.limit(limit).all()

    items = [
        schemas.PredictionResponse(
            id=item.id,
            predictions=json.loads(item.predictions_json),
            imageData=item.image_data,
            createdAt=item.created_at,
        )
        for item in items_db
    ]

    return schemas.HistoryListResponse(total=total, items=items)