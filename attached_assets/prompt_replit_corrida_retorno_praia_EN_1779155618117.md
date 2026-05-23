# Replit Prompt — Race Event Registration Web App

Build a polished, simple, efficient web application for managing registrations for a local running event. The app itself must be entirely in Brazilian Portuguese (`pt-BR`) for all user-facing screens, labels, buttons, messages, validation errors, empty states, and administrative UI.

The prompt is written in English because it will be used with Replit, but the final application language must be Portuguese from Brazil.

---

## 1. Project Overview

Create a web app for event registration, focused initially on a community running event held every July to celebrate the return of a local beach after the winter season. During the rainy/winter period, the river rises and covers the beach. When the river level starts to drop again, the beach becomes available for public use, and the community celebrates this moment with a running event.

The system must allow participants to access a public event page, read the event information, choose a route distance, and submit their registration without creating an account or logging in.

Only event organizers/administrators need authentication.

The system should be simple, but not ugly. “Simple” means efficient, clear, fast, and easy to use. The UI must look elegant, modern, trustworthy, responsive, and suitable for a real public sports event.

---

## 2. Core Principle

Participants must NOT create an account.

Public participant flow:

1. Open the public event link.
2. Read the event information.
3. Click the registration button.
4. Fill in the form.
5. Select the route: 3 km, 5 km, or 10 km.
6. Accept the responsibility terms.
7. Submit the registration.
8. See a success confirmation screen.

Admin/organizer flow:

1. Log in to the admin area.
2. View all registrations.
3. Filter and search participants.
4. View dashboard numbers.
5. Edit or cancel registrations.
6. Export participant lists.

---

## 3. Recommended Tech Stack

Use a simple full-stack approach suitable for Replit.

Preferred stack:

- Python
- Django
- SQLite for development
- Django templates
- Tailwind CSS or clean modern CSS
- Django Admin or custom admin pages

If Django is not ideal in the Replit environment, use the closest reliable full-stack alternative, but keep the architecture simple and maintainable.

The app must be easy to later migrate to:

- PostgreSQL
- Docker
- Coolify
- VPS production deployment

Do not overengineer the first version.

---

## 4. Language Requirement

The application interface must be 100% in Brazilian Portuguese.

Use Portuguese for:

- page titles;
- buttons;
- form labels;
- validation messages;
- success messages;
- admin dashboard labels;
- filters;
- table headers;
- empty states;
- confirmation screens;
- terms and warnings.

Examples:

- “Fazer inscrição”
- “Confirmar inscrição”
- “Inscrição realizada com sucesso”
- “Nome completo”
- “WhatsApp”
- “Data de nascimento”
- “Percurso”
- “Sexo”
- “Participantes inscritos”
- “Exportar lista”

Do not leave English text visible in the final app.

---

## 5. Application Name

Use a generic but elegant name for now:

**Corrida do Retorno da Praia**

Also use this event name in the UI.

The internal project/repository name can be:

`corrida-retorno-praia`

---

## 6. Public Pages

### 6.1 Public Event Landing Page

Create a beautiful landing page for the event.

Route suggestion:

`/`

The page must include:

- large hero/banner area;
- event name;
- short event description;
- event date;
- event time;
- event location;
- route options: 3 km, 5 km, 10 km;
- main CTA button: “Fazer inscrição”;
- section explaining the event story/context;
- section showing route cards;
- section with important information;
- WhatsApp/contact area;
- footer.

Suggested default event content in pt-BR:

Event name:

“Corrida do Retorno da Praia”

Short description:

“Uma corrida comunitária para celebrar o retorno da praia após o período de inverno, reunindo moradores, atletas e famílias em um momento especial para o nosso bairro.”

Date:

“Julho de 2026”

Time:

“07:00”

Location:

“Praia do bairro — ponto de largada a definir”

Route cards:

- 3 km — “Ideal para iniciantes, caminhada e corrida leve.”
- 5 km — “Percurso intermediário para quem já pratica corrida.”
- 10 km — “Desafio para atletas mais experientes.”

The design should feel like a real sports event page.

Visual style:

- modern;
- clean;
- responsive;
- mobile-first;
- elegant typography;
- good spacing;
- strong CTA;
- cards with soft shadows and rounded corners;
- colors inspired by river, beach, sunrise, sand, and sport energy.

Do not make it look like a basic unstyled form.

---

### 6.2 Registration Page

Route suggestion:

`/inscricao/`

Create a public registration form. No login required.

Fields:

Required:

- Nome completo
- WhatsApp
- Data de nascimento
- Sexo
- Percurso
- Aceite do termo de responsabilidade

Optional:

- E-mail
- Cidade
- Bairro
- Equipe ou assessoria
- Tamanho da camisa
- Observação médica

