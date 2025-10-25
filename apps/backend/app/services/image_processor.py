"""
Serviço de processamento de imagens
"""
import base64
import re
import io
import numpy as np
from PIL import Image
from app.config import IMG_SIZE


def decode_base64_image(base64_string: str) -> Image.Image:
    """
    Decodifica uma string base64 em uma imagem PIL

    Args:
        base64_string: String base64 (com ou sem data URI)

    Returns:
        Imagem PIL decodificada

    Raises:
        ValueError: Se a string base64 for inválida
    """
    try:
        # Remove o data URI se presente (data:image/png;base64,...)
        if "," in base64_string and base64_string.startswith("data:"):
            base64_string = base64_string.split(",", 1)[1]

        # Remove espaços em branco e quebras de linha
        base64_string = re.sub(r"\s+", "", base64_string)

        # Decodifica base64
        image_bytes = base64.b64decode(base64_string)

        # Cria imagem PIL
        image = Image.open(io.BytesIO(image_bytes))

        return image

    except Exception as e:
        raise ValueError(f"Erro ao decodificar imagem base64: {str(e)}")


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocessa a imagem para o formato esperado pelo modelo

    Args:
        image: Imagem PIL a ser processada

    Returns:
        Array numpy normalizado pronto para predição
    """
    # Converter para RGB se necessário
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Redimensionar para o tamanho esperado pelo modelo (224x224)
    # LANCZOS para melhor qualidade, mais rápido que BICUBIC
    image = image.resize(IMG_SIZE, Image.Resampling.LANCZOS)

    # Converter para array numpy float32 (mais rápido que float64)
    # e normalizar (0-1) em uma operação
    img_array = np.array(image, dtype=np.float32) / 255.0

    # Adicionar dimensão do batch
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def validate_image_file(content_type: str | None) -> bool:
    """
    Valida se o arquivo é uma imagem

    Args:
        content_type: Content-Type do arquivo

    Returns:
        True se for uma imagem válida, False caso contrário
    """
    if not content_type:
        return False

    return content_type.startswith("image/")
