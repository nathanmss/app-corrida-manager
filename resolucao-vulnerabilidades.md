# Plano de resolucao de vulnerabilidades

**Base analisada:** `relatorio-vulnerabilidades.md`  
**Data:** 2026-05-23  
**Aplicacao:** Treinao Encontro das Aguas — 2ª Edicao  
**Ambiente citado no relatorio:** `http://vy3bin1sun2nc0itfsaxwu9h.2.24.83.99.sslip.io/`

Este plano transforma o relatorio de vulnerabilidades em tarefas executaveis. A prioridade antes de abrir inscricoes ao publico e eliminar exposicoes de dados pessoais por configuracao de transporte, CORS e cabecalhos HTTP.

## Status de execucao

Atualizado em 2026-05-23:

- [x] `TASK-004` CORS por allowlist implementado.
- [x] `TASK-005` Metodos e headers CORS restringidos.
- [x] `TASK-006` Helmet e cabecalhos de seguranca implementados.
- [ ] `TASK-007` HSTS pendente ate existir dominio definitivo com HTTPS confiavel.
- [x] `TASK-008` `X-Powered-By` removido.
- [x] `TASK-009` Rate limit inicial no login admin implementado.
- [ ] `TASK-002` HTTPS definitivo pendente ate compra/configuracao do dominio.
- [ ] `TASK-003` Cookie estritamente `Secure` em producao final pendente ate HTTPS definitivo.
- [ ] `TASK-010` Revisao/decisao final de CSRF pendente.
- [ ] `TASK-011` Fallback SPA para caminhos sensiveis pendente.
- [ ] `TASK-012` Regressao funcional completa em producao pendente.
- [ ] `TASK-013` Reexecucao da auditoria leve em producao pendente.

## Diagnostico resumido

| ID | Tema | Severidade | Diagnostico no codigo atual | Decisao |
|---|---|---:|---|---|
| VULN-001 | HTTPS/TLS ausente no dominio temporario | Alta | O deploy temporario esta em HTTP; o app ja depende do proxy do Coolify para TLS. | Corrigir operacionalmente no Coolify com dominio HTTPS definitivo antes do lancamento. |
| VULN-002 | CORS reflete qualquer `Origin` com credenciais | Alta | Confirmado em `artifacts/api-server/src/app.ts`: `cors({ credentials: true, origin: true })`. | Substituir por allowlist explicita por ambiente. |
| VULN-003 | Metodos CORS permissivos | Baixa | Consequencia da configuracao padrao do `cors`. | Restringir metodos e headers no mesmo patch de CORS. |
| VULN-004 | Cabecalhos de seguranca ausentes | Media | Nao ha `helmet` nem headers equivalentes no Express. | Adicionar `helmet` com CSP compatível com o SPA. |
| VULN-005 | `X-Powered-By: Express` exposto | Baixa | Express envia o header por padrao; o app ainda nao chama `app.disable("x-powered-by")`. | Desabilitar explicitamente e validar headers. |
| VULN-006 | Cookie admin em producao durante fase HTTP temporaria | Alta operacional | A correcao recente permitiu cookie sem `Secure` no host HTTP temporario para viabilizar login. | Reverter para cookie obrigatoriamente `Secure` quando HTTPS definitivo estiver ativo. |
| VULN-007 | Falta de rate limit no login admin | Media | Fora do relatorio passivo, mas citado nas limitacoes; nao ha rate limit em `/api/admin/login`. | Adicionar como hardening antes de lancamento. |

## Fase 0 — Contencao operacional antes de qualquer divulgacao

### TASK-001 — Congelar uso publico ate HTTPS definitivo

**Objetivo:** evitar trafego real de credenciais e dados pessoais sobre HTTP.

**Acoes:**
- Nao divulgar o link temporario HTTP para participantes reais.
- Usar o ambiente atual apenas para testes controlados.
- Cancelar/remover inscricoes de teste antes da abertura publica.

**Criterios de aceite:**
- Usuario confirma que o link temporario nao sera usado publicamente.
- Lista de inscricoes de teste esta identificada para limpeza.

**Validacao:**
- Conferencia manual no painel admin.

