#!/bin/bash
# Script para rodar ReciclaAI usando imagens Docker pré-construídas
# Não requer git clone ou código local

echo "🚀 Iniciando ReciclaAI com Docker..."
echo ""

# Verifica se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "Erro: Docker não está rodando. Por favor, inicie o Docker Desktop."
    exit 1
fi

# Baixa as imagens mais recentes
echo "Baixando imagens mais recentes..."
docker compose -f docker-compose.pull.yml pull

# Inicia os containers
echo "Iniciando containers..."
docker compose -f docker-compose.pull.yml up -d

echo ""
echo "ReciclaAI está rodando!"
echo ""
echo "Acesse:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend:  http://localhost:8000/docs"
echo ""
echo "Para parar os containers, execute:"
echo "   docker compose -f docker-compose.pull.yml down"
echo ""

