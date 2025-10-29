# ReciclaAI

O ReciclaAI é um projeto que usa inteligência artificial e visão computacional para identificar se um material é reciclável e dar dicas de como descartar ou reciclar. A pessoa só tira uma foto e o sistema identifica o tipo de resíduo e orienta o que fazer.

Este é um projeto do curso Samsung Innovation Campus 2025.

# Documentos

<https://drive.google.com/drive/folders/1zZ3acZEuL7NNnp6csgUkzWTPCKPYDwit?dmr=1&ec=wgc-drive-globalnav-goto>

# Tecnologias

**Repositório**: Bun e Turborepo (monorepo)

**Front-end**: Next.js 16, Bun e TypeScript

**Back-end**: Python 3.13, uv, FastAPI (decidir outros)

# Instalação

> **Pré-requisitos**: Python 3.13 instalado; Git instalado

**1.** Clone o repositório utilizando `git clone https://github.com/SIC-ReciclaAI/reciclaai2`

**2.** Instale o Bun utilizando `powershell -c "irm bun.sh/install.ps1|iex"` (ou, no Linux `curl -fsSL https://bun.com/install | bash`)

**3.** Instale o uv utilizando `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`

**4.** Entre no repositório clonado utilizando `cd reciclaai2`

**5.** Instale todas as dependencias utilizando `bun install`

**6.** Inicie o backend (API que roda o nosso modelo) e o site (para enviar os pedidos do modelo) utilizando `bun dev`

**7.** O backend estará disponível em `localhost:8000` e o site em `localhost:3000`
