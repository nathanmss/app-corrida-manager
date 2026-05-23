# specs.md — Treinão Encontro das Águas — 2ª Edição

## 1. Visão geral do projeto

Este projeto é uma aplicação web para inscrições públicas de eventos, inicialmente construída para o evento:

**Treinão Encontro das Águas — 2ª Edição**

O evento é um treinão comunitário de corrida, realizado em julho, para celebrar o retorno e a reabertura de uma área de praia local após o período de inverno/chuvas, quando o nível do rio começa a baixar e a praia volta a ser utilizada.

O sistema deve permitir que participantes façam inscrição rapidamente por um link público, sem criar conta. A organização deve ter uma área administrativa autenticada para gerenciar inscrições, visualizar resumos, filtrar participantes e exportar dados.

A aplicação deve ser simples, eficiente e elegante. "Simples" significa focada e fácil de usar, não visualmente pobre.

---

## 2. Objetivo do produto

Criar uma aplicação web mobile-first que permita aos participantes:

1. acessar a página pública do evento;
2. ler as informações do evento;
3. escolher um percurso: 3 km, 5 km ou 10 km;
4. preencher seus dados pessoais;
5. aceitar um termo de responsabilidade, saúde e ciência de riscos;
6. enviar a inscrição;
7. receber uma tela clara de confirmação.

A organização deve conseguir:

1. entrar na área administrativa;
2. visualizar todas as inscrições;
3. buscar e filtrar participantes;
4. editar/cancelar inscrições;
5. exportar listas;
6. usar os dados para check-in, organização dos percursos e planejamento de pódio/categorias.

---

## 3. Contexto de desenvolvimento

O primeiro protótipo funcional foi gerado com Replit.

A próxima fase de desenvolvimento acontecerá localmente no **Mac Mini M4** do usuário, conectado a um repositório Git.

Quando a aplicação estiver utilizável e finalizada, ela será publicada na VPS do usuário usando **Coolify**.

Fluxo esperado:

1. Replit gera o protótipo inicial.
2. O projeto é baixado/clonado localmente.
3. O repositório é conectado ao GitHub ou a outro remoto Git.
4. Codex continua o desenvolvimento localmente usando este `specs.md` e o `AGENTS.md`.
5. Gemini CLI pode ser usado para refinamento de frontend/UI quando for útil.
6. Context7 MCP deve ser usado para documentação técnica.
7. A skill Playwright deve ser usada para validação de UI e checagens mobile.
8. A skill interface-design deve ser usada para melhorias de UI/UX.
9. Depois que a aplicação estiver estável, ela será preparada para deploy em produção via Coolify.

---

## 4. Direção técnica atual

O protótipo do Replit usa uma stack Node/TypeScript.

Stack preferida para continuidade:

- React;
- Vite;
- TypeScript;
- Tailwind CSS;
- shadcn/ui or existing UI component structure;
- Express backend;
- PostgreSQL;
- Drizzle ORM;
- deploy pronto para Docker;
- deploy de produção via Coolify.

A stack atual deve ser preservada, salvo motivo técnico forte e aprovação explícita do usuário para mudança.

---

## 5. Regras centrais do produto

1. A área pública do participante não deve exigir login.
2. Participantes apenas preenchem o formulário de inscrição e confirmam a inscrição.
3. A área administrativa/organização exige autenticação.
4. A UI da aplicação deve estar inteiramente em português do Brasil.
5. O código pode usar inglês para nomes técnicos.
6. A experiência mobile é prioridade porque a maioria dos usuários acessará pelo telefone.
7. A aplicação deve ser elegante e polida, mesmo com escopo simples.
8. O sistema deve estar preparado para uso em produção, não apenas para protótipo.

---

## 6. Event Identity

Official event name for user-facing UI:

**Treinão Encontro das Águas — 2ª Edição**

Technical slug:

`treinao-encontro-das-aguas-2-edicao`

Event routes:

- 3 km;
- 5 km;
- 10 km.

Suggested public copy:

> Um treinão comunitário para celebrar o encontro, o movimento e a energia das águas. Escolha seu percurso, confirme sua presença e venha participar com a gente.

The UI should feel:

- sporty;
- welcoming;
- community-oriented;
- elegant;
- mobile-first;
- clear and trustworthy.

---

## 7. Fluxo público do participante

O fluxo do participante é:

1. Participante recebe ou acessa o link público do evento.
2. Participante visualiza a página pública do evento.
3. Participante clica no CTA de inscrição.
4. Participante preenche o formulário.
5. Participante escolhe um percurso: 3 km, 5 km ou 10 km.
6. Participante abre e aceita o termo de responsabilidade.
7. Participante envia o formulário.
8. Sistema valida os dados.
9. Sistema impede inscrição duplicada por CPF.
10. Participante vê uma tela de sucesso com a confirmação da inscrição.

Nenhuma conta, senha ou login de participante é necessário.

---

## 8. Páginas públicas

### 8.1 Página pública do evento

Deve incluir:

- banner/hero do evento;
- nome do evento;
- data;
- local;
- descrição curta;
- cards de percurso para 3 km, 5 km e 10 km;
- botão CTA claro para inscrição;
- seção de informações importantes;
- área de WhatsApp/contato, se disponível;
- layout mobile-first.

### 8.2 Página de inscrição

Deve incluir:

- formulário de dados do participante;
- seleção de percurso;
- campos opcionais de contato de emergência;
- checkbox de termos;
- modal de termos;
- botão de envio;
- mensagens de validação em pt-BR.

### 8.3 Página de sucesso

Deve incluir:

- mensagem clara de sucesso;
- nome do participante;
- percurso escolhido;
- código de inscrição, se disponível;
- informações do evento;
- orientação para contatar a organização, se necessário;
- botão opcional de compartilhamento.

---

## 9. Requisitos do formulário de inscrição

Campos obrigatórios:

1. Nome completo;
2. CPF;
3. WhatsApp;
4. Data de nascimento;
5. Sexo;
6. Percurso selecionado;
7. Aceite dos termos.

Campos opcionais:

1. Nome do contato de emergência;
2. WhatsApp do contato de emergência.

Grupo de campos removido/indesejado:

- Não manter uma aba/seção genérica de "informações adicionais".
- Substituir essa área por campos opcionais de contato de emergência.

Regras de CPF:

1. CPF é obrigatório.
2. CPF é o identificador único da inscrição.
3. Apenas uma inscrição ativa por CPF é permitida para o mesmo evento.
4. CPF deve ser validado.
5. CPF deve ser normalizado antes da checagem de duplicidade.
6. O painel admin deve mostrar CPF.
7. Exportações devem incluir CPF.

Regras de contato de emergência:

1. Contato de emergência é opcional.
2. Se informado, coletar nome e WhatsApp.
3. A UI deve explicar que é opcional, mas útil em caso de emergência.
4. Se apenas um campo de contato de emergência for preenchido, a validação deve orientar o participante a completar o outro campo útil ou limpar ambos.

---

## 10. Fluxo de termos e responsabilidade

O formulário de inscrição deve incluir:

`Li e aceito o Termo de Responsabilidade, Saúde e Ciência de Riscos.`

O título do termo deve ser clicável e abrir um modal/dialog.

O modal deve:

- funcionar muito bem no mobile;
- ter tipografia legível;
- ter rolagem interna;
- incluir o texto completo dos termos;
- ter botão `Fechar`;
- ter botão primário `Li e aceito os termos`;
- marcar o checkbox quando aceito.

O participante não pode enviar a inscrição sem aceitar os termos.

O backend deve armazenar:

- `acceptedTerms`;
- `acceptedTermsAt`;
- `termsVersion`.

Versão padrão atual:

`2026-05-18-v1`

As telas admin e exportações devem incluir essas informações quando implementadas.

---

## 11. Requisitos da área administrativa

A área administrativa é apenas para a organização.

Recursos obrigatórios:

- login admin;
- dashboard com resumo;
- lista de inscrições;
- busca por nome, CPF ou WhatsApp;
- filtros por percurso;
- filtros por sexo;
- filtros/status quando aplicável;
- edição de inscrição;
- cancelamento de inscrição;
- exportação CSV/Excel quando aplicável;
- visualização dos dados de aceite dos termos;
- cards de inscrição amigáveis no mobile.

O dashboard deve mostrar:

- total de inscrições;
- inscrições por percurso;
- inscrições por sexo;
- inscrições recentes;
- resumo por status, se aplicável.

---

## 12. Direção do modelo de dados

Entidades esperadas:

### Event

- id;
- name;
- slug;
- description;
- date;
- time;
- location;
- banner/image if applicable;
- status;
- registration deadline;
- participant limit if applicable.

