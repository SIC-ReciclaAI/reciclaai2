# predict_reciclaAI.py
"""
Script de inferência do modelo ReciclaAI
Carrega o modelo treinado (reciclaAI_model_final.h5)
e realiza a classificação de uma imagem individual.
"""

import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import matplotlib.pyplot as plt
import sys


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
    plt.axis('off')
    plt.title(f"Predição: {pred_class} ({pred_prob*100:.1f}%)")
    plt.show()

    print("\n Resultado detalhado:")
    for c, p in zip(CLASSES, preds[0]):
        print(f"  {c:10s}: {p*100:5.2f}%")


# Execução pelo terminal
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python predict_reciclaAI.py <caminho_da_imagem>")
    else:
        img_path = sys.argv[1]
        predict_image(img_path)