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

## Passo a passo de instalação

```bash
git clone https://github.com/SIC-ReciclaAI/reciclaai2
cd reciclaai2
```

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