### Route

- id;
- eventId;
- name;
- distanceKm;
- description;
- participant limit if applicable.

### Participante / Inscrição

Dependendo do código atual, participante e inscrição podem estar separados ou combinados. Os dados obrigatórios devem incluir:

- id;
- eventId;
- routeId;
- fullName;
- cpf;
- whatsapp;
- dateOfBirth;
- calculatedAge if used;
- sex;
- emergencyContactName opcional;
- emergencyContactWhatsapp opcional;
- status;
- acceptedTerms;
- acceptedTermsAt;
- termsVersion;
- registrationCode, se disponível;
- createdAt;
- updatedAt.

### Usuário admin

Obrigatório antes da produção:

- id;
- name;
- email;
- passwordHash;
- role;
- createdAt;
- updatedAt.

---

## 13. Requisitos de produção

Antes do deploy de produção, o projeto deve ter:

- nenhuma dependência de autenticação exclusiva do Replit;
- login admin pronto para produção;
- migrações de banco explícitas;
- script de seed explícito;
- variáveis de ambiente documentadas;
- Dockerfile ou configuração de deploy compatível com Coolify;
- PostgreSQL configurado;
- build passando;
- UI mobile validada;
- fluxo público de inscrição validado;
- fluxo admin validado;
- exportação validada;
- nenhuma referência antiga de nome do evento visível para usuários.

---

## 14. Plano de deploy

Ambiente alvo:

- VPS do usuário;
- Coolify;
- PostgreSQL;
- domínio ou subdomínio a configurar depois;
- HTTPS tratado pelo Coolify/proxy reverso.

Fases de deploy:

1. Desenvolvimento local no Mac Mini M4.
2. Configuração do repositório Git.
3. Configuração do banco local.
4. Mapeamento de variáveis de ambiente de produção.
5. Configuração Docker/Coolify.
6. Deploy de teste semelhante a staging, se possível.
7. Deploy final de produção.
8. Testes rápidos pós-deploy.

---

## 15. Marcos

### Marco 1 — Auditoria do repositório e setup local

- [x] Abrir e inspecionar o projeto gerado pelo Replit.
- [x] Confirmar a estrutura real de pastas e comandos.
- [x] Instalar dependências localmente no Mac Mini M4.
- [x] Criar/atualizar `.env.example`.
- [x] Documentar comandos de setup local.
- [x] Verificar que o servidor de desenvolvimento roda localmente.
- [x] Verificar status de build/typecheck.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Aplicação roda localmente.
- Setup local está documentado.
- Problemas conhecidos estão listados.

---

### Marco 2 — Limpar referências do protótipo Replit

- [x] Remover referências antigas visíveis ao usuário para Corrida do Retorno da Praia.
- [x] Garantir que o nome do evento seja sempre Treinão Encontro das Águas — 2ª Edição.
- [x] Padronizar o slug técnico.
- [x] Revisar metadados/títulos das páginas.
- [x] Revisar textos da página de sucesso/compartilhamento.
- [x] Revisar textos de login admin/sidebar/rodapé.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Nenhum nome antigo do evento aparece na aplicação visível ao usuário.
- Referências técnicas foram renomeadas ou documentadas quando inofensivas.

---

### Marco 3 — CPF como identificador obrigatório e único

- [x] Adicionar CPF como campo obrigatório de inscrição, se ainda não existir.
- [x] Adicionar validação de CPF.
- [x] Normalizar CPF antes de salvar/checar duplicidade.
- [x] Garantir apenas uma inscrição ativa por CPF por evento.
- [x] Atualizar schema/validação do backend.
- [x] Atualizar validação do formulário no frontend.
- [x] Atualizar lista/detalhes admin para mostrar CPF.
- [x] Atualizar exportação CSV/Excel para incluir CPF.
- [x] Adicionar mensagem clara em pt-BR para CPF duplicado.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Um participante não consegue se inscrever duas vezes no mesmo evento usando o mesmo CPF.
- CPF aparece no admin e nas exportações.
- Mensagens de validação são claras e em pt-BR.

---

### Marco 4 — Substituir informações adicionais por contato de emergência

- [x] Remover aba/seção genérica de informações adicionais da inscrição.
- [x] Adicionar campo opcional de nome do contato de emergência.
- [x] Adicionar campo opcional de WhatsApp do contato de emergência.
- [x] Adicionar texto auxiliar explicando que os campos são opcionais.
- [x] Adicionar validação quando apenas parte do contato de emergência é preenchida.
- [x] Atualizar schema/validação do backend.
- [x] Atualizar visualização/edição no admin.
- [x] Atualizar exportação.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Nenhuma seção genérica de informações adicionais permanece no formulário público.
- Campos opcionais de contato de emergência funcionam e são armazenados.

---

### Marco 5 — Fortalecimento do aceite dos termos

- [x] Revisar implementação do modal de termos.
- [x] Garantir que o modal seja adequado ao mobile.
- [x] Garantir que o checkbox não possa ser burlado.
- [x] Armazenar `acceptedTerms`, `acceptedTermsAt`, `termsVersion`.
- [x] Exibir dados de aceite dos termos no admin quando útil.
- [x] Incluir dados dos termos na exportação.
- [x] Documentar versão atual dos termos.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Toda inscrição armazena evidência do aceite dos termos.
- Exportação/admin conseguem mostrar dados do aceite dos termos.

---

### Marco 6 — Remover Replit Auth e implementar autenticação admin

- [x] Auditar implementação atual de autenticação.
- [x] Remover dependência específica de Replit do fluxo de produção.
- [x] Criar modelo/tabela de usuário admin, se necessário.
- [x] Implementar hash seguro de senha.
- [x] Implementar login/logout admin.
- [x] Proteger rotas/endpoints admin.
- [x] Adicionar seed admin via variáveis de ambiente ou script de setup.
- [x] Atualizar `.env.example`.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Autenticação admin funciona localmente sem Replit.
- Inscrição pública continua sem autenticação.
- Rotas admin ficam protegidas.

---

### Marco 7 — Seed e confiabilidade do banco

- [x] Criar script de seed explícito.
- [x] Criar seed dos dados do evento.
- [x] Criar seed dos percursos: 3 km, 5 km e 10 km.
- [x] Criar seed do usuário admin inicial.
- [x] Garantir que um banco novo consiga iniciar do zero.
- [x] Garantir que migrações/schema estejam documentados.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Um banco novo pode ser inicializado de forma previsível.
- A aplicação funciona após executar migrações/seeds.

---

### Marco 8 — Refinamento de UI mobile-first

- [x] Usar a skill interface-design para refinamento de UI.
- [x] Refinar layout mobile da landing page.
- [x] Refinar layout mobile do formulário de inscrição.
- [x] Refinar experiência touch da seleção de percurso.
- [x] Refinar experiência mobile de leitura do modal de termos.
- [x] Refinar layout mobile da página de sucesso.
- [x] Refinar cards mobile de inscrições no admin.
- [x] Validar com Playwright em 360, 390, 430, 768 e desktop.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Sem rolagem horizontal no mobile.
- Inscrição confortável em telas de telefone.
- Lista admin utilizável no mobile.

---

### Marco 9 — Gestão admin e polimento da exportação

- [x] Melhorar resumos do dashboard.
- [x] Melhorar busca por nome, CPF e WhatsApp.
- [x] Melhorar filtros por percurso/sexo/status.
- [x] Garantir que fluxos de edição/cancelamento funcionem.
- [x] Garantir que a exportação inclua todos os campos relevantes:
  - nome;
  - CPF;
  - WhatsApp;
  - data de nascimento/idade;
  - sexo;
  - percurso;
  - contato de emergência;
  - status;
  - aceite dos termos;
  - data dos termos;
  - versão dos termos;
  - data de criação.
- [x] Validar conteúdo da exportação.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Organização consegue gerenciar e exportar inscrições com confiança.

---

### Marco 10 — Preparação de produção para Coolify

- [x] Criar ou revisar Dockerfile.
- [x] Criar comandos de build/start de produção.
- [x] Documentar variáveis de ambiente.
- [x] Configurar conexão PostgreSQL.
- [x] Garantir que migrações/seeds possam rodar em produção.
- [x] Garantir que a aplicação não dependa do Replit.
- [x] Adicionar notas de deploy para Coolify.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Projeto está pronto para deploy via Coolify.

---

### Marco 11 — QA final e prontidão de lançamento

