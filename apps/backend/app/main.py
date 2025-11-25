import base64
import io
import uuid
from typing import Any, Dict

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel

# Importações do TensorFlow/Keras
import tensorflow as tf
from tensorflow.keras.layers import Input, GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.applications import EfficientNetB4 
from tensorflow.keras.preprocessing.image import ImageDataGenerator

app = FastAPI()

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
IMG_SIZE = (380, 380) # B4 usa 380x380
DROPOUT_RATE = 0.4    # Valor utilizado no treinamento


# Ddefinição do gerador TTA 
tta_datagen = ImageDataGenerator(
    zoom_range=0.1,         # Zoom leve de até 10%
    brightness_range=[0.9, 1.1] # Variação leve de brilho
)
# 1 Original + 1 Espelhada + 4 Aleatórias = 6 Votos
N_AUGMENTATIONS = 4 


# REconstrução do modelo e carregamento de pesos
inputs = Input(shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
base_model = EfficientNetB4(weights=None, 
                            include_top=False, 
                            input_tensor=inputs)
base_model.trainable = False 

# Head do modelo
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(DROPOUT_RATE)(x) 
x = Dense(512, activation='relu')(x)
x = Dropout(DROPOUT_RATE)(x) 
outputs = Dense(len(CLASSES), activation='softmax')(x)
model = Model(inputs=inputs, outputs=outputs)

# Compilação 
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Carrega os pesos
try:
    model.load_weights(MODEL_PATH)
    print("Modelo B4 carregado com sucesso.")
except Exception as e:
    print(f"ERRO CRÍTICO ao carregar pesos: {e}")


# Cache de resultados (em memória)
predictions_cache: Dict[str, Dict[str, Any]] = {}

class ImageRequest(BaseModel):
    imageData: str


@app.get("/")
async def root():
    return {"message": "API ReciclaAI com EfficientNetB4 e TTA)"}


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
            img_pil = Image.open(io.BytesIO(image_bytes))
        except Exception:
            raise HTTPException(status_code=400, detail="Formato de imagem inválido")

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
            images_to_predict.append(batch[0]) # Adiciona a imagem aumentada
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
        predictions = {}
        for class_name, prob in zip(CLASSES, avg_predictions):
            predictions[class_name] = float(prob)

        # Ordena por probabilidade decrescente
        predictions = dict(sorted(predictions.items(), key=lambda item: item[1], reverse=True))

        # Gera UUID e armazena no cache
        prediction_id = str(uuid.uuid4())
        # Armazena apenas o ID ou um preview pequeno da imagem se necessário,
        # pois salvar o base64 inteiro no cache pode consumir muita memória.
        predictions_cache[prediction_id] = {"predictions": predictions, "imageData": request.imageData}

        return {"success": True, "id": prediction_id}

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERRO NO BACKEND: {e}") # Log útil
        raise HTTPException(status_code=500, detail=f"Erro interno ao processar imagem: {str(e)}")


@app.get("/predictions/{id}")
async def get_prediction_result(id: str):
    """Recupera o resultado de uma predição pelo UUID"""
    if id not in predictions_cache:
        raise HTTPException(status_code=404, detail="Resultado não encontrado")

    return predictions_cache[id]

