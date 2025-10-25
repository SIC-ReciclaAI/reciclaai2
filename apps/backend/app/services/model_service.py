"""
Serviço de gerenciamento do modelo de IA
"""
import tensorflow as tf
import numpy as np
from typing import Tuple, List, Dict
from app.config import MODEL_PATH, CLASSES
from app.constants import CLASS_INFO


class ModelService:
    """Serviço para gerenciar o modelo de classificação"""

    def __init__(self):
        self.model = None
        self.is_loaded = False

    def load_model(self) -> None:
        """Carrega o modelo treinado"""
        try:
            if MODEL_PATH.exists():
                self.model = tf.keras.models.load_model(MODEL_PATH)
                self.is_loaded = True
                print(f"✓ Modelo carregado de: {MODEL_PATH}")
            else:
                print(f"⚠ AVISO: Modelo não encontrado em {MODEL_PATH}")
                print("  Execute o notebook de treino para gerar o modelo")
        except Exception as e:
            print(f"✗ Erro ao carregar modelo: {e}")
            self.is_loaded = False

    def predict(self, img_array: np.ndarray) -> np.ndarray:
        """
        Realiza predição com o modelo

        Args:
            img_array: Array numpy com a imagem preprocessada

        Returns:
            Array com as probabilidades de cada classe
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Modelo não está carregado")

        predictions = self.model.predict(img_array, verbose=0)
        return predictions[0]

    def get_prediction_result(self, predictions: np.ndarray) -> Dict:
        """
        Processa as predições e retorna resultado formatado

        Args:
            predictions: Array com probabilidades de cada classe

        Returns:
            Dicionário com resultado principal da predição
        """
        predicted_class_idx = np.argmax(predictions)
        confidence = float(predictions[predicted_class_idx])

        predicted_class = CLASSES[predicted_class_idx]
        class_info = CLASS_INFO[predicted_class]

        return {
            "class": predicted_class,
            "name": class_info["name"],
            "category": class_info["category"],
            "bin_color": class_info["color"],
            "confidence": confidence,
            "confidence_percentage": f"{confidence * 100:.2f}%",
        }

    def get_all_predictions(self, predictions: np.ndarray) -> List[Dict]:
        """
        Retorna todas as predições ordenadas por confiança

        Args:
            predictions: Array com probabilidades de cada classe

        Returns:
            Lista de dicionários com todas as predições
        """
        all_predictions = [
            {"class": CLASSES[i], "name": CLASS_INFO[CLASSES[i]]["name"], "confidence": float(predictions[i])}
            for i in range(len(CLASSES))
        ]
        all_predictions.sort(key=lambda x: x["confidence"], reverse=True)

        return all_predictions

    def get_instructions(self, class_name: str) -> List[str]:
        """
        Retorna instruções de descarte para uma classe

        Args:
            class_name: Nome da classe

        Returns:
            Lista de instruções
        """
        return CLASS_INFO[class_name]["instructions"]


# Instância global do serviço
model_service = ModelService()