- [x] Rodar build/typecheck completo.
- [x] Testar fluxo público de inscrição.
- [x] Testar prevenção de CPF duplicado.
- [x] Testar modal de termos e aceite.
- [x] Testar login admin.
- [x] Testar gestão admin de inscrições.
- [x] Testar exportação.
- [x] Testar layouts mobile.
- [ ] Testar deploy em produção.
- [x] Documentar problemas finais conhecidos, se houver.
- [x] Atualizar o Registro de Progresso.

Critérios de aceite:

- Aplicação está utilizável para o evento real.
- Fluxos críticos foram validados.

---

## 16. Mudanças obrigatórias conhecidas atualmente

Estas mudanças vieram diretamente do feedback do usuário e devem ser tratadas nos marcos:

1. CPF must be mandatory.
2. CPF must be the unique identifier for registration.
3. Only one registration per CPF per event.
4. Remover a seção/aba genérica de informações adicionais.
5. Adicionar campos opcionais de contato de emergência:
   - nome do contato de emergência;
   - WhatsApp do contato de emergência.
6. Manter modal de termos e aceite de responsabilidade.
7. Continuar priorizando responsividade mobile refinada.
8. Preparar a aplicação para desenvolvimento local no Mac Mini M4.
9. Preparar deploy final na VPS via Coolify.

---

## 17. Regras de check-in de desenvolvimento

No início de toda sessão de trabalho:

1. Ler `AGENTS.md`.
2. Ler este `specs.md`.
3. Identificar o marco atual.
4. Inspecionar o Registro de Progresso.
5. Trabalhar apenas na tarefa/marco selecionado.

Ao final de toda sessão de trabalho:

1. Rodar checagens relevantes.
2. Atualizar o Registro de Progresso.
3. Não marcar marcos como completos sem confirmação explícita do usuário.
4. Listar pendências claramente.

---

## 18. Registro de Progresso

### Estado inicial — 2026-05-18

**Agente:** Planning / ChatGPT  
**Escopo:** Project planning files generated for local development continuation.  
**Arquivos alterados:**
- `AGENTS.md`
- `specs.md`

**O que mudou:**
- Defined development rules for AI agents.
- Defined mandatory use of Context7 MCP.
- Defined mandatory use of Playwright and interface-design skills.
- Documented project scope.
- Documented local Mac Mini M4 development flow.
- Documented future Coolify deployment flow.
- Added milestone plan.
- Added CPF as mandatory unique registration identifier.
- Added emergency contact fields as replacement for generic additional information.

**Validação realizada:**
- Planning only. No code validation performed yet.

**Pendente:**
- Place these files in the repository root.
- Start Marco 1 with Codex locally.
- Audit actual Replit-generated project structure.

**Riscos/observações:**
- The Replit prototype may still contain Replit-specific authentication and seed assumptions.
- Production deployment must not depend on Replit Auth.

**Próximo passo recomendado:**
- Add `AGENTS.md` and `specs.md` to the project root, then run Codex locally and begin Marco 1.

### 2026-05-19 — Codex tooling setup

**Agente:** Codex  
**Escopo:** Installed mandatory Codex tooling requested in `AGENTS.md`.  
**Arquivos alterados:**
- `specs.md`
- `~/.codex/config.toml`
- `~/.codex/skills/playwright/SKILL.md`
- `~/.codex/skills/interface-design/SKILL.md`

**O que mudou:**
- Added global Context7 MCP server configuration for Codex using `npx -y @upstash/context7-mcp`.
- Installed the official curated `playwright` skill.
- Installed the external `interface-design` skill from `Dammyjay93/interface-design` because it is not present in the official curated Codex skill catalog.

**Validação realizada:**
- `codex mcp list`
- `find /Users/nathanmss/.codex/skills -maxdepth 2 -name SKILL.md`

**Pendente:**
- Restart Codex so newly installed skills are loaded in future sessions.
- Confirm Context7 availability in the next session after Codex reloads the MCP configuration.

**Riscos/observações:**
- Context7 MCP is configured globally in `~/.codex/config.toml`, not in the repository.
- `interface-design` came from an external skill repository, not the OpenAI curated skill catalog.

**Próximo passo recomendado:**
- Restart Codex, then begin Marco 1 by auditing the actual project structure and current implementation.

### 2026-05-20 — Context7 MCP startup fix

**Agente:** Codex  
**Escopo:** Diagnosed and fixed the Context7 MCP startup failure shown when launching Codex.  
**Arquivos alterados:**
- `specs.md`
- `~/.codex/config.toml`
- `.codex-npm-cache/`

**O que mudou:**
- Identified that `npx` was failing because `~/.npm` contains root-owned cache entries.
- Added `NPM_CONFIG_CACHE=/Users/nathanmss/workspace/app-corrida-manager/.codex-npm-cache` to the `context7` MCP server config.
- Created a writable npm cache directory for the Context7 MCP package.

**Validação realizada:**
- `NPM_CONFIG_CACHE=/Users/nathanmss/workspace/app-corrida-manager/.codex-npm-cache npm view @upstash/context7-mcp version`
- Manual MCP stdio initialize handshake against `npx -y @upstash/context7-mcp`, confirmed Context7 v2.2.5 returned `serverInfo`.

**Pendente:**
- Restart Codex to confirm startup no longer shows the Context7 MCP warning.

**Riscos/observações:**
- Context7 was unavailable at the beginning of the session, so external documentation lookup through Context7 could not be used before this fix.
- The root-owned `~/.npm` entries still exist; this session avoided them by using a dedicated cache for the MCP server instead of requiring sudo.
- This directory is not currently a Git repository, so changes could not be reviewed with `git status`.

**Próximo passo recomendado:**
- Restart Codex and verify that the `context7` MCP starts cleanly before beginning Marco 1 implementation work.

### 2026-05-20 — Marco 1 auditoria local e setup

**Agente:** Codex  
**Escopo:** Audited the Replit-generated workspace structure, installed dependencies, documented local setup, and validated local dev server startup.  
**Arquivos alterados:**
- `.env.example`
- `.gitignore`
- `README.md`
- `replit.md`
- `pnpm-workspace.yaml`
- `pnpm-lock.yaml`
- `specs.md`

**O que mudou:**
- Confirmed this is a pnpm workspace with frontend in `artifacts/corrida-retorno-praia`, API in `artifacts/api-server`, and shared packages under `lib/*`.
- Added `.env.example` with the current required local variables: `DATABASE_URL`, `PORT`, `BASE_PATH`, `NODE_ENV`, `LOG_LEVEL`, `REPL_ID`, and `ISSUER_URL`.
- Added `.gitignore` for local dependencies, build output, env files, and local caches.
- Added `README.md` with stack overview, folder map, setup commands, known local state, and validation notes.
- Updated `replit.md` so it no longer describes the old event as the project title and no longer claims seed data exists automatically.
- Removed native dependency exclusion overrides for Rollup, esbuild, Tailwind oxide and Lightning CSS from `pnpm-workspace.yaml`; these blocked Vite from running on the Mac Mini M4 by excluding `@rollup/rollup-darwin-arm64`.
- Regenerated `pnpm-lock.yaml` after the workspace override correction.
- Consulted Context7 for Vite local server/config behavior while documenting setup.

**Validação realizada:**
- `corepack pnpm --version` returned `11.1.3`.
- `CI=true corepack pnpm install --no-frozen-lockfile --ignore-scripts` completed successfully after correcting native dependency overrides.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` failed in `artifacts/api-server` due existing TypeScript errors in `src/routes/admin.ts` and `src/routes/registrations.ts`.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` failed because it runs the same failing typecheck.
- `PORT=5173 BASE_PATH=/ corepack pnpm --filter @workspace/corrida-retorno-praia run dev` started Vite successfully outside the sandbox; `curl -I http://localhost:5173/` returned `HTTP/1.1 200 OK`.
- `PORT=8080 DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_corrida_manager corepack pnpm --filter @workspace/api-server run dev` started the API successfully; `curl -i http://localhost:8080/api/healthz` returned `HTTP/1.1 200 OK` with `{"status":"ok"}`.
- `PORT=5173 BASE_PATH=/ corepack pnpm --filter @workspace/corrida-retorno-praia run build` completed successfully, with only a Vite/Rollup chunk-size warning.

**Pendente:**
- Fix API TypeScript errors before claiming build/typecheck is passing.
- Add a real seed script for the event, routes and initial admin user.
- `pnpm` is not directly available on the PATH in this machine; commands currently work via `corepack pnpm` or a temporary shim.
- The root `preinstall` script fails when install is invoked through Corepack, so dependency install currently requires `--ignore-scripts` or a follow-up package-manager fix.
- Continue Marco 2 cleanup for remaining old event-name references in `lib/api-spec/openapi.yaml` and generated API files.

