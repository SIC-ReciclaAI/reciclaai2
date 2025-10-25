"""
Serviço de gerenciamento do modelo de IA
"""
import os
import tensorflow as tf
import numpy as np
from typing import Tuple, List, Dict
from app.config import MODEL_PATH, CLASSES, TF_NUM_THREADS, TF_ENABLE_XLA, TF_ENABLE_MIXED_PRECISION
from app.constants import CLASS_INFO


class ModelService:
    """Serviço para gerenciar o modelo de classificação"""

    def __init__(self):
        self.model = None
        self.is_loaded = False
        self._configure_tensorflow()

    def _configure_tensorflow(self) -> None:
        """Configura TensorFlow para melhor performance"""
        # Habilita otimizações de performance XLA (Just-In-Time compilation)
        if TF_ENABLE_XLA:
            tf.config.optimizer.set_jit(True)
        
        # Configuração de threads para melhor uso de CPU
        tf.config.threading.set_inter_op_parallelism_threads(TF_NUM_THREADS)
        tf.config.threading.set_intra_op_parallelism_threads(TF_NUM_THREADS)
        
        # Habilita mixed precision para GPUs (se disponível e configurado)
        if TF_ENABLE_MIXED_PRECISION:
            try:
                tf.keras.mixed_precision.set_global_policy('mixed_float16')
            except:
                pass  # Se não suportar, continua com float32

    def load_model(self) -> None:
        """Carrega o modelo treinado com otimizações"""
        try:
            if MODEL_PATH.exists():
                # Carrega modelo com compilação otimizada
                self.model = tf.keras.models.load_model(
                    MODEL_PATH,
                    compile=True  # Garante que o modelo vem compilado
                )
                
                # Warm-up: primeira predição é sempre mais lenta
                # Fazemos uma predição dummy para inicializar o grafo
                dummy_input = np.zeros((1, 224, 224, 3), dtype=np.float32)
                _ = self.model.predict(dummy_input, verbose=0)
                
                self.is_loaded = True
                print(f"✓ Modelo carregado e otimizado: {MODEL_PATH}")
                print(f"✓ Usando {TF_NUM_THREADS} threads para inferência")
                print(f"✓ XLA: {'Habilitado' if TF_ENABLE_XLA else 'Desabilitado'}")
            else:
                print(f"⚠ AVISO: Modelo não encontrado em {MODEL_PATH}")
                print("  Execute o notebook de treino para gerar o modelo")
        except Exception as e:
            print(f"✗ Erro ao carregar modelo: {e}")
            self.is_loaded = False

    def predict(self, img_array: np.ndarray) -> np.ndarray:
        """
        Realiza predição com o modelo de forma otimizada

        Args:
            img_array: Array numpy com a imagem preprocessada

        Returns:
            Array com as probabilidades de cada classe
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Modelo não está carregado")

        # Garante que o input está no tipo correto (float32 é mais rápido)
        if img_array.dtype != np.float32:
            img_array = img_array.astype(np.float32)

        # Usa predict ao invés de __call__ para melhor caching
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
