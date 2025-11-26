# 📦 Como Publicar as Imagens Docker

Este guia explica como publicar as imagens Docker no Docker Hub para que qualquer pessoa possa rodar o projeto sem precisar do código local.

## Pré-requisitos

1. Conta no [Docker Hub](https://hub.docker.com/) (gratuita)
2. Docker Desktop instalado e rodando

## Passo a passo

### 1. Fazer login no Docker Hub

```bash
docker login
```

Digite seu username e password do Docker Hub.

### 2. Construir e marcar as imagens

Substitua `SEU_USUARIO` pelo seu username do Docker Hub:

```bash
# Construir as imagens
docker compose build

# Marcar as imagens com seu username
docker tag reciclaai2-backend:latest SEU_USUARIO/reciclaai-backend:latest
docker tag reciclaai2-frontend:latest SEU_USUARIO/reciclaai-frontend:latest
```

**Exemplo:**
```bash
docker tag reciclaai2-backend:latest ecmartins/reciclaai-backend:latest
docker tag reciclaai2-frontend:latest ecmartins/reciclaai-frontend:latest
```

### 3. Publicar as imagens

```bash
docker push SEU_USUARIO/reciclaai-backend:latest
docker push SEU_USUARIO/reciclaai-frontend:latest
```

**Exemplo:**
```bash
docker push ecmartins/reciclaai-backend:latest
docker push ecmartins/reciclaai-frontend:latest
```

⚠️ **Nota:** A primeira vez pode demorar bastante (as imagens são grandes, especialmente a do backend com TensorFlow).

### 4. Atualizar o docker-compose.pull.yml

Edite o arquivo `docker-compose.pull.yml` e substitua `ecmartins` pelo seu username do Docker Hub (se diferente):

```yaml
services:
  backend:
    image: SEU_USUARIO/reciclaai-backend:latest
  frontend:
    image: SEU_USUARIO/reciclaai-frontend:latest
```

**Nota:** O arquivo já está configurado com `ecmartins` como padrão.

### 5. (Opcional) Criar uma organização no Docker Hub

Se quiser usar um nome mais profissional (ex: `reciclaai`), você pode:
- Criar uma organização no Docker Hub
- Adicionar colaboradores
- Usar o nome da organização no lugar do username pessoal

## Atualizando as imagens

Sempre que fizer mudanças no código e quiser atualizar as imagens públicas:

```bash
# 1. Reconstruir
docker compose build

# 2. Remarcar
docker tag reciclaai2-backend:latest SEU_USUARIO/reciclaai-backend:latest
docker tag reciclaai2-frontend:latest SEU_USUARIO/reciclaai-frontend:latest

# 3. Publicar novamente
docker push SEU_USUARIO/reciclaai-backend:latest
docker push SEU_USUARIO/reciclaai-frontend:latest
```

## Alternativa: GitHub Container Registry

Se preferir usar o GitHub Container Registry (ghcr.io) em vez do Docker Hub:

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u SEU_USUARIO --password-stdin

# Marcar
docker tag reciclaai2-backend:latest ghcr.io/SIC-ReciclaAI/reciclaai-backend:latest
docker tag reciclaai2-frontend:latest ghcr.io/SIC-ReciclaAI/reciclaai-frontend:latest

# Publicar
docker push ghcr.io/SIC-ReciclaAI/reciclaai-backend:latest
docker push ghcr.io/SIC-ReciclaAI/reciclaai-frontend:latest
```

Depois atualize o `docker-compose.pull.yml` com os novos nomes.

