# AGENTS.md — Development Rules for Treinão Encontro das Águas

This file defines mandatory instructions for AI coding agents working on this repository.

The project is a web application for public event registrations, initially focused on the running event **Treinão Encontro das Águas — 2ª Edição**.

The application UI must be entirely in **Brazilian Portuguese (pt-BR)**. Code, internal comments, commits, branch names and technical documentation may be written in English unless otherwise specified.

---

## 1. Core Development Principles

1. Always read `specs.md` before making any change.
2. Always check the current milestone and Progress Tracker in `specs.md` before starting work.
3. Work on one milestone/task at a time.
4. Do not mark a milestone as complete without explicit user confirmation.
5. After each meaningful work session, update the Progress Tracker in `specs.md` with:
   - what was changed;
   - files touched;
   - pending items;
   - risks or blockers;
   - recommended next step.
6. Keep the app simple, elegant, efficient and production-oriented.
7. Do not over-engineer features that are not in the current milestone.
8. Do not remove existing working functionality unless the task explicitly requires it.
9. Preserve public registration without participant login.
10. Only the admin/organization area requires authentication.
11. The project must remain mobile-first, especially for the public registration flow.
12. Favor maintainability, clarity and predictable behavior over clever abstractions.

---

## 2. Mandatory MCP Usage

### Context7 MCP

The agent **must always use the Context7 MCP** when working with libraries, frameworks, APIs or implementation details that depend on external documentation.

Use Context7 especially for:

- React;
- Vite;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- Express;
- Drizzle ORM;
- PostgreSQL;
- authentication/session libraries;
- form validation;
- date formatting;
- Docker/Coolify deployment details;
- any dependency already present in the repository.

Rules:

1. Before implementing or changing framework/library-specific code, consult Context7.
2. Do not guess APIs when Context7 can confirm them.
3. Prefer current official documentation via Context7 over memory.
4. If Context7 is unavailable, document the limitation in the Progress Tracker before proceeding.

---

## 3. Mandatory Skill Usage

### Playwright Skill

Use the Playwright skill for UI validation, regression checks and mobile responsiveness testing.

Use it when:

- changing public pages;
- changing registration flow;
- changing the terms modal;
- changing admin screens;
- validating mobile layouts;
- checking form behavior;
- validating route navigation;
- testing visual regressions.

Required viewport checks for public pages:

- 360px width;
- 390px width;
- 430px width;
- 768px width;
- desktop width.

Important mobile checks:

- no horizontal scroll;
- CTA buttons visible and easy to tap;
- form fields comfortable for touch;
- terms modal readable with internal scroll;
- submit button full width on mobile;
- admin registration list usable on mobile.

### interface-design Skill

Use the interface-design skill when modifying UI, layout, visual hierarchy, spacing, colors, cards, responsive behavior or design system decisions.

Use it especially for:

- landing page refinement;
- registration page refinement;
- event cards;
- CTA areas;
- admin dashboard layout;
- mobile card design;
- form spacing and hierarchy;
- typography and visual polish.

The goal is not to make the app complex. The goal is to make it **simple, refined, clear and elegant**.

---

## 4. Language and UX Rules

1. All visible text in the application must be in pt-BR.
2. Avoid technical terms in participant-facing UI.
3. Use warm, clear and direct language.
4. The event name must be displayed as:

   **Treinão Encontro das Águas — 2ª Edição**

5. Use this technical slug when needed:

   `treinao-encontro-das-aguas-2-edicao`

6. Do not leave old user-facing references to:
   - Corrida do Retorno da Praia;
   - Retorno da Praia;
   - Praia Run;
   - placeholder event names.

---

## 5. Architecture Rules

The current Replit-generated base may use a Node/TypeScript stack. Preserve the existing architecture unless a milestone explicitly instructs otherwise.

Expected stack for continuation:

- React;
- Vite;
- TypeScript;
- Tailwind CSS;
- shadcn/ui or equivalent UI components already present;
- Express backend;
- PostgreSQL;
- Drizzle ORM;
- Docker-ready deployment;
- Coolify production deployment later.

Do not migrate the project to another framework unless explicitly requested.

---

## 6. Authentication Rules

Public participants must never need an account.

Public flow:

1. Participant opens public event page.
2. Participant fills registration form.
3. Participant accepts terms.
4. Participant submits registration.
5. Participant sees success confirmation.

Admin flow:

1. Organization accesses protected admin area.
2. Organization logs in.
3. Organization manages registrations, event data and exports.

Important:

- Replit Auth is acceptable only in the initial prototype.
- Before production, remove Replit-specific authentication.
- Implement simple production-safe admin authentication.
- Use secure password hashing.
- Do not expose admin credentials in the frontend.
- Admin seed credentials must come from environment variables or a secure setup flow.

---

## 7. Registration Rules

The registration form must include at minimum:

- full name;
- CPF, mandatory;
- WhatsApp;
- date of birth;
- sex;
- selected route: 3 km, 5 km or 10 km;
- optional emergency contact name;
- optional emergency contact WhatsApp;
- terms acceptance.

CPF is the unique participant identifier.

Rules:

1. CPF is mandatory.
2. Only one active registration is allowed per CPF per event.
3. CPF must be validated and normalized before saving.
4. Store CPF in a consistent format.
5. Do not allow duplicate active registrations for the same CPF in the same event.
6. Additional information section must be removed from the registration form.
7. Replace the additional information section with optional emergency contact fields.
8. Emergency contact is optional, but if one field is filled, validation should guide the user to fill the matching useful field.

---

## 8. Terms and Responsibility Rules

The terms flow is mandatory.

The registration form must have a checkbox:

`Li e aceito o Termo de Responsabilidade, Saúde e Ciência de Riscos.`

The terms text must open in a modal/dialog.

The modal must:

- be mobile-friendly;
- have internal scroll;
- have a close button;
- have a primary button: `Li e aceito os termos`;
- mark the checkbox when accepted;
- not allow registration submission unless accepted.

The backend must store:

- `acceptedTerms`;
- `acceptedTermsAt`;
- `termsVersion`.

Current default terms version:

`2026-05-18-v1`

Do not remove this data from exports or admin visibility once implemented.

---

## 9. Data and Database Rules

1. Database schema changes must be reflected in migrations or documented migration steps.
2. Keep schema, API validation and frontend types aligned.
3. Do not rely on Replit-only seeded database state.
4. Create explicit seed logic for:
   - event;
   - routes: 3 km, 5 km and 10 km;
   - initial admin user.
5. New database fields must be included where appropriate in:
   - schema;
   - API validation;
   - admin views;
   - exports;
   - tests or manual validation steps.

---

## 10. Admin Rules

The admin panel must support:

- login;
- dashboard summary;
- registration list;
- search;
- filters by route, sex, age/status where applicable;
- edit registration;
- cancel registration;
- export CSV/Excel where applicable;
- visibility of CPF and terms acceptance data;
- mobile-friendly admin registration list.

On desktop, a table layout is acceptable.

On mobile, prefer cards over wide tables.

---

## 11. Testing and Validation Rules

Before ending a work session, run the safest available checks for the current project:

- typecheck;
- lint, if available;
- build;
- relevant tests, if available;
- manual Playwright validation for UI-related changes.

If a check cannot be run, explain why in the Progress Tracker.

Do not claim a task is complete if build/typecheck fails.

---

## 12. Git and Repository Rules

The project will be developed locally on the user's **Mac Mini M4**, connected to a Git repository.

Rules:

1. Keep changes small and reviewable.
2. Prefer meaningful commits by milestone/task.
3. Do not commit secrets.
4. Use `.env.example` for required environment variables.
5. Keep production-specific values out of source control.
6. Document local setup clearly.

---

## 13. Deployment Rules

The final deployment target is the user's VPS using **Coolify**.

Before production deploy, ensure:

- Dockerfile or Coolify-compatible build config exists;
- environment variables are documented;
- PostgreSQL is configured;
- migrations/seeds can run predictably;
- admin auth is no longer Replit-dependent;
- public registration flow works in production mode;
- mobile UI has been validated;
- export functions work;
- app has no old event-name references in the UI.

---

## 14. Progress Tracker Discipline

After each session, append a new entry in `specs.md` under **Progress Tracker** using this format:

```md
### YYYY-MM-DD — Short session title

**Agent:** Codex / Gemini / Other  
**Scope:** What was worked on  
**Files changed:**
- `path/to/file`

**What changed:**
- item 1
- item 2

**Validation performed:**
- command or manual test

**Pending:**
- item 1

**Risks/notes:**
- item 1

**Recommended next step:**
- next action
```

Do not delete previous progress entries.

---

## 15. Final Rule

The goal is to transform the Replit prototype into a clean, maintainable, mobile-first production application for event registration.

Always prioritize:

1. correctness;
2. mobile usability;
3. clear admin management;
4. simple and elegant UI;
5. safe production deployment.