**Riscos/observações:**
- This directory is not currently a Git repository, so changes could not be reviewed with `git status`.
- Admin authentication still depends on Replit/OIDC and `REPL_ID`; this is expected to be removed in Marco 6.
- The API can start and serve health checks with a placeholder `DATABASE_URL`, but public/admin data routes still require a real PostgreSQL database with schema and seed data.
- No Playwright UI validation was performed because this session changed setup/config documentation and dependency installation, not app UI.

**Próximo passo recomendado:**
- Fix the existing API typecheck failures in `artifacts/api-server/src/routes/admin.ts` and `artifacts/api-server/src/routes/registrations.ts`, then rerun full `typecheck` and `build`.

### 2026-05-20 — API typecheck and build unblock

**Agente:** Codex  
**Escopo:** Fixed the TypeScript blockers found during Marco 1 validation and made the workspace build runnable without mandatory Vite env variables.  
**Arquivos alterados:**
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/api-server/src/routes/registrations.ts`
- `artifacts/corrida-retorno-praia/vite.config.ts`
- `artifacts/mockup-sandbox/vite.config.ts`
- `specs.md`

**O que mudou:**
- Replaced fragile inferred Express handler types in admin `requireAuth` with explicit `Request` and `Response` types.
- Typed admin registration filters as Drizzle SQL filters and guarded the optional search `or(...)` expression.
- Normalized public registration `birthDate` from the generated Zod `Date` value into `YYYY-MM-DD` before duplicate checking and insertion into the Drizzle `date()` column.
- Removed an unused generated params import from the registration route.
- Added local defaults for Vite `PORT` and `BASE_PATH` in both frontend Vite configs so root builds do not fail when those env vars are absent.

**Validação realizada:**
- Consulted Context7 for Express route handler patterns and Drizzle PostgreSQL `date()` string/date inference behavior.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm --filter @workspace/corrida-retorno-praia run dev` started with default port/base settings.
- `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:5173/` returned `200`.

**Pendente:**
- Install or expose a real `pnpm` shim on the machine PATH, or keep using `corepack pnpm`.
- Decide whether to adjust/remove the root `preinstall` script that fails under Corepack without `--ignore-scripts`.
- Start Marco 2 cleanup of remaining old event-name references in OpenAPI/generated files.
- Add seed logic in a later milestone for event, routes and initial admin user.

**Riscos/observações:**
- Build passes, but Vite still reports non-fatal sourcemap warnings in generated/shadcn UI component files and a large frontend chunk warning.
- This directory is still not a Git repository, so no `git status` diff is available.
- No Playwright UI validation was run because the changes were backend type fixes and local build/dev config defaults, not user-facing layout changes.

**Próximo passo recomendado:**
- Begin Marco 2 by updating the OpenAPI description and regenerating generated API clients/schemas so old event-name references are removed from technical generated files.

### 2026-05-20 — Base Git e limpeza de referências geradas do Marco 2

