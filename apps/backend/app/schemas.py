"""
Schemas Pydantic para validação de dados
"""
from pydantic import BaseModel, Field
from typing import List, Tuple


class Base64ImageRequest(BaseModel):
    """Requisição com imagem em base64"""

    image: str = Field(..., description="Imagem codificada em base64 (com ou sem data URI)")


class PredictionResult(BaseModel):
    """Resultado da predição principal"""

    class_name: str = Field(..., alias="class", description="Identificador da classe")
    name: str = Field(..., description="Nome traduzido da classe")
    category: str = Field(..., description="Categoria do resíduo")
    bin_color: str = Field(..., description="Cor da lixeira apropriada")
    confidence: float = Field(..., ge=0, le=1, description="Confiança da predição")
    confidence_percentage: str = Field(..., description="Confiança em formato percentual")

    class Config:
        populate_by_name = True


class ClassPrediction(BaseModel):
    """Predição individual de uma classe"""

    class_name: str = Field(..., alias="class", description="Identificador da classe")
    name: str = Field(..., description="Nome traduzido da classe")
    confidence: float = Field(..., ge=0, le=1, description="Confiança da predição")

    class Config:
        populate_by_name = True


class ImageMetadata(BaseModel):
    """Metadados da imagem analisada"""

    image_size: Tuple[int, int] = Field(..., description="Dimensões da imagem (largura, altura)")
    image_mode: str = Field(..., description="Modo de cor da imagem")
    filename: str | None = Field(None, description="Nome do arquivo original")


class AnalysisResponse(BaseModel):
    """Resposta completa da análise de imagem"""

    success: bool = Field(..., description="Indica se a análise foi bem-sucedida")
    prediction: PredictionResult = Field(..., description="Resultado principal da classificação")
    instructions: List[str] = Field(..., description="Instruções de descarte")
    all_predictions: List[ClassPrediction] = Field(..., description="Todas as predições ordenadas por confiança")
    metadata: ImageMetadata = Field(..., description="Metadados da imagem")


class ClassInfo(BaseModel):
    """Informações sobre uma classe de resíduo"""

    id: str = Field(..., description="Identificador da classe")
    name: str = Field(..., description="Nome traduzido")
    category: str = Field(..., description="Categoria do resíduo")
    bin_color: str = Field(..., description="Cor da lixeira")
    instructions: List[str] = Field(..., description="Instruções de descarte")


class ClassesResponse(BaseModel):
    """Resposta com lista de todas as classes"""

    classes: List[ClassInfo] = Field(..., description="Lista de classes de resíduos")


class HealthResponse(BaseModel):
    """Resposta do health check"""

    status: str = Field(..., description="Status da API")
    model_loaded: bool = Field(..., description="Indica se o modelo está carregado")
    model_path: str = Field(..., description="Caminho do modelo")
    classes: List[str] = Field(..., description="Lista de classes suportadas")


class RootResponse(BaseModel):
    """Resposta do endpoint raiz"""

    message: str = Field(..., description="Mensagem de boas-vindas")
    version: str = Field(..., description="Versão da API")
    status: str = Field(..., description="Status da API")
    model_loaded: bool = Field(..., description="Indica se o modelo está carregado")
