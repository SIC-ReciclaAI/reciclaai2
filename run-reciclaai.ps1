# Script PowerShell para rodar ReciclaAI usando imagens Docker pré-construídas
# Não requer git clone ou código local

Write-Host "Iniciando ReciclaAI com Docker..." -ForegroundColor Green
Write-Host ""

# Verifica se o Docker está rodando
try {
    docker info | Out-Null
} catch {
    Write-Host "Erro: Docker não está rodando. Por favor, inicie o Docker Desktop." -ForegroundColor Red
    exit 1
}

# Baixa as imagens mais recentes
Write-Host "Baixando imagens mais recentes..." -ForegroundColor Cyan
docker compose -f docker-compose.pull.yml pull

# Inicia os containers
Write-Host "▶Iniciando containers..." -ForegroundColor Cyan
docker compose -f docker-compose.pull.yml up -d

Write-Host ""
Write-Host "ReciclaAI está rodando!" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse:" -ForegroundColor Yellow
Write-Host "   - Frontend: http://localhost:3000"
Write-Host "   - Backend:  http://localhost:8000/docs"
Write-Host ""
Write-Host "Para parar os containers, execute:" -ForegroundColor Gray
Write-Host "   docker compose -f docker-compose.pull.yml down"
Write-Host ""