Field details:

#### Nome completo

Text input.
Required.

#### WhatsApp

Text input.
Required.
Use Brazilian phone formatting if possible.

#### E-mail

Email input.
Optional.

#### Data de nascimento

Date input.
Required.
The system should calculate age automatically when displaying admin data.

#### Sexo

Select input.
Options:

- Masculino
- Feminino
- Outro / Prefiro não informar

#### Percurso

Select or radio cards.
Options:

- 3 km
- 5 km
- 10 km

Make the route selection visually clear and pleasant.

#### Cidade

Text input.
Optional.

#### Bairro

Text input.
Optional.

#### Equipe ou assessoria

Text input.
Optional.
Example placeholder: “Informe sua equipe, assessoria ou deixe em branco.”

#### Tamanho da camisa

Select input.
Optional.
Options:

- PP
- P
- M
- G
- GG
- XG

#### Observação médica

Textarea.
Optional.
Placeholder example:

“Informe alguma condição médica relevante, alergia ou observação importante para a organização.”

#### Responsibility term

Checkbox.
Required.
Text in Portuguese:

“Declaro que estou apto(a) a participar da corrida e assumo total responsabilidade pelas informações fornecidas e pela minha participação no evento.”

Button:

“Confirmar inscrição”

---

### 6.3 Registration Success Page

After submitting the form, redirect to a success page.

Route suggestion:

`/inscricao/sucesso/`

Show a clear confirmation message in Portuguese.

Example:

“Inscrição realizada com sucesso!”

Then show a summary:

- Nome
- Percurso escolhido
- Data do evento
- Local
- Código de inscrição, if implemented

Also include:

- button to return to the event page;
- button or link to contact the organization via WhatsApp;
- optional message encouraging the participant to share the event.

Example text:

“Obrigado por se inscrever na Corrida do Retorno da Praia. Sua inscrição foi registrada e a organização poderá entrar em contato pelo WhatsApp informado.”

---

## 7. Admin Area

The organizer/admin area must require login.

Use Django Admin if that is the quickest reliable solution, but also create a friendly dashboard if possible.

Suggested routes:

- `/admin/` for Django admin
- `/painel/` for custom dashboard, if implemented

### 7.1 Admin Dashboard

Create a dashboard showing:

- total registrations;
- registrations by route:
  - 3 km
  - 5 km
  - 10 km
- registrations by sex;
- registrations by shirt size;
- recent registrations;
- pending/confirmed/cancelled status counts.

All labels must be in Portuguese.

Example cards:

- “Total de inscritos”
- “Inscritos no percurso 3 km”
- “Inscritos no percurso 5 km”
- “Inscritos no percurso 10 km”
- “Inscrições recentes”

---

### 7.2 Registration List

Create a list/table of registrations with:

- Nome
- WhatsApp
- Idade
- Sexo
- Percurso
- Tamanho da camisa
- Status
- Data da inscrição

Filters/search:

- search by name;
- filter by route;
- filter by sex;
- filter by status;
- filter by shirt size if possible.

Status values:

- Inscrito
- Confirmado
- Pendente de pagamento
- Cancelado

Even if payment is not fully implemented, include the status field because it will be useful later.

---

### 7.3 Edit Registration

Allow the admin to edit a registration.

At minimum, allow editing:

- participant information;
- route;
- status;
- internal notes.

Internal notes must not appear publicly.

---

### 7.4 Export

Implement export if possible in the first version.

At least CSV export is required.
Excel export is a plus.

The exported file should include:

- full name;
- WhatsApp;
- email;
- date of birth;
- calculated age;
- sex;
- route;
- city;
- neighborhood;
- team/advisory;
- shirt size;
- medical notes;
- status;
- registration date.

Button label:

“Exportar lista”

---

## 8. Data Model

Use a clean data model that can evolve later.

### 8.1 Event

Fields:

- id
- name
- description
- date
- time
- location
- registration_deadline
- banner_image optional
- status active/inactive
- created_at
- updated_at

Portuguese UI label: “Evento”

---

### 8.2 Route / Distance

Fields:

- id
- event
- name
- distance_km
- description
- participant_limit optional
- active

Examples:

- 3 km
- 5 km
- 10 km

Portuguese UI label: “Percurso”

---

### 8.3 Participant

Fields:

- id
- full_name
- whatsapp
- email optional
- birth_date
- sex
- city optional
- neighborhood optional
- team optional
- shirt_size optional
- medical_notes optional
- created_at
- updated_at

Portuguese UI label: “Participante”

---

### 8.4 Registration

Fields:

- id
- event
- participant
- route
- status
- payment_status optional
- accepted_terms boolean
- registration_code optional
- internal_notes optional
- created_at
- updated_at

