# Runbook de deploy no Coolify

Este documento descreve o procedimento operacional para publicar o **Treinão Encontro das Águas — 2ª Edição** na VPS usando Coolify.

## 1. Topologia recomendada

Use uma aplicação única baseada no `Dockerfile` do repositório:

- a API Express responde em `/api/*`;
- o mesmo container serve o frontend Vite compilado;
- PostgreSQL fica como recurso gerenciado no Coolify;
- Coolify faz o proxy HTTPS para o domínio/subdomínio.

Porta interna da aplicação:

```txt
8080
```

Health check recomendado:

```txt
/api/healthz
```

## 2. Variáveis de produção

Configure estas variáveis no app do Coolify:

```env
NODE_ENV=production
PORT=8080
LOG_LEVEL=info
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:5432/BANCO
```

Configure também as variáveis usadas para criar ou atualizar o admin inicial:

```env
ADMIN_EMAIL=seu-email-admin@dominio.com
ADMIN_PASSWORD=uma-senha-forte
ADMIN_NAME=Organização
```

Não use as credenciais locais de desenvolvimento em produção:

```txt
admin@encontrodasaguas.local
admin123
```

O `Dockerfile` já define:

```env
PUBLIC_DIR=/app/artifacts/corrida-retorno-praia/dist/public
```

Não altere `PUBLIC_DIR` no Coolify, salvo se a estrutura de build mudar.

## 3. Criar PostgreSQL no Coolify

1. Crie um recurso PostgreSQL no mesmo projeto/ambiente da aplicação.
2. Defina usuário, senha e nome do banco.
3. Copie a string de conexão interna fornecida pelo Coolify.
4. Cole essa string em `DATABASE_URL` no app.
5. Garanta que app e banco estejam na mesma rede/destination do Coolify.

Formato esperado:

```txt
postgresql://USUARIO:SENHA@HOST:5432/BANCO
```

## 4. Criar a aplicação no Coolify

1. Crie uma nova aplicação a partir do repositório Git.
2. Selecione build por `Dockerfile`.
3. Use a raiz do repositório como diretório base.
4. Exponha a porta interna `8080`.
5. Configure o domínio/subdomínio.
6. Ative HTTPS/force HTTPS no Coolify.
7. Configure health check em `/api/healthz`.
8. Faça o primeiro deploy.

Depois do deploy, valide:

```txt
https://SEU_DOMINIO/api/healthz
https://SEU_DOMINIO/
https://SEU_DOMINIO/inscricao
https://SEU_DOMINIO/painel/login
```

## 5. Inicializar schema e seeds

Após o primeiro deploy da aplicação e criação do banco, execute os comandos abaixo no terminal/exec da aplicação no Coolify.

Aplicar o schema atual no PostgreSQL:

```sh
pnpm --filter @workspace/db run push
```

Criar ou atualizar o evento oficial e os percursos:

```sh
pnpm --filter @workspace/scripts run seed:event
```

Criar ou atualizar o admin inicial:

```sh
ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" ADMIN_NAME="$ADMIN_NAME" pnpm --filter @workspace/scripts run seed:admin
```

Os seeds são idempotentes:

- `seed:event` cria ou atualiza o evento **Treinão Encontro das Águas — 2ª Edição**;
- `seed:event` cria ou atualiza os percursos `3 km`, `5 km` e `10 km`;
- `seed:admin` cria ou atualiza o admin pelo e-mail informado.

## 6. Ordem segura de primeira publicação

1. Criar PostgreSQL no Coolify.
2. Configurar `DATABASE_URL`.
3. Configurar `NODE_ENV=production`, `PORT=8080`, `LOG_LEVEL=info`.
4. Configurar `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.
5. Criar app pelo `Dockerfile`.
6. Fazer deploy.
7. Executar `pnpm --filter @workspace/db run push`.
8. Executar `pnpm --filter @workspace/scripts run seed:event`.
9. Executar `pnpm --filter @workspace/scripts run seed:admin`.
10. Acessar `/api/healthz`.
11. Acessar `/inscricao`.
12. Fazer login em `/painel/login`.
13. Fazer uma inscrição real de teste.
14. Confirmar que a inscrição aparece no admin.
15. Exportar CSV e conferir CPF, percurso, contato de emergência e termos.

## 7. Smoke test pós-deploy

Execute este checklist depois de cada deploy:

- `/api/healthz` retorna `{"status":"ok"}`;
- `/` carrega a página pública;
- `/inscricao` carrega o formulário;
- checkbox de termos abre o modal;
- aceite dos termos marca o checkbox;
- inscrição pública salva com sucesso;
- tentativa de CPF duplicado retorna erro claro;
- `/painel/login` autentica o admin;
- `/painel/inscricoes` lista inscrições;
- edição de inscrição abre e salva;
- exportação CSV baixa arquivo com CPF e dados de termos.

## 8. Rollback operacional

Se o deploy novo falhar:

1. Use o rollback do Coolify para voltar ao deployment anterior.
2. Não rode `db:push` novamente até entender a falha.
3. Verifique logs da aplicação e do PostgreSQL.
4. Valide `/api/healthz`.
5. Valide login admin e uma consulta de inscrições.

## 9. Observação sobre migrações

O procedimento atual usa:

```sh
pnpm --filter @workspace/db run push
```

Isso aplica o schema atual com `drizzle-kit push`. É suficiente para o primeiro deploy controlado, mas o ideal antes de evoluções frequentes em produção é adicionar migrações versionadas com `drizzle-kit generate` e `drizzle-kit migrate`.

Enquanto migrações versionadas não forem adicionadas:

- rode `db:push` apenas de forma controlada;
- evite mudanças manuais no banco de produção;
- faça backup do PostgreSQL antes de alterações de schema.

## 10. Backup antes de lançamento

Antes de abrir inscrições para o público:

1. Confirme que o PostgreSQL tem backup automático no Coolify/VPS.
2. Faça um backup manual inicial.
3. Guarde as credenciais admin em local seguro.
4. Remova qualquer inscrição de teste do banco de produção.
5. Faça uma inscrição real final e exporte CSV para conferência.
