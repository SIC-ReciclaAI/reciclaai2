"""
Rotas para informações da API e classes
"""
from fastapi import APIRouter
from app.schemas import RootResponse, HealthResponse, ClassesResponse
from app.config import API_TITLE, API_VERSION, MODEL_PATH, CLASSES
from app.constants import CLASS_INFO
from app.services.model_service import model_service

router = APIRouter(tags=["info"])


@router.get("/", response_model=RootResponse)
async def root() -> dict:
    """
    Endpoint raiz da API

    Returns:
        Informações básicas da API
    """
    return {
        "message": f"{API_TITLE}",
        "version": API_VERSION,
        "status": "online",
        "model_loaded": model_service.is_loaded,
    }


@router.get("/v1/health", response_model=HealthResponse)
async def health_check() -> dict:
    """
    Verifica o status da API e do modelo

    Returns:
        Status de saúde da API e informações do modelo
    """
    return {
        "status": "healthy",
        "model_loaded": model_service.is_loaded,
        "model_path": str(MODEL_PATH),
        "classes": CLASSES,
    }


@router.get("/v1/classes", response_model=ClassesResponse)
async def get_classes() -> dict:
    """
    Retorna informações sobre todas as classes de resíduos

    Returns:
        Lista com informações de cada classe (nome, categoria, instruções, etc.)
    """
    return {
        "classes": [
            {
                "id": class_id,
                "name": info["name"],
                "category": info["category"],
                "bin_color": info["color"],
                "instructions": info["instructions"],
            }
            for class_id, info in CLASS_INFO.items()
        ]
    }