## Fase 1 — Transporte seguro e dominio

### TASK-002 — Configurar dominio definitivo com HTTPS no Coolify

**Objetivo:** resolver a vulnerabilidade de trafego em texto claro.

**Acoes:**
- Configurar dominio/subdominio definitivo no Coolify.
- Habilitar certificado TLS confiavel, preferencialmente Let's Encrypt pelo Coolify.
- Ativar redirecionamento HTTP para HTTPS no proxy do Coolify.
- Validar `https://DOMINIO/api/healthz`, `/`, `/inscricao` e `/painel/login`.

**Criterios de aceite:**
- `http://DOMINIO` redireciona para `https://DOMINIO`.
- `https://DOMINIO/api/healthz` retorna `{"status":"ok"}`.
- Navegador mostra certificado confiavel.

**Validacao:**
- `curl -I http://DOMINIO/`
- `curl -I https://DOMINIO/api/healthz`
- Playwright abrindo `/`, `/inscricao` e `/painel/login` em HTTPS.

### TASK-003 — Tornar cookie admin obrigatoriamente seguro em producao

**Objetivo:** garantir que a sessao admin nunca trafegue sem TLS no ambiente final.

**Acoes:**
- Ajustar a funcao de cookie de sessao para exigir `Secure` em `NODE_ENV=production`, exceto se uma flag temporaria explicita permitir HTTP de homologacao.
- Preferencia: remover a permissao temporaria de cookie inseguro assim que o dominio HTTPS definitivo estiver ativo.
- Manter `HttpOnly`, `SameSite=Lax`, `path=/` e TTL.

**Criterios de aceite:**
- Em HTTPS de producao, `Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax`.
- Em HTTP de producao final, login admin nao deve depender de cookie sem `Secure`.

**Validacao:**
- Playwright login admin em HTTPS e `cookie-list` para confirmar atributos.
- `curl -I` ou DevTools para conferir `Set-Cookie` em `/api/admin/login` com credenciais de teste controladas.

## Fase 2 — CORS

### TASK-004 — Criar configuracao de CORS por allowlist

**Objetivo:** remover reflexao arbitraria de `Origin` com credenciais.

**Acoes:**
- Substituir `cors({ credentials: true, origin: true })` por uma funcao de validacao de origem.
- Criar variavel de ambiente `CORS_ALLOWED_ORIGINS`, com lista separada por virgula.
- Em desenvolvimento, permitir apenas origens locais conhecidas, por exemplo:
  - `http://localhost:5173`
  - `http://127.0.0.1:5173`
- Em producao, permitir apenas o dominio definitivo HTTPS.
- Permitir requisicoes sem `Origin` para `curl`, healthcheck e chamadas server-to-server, sem adicionar `Access-Control-Allow-Origin` arbitrario.

**Criterios de aceite:**
- `Origin: https://attacker.test` nao recebe `Access-Control-Allow-Origin: https://attacker.test`.
- Origem oficial recebe `Access-Control-Allow-Origin` igual a origem oficial.
- `Access-Control-Allow-Credentials: true` aparece apenas quando a origem e permitida.

**Validacao:**
- `curl -I -H "Origin: https://attacker.test" https://DOMINIO/api/auth/user`
- `curl -I -H "Origin: https://DOMINIO" https://DOMINIO/api/auth/user`
- Playwright fluxo publico e admin no dominio oficial.

### TASK-005 — Restringir metodos e headers CORS

**Objetivo:** reduzir superficie anunciada em preflight.

**Acoes:**
- Configurar `methods` para os metodos realmente usados pela API:
  - `GET`
  - `POST`
  - `PATCH`
  - `OPTIONS`
- Configurar `allowedHeaders` para:
  - `Content-Type`
  - `Authorization`
- Avaliar se `DELETE`, `PUT` e outros metodos nao utilizados devem permanecer bloqueados.

**Criterios de aceite:**
- Preflight nao anuncia `PUT` ou `DELETE` enquanto nao existirem rotas que usem esses metodos.
- Rotas existentes continuam funcionando.