Portuguese UI label: “Inscrição”

Prevent obvious duplicate registrations when possible.

Suggested duplicate check:

- same WhatsApp + same event;
- or same full name + same birth date + same event.

If duplicate is detected, show a friendly message in Portuguese instead of creating another registration.

Example message:

“Já encontramos uma inscrição com esses dados para este evento. Caso precise corrigir alguma informação, entre em contato com a organização.”

---

## 9. Business Rules

1. Participants do not need accounts.
2. Only admins/organizers log in.
3. A participant can register once per event.
4. Each registration must belong to one event and one route.
5. Route options for the first event are 3 km, 5 km, and 10 km.
6. Age should be calculated from birth date when needed.
7. Admins should be able to filter by sex, age, route, and status.
8. Public pages must be responsive and work well on mobile.
9. The app must be ready to evolve into a reusable event registration system.
10. Keep the implementation simple but clean and well-structured.

---

## 10. UI/UX Requirements

The UI must be elegant, not generic.

Use:

- responsive layout;
- mobile-first design;
- attractive hero section;
- route cards;
- clear form sections;
- large buttons;
- accessible contrast;
- rounded cards;
- subtle shadows;
- good spacing;
- clean typography.

The app should feel trustworthy enough for a public event.

Avoid:

- plain default browser form styling;
- messy tables;
- English visible text;
- confusing admin layout;
- unnecessary complexity.

---

## 11. Suggested Page Content in pt-BR

### Hero headline

“Corrida do Retorno da Praia”

### Hero subtitle

“Celebre com a comunidade o retorno da praia após o inverno em uma corrida especial para todas as idades.”

### CTA

“Fazer inscrição”

### About section title

“Sobre o evento”

### About text

“Todos os anos, quando o rio começa a baixar após o período de inverno, a praia volta a aparecer e se torna novamente um ponto de encontro para o nosso bairro. Para celebrar esse momento, realizamos uma corrida comunitária reunindo moradores, famílias, atletas iniciantes e corredores experientes.”

### Route section title

“Escolha seu percurso”

### Important info title

“Informações importantes”

Suggested items:

- “Chegue com antecedência ao local da largada.”
- “Use roupas leves e adequadas para atividade física.”
- “A organização poderá entrar em contato pelo WhatsApp informado.”
- “A inscrição é pessoal e deve conter dados verdadeiros.”

---

## 12. Initial Seed Data

Create initial data automatically if possible:

Event:

- Name: Corrida do Retorno da Praia
- Date: July 2026 placeholder
- Time: 07:00
- Location: Praia do bairro — ponto de largada a definir
- Status: active

Routes:

- 3 km
- 5 km
- 10 km

---

## 13. Security and Validation

Implement basic validation:

- required fields;
- valid birth date;
- valid email if provided;
- accepted terms required;
- duplicate registration prevention;
- admin pages protected by login.

Use CSRF protection if using Django.

Do not expose internal notes publicly.

Do not show sensitive data publicly.

---

## 14. Future-Ready Features

Do not necessarily implement these now, but structure the app so these can be added later:

- multiple events;
- configurable podium categories;
- automatic category assignment by sex, age, and route;
- payment control via Pix;
- Mercado Pago or Asaas integration;
- QR Code check-in;
- bib number generation;
- race results;
- ranking and podium generation;
- public list of confirmed participants;
- WhatsApp notifications;
- certificate generation.

---

## 15. Expected MVP Deliverables

The Replit-generated app should include at least:

1. Public event landing page.
2. Public registration form without participant login.
3. Route selection: 3 km, 5 km, 10 km.
4. Participant data capture.
5. Responsibility term checkbox.
6. Registration success page.
7. Admin access/login.
8. Admin view of registrations.
9. Basic dashboard or Django Admin setup.
10. Ability to edit registrations.
11. Basic filters or search if possible.
12. CSV export if possible.
13. Responsive and elegant UI in pt-BR.

---

## 16. Development Notes

Prioritize working functionality over excessive abstractions.

However, keep the code clean and organized.

Use meaningful file names, clear models, and readable templates.

Add comments only where useful.

Make sure the app can run in Replit with clear instructions.

At the end, provide:

- how to run the app;
- default admin creation instructions;
- any environment variables needed;
- main routes available.

---

## 17. Final Quality Criteria

The app is successful if:

- a participant can register without login;
- the organizer can see the registration in the admin area;
- the route choice is saved correctly;
- the app is fully in Brazilian Portuguese;
- the landing page looks elegant and appropriate for a real event;
- the codebase is simple enough to later continue development locally with Codex;
- the project can later be prepared for deployment on a VPS using Coolify.
