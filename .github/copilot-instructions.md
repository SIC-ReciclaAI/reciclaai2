# Instruções Copilot ReciclaAI

## Visão Geral do Projeto
ReciclaAI usa IA (visão computacional baseada em CNN) para classificar resíduos a partir de fotos do usuário em 5 categorias: **plástico, vidro, papel, metal, orgânico**. Fornece orientações de descarte, pontos de coleta e dicas de reciclagem. Desenvolvido para o Samsung Innovation Campus 2025.

### Funcionalidades Principais
- Classificação de imagens com tempo de resposta <15s
- Instruções de descarte por categoria de resíduo
- Loop de feedback do usuário para melhoria do modelo
- Histórico de imagens e localizador de pontos de coleta
- Interface mobile (Android/iOS) + web responsiva

## Arquitetura

### Estrutura do Monorepo (Turborepo + Bun)
- **Frontend**: `apps/frontend/` - Next.js 16, React 19, TypeScript, Tailwind 4
- **Backend**: `apps/backend/` - Python 3.14, FastAPI, modelo CNN (ainda não no repo)
- **Packages**: `packages/` - Código compartilhado (vazio, preparado para uso futuro)

### Stack Tecnológica
- **Runtime**: Bun 1.3 (NÃO npm/yarn/pnpm)
- **Python Backend**: Use `uv` para rodar e instalar dependências em `apps/backend`
- **Build**: Turborepo
- **Lint/Format**: Biome 2.3.0
- **Tipos**: TypeScript nativo em Go (`tsgo`)

## Fluxo de Desenvolvimento

```powershell
# Configuração (única vez)
bun install              # Instalar todas as dependências

# Desenvolvimento diário
bun dev                  # Frontend (localhost:3000) + Backend (localhost:4000/v1)
bun lint                 # Verificar código com Biome
bun format               # Auto-correção (inclui --unsafe)
bun typecheck            # Verificação de tipos em todos os pacotes

# Apenas frontend
cd apps/frontend
bun dev                  # Next.js com Turbopack
bun typecheck            # Tipos Next.js + tsgo

# Produção
bun build                # Build de todos os apps via Turbo
```

## Convenções de Código

### Regras do Biome (Estritamente Aplicadas)
- **Estilo**: 2 espaços, aspas simples, ponto e vírgula, máx 120 caracteres
- **Imports**: Auto-organização, use `import type` para tipos
- **Erros**: Imports/variáveis não usados, sintaxe `Array<T>`, loops `.forEach()`
- **Tailwind**: Classes auto-ordenadas com `useSortedClasses` (use `cn()`, `clsx()`, `twMerge()`)

### Padrão de Componentes UI (shadcn/ui "new-york")
```tsx
// Exemplo do button.tsx
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const variants = cva('base-classes', {
  variants: { variant: { default: '...', destructive: '...' } }
});

function Component({ className, variant, ...props }: VariantProps<typeof variants>) {
  return <button className={cn(variants({ variant }), className)} {...props} />;
}
```
- Componentes: `src/components/ui/` (primitivos), `src/components/` (features)
- Ícones: apenas `lucide-react`
- Aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`

### Next.js 16 + React 19
- **React Compiler**: Auto-memoização habilitada
- **Typed Routes**: Navegação type-safe
- **Turbopack**: Cache FS para dev/build
- **Server Components**: Padrão (adicione `'use client'` quando necessário)
- **Fontes**: Geist Sans + Geist Mono (veja `layout.tsx`)
- **Estilização**: Tailwind 4 com variáveis CSS em `globals.css`

## Pontos de Integração

### Comunicação Backend
- Backend: `localhost:4000/v1` (FastAPI com modelo CNN)
- Frontend: `localhost:3000`
- Deps Python: Ainda não configuradas (TODO)

### Estrutura de Arquivos
```
apps/frontend/src/
├── app/              # Next.js App Router (page.tsx, layout.tsx)
├── components/
│   └── ui/          # Primitivos shadcn/ui
├── lib/             # utils.ts (helper cn())
└── hooks/           # Hooks React customizados
```

## Padrões Comuns

### Componentes UI
- Use `cn("base", condition && "conditional")` para composição de className
- Siga o padrão CVA para variantes (veja `button.tsx`)
- Primitivos shadcn/ui em `src/components/ui/`

## Observações Específicas do Projeto

- **Ambiente Windows**: PowerShell padrão, use `;` para encadear comandos
- **Tasks Turbo**: Definidas em `turbo.json` (dev, build, lint, format, typecheck)
- **Versões Catalog**: `package.json` raiz usa `catalog:` para deps compartilhadas
- **Sem forEach**: Biome força `.map()`/`.filter()` por performance
