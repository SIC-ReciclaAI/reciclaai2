"""
ReciclaAI - API para classificação de resíduos usando IA

Aplicação FastAPI modularizada para análise de imagens de resíduos
e fornecimento de instruções de descarte apropriadas.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.services.model_service import model_service
from app.routes import info, analysis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação"""
    # Startup
    print("🚀 Iniciando ReciclaAI API...")
    model_service.load_model()
    print("✅ API pronta para receber requisições!")
    yield
    # Shutdown
    print("👋 Encerrando ReciclaAI API...")


# Criar aplicação FastAPI
app = FastAPI(
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url=None,
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