**Validacao:**
- `curl -I -X OPTIONS -H "Origin: https://DOMINIO" -H "Access-Control-Request-Method: POST" https://DOMINIO/api/registrations`
- `curl -I -X OPTIONS -H "Origin: https://attacker.test" -H "Access-Control-Request-Method: POST" https://DOMINIO/api/registrations`

## Fase 3 — Cabecalhos de seguranca

### TASK-006 — Adicionar Helmet no Express

**Objetivo:** aplicar cabecalhos de seguranca consistentes no app e na API.

**Acoes:**
- Adicionar dependencia `helmet` ao `artifacts/api-server`.
- Aplicar `app.use(helmet(...))` antes das rotas.
- Comecar com politica conservadora compativel com Vite SPA:
  - `default-src 'self'`
  - `base-uri 'self'`
  - `object-src 'none'`
  - `frame-ancestors 'none'`
  - `img-src 'self' data:`
  - `font-src 'self' data:`
  - `connect-src 'self'`
  - `script-src 'self'`
  - `style-src 'self' 'unsafe-inline'`
- Configurar `referrerPolicy: { policy: "no-referrer" }`.
- Configurar `permissionsPolicy` manual se a versao do Helmet usada nao cobrir esse header.

**Criterios de aceite:**
- Respostas incluem CSP, `X-Content-Type-Options`, `Referrer-Policy` e protecao contra frame/clickjacking.
- SPA continua carregando sem erros de CSP no console.

**Validacao:**
- `curl -I https://DOMINIO/`
- `curl -I https://DOMINIO/api/healthz`
- Playwright em `/`, `/inscricao`, modal de termos, `/painel/login` e `/painel/inscricoes`.
- `playwright console` sem erros de CSP bloqueando assets legitimos.

### TASK-007 — HSTS somente apos HTTPS confiavel

**Objetivo:** evitar downgrade HTTP depois que TLS estiver correto.

**Acoes:**
- Habilitar `Strict-Transport-Security` apenas no dominio HTTPS definitivo.
- Comecar com `max-age=15552000; includeSubDomains` se o dominio/subdominios estiverem sob controle.
- Nao usar `preload` ate confirmar estrategia de dominio.

**Criterios de aceite:**
- HSTS presente em `https://DOMINIO/`.
- HSTS ausente ou irrelevante em ambiente HTTP temporario.

**Validacao:**
- `curl -I https://DOMINIO/ | rg -i strict-transport-security`

### TASK-008 — Remover divulgacao `X-Powered-By`

**Objetivo:** reduzir fingerprinting da stack.

**Acoes:**
- Adicionar `app.disable("x-powered-by")`.
- Confirmar se Helmet tambem remove esse header na versao instalada; manter a chamada explicita mesmo assim.

**Criterios de aceite:**
- Nenhuma resposta publica contem `X-Powered-By: Express`.

**Validacao:**
- `curl -I https://DOMINIO/`
- `curl -I https://DOMINIO/api/healthz`

## Fase 4 — Hardening adicional antes de lancamento

### TASK-009 — Rate limit no login admin

**Objetivo:** reduzir risco de brute-force contra `/api/admin/login`.

**Acoes:**
- Adicionar rate limiting por IP e, se viavel, por e-mail normalizado.
- Politica inicial sugerida:
  - maximo de 5 tentativas falhas por 15 minutos por IP/e-mail;
  - resposta em pt-BR sem revelar se e-mail existe.
- Garantir compatibilidade com `trust proxy` no Coolify.

**Criterios de aceite:**
- Tentativas repetidas retornam `429` com mensagem clara.
- Login valido continua funcionando apos janela/limite adequado.

**Validacao:**
- Teste controlado com credenciais invalidas.
- Playwright login admin valido.

### TASK-010 — Revisar CSRF para rotas administrativas

**Objetivo:** reforcar mutacoes admin autenticadas.

**Acoes:**
- Avaliar se `SameSite=Lax` e CORS allowlist atendem o risco atual.
- Para defesa em profundidade, considerar token CSRF em rotas admin mutaveis, especialmente:
  - `PATCH /api/admin/registrations/:id`
  - logout, se mantido como mutacao sensivel.
- Documentar decisao tecnica caso token CSRF seja adiado.

