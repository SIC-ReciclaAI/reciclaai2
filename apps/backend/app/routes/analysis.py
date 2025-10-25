"""
Rotas para análise de imagens
"""
from fastapi import APIRouter, HTTPException
from app.schemas import AnalysisResponse, Base64ImageRequest
from app.services.model_service import model_service
from app.services.image_processor import preprocess_image, decode_base64_image

router = APIRouter(prefix="/v1", tags=["analysis"])


@router.post("/analyze-image", response_model=AnalysisResponse)
async def analyze_image(request: Base64ImageRequest) -> dict:
    """
    Analisa uma imagem e retorna a classificação do resíduo

    Args:
        request: Requisição contendo imagem em base64

    Returns:
        Resultado da análise com classificação, confiança e instruções

    Raises:
        HTTPException: Se o modelo não estiver carregado ou houver erro no processamento
    """
    if not model_service.is_loaded:
        raise HTTPException(status_code=503, detail="Modelo não carregado. Execute o treino do modelo primeiro.")

    try:
        # Decodificar imagem base64
        image = decode_base64_image(request.image)

        # Preprocessar imagem
        img_array = preprocess_image(image)

        # Fazer predição
        predictions = model_service.predict(img_array)

        # Obter resultado principal
        prediction_result = model_service.get_prediction_result(predictions)

        # Obter todas as predições
        all_predictions = model_service.get_all_predictions(predictions)

        # Obter instruções
        instructions = model_service.get_instructions(prediction_result["class"])

        # Retornar resultado
        return {
            "success": True,
            "prediction": prediction_result,
            "instructions": instructions,
            "all_predictions": all_predictions,
            "metadata": {
                "image_size": image.size,
                "image_mode": image.mode,
                "filename": None,  # Base64 não tem filename
            },
        }

    except ValueError as e:
        # Erro de decodificação base64
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")
