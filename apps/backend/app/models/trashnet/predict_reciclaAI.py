# predict_reciclaAI.py
"""
Script de inferência do modelo ReciclaAI
Carrega o modelo treinado (reciclaAI_model_final.h5)
e realiza a classificação de uma imagem individual.
"""

import sys

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Definições básicas
MODEL_PATH = "reciclaAI_model_final.h5"

# Classes originais do TrashNet
CLASSES = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]


# Função de predição
def predict_image(img_path):
  # Carrega o modelo
  model = tf.keras.models.load_model(MODEL_PATH)

  # Pré-processamento da imagem
  img = image.load_img(img_path, target_size=(224, 224))
  img_array = image.img_to_array(img)
  img_array = np.expand_dims(img_array, axis=0) / 255.0  # normaliza [0,1]

  # Faz a previsão
  preds = model.predict(img_array)
  pred_class = CLASSES[np.argmax(preds)]
  pred_prob = np.max(preds)

  # Mostra o resultado
  plt.imshow(image.load_img(img_path))
  plt.axis("off")
  plt.title(f"Predição: {pred_class} ({pred_prob * 100:.1f}%)")
  plt.show()

  print("\n Resultado detalhado:")
  for c, p in zip(CLASSES, preds[0]):
    print(f"  {c:10s}: {p * 100:5.2f}%")


# Função de predição para API (retorna dicionário)
def predict_image_api(img_array):
  """
  Realiza predição em uma imagem já processada (array numpy).

  Args:
      img_array: numpy array com shape (224, 224, 3) normalizado [0,1]

  Returns:
      dict: {"predictions": {"class_name": probability, ...}}
  """
  # Carrega o modelo
  model = tf.keras.models.load_model(MODEL_PATH)

  # Adiciona dimensão do batch se necessário
  if len(img_array.shape) == 3:
    img_array = np.expand_dims(img_array, axis=0)

  # Faz a previsão
  preds = model.predict(img_array)

  # Converte para dicionário
  predictions = {}
  for class_name, prob in zip(CLASSES, preds[0]):
    predictions[class_name] = float(prob)

  return {"predictions": predictions}


# Execução pelo terminal
if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Uso: python predict_reciclaAI.py <caminho_da_imagem>")
  else:
    img_path = sys.argv[1]
    predict_image(img_path)
