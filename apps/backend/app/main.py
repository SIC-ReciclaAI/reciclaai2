"""
ReciclaAI - API para classificação de resíduos usando IA

Aplicação FastAPI modularizada para análise de imagens de resíduos
e fornecimento de instruções de descarte apropriadas.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_DESCRIPTION, API_VERSION, CORS_ORIGINS
from app.services.model_service import model_service
from app.routes import info, analysis

# Criar aplicação FastAPI
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rotas
app.include_router(info.router)
app.include_router(analysis.router)


@app.on_event("startup")
async def startup_event():
    """Carrega o modelo na inicialização da aplicação"""
    print("🚀 Iniciando ReciclaAI API...")
    model_service.load_model()
    print("✅ API pronta para receber requisições!")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup ao desligar a aplicação"""
    print("👋 Encerrando ReciclaAI API...")
