# Treinão Encontro das Águas — 2ª Edição

Aplicação web para inscrições públicas do evento **Treinão Encontro das Águas — 2ª Edição** e gestão administrativa das inscrições.

## Stack atual

- Workspace pnpm com Node.js 24 e TypeScript 5.9.
- Frontend: React, Vite, Tailwind CSS, shadcn/ui, wouter e TanStack Query.
- API: Express.
- Banco: PostgreSQL com Drizzle ORM.
- Contratos: OpenAPI em `lib/api-spec/openapi.yaml`, com geração para `lib/api-client-react` e `lib/api-zod`.
- Autenticação admin: login próprio por e-mail/senha com sessão HTTP-only e senha com hash `scrypt`.

## Estrutura

- `artifacts/corrida-retorno-praia/` — frontend React/Vite.
- `artifacts/api-server/` — API Express.
- `lib/db/` — conexão e schema Drizzle.
- `lib/api-spec/` — especificação OpenAPI.
- `lib/api-client-react/` — cliente React Query gerado.
- `lib/api-zod/` — schemas Zod gerados.
- `scripts/` — scripts auxiliares.

## Setup local

1. Copie `.env.example` para `.env` e ajuste `DATABASE_URL`.
2. Instale as dependências:

```sh
corepack pnpm install --frozen-lockfile --ignore-scripts
```

No estado atual do Mac local, `pnpm` pode não existir diretamente no PATH. Se isso acontecer, use `corepack pnpm ...`.

O script `preinstall` do workspace exige o user agent `pnpm/*`, mas a chamada via Corepack pode ser reportada de forma diferente e falhar. Por isso, a instalação local auditada nesta etapa usou `--ignore-scripts`.

## Comandos

Typecheck completo:

```sh
pnpm run typecheck
```

Build completo:

```sh
pnpm run build
```

API local:

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_corrida_manager PORT=8080 pnpm --filter @workspace/api-server run dev
```

Frontend local:

```sh
pnpm --filter @workspace/corrida-retorno-praia run dev
```

Aplicar schema no banco de desenvolvimento:

```sh
pnpm --filter @workspace/db run push
```

Criar/atualizar o evento oficial e os percursos:

```sh
pnpm --filter @workspace/scripts run seed:event
```

Criar/atualizar um usuário administrador local:

```sh
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=troque-esta-senha ADMIN_NAME="Organização" pnpm --filter @workspace/scripts run seed:admin
```

Gerar cliente e schemas a partir do OpenAPI:

```sh
pnpm --filter @workspace/api-spec run codegen
```

## Produção / Coolify

O projeto agora pode rodar em um único container: a API Express serve `/api/*` e também o build estático do frontend quando `PUBLIC_DIR` aponta para a pasta gerada pelo Vite.

O runbook detalhado de publicação está em [`docs/deploy-coolify.md`](docs/deploy-coolify.md).

Build local da imagem:

```sh
docker build -t app-corrida-manager .
```

Execução local da imagem, usando um PostgreSQL acessível pelo host:

```sh
docker run --rm \
  -p 8080:8080 \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/app_corrida_manager" \
  -e NODE_ENV=production \
  -e PORT=8080 \
  app-corrida-manager
```

Variáveis obrigatórias no Coolify:

- `DATABASE_URL`
- `NODE_ENV=production`
- `PORT=8080`

Variáveis úteis:

- `LOG_LEVEL=info`
- `CORS_ALLOWED_ORIGINS` com origens externas permitidas, separadas por vírgula. Para o container único com frontend e API no mesmo domínio, pode ficar vazio.
- `ENABLE_HSTS=false` enquanto o domínio definitivo HTTPS não estiver configurado; use `true` depois do HTTPS confiável.
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

O Dockerfile já define `PUBLIC_DIR=/app/artifacts/corrida-retorno-praia/dist/public`. Só altere se a estrutura de build mudar.

Depois de criar o banco de produção, rode os comandos de schema/seed contra o `DATABASE_URL` de produção:

```sh
pnpm --filter @workspace/db run push
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=troque-esta-senha ADMIN_NAME="Organização" pnpm --filter @workspace/scripts run seed:admin
pnpm --filter @workspace/scripts run seed:event
```

## Estado conhecido da auditoria inicial

- O workspace possui seed explícito para evento/percursos e admin.
- `typecheck` e `build` passam no estado atual validado localmente.
- `artifacts/corrida-retorno-praia` ainda é um nome técnico legado do pacote/pasta. Ele não deve aparecer na UI pública; uma renomeação estrutural pode ser feita depois, com cuidado para não gerar ruído desnecessário.
- Os Vite configs têm defaults locais: frontend público em `5173`, mockup sandbox em `5174`, e `BASE_PATH=/`.
- O fluxo admin principal não depende de Replit/OIDC. As rotas OIDC permanecem apenas como compatibilidade técnica legada enquanto a limpeza final não é feita.