**Agente:** Codex  
**Escopo:** Followed the setup recommendations before continuing milestones and removed remaining old event-name references from generated API code.  
**Arquivos alterados:**
- `.git/`
- `package.json`
- `README.md`
- `replit.md`
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/*`
- `lib/api-zod/src/generated/*`
- `specs.md`

**O que mudou:**
- Initialized a local Git repository in the project folder.
- Added `packageManager: pnpm@11.1.3` to make the Corepack/pnpm version explicit.
- Relaxed the root `preinstall` user-agent guard so `corepack pnpm install --frozen-lockfile` works without `--ignore-scripts` while still rejecting non-pnpm package managers.
- Confirmed dependency install now succeeds with `corepack pnpm install --frozen-lockfile`.
- Updated OpenAPI description from the old event name to `Treinão Encontro das Águas — 2ª Edição`.
- Regenerated the React Query client and Zod schemas with Orval.
- Updated README/replit notes so frontend dev no longer claims `PORT` and `BASE_PATH` are required.
- Documented that `corrida-retorno-praia` remains only as a legacy technical package/folder name and is not user-facing.

**Validação realizada:**
- Consulted Context7 for Orval code generation workflow.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm --filter @workspace/api-spec run codegen`
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build`
- `rg -n "Corrida do Retorno|Retorno da Praia|Praia Run" README.md replit.md artifacts lib scripts -g '!**/dist/**'` returned no matches.
- `rg -n "Corrida do Retorno|Retorno da Praia|Praia Run" specs.md AGENTS.md` only returned rule/milestone text that explicitly lists old names as forbidden.

**Pendente:**
- Add a Git remote and make an initial commit when the desired baseline scope is confirmed.
- The `pnpm` command itself still is not globally available on PATH; `corepack pnpm` works and the repo now declares the package manager version.
- Decide later whether to rename the legacy technical package/folder `artifacts/corrida-retorno-praia`; it is not user-facing but may be cleaned up if the user wants technical names fully aligned.
- Continue Marco 2 with a user-facing sweep in the running app and metadata, then move to Marco 3 CPF work.

**Riscos/observações:**
- Because Git was initialized after files already existed, `git status` currently shows the entire project as untracked until an initial commit is made.
- Build passes, but Vite still reports non-fatal sourcemap warnings in UI component files and a large frontend chunk warning.
- No Playwright UI validation was run yet because the visible UI was not changed in this session.

**Próximo passo recomendado:**
- Run the app and perform a quick user-facing Marco 2 sweep, then start Marco 3 implementation for CPF validation/uniqueness.

### 2026-05-21 — Marco 4 emergency contact public flow

**Agente:** Codex  
**Escopo:** Replaced the public registration form's generic optional information section with optional emergency contact fields and propagated the fields through API/admin/export contracts.  
**Arquivos alterados:**
- `.gitignore`
- `lib/db/src/schema/registrations.ts`
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/*`
- `lib/api-zod/src/generated/*`
- `artifacts/api-server/src/routes/registrations.ts`
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/corrida-retorno-praia/src/pages/Registration.tsx`
- `artifacts/corrida-retorno-praia/src/pages/admin/EditRegistration.tsx`
- `specs.md`

**O que mudou:**
- Added `emergencyContactName` and `emergencyContactWhatsapp` to the Drizzle registration schema, OpenAPI contract, generated client types and generated Zod schemas.
- Removed the public form's "Informações Adicionais" accordion and replaced it with a focused "Contato de emergência" block.
- Added frontend and backend validation so a partial emergency contact guides the participant to fill both name and WhatsApp or leave both blank.
- Included emergency contact fields in registration creation, admin registration formatting/editing and CSV export.
- Added a guard so the registration page shows the unavailable state instead of crashing if `/api/events/active` returns an invalid shape during local dev without the API/database.
- Ignored Playwright local session/output folders so validation artifacts are not accidentally committed.

**Validação realizada:**
- Consulted Context7 for React Hook Form/Zod resolver usage, Drizzle PostgreSQL schema/index patterns and Express response patterns.
- Used the `interface-design` skill for the public form layout change.
- `corepack pnpm -w run typecheck:libs` passed after Orval generation completed; the package script's direct `pnpm` call still required the temporary `/private/tmp/codex-bin/pnpm` shim.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed; Vite kept the existing non-fatal sourcemap and large chunk warnings.
- Used Playwright CLI with Microsoft Edge and a mocked `/api/events/active` response to validate `/inscricao` at 360, 390, 430, 768 and 1280 px.
- Playwright confirmed no horizontal scroll at the tested widths, "Contato de emergência" appears, "Informações Adicionais" no longer appears, the terms modal opens on mobile, and the modal accept button marks the terms checkbox.
- Playwright validated partial emergency contact feedback: `Informe o WhatsApp do contato de emergência ou deixe os dois campos em branco`.

**Pendente:**
- Apply the database change in a real PostgreSQL instance with `corepack pnpm --filter @workspace/db run push` or a later migration workflow before testing persistence end to end.
- Run public registration submission against a real local API/database once seed logic exists.
- Continue Marco 4 admin list/detail polish if the organization wants emergency contact visible directly in the list cards/table, not only in edit/detail/export.

**Riscos/observações:**
- The project still has no tracked baseline commit, so `git status` shows the whole workspace as untracked.
- No real database was available in this session; persistence was type/build validated but not executed against PostgreSQL.
- The legacy optional columns (`email`, `city`, `neighborhood`, `team`, `shirtSize`, `medicalNotes`) remain in schema/admin/export for existing compatibility, but the public form no longer asks for them.

**Próximo passo recomendado:**
- Decide whether to finish Marco 4 with emergency contact visibility in the admin list, or move to Marco 5 terms acceptance hardening since the public flow now stores the terms fields.

### 2026-05-21 — Chrome Playwright UI validation

**Agente:** Codex  
**Escopo:** Revalidated the public registration UI with Google Chrome after Chrome was installed locally.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Confirmed `/Applications/Google Chrome.app` is installed.
- Re-ran the public registration UI validation through Playwright using the default Chrome channel instead of Microsoft Edge.

**Validação realizada:**
- `ls -ld /Applications/'Google Chrome.app' /Applications/'Microsoft Edge.app' /Applications/Firefox.app`
- Started Vite locally at `http://localhost:5173/`.
- `curl -s -o /tmp/codex-registration.html -w '%{http_code}\n' http://localhost:5173/inscricao` returned `200`.
- Used Playwright CLI with Chrome and a mocked `/api/events/active` response.
- Validated `/inscricao` at 360, 390, 430, 768 and 1280 px.
- Confirmed no horizontal scroll at all tested widths.
- Confirmed `Confirmar inscrição`, route cards and `Contato de emergência` are visible.
- Confirmed `Informações Adicionais` is absent.
- Confirmed the terms modal fits at 360 px, has `Fechar` and `Li e aceito os termos`, and the accept button marks the checkbox.
- Confirmed partial emergency contact validation shows `Informe o WhatsApp do contato de emergência ou deixe os dois campos em branco`.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm --filter @workspace/corrida-retorno-praia run typecheck` passed.

**Pendente:**
- Full end-to-end submission still requires a real local PostgreSQL database with schema and seed data.

**Riscos/observações:**
- The UI validation used an API mock for event data, so it validates rendering and client-side form behavior, not persistence.
- Playwright screenshots were saved under ignored `output/playwright/` paths.

**Próximo passo recomendado:**
- Prepare local database/seed flow, then validate the complete registration submission and duplicate CPF behavior against the real API.

### 2026-05-21 — Event seed script groundwork

**Agente:** Codex  
**Escopo:** Added predictable seed logic for the official event and public routes so a fresh database can be initialized once PostgreSQL is available locally.  
**Arquivos alterados:**
- `package.json`
- `pnpm-lock.yaml`
- `README.md`
- `scripts/package.json`
- `scripts/src/seed-event.ts`
- `specs.md`

**O que mudou:**
- Added `scripts/src/seed-event.ts`, an idempotent seed script that creates or updates `Treinão Encontro das Águas — 2ª Edição`.
- Seeded event defaults: date `2026-07-05`, time `06:00`, location `Encontro das Águas`, status `active`.
- Seeded official routes for the event: `3 km`, `5 km` and `10 km`.
- Added `seed:event` to `@workspace/scripts`.
- Added root convenience scripts `db:push` and `db:seed:event`.
- Documented the seed command in `README.md`.

**Validação realizada:**
- Consulted Context7 for Drizzle ORM PostgreSQL connection and insert patterns.
- `CI=true corepack pnpm install --frozen-lockfile --ignore-scripts` passed after the first sandboxed lockfile attempt hit DNS restrictions.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm --filter @workspace/scripts run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed; Vite kept the existing non-fatal sourcemap and large chunk warnings.
- Checked local PostgreSQL availability at `postgresql://postgres:postgres@localhost:5432/app_corrida_manager`; connection returned `ECONNREFUSED`.
- Checked Docker availability; Docker CLI exists, but Docker daemon is not running.

**Pendente:**
- Start a local PostgreSQL instance, then run `corepack pnpm --filter @workspace/db run push` and `corepack pnpm --filter @workspace/scripts run seed:event`.
- Validate `/api/events/active` against the real database.
- Validate complete public registration submission and duplicate CPF prevention against the real API/database.
- Add initial admin seed after production-safe admin auth is implemented in Marco 6.

**Riscos/observações:**
- The seed was type/build validated but not executed because no local PostgreSQL database is running.
- The current seed intentionally does not create an admin user while admin auth still depends on Replit/OIDC.
- The first lockfile update attempt was slow because sandboxed network requests to npm failed with `ENOTFOUND`; the final install check passed with escalated network permission.

**Próximo passo recomendado:**
- Start Docker Desktop or another local PostgreSQL service, then apply schema, run the event seed, and perform real end-to-end registration validation.

### 2026-05-21 — Real local database registration validation

**Agente:** Codex  
**Escopo:** Started a local PostgreSQL container, applied schema, executed the event seed and validated the public registration flow end to end against the real API/database.  
**Arquivos alterados:**
- `artifacts/corrida-retorno-praia/vite.config.ts`
- `artifacts/corrida-retorno-praia/src/pages/Registration.tsx`
- `specs.md`

**O que mudou:**
- Created local Docker container `app-corrida-postgres` from `postgres:17-alpine`, using database `app_corrida_manager`, user `postgres` and password `postgres`.
- Applied the Drizzle schema to the local PostgreSQL database.
- Executed the event seed successfully.
- Added a Vite development proxy so frontend `/api/*` requests are forwarded to `http://localhost:8080` during local development.
- Added a description to the terms dialog for accessibility.
- Changed the terms checkbox validation to allow a controlled initial `false` value while still requiring acceptance before submit.

**Validação realizada:**
- `docker exec app-corrida-postgres pg_isready -U postgres -d app_corrida_manager` returned accepting connections.
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_corrida_manager corepack pnpm --filter @workspace/db run push` applied schema.
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_corrida_manager corepack pnpm --filter @workspace/scripts run seed:event` completed.
- `curl http://localhost:8080/api/healthz` returned `{"status":"ok"}`.
- `curl http://localhost:8080/api/events/active` returned the seeded event and routes.
- `curl http://localhost:5173/api/events/active` returned JSON after adding the Vite proxy.
- Used Playwright/Chrome at 390 px to submit a real public registration through the frontend; API returned `201`, success page loaded, participant name and route appeared.
- Tried registering the same CPF again; API returned `409 Conflict` with the pt-BR duplicate CPF message.
- Queried PostgreSQL and confirmed the saved CPF is normalized (`52998224725`) and terms fields include `accepted_terms = true` and `terms_version = 2026-05-18-v1`.
- Revalidated terms modal/checkbox after accessibility/state fixes; the previous Radix dialog description and checkbox controlled-state warnings no longer appeared.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed; Vite kept existing non-fatal sourcemap and large chunk warnings.

**Pendente:**
- Add production-safe admin auth and admin seed in Marco 6.
- Decide whether to keep the local PostgreSQL container running between sessions or document stop/start commands more explicitly.
- Continue Marco 5 terms acceptance hardening by surfacing terms acceptance data in admin/export.

**Riscos/observações:**
- The local database now contains one test registration for CPF `52998224725`.
- The Docker container uses local development credentials from `.env.example`, not production credentials.
- The Vite dev proxy is development-only and does not change production deployment behavior.

**Próximo passo recomendado:**
- Move to Marco 5: display terms acceptance evidence in admin views and include terms acceptance fields in export.

### 2026-05-21 — Local admin auth and terms checkbox correction

**Agente:** Codex  
**Escopo:** Fixed the terms checkbox UX and replaced the broken local Replit/OIDC admin login path with a working local e-mail/password admin flow.  
**Arquivos alterados:**
- `.env.example`
- `README.md`
- `package.json`
- `lib/db/src/schema/auth.ts`
- `lib/replit-auth-web/src/use-auth.ts`
- `artifacts/api-server/src/lib/password.ts`
- `artifacts/api-server/src/middlewares/authMiddleware.ts`
- `artifacts/api-server/src/routes/auth.ts`
- `artifacts/corrida-retorno-praia/src/pages/Registration.tsx`
- `artifacts/corrida-retorno-praia/src/pages/admin/Login.tsx`
- `scripts/package.json`
- `scripts/src/seed-admin.ts`
- `specs.md`

**O que mudou:**
- Changed the public terms checkbox so clicking it opens the terms modal instead of immediately checking the box.
- The terms checkbox is marked only after clicking `Li e aceito os termos` in the modal.
- Added local admin users table `admin_users`.
- Added password hashing and verification using Node `crypto.scrypt`.
- Added `POST /api/admin/login` for local admin login with HTTP-only session cookie.
- Made local logout clear the session and return to `/painel/login` when `REPL_ID` is not configured.
- Updated auth middleware so local admin sessions do not try OIDC refresh.
- Replaced the admin login button with a pt-BR e-mail/senha form.
- Added `scripts/src/seed-admin.ts` and root `db:seed:admin` command.
- Documented admin seed command and added `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` to `.env.example`.

**Validação realizada:**
- Consulted Context7 for Express cookie/JSON response patterns and React Hook Form async login handling.
- Applied schema to local PostgreSQL with `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_corrida_manager corepack pnpm --filter @workspace/db run push`.
- Seeded local admin with `ADMIN_EMAIL=admin@encontrodasaguas.local ADMIN_PASSWORD=admin123 ADMIN_NAME='Organização' corepack pnpm --filter @workspace/scripts run seed:admin`.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed; Vite kept existing non-fatal sourcemap and large chunk warnings.
- `curl` login to `/api/admin/login` returned `200` and set an HTTP-only `sid` cookie.
- Authenticated `curl` to `/api/auth/user` returned the local admin user.
- Authenticated `curl` to `/api/admin/registrations` returned registration data.
- Used Playwright/Chrome mobile viewport to log in through `/painel/login` and open `/painel/inscricoes`; admin list rendered and had no horizontal scroll.
- Used Playwright/Chrome to validate that clicking the terms checkbox opens the terms modal, and accepting terms marks the checkbox.

**Pendente:**
- Replace remaining Replit/OIDC route compatibility fully or keep it only as legacy fallback until production hardening is complete.
- Add production guidance for changing/removing the temporary local admin password.
- Continue Marco 5 by showing terms acceptance data in admin views and exports.

**Riscos/observações:**
- A local development admin exists with e-mail `admin@encontrodasaguas.local` and password `admin123`; this is only for local validation and must not be used in production.
- The package name `lib/replit-auth-web` remains technical legacy naming, though the hook now supports local admin credential login.

**Próximo passo recomendado:**
- Validate the admin panel manually with the local credentials, then continue with terms acceptance visibility in admin/export.

### 2026-05-22 — Visibilidade do aceite dos termos no admin

**Agente:** Codex  
**Escopo:** Continued Marco 5 by surfacing responsibility term acceptance evidence in admin views and CSV export.  
**Arquivos alterados:**
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/corrida-retorno-praia/src/pages/admin/EditRegistration.tsx`
- `artifacts/corrida-retorno-praia/src/pages/admin/RegistrationsList.tsx`
- `lib/api-spec/openapi.yaml`
- `lib/api-client-react/src/generated/api.ts`
- `lib/api-client-react/src/generated/api.schemas.ts`
- `lib/api-zod/src/generated/api.ts`
- `lib/api-zod/src/generated/types/adminRegistration.ts`
- `lib/api-zod/src/generated/types/adminStats.ts`
- `lib/api-zod/src/generated/types/registrationUpdate.ts`
- `specs.md`

**O que mudou:**
- Added `acceptedTerms`, `acceptedTermsAt` and `termsVersion` to admin registration API responses.
- Added a compact terms acceptance badge and acceptance date to the admin registration list on desktop and mobile.
- Added full terms evidence to the admin edit/details sidebar.
- Added terms acceptance columns to the CSV export: accepted yes/no, accepted timestamp and terms version.
- Updated OpenAPI and regenerated the React/Zod API clients.

**Validação realizada:**
- Consulted Context7 for React controlled UI/state guidance, Drizzle select/type patterns and shadcn/ui composition guidance.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm --filter @workspace/api-spec run codegen` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passed.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passed; Vite kept existing non-fatal sourcemap and large chunk warnings.
- Authenticated `curl` confirmed `/api/admin/registrations` returns terms fields.
- Authenticated `curl` confirmed `/api/admin/export` includes terms columns and values.
- Used Playwright/Chrome to validate admin login, mobile list at 360 px, 390 px, 430 px and 768 px, and desktop table at 1280 px.
- Playwright confirmed no horizontal scroll at tested widths, the list shows `Termos`/`Aceito`, and the edit page shows `Termo de responsabilidade`, accepted status and `Versão 2026-05-18-v1`.

**Pendente:**
- User manual validation of the updated admin list, edit details and CSV export.
- Continue Marco 6/9 hardening by deciding whether to remove legacy Replit/OIDC compatibility fully before production.

**Riscos/observações:**
- Local admin credentials remain development-only: `admin@encontrodasaguas.local` / `admin123`.
- Existing dev database contains test registrations used for validation.
- CSV currently exports the terms timestamp in ISO format for audit precision.

**Próximo passo recomendado:**
- Manually validate the admin panel and CSV export, then continue with production auth/deployment hardening.

### 2026-05-22 — Caminho de produção via Docker

**Agente:** Codex  
**Escopo:** Continued production preparation by adding a Docker/Coolify-ready single-container serving path.  
**Arquivos alterados:**
- `.dockerignore`
- `.env.example`
- `Dockerfile`
- `README.md`
- `artifacts/api-server/src/app.ts`
- `specs.md`

**O que mudou:**
- Adicionado suporte opcional a `PUBLIC_DIR` na API Express para que a produção sirva o build do frontend Vite e mantenha `/api/*` roteado para a API.
- Adicionado Dockerfile multi-stage usando Node 24 Alpine, pnpm/Corepack, build completo do workspace e usuário não-root no runtime.
- Adicionado `.dockerignore` para dependências, outputs de build, arquivos locais de env, artefatos Playwright, cache Codex e arquivos TypeScript build info antigos.
- Atualizado `.env.example` para documentar `PUBLIC_DIR` e esclarecer que Replit/OIDC é compatibilidade legada, não o fluxo admin principal.
- Atualizado `README.md` com notas de deploy Docker/Coolify e status atual de setup/auth admin.

**Validação realizada:**
- Consultado Context7 para servir arquivos estáticos/SPA fallback no Express, comportamento de build de produção do Vite e práticas de Docker multi-stage para Node.js.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run typecheck` passou.
- `PATH=/private/tmp/codex-bin:$PATH corepack pnpm run build` passou; Vite manteve warnings não fatais já existentes de sourcemap e chunk grande.
- API de produção rodada localmente com `PUBLIC_DIR` na porta `8090`; `/`, `/inscricao` e `/api/healthz` retornaram `200`.
- `docker build -t app-corrida-manager:codex-validate .` concluído com sucesso.
- Imagem construída rodada na porta `8091`; `/`, `/inscricao` e `/api/healthz` retornaram `200`.
- Container temporário de validação removido e processo temporário da API de produção parado.

**Pendente:**
- Decidir topologia final no Coolify: container único da aplicação com PostgreSQL gerenciado, ou serviços separados para frontend/API.
- Adicionar um runbook mais formal de migração/seed de produção antes do deploy na VPS.
- Considerar remover rotas legadas Replit/OIDC e nomes técnicos legados quando a autenticação de produção estiver totalmente fechada.

**Riscos/observações:**
- A imagem Docker atualmente mantém o workspace construído completo por simplicidade e previsibilidade operacional; otimização de tamanho pode ser feita depois.
- O build Docker falhou inicialmente porque arquivos locais `*.tsbuildinfo` entraram no contexto; `.dockerignore` agora os exclui.
- A tag local de validação `app-corrida-manager:codex-validate` permanece na máquina e pode ser sobrescrita ou removida depois.

**Próximo passo recomendado:**
- Continuar o endurecimento de produção com procedimento de migração/seed para Coolify e limpeza final da compatibilidade legada Replit/OIDC.

### 2026-05-22 — Reconciliação dos checkboxes dos marcos

**Agente:** Codex  
**Escopo:** Reconciliou os checkboxes dos marcos com a implementação e validação já concluídas.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Marcados como concluídos os itens de setup local, limpeza do nome antigo do evento, fluxo de CPF, contato de emergência, fortalecimento dos termos, auth admin local, seeds, validações mobile/admin, exportação e preparação Docker/Coolify.
- Mantidos em aberto os itens que ainda exigem trabalho dedicado: runbook de migração/seed de produção, polimento final da landing/sucesso, filtros adicionais do admin, teste real de deploy em produção e documentação final de riscos conhecidos.

**Validação realizada:**
- Revisadas as entradas existentes do Registro de Progresso e o checklist dos marcos contra as notas de implementação/validação já concluídas.

**Pendente:**
- Continuar o trabalho nos itens restantes ainda não marcados.

**Riscos/observações:**
- Checkboxes dos marcos agora refletem trabalho implementado/validado, mas o aceite completo dos marcos ainda deve seguir confirmação do usuário e QA final.

**Próximo passo recomendado:**
- Continuar com o runbook de migração/seed de produção para Coolify e depois concluir os itens restantes de polimento de UI e QA final.

### 2026-05-22 — Correção de idioma da documentação viva

**Agente:** Codex  
**Escopo:** Corrigiu os trechos principais do `specs.md` que ainda estavam em inglês apesar da exigência de pt-BR para acompanhamento do projeto.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Traduzidas para pt-BR as seções vivas de visão geral, objetivo, contexto, regras, fluxo público, páginas, formulário, termos, área admin, modelo de dados, produção, deploy, marcos e regras de check-in.
- Traduzidos os checklists dos marcos, critérios de aceite e rótulos recorrentes do Registro de Progresso.
- Mantidos nomes técnicos e identificadores de código em inglês quando fazem parte da implementação (`acceptedTerms`, `termsVersion`, `PUBLIC_DIR`, etc.).

**Validação realizada:**
- Revisão textual com busca por cabeçalhos e rótulos principais em inglês.

**Pendente:**
- Revisar, quando houver tempo, entradas históricas antigas do Registro de Progresso que ainda contenham frases em inglês por terem sido registradas antes desta correção.

**Riscos/observações:**
- A documentação operacional atual agora está em pt-BR; nomes técnicos de variáveis/campos permanecem em inglês por consistência de código.

**Próximo passo recomendado:**
- Seguir o desenvolvimento com novas entradas e documentação sempre em pt-BR, salvo nomes técnicos de código.

### 2026-05-22 — Runbook de produção para Coolify

**Agente:** Codex  
**Escopo:** Documentou o procedimento operacional para primeira publicação da aplicação na VPS via Coolify.  
**Arquivos alterados:**
- `README.md`
- `docs/deploy-coolify.md`
- `specs.md`

**O que mudou:**
- Criado `docs/deploy-coolify.md` com topologia recomendada, variáveis de produção, criação do PostgreSQL, criação do app por Dockerfile, comandos de schema/seed, ordem segura de primeira publicação, smoke test, rollback e observações de backup.
- Adicionado link para o runbook no `README.md`.
- Marcados como concluídos os itens de documentação de schema/migração e execução de seeds em produção nos marcos 7 e 10.

**Validação realizada:**
- Consultado Context7 para confirmar suporte do Coolify a aplicações por Dockerfile, variáveis, portas, health check e comandos de deploy.
- Consultado Context7 para confirmar recomendação do Drizzle sobre `migrate` em produção e uso de `push` como caminho direto atual.
- Revisado o runbook contra os scripts existentes: `db:push`, `db:seed:event` e `db:seed:admin`.

**Pendente:**
- Executar o procedimento em uma instância real do Coolify/VPS.
- Definir credenciais reais de produção para `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME`.
- Considerar adicionar migrações versionadas com `drizzle-kit generate`/`migrate` antes de evoluções frequentes em produção.

**Riscos/observações:**
- O procedimento atual usa `drizzle-kit push`; é aceitável para o primeiro deploy controlado, mas migrações versionadas são mais apropriadas para evolução contínua em produção.
- O teste real de deploy em produção permanece aberto até executarmos na VPS.

**Próximo passo recomendado:**
- Fazer o primeiro deploy controlado no Coolify seguindo `docs/deploy-coolify.md`, ou antes disso finalizar os últimos polimentos de UI/admin ainda abertos.

### 2026-05-22 — Polimento mobile da landing e sucesso

**Agente:** Codex  
**Escopo:** Refinou os itens abertos do Marco 8 para a página pública inicial e a página de confirmação de inscrição.  
**Arquivos alterados:**
- `artifacts/corrida-retorno-praia/src/pages/Home.tsx`
- `artifacts/corrida-retorno-praia/src/pages/RegistrationSuccess.tsx`
- `specs.md`

**O que mudou:**
- Reestruturada a landing com hero mais específico do evento, CTA principal visível, botão secundário para percursos, dados de data/hora/local e seções de percurso/informações com melhor leitura mobile.
- Removidos efeitos decorativos genéricos do hero e substituídos por uma assinatura visual de linha de percurso/encontro das águas.
- Reestruturada a página de sucesso com cabeçalho de confirmação, comprovante mais escaneável, blocos de percurso/código, orientação ao participante e botões mobile-first.
- Ajustados contrastes das faixas visuais após inspeção por screenshot em 390 px.

**Validação realizada:**
- Consultado Context7 para práticas atuais de composição React e responsividade Tailwind.
- Usada a skill `interface-design` para orientar hierarquia, intenção visual e ergonomia mobile.
- Usada a skill Playwright com mocks de API para validar `/` e `/inscricao/sucesso/CODE123` em 360, 390, 430, 768 e 1280 px.
- Playwright confirmou ausência de overflow horizontal e presença dos CTAs/conteúdos principais nas larguras testadas.
- `corepack pnpm --filter @workspace/corrida-retorno-praia run typecheck`
- `corepack pnpm run typecheck:libs`
- `corepack pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck`
- `corepack pnpm -r --if-present run build`

**Pendente:**
- Validação manual do usuário nas páginas refinadas.
- O teste visual desta sessão usou mocks porque Docker/PostgreSQL local não estava ativo.
- Os checkboxes do Marco 8 ainda devem ser reconciliados somente após aceite/validação do usuário.

**Riscos/observações:**
- `pnpm run typecheck` e `pnpm run build` na raiz ainda falham quando chamados literalmente porque o script interno usa `pnpm` global, que não está disponível no `PATH` desta sessão; as etapas equivalentes foram executadas com `corepack pnpm`.
- O build mantém os warnings não fatais já conhecidos de sourcemap em componentes UI e chunk grande do Vite.

**Próximo passo recomendado:**
- Avançar para os itens restantes do Marco 9: melhorar resumos do dashboard e filtros por percurso/sexo/status.

### 2026-05-23 — Resumos e filtros do painel admin

**Agente:** Codex  
**Escopo:** Avançou o Marco 9 com melhorias no dashboard e nos filtros da lista de inscrições.  
**Arquivos alterados:**
- `artifacts/corrida-retorno-praia/src/pages/admin/Dashboard.tsx`
- `artifacts/corrida-retorno-praia/src/pages/admin/RegistrationsList.tsx`
- `specs.md`

**O que mudou:**
- Reorganizado o dashboard com cartões de total, inscrições ativas, confirmadas, pendentes e canceladas.
- Adicionada distribuição por percurso com barras de progresso e indicação do percurso com maior procura.
- Adicionado resumo por sexo e status em uma seção de perfil das inscrições.
- Adicionada versão mobile em cards para inscrições recentes no dashboard.
- Corrigido o filtro de percurso da lista admin para enviar `3 km`, `5 km` e `10 km`, alinhado ao backend.
- Adicionado filtro por sexo na lista admin.
- Adicionado botão `Limpar filtros` com contagem de resultados filtrados.

**Validação realizada:**
- Consultado Context7 para práticas de React com valores derivados e TanStack Query com `placeholderData: keepPreviousData`.
- Usada a skill `interface-design` para orientar densidade, hierarquia e ergonomia do painel administrativo.
- `corepack pnpm --filter @workspace/corrida-retorno-praia run typecheck`
- `corepack pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck`
- `corepack pnpm -r --if-present run build`
- Playwright com mocks de API validou `/painel` e `/painel/inscricoes` em 360, 390, 430, 768 e 1280 px sem overflow horizontal.
- Playwright validou interação real dos filtros: percurso envia `route=5+km`, sexo envia `sex=feminino`, combinação dos filtros reduz os resultados e `Limpar filtros` restaura a lista.
- Smoke test adicional em 390 px confirmou o dashboard sem erro runtime após substituir o componente `Progress` por barra HTML/Tailwind simples.

**Pendente:**
- Validação manual do usuário no painel admin.
- Reconciliar checkboxes do Marco 9 após aceite/validação do usuário.
- Teste contra banco real não foi executado nesta sessão porque Docker/PostgreSQL local não estava ativo.

**Riscos/observações:**
- As validações visuais e de filtro usaram mocks no Playwright, mas cobriram a compatibilidade dos parâmetros enviados pela UI com o comportamento esperado do backend.
- O componente `Progress` foi evitado no dashboard porque o Vite registrou erro runtime transitório ao otimizar `@radix-ui/react-progress` no dev server; a barra simples remove essa dependência da alteração.
- O build mantém os warnings não fatais já conhecidos de sourcemap em componentes UI e chunk grande do Vite.

**Próximo passo recomendado:**
- Fazer validação manual do painel admin e, em seguida, executar QA com banco real ou seguir para o deploy controlado no Coolify.

### 2026-05-23 — Preparação para publicação no GitHub

**Agente:** Codex  
**Escopo:** Preparou o repositório local para o primeiro push no GitHub informado pelo usuário.  
**Arquivos alterados:**
- `.gitignore`
- `specs.md`

**O que mudou:**
- Configurado o remoto `origin` para `https://github.com/nathanmss/app-corrida-manager.git`.
- Configurada identidade Git local do projeto como `nathanmss <nathanmss@users.noreply.github.com>`.
- Adicionado `*.tsbuildinfo` ao `.gitignore` para evitar versionar artefatos gerados pelo TypeScript.
- Conferido que não há `.env` real para versionar; apenas `.env.example`.

**Validação realizada:**
- `git ls-remote --heads origin` respondeu sem branches remotas, indicando repositório remoto vazio ou sem heads publicados.
- `git add -n .` revisado para confirmar o escopo do commit inicial.
- Busca por padrões sensíveis encontrou apenas placeholders/documentação e referências técnicas, não arquivos de segredo reais.

**Pendente:**
- Criar o commit inicial e executar `git push -u origin main`.
- Validar se a autenticação Git local permite push para o repositório.

**Riscos/observações:**
- `gh` não está instalado nesta máquina, então não foi possível usar o fluxo completo da skill GitHub com abertura de PR.
- O push será direto para `main`, pois o repositório remoto não apresentou branches existentes.

**Próximo passo recomendado:**
- Finalizar commit inicial e push para o GitHub.

### 2026-05-23 — Publicação inicial no GitHub

**Agente:** Codex  
**Escopo:** Publicou o baseline local no repositório GitHub informado pelo usuário.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Criado commit inicial `3a72007` com o baseline completo do projeto.
- Executado push da branch `main` para `origin/main`.
- Branch local `main` configurada para rastrear `origin/main`.

**Validação realizada:**
- `git push -u origin main`
- Push respondeu com criação de nova branch remota `main -> main`.

**Pendente:**
- Criar um commit complementar com esta entrada do Registro de Progresso e fazer novo push.
- Instalar/configurar `gh` futuramente se quisermos abrir PRs pelo fluxo completo GitHub.

**Riscos/observações:**
- O repositório remoto estava sem heads antes do push, então a publicação foi direta em `main`.
- Nenhum `.env` real foi versionado; apenas `.env.example`.

**Próximo passo recomendado:**
- Confirmar no GitHub que o repositório remoto mostra o projeto em `main`.

### 2026-05-23 — Reconciliação final de QA pendente

**Agente:** Codex  
**Escopo:** Reconciliou itens já implementados/validados e documentou pendências finais antes do deploy real.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Marcados como concluídos os itens do Marco 8 referentes ao refinamento mobile da landing page e da página de sucesso, após implementação e validação Playwright.
- Marcados como concluídos os itens do Marco 9 referentes aos resumos do dashboard e filtros por percurso/sexo/status, após implementação e validação Playwright.
- Marcado como concluído o item de documentação de problemas finais conhecidos no Marco 11.

**Validação realizada:**
- Revisão do checklist contra as entradas recentes do Registro de Progresso.
- `git status --short` confirmou o repositório limpo antes desta atualização.
- Tentativa de checar Docker/PostgreSQL local falhou porque o Docker daemon não está ativo nesta sessão.

**Pendente:**
- Testar deploy em produção no Coolify/VPS.
- Rodar QA com banco real novamente quando Docker/PostgreSQL local estiver ativo ou diretamente no ambiente de deploy.
- Conferir manualmente o repositório no GitHub e as telas finais.

**Riscos/observações:**
- O QA visual/admin mais recente usou mocks de API no Playwright porque o banco local não estava disponível.
- O build passa, mas ainda mantém warnings não fatais de sourcemap em componentes UI e chunk grande do Vite.
- `gh` não está instalado, então fluxos futuros de PR via GitHub CLI ainda dependem dessa instalação.

**Próximo passo recomendado:**
- Fazer o primeiro deploy controlado no Coolify seguindo `docs/deploy-coolify.md`.

### 2026-05-23 — Deploy inicial no Coolify

**Agente:** Codex  
**Escopo:** Configurou e executou o primeiro deploy de produção no Coolify usando o repositório GitHub e PostgreSQL gerenciado pelo Coolify.  
**Arquivos alterados:**
- `specs.md`

**O que mudou:**
- Criado projeto `App Corrida Manager` no Coolify.
- Criado recurso PostgreSQL interno para `app_corrida_manager`.
- Criada aplicação a partir de `https://github.com/nathanmss/app-corrida-manager.git` usando build pack `Dockerfile`.
- Configurados porta interna `8080`, variáveis de produção, credenciais iniciais de admin e `DATABASE_URL` interno.
- Configurado healthcheck HTTP em `/api/healthz`.
- Executado deploy da aplicação; o Coolify indicou `Running (healthy)`.
- Executados `db:push`, seed do evento e seed do admin no container via `corepack pnpm`.

**Validação realizada:**
- Consultado Context7 para confirmar detalhes atuais de configuração de aplicação Dockerfile, variáveis, portas e healthcheck no Coolify.
- Usada a skill Playwright para toda a configuração no Coolify e smoke tests externos.
- Deploy concluiu build, typecheck e build do frontend/backend no ambiente do Coolify.
- `http://vy3bin1sun2nc0itfsaxwu9h.2.24.83.99.sslip.io/api/healthz` retornou `{"status":"ok"}`.
- `http://vy3bin1sun2nc0itfsaxwu9h.2.24.83.99.sslip.io/` carregou a página pública do evento.
- `http://vy3bin1sun2nc0itfsaxwu9h.2.24.83.99.sslip.io/inscricao` carregou o formulário de inscrição.
- Migração/seed no container retornaram: schema aplicado, evento `Treinão Encontro das Águas — 2ª Edição` criado com percursos 3 km, 5 km e 10 km, e admin inicial criado.

**Pendente:**
- Validar login e uso do painel admin em HTTPS confiável.
- Configurar domínio definitivo quando o usuário comprar/informar o domínio do app.
- Revalidar domínio, certificado TLS e painel admin depois da troca de domínio.

**Riscos/observações:**
- O domínio temporário padrão foi mantido por decisão do usuário até a compra do domínio definitivo.
- Em `NODE_ENV=production`, o cookie de sessão admin é `Secure`; no domínio temporário acessado via `http://`, o navegador não preserva a sessão administrativa.
- A tentativa de acessar o domínio temporário por `https://` encontrou certificado não confiável e rota sem aplicação disponível para esse host HTTPS.
- O log do healthcheck do Coolify mostrou `curl: not found`, mas o recurso foi marcado como healthy; o endpoint externo `/api/healthz` foi validado separadamente com Playwright.
- O build mantém warnings não fatais já conhecidos de sourcemap em componentes UI, chunk grande do Vite e alerta do Docker sobre variável sensível em `ARG/ENV`.

**Próximo passo recomendado:**
- Quando o domínio definitivo estiver disponível, configurar o domínio HTTPS no Coolify, redeployar e validar o login admin completo em produção.

### 2026-05-23 — Ajuste do healthcheck Docker

**Agente:** Codex
**Escopo:** Corrigiu a imagem de produção para compatibilizar o healthcheck do Coolify com o runtime Alpine.
**Arquivos alterados:**
- `Dockerfile`
- `docs/deploy-coolify.md`
- `specs.md`

**O que mudou:**
- Adicionado `curl` no estágio runtime do `Dockerfile`, onde o healthcheck do container é executado.
- Adicionado `HEALTHCHECK` Docker explícito para `http://127.0.0.1:${PORT}/api/healthz`.
- Atualizado o runbook do Coolify para documentar que o runtime já inclui `curl` e que o caminho recomendado de healthcheck segue sendo `/api/healthz`.

**Validação realizada:**
- Consultado Context7 para confirmar instalação de pacotes runtime em imagens Alpine com `apk add`.
- `corepack pnpm run typecheck:libs`
- `corepack pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck`
- `corepack pnpm -r --if-present run build`
- `docker info` confirmou que o Docker CLI existe, mas o daemon Docker não está ativo nesta sessão.
- Commit `600f1f1` criado e enviado para `origin/main`.

**Pendente:**
- Reconstruir e publicar a imagem no Coolify para confirmar que o log `curl: not found` desaparece.
- Validar login admin em HTTPS confiável após configurar o domínio definitivo.

**Riscos/observações:**
- `corepack pnpm run typecheck` e `corepack pnpm run build` na raiz ainda falham literalmente porque os scripts internos chamam `pnpm` e não há `pnpm` global no `PATH`; as etapas equivalentes passaram com `corepack pnpm`.
- Não foi possível rodar `docker build` local porque o Docker daemon não está ativo.

**Próximo passo recomendado:**
- Redeployar no Coolify a partir de `origin/main`; depois validar o healthcheck e seguir com a configuração do domínio HTTPS definitivo.
