# ReciclaAI

O ReciclaAI usa IA e visão computacional para classificar resíduos, indicar se são recicláveis e sugerir o descarte correto. A versão atual inclui autenticação de usuários (JWT) e histórico com as últimas imagens analisadas, armazenados em banco SQL.

Projeto desenvolvido no **Samsung Innovation Campus 2025**.

## Documentos de apoio

<https://drive.google.com/drive/folders/1zZ3acZEuL7NNnp6csgUkzWTPCKPYDwit?dmr=1&ec=wgc-drive-globalnav-goto>

## Principais tecnologias

- **Monorepo**: Turborepo + Bun
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind
- **Backend**: Python 3.13, FastAPI, TensorFlow, SQLAlchemy, JWT
- **Banco padrão**: SQLite (pode ser alterado via `DATABASE_URL`)

## Pré-requisitos

- Git
- Python 3.13 + [uv](https://docs.astral.sh/uv/)
- [Bun](https://bun.sh/)
- (Opcional) Banco SQL externo se não quiser usar o SQLite embutido

### Como instalar uv e Bun no Windows

No PowerShell (pode ser necessário abrir como administrador), execute:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

Isso baixa e configura o `uv` e o `bun` no PATH para que os comandos do restante do guia funcionem.

## Passo a passo de instalação

```bash
git clone -b feature/sql-auth-readme --single-branch https://github.com/SIC-ReciclaAI/reciclaai2.git
cd reciclaai2
```

## 🐳 Executando com Docker

A forma mais simples de rodar o projeto é usando Docker. Você só precisa ter o Docker Desktop instalado.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando

### Opção 1: Rodar sem código local (Mais fácil) ⭐

**Ideal para quem só quer usar a aplicação sem desenvolver.**

1. Baixe os arquivos necessários:
   - `docker-compose.pull.yml`
   - `run-reciclaai.sh` (Linux/Mac) ou `run-reciclaai.ps1` (Windows)

2. Execute o script:

   **Linux/Mac:**
   ```bash
   chmod +x run-reciclaai.sh
   ./run-reciclaai.sh
   ```

   **Windows (PowerShell):**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\run-reciclaai.ps1
   ```

   **Ou manualmente:**
   ```bash
   docker compose -f docker-compose.pull.yml pull
   docker compose -f docker-compose.pull.yml up -d
   ```

3. Acesse no navegador:
   - **Frontend**: http://localhost:3000
   - **Backend (docs)**: http://localhost:8000/docs

**Vantagens:**
- ✅ Não precisa fazer `git clone`
- ✅ Não precisa ter o código local
- ✅ Apenas 2 arquivos necessários
- ✅ Imagens pré-construídas e otimizadas

### Opção 2: Rodar com código local (Desenvolvimento)

**Ideal para quem quer desenvolver ou modificar o código.**

1. Clone o repositório:
```bash
git clone -b feature/sql-auth-readme --single-branch https://github.com/SIC-ReciclaAI/reciclaai2.git
cd reciclaai2
```

2. Na pasta raiz do projeto, execute:

```bash
docker compose up --build
```

3. Aguarde a construção das imagens (primeira vez pode levar alguns minutos).

4. Acesse no navegador:
   - **Frontend**: http://localhost:3000
   - **Backend (docs)**: http://localhost:8000/docs

### Comandos úteis

```bash
# Parar os containers
docker compose down
# ou (se usando imagens pré-construídas)
docker compose -f docker-compose.pull.yml down

# Parar e remover volumes (limpa o banco de dados)
docker compose down -v

# Ver logs
docker compose logs -f

# Reconstruir após mudanças no código (apenas Opção 2)
docker compose up --build
```

### Vantagens do Docker

- ✅ Não precisa instalar Python, Node.js, Bun ou uv
- ✅ Ambiente isolado e consistente
- ✅ Funciona em qualquer sistema operacional
- ✅ Fácil de compartilhar e distribuir

### Publicar suas próprias imagens

Se quiser publicar as imagens no Docker Hub para que outros possam usar sem o código local, veja o guia em [PUBLISH_DOCKER.md](./PUBLISH_DOCKER.md).

---

## Desenvolvimento local (sem Docker)

Se preferir rodar localmente sem Docker, siga os passos abaixo:

### Backend (`apps/backend`)

```bash
cd apps/backend
uv sync                # instala dependências no ambiente virtual gerenciado pelo uv
```

Variáveis importantes (`.env`, ou exportadas antes de rodar o servidor):

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `DATABASE_URL` | URL SQLAlchemy do banco | `sqlite:///./reciclaai.db` |
| `JWT_SECRET_KEY` | Segredo usado para assinar os tokens | `reciclaai-secret` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiração do token JWT | `4320` (3 dias) |

Rodar o backend em desenvolvimento:

```bash
uv run uvicorn app.main:app --reload
# disponível em http://localhost:8000
```

### Frontend (`apps/frontend`)

```bash
cd apps/frontend
bun install
```

Crie um `.env.local` (ou use variáveis do sistema):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Rodar o site:

```bash
bun run dev
# disponível em http://localhost:3000
```

> Observação: como estamos em um monorepo, abra dois terminais — um para o backend (uvicorn) e outro para o frontend (Next.js).

## Fluxo principal

1. Usuário cria conta ou faz login (dados salvos no banco SQL).
2. Faz upload de uma imagem e a API analisa com o modelo TensorFlow.
3. Resultado + imagem são guardados em `prediction_history`, permitindo listar as últimas análises em qualquer dispositivo autenticado.

## Scripts úteis

| Comando | Local | Descrição |
| --- | --- | --- |
| `uv sync` | `apps/backend` | Instala/atualiza deps Python |
| `uv run uvicorn app.main:app --reload` | `apps/backend` | Sobe a API FastAPI |
| `bun install` | `apps/frontend` | Instala deps do Next.js |
| `bun run dev` | `apps/frontend` | Sobe o frontend em modo dev |

## Próximos passos sugeridos

- Configurar Postgres/MySQL em produção (atualizando `DATABASE_URL`).
- Configurar HTTPS e domínio público para expor o backend.
- Adicionar testes automatizados para rotas protegidas e componentes do front.

---

Sinta-se à vontade para abrir issues ou PRs com melhorias. ♻️💚