**Criterios de aceite:**
- Mutacoes admin nao podem ser executadas de origem externa nao confiavel com leitura de resposta.
- Decisao sobre token CSRF registrada.

**Validacao:**
- Testes com origem nao permitida.
- Playwright fluxo de edicao/cancelamento admin.

### TASK-011 — Validar exposicao do fallback SPA para caminhos sensiveis

**Objetivo:** reduzir falsos positivos e evitar confusao operacional em scanners.

**Acoes:**
- Avaliar se caminhos como `/.env`, `/.git/HEAD`, `/package.json` devem retornar `404` explicito em vez de `index.html`.
- Implementar bloqueio antes do fallback SPA, se desejado.

**Criterios de aceite:**
- Arquivos sensiveis comuns retornam `404`.
- Rotas SPA legitimas continuam funcionando.

**Validacao:**
- `curl -I https://DOMINIO/.env`
- `curl -I https://DOMINIO/.git/HEAD`
- Playwright navegando em rotas SPA.

## Fase 5 — Validacao final de seguranca

### TASK-012 — Checklist de regressao funcional

**Objetivo:** garantir que as correcoes de seguranca nao quebraram o produto.

**Acoes:**
- Rodar typecheck e build completos.
- Validar fluxo publico:
  - landing page;
  - formulario;
  - modal de termos;
  - criacao de inscricao;
  - CPF duplicado;
  - pagina de sucesso.
- Validar fluxo admin:
  - login;
  - dashboard;
  - lista;
  - filtros;
  - edicao/cancelamento;
  - exportacao CSV.

**Criterios de aceite:**
- Build/typecheck passam.
- Playwright passa nos viewports `360`, `390`, `430`, `768` e desktop para paginas publicas alteradas.
- Login admin e painel funcionam em HTTPS.

**Validacao:**
- `corepack pnpm run typecheck:libs`
- `corepack pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck`
- `corepack pnpm -r --if-present run build`
- Playwright nos fluxos publicos e admin.

### TASK-013 — Reexecutar varredura leve do relatorio

**Objetivo:** confirmar que os achados do relatorio foram tratados.

**Acoes:**
- Repetir comandos do `relatorio-vulnerabilidades.md` contra o dominio HTTPS definitivo.
- Validar CORS malicioso, headers, HSTS e ausencia de `X-Powered-By`.
- Registrar evidencias em nova entrada no `specs.md`.

**Criterios de aceite:**
- Itens 1, 2, 3, 4 e 5 do relatorio original deixam de reproduzir.
- Qualquer excecao restante fica documentada com justificativa e prazo.

**Validacao:**
- `curl -I` com origem maliciosa.
- `curl -I` da raiz e endpoints API.
- Playwright smoke test completo.

## Ordem recomendada de execucao

1. `TASK-002` configurar HTTPS definitivo.
2. `TASK-004` e `TASK-005` corrigir CORS.
3. `TASK-006`, `TASK-007` e `TASK-008` adicionar headers e remover fingerprint.
4. `TASK-003` endurecer cookie admin para producao HTTPS.
5. `TASK-009` adicionar rate limit no login.
6. `TASK-010` decidir/implementar CSRF admin.
7. `TASK-011` ajustar fallback SPA para caminhos sensiveis, se aprovado.
8. `TASK-012` regressao funcional.
9. `TASK-013` reexecutar auditoria leve.

## Variaveis de ambiente a adicionar/documentar

```env
CORS_ALLOWED_ORIGINS=https://seudominio.com
```

Opcional apenas se for indispensavel manter homologacao HTTP temporaria:

```env
ALLOW_INSECURE_PRODUCTION_COOKIES=false
```

Essa flag deve ficar `false` ou ausente no ambiente final publico.

## Observacoes finais

- O item de HTTPS depende de configuracao operacional no Coolify e do dominio definitivo.
- A correcao de CORS e headers deve ser feita no codigo antes do proximo deploy publico.
- As inscricoes de teste criadas em producao devem ser canceladas/removidas antes do lancamento.
- A validacao autenticada via Playwright exige uma sessao admin ou credenciais fornecidas de forma segura durante o teste.
