<p align="right">
  <a href="README.md"><strong>🇺🇸 English</strong></a> · <a href="README.pt-BR.md">🇧🇷 Português</a>
</p>

<p align="center">
  <img src="docs/screenshots/fitcpx-logo.png" alt="FitCPX logo" width="96" />
</p>

<h1 align="center">FitCPX · Backend API</h1>

<p align="center">
  <strong>The services behind a real fitness-management SaaS — and the engineering that connects them.</strong>
</p>

<p align="center">
  <a href="https://fitcpx.com">Official product</a> ·
  <a href="https://github.com/Allyyssoonnn/fitcpx-web">Web application</a> ·
  <a href="#inside-this-repository">Explore the code</a>
</p>

<p align="center">
  <code>Node.js</code> &nbsp; <code>TypeScript</code> &nbsp; <code>NestJS</code> &nbsp;
  <code>Express</code> &nbsp; <code>Sequelize</code> &nbsp; <code>MySQL</code>
</p>

---

## The project

FitCPX is a commercial platform for personal trainers and fitness businesses. It brings together **student management, workout prescription, physical assessments, scheduling, contracts, plans, payments and communication**.

This repository contains the **backend serving those workflows**. It is not a starter template or an isolated demo. Its Git history documents the evolution of a real application since **November 2024**, including new modules, maintenance work and changes in architecture.

I developed and maintained backend functionality spanning API endpoints, business rules, data persistence, external integrations and operational workflows. The code reflects the practical challenges of keeping interconnected product features working over time.

> **Repository boundary:** this is the backend, not the entire FitCPX ecosystem. The professional-facing [web application](https://github.com/Allyyssoonnn/fitcpx-web), the **FitCPX – Aluno** companion app and the **standalone exercise-library app** are separate codebases.

## What the API supports

| Domain | Implemented backend responsibilities |
| --- | --- |
| **Accounts and companies** | User authentication, registration, company records, licensing and dashboard data |
| **Students** | Student profiles, account operations, attachments and related records |
| **Training** | Workouts, sessions, exercise data, workout history and PDF generation |
| **Physical assessments** | Assessment records, images, measurements and PDF reports |
| **Scheduling and services** | Calendar events, appointments, services and plans |
| **Contracts and billing** | Contract creation, online-signature flows, checkout, licenses, payments and payouts |
| **Communication** | Chat messages, transactional emails, notifications and mobile-facing endpoints |

These features span multiple modules and external services. Some flows require valid credentials, application data and connected client applications; their presence in the source code does not mean they work without configuration.

## Engineering highlights

### An evolving Express + NestJS architecture

The application combines a legacy **Express** entry point with a modular **NestJS** application mounted on the same HTTP server. Existing JavaScript routes coexist with newer TypeScript modules, reflecting an incremental architectural evolution rather than a one-off rewrite.

- **Express layer:** `index.js`, `api/routes/` and `api/controllers/` retain legacy API flows.
- **NestJS modules:** `app.module.ts` and `modules/` group controllers, services, repositories and integrations by domain.
- **Persistence:** Sequelize models, migrations and seeders map application workflows to MySQL.
- **Access control:** token verification middleware handles authenticated requests, including student-specific mobile tokens; NestJS also configures request throttling.
- **Operational tooling:** Docker, PM2, an HTTP load-test script using k6, and monitoring configuration are part of the repository.

### How the pieces fit together

```text
FitCPX Web ────────────────┐
                          │
FitCPX – Aluno (mobile) ───┼──► Node.js HTTP server
                          │       ├── Express legacy routes
Other authorized clients ─┘       └── NestJS domain modules
                                      ├── Controllers and services
                                      ├── Sequelize repositories / models ──► MySQL
                                      └── External integrations
                                            ├── Asaas / Autentique
                                            ├── AWS S3
                                            ├── Firebase notifications
                                            └── Email services
```

The **standalone exercise-library app** is a different mobile product; it should not be confused with the student companion app connected to this management platform.

### Integrations represented in the code

- **Asaas:** billing, licenses, payment-related operations and event handling.
- **Autentique:** electronic-signature-related contract workflows.
- **AWS S3:** storage of uploaded files and assessment-related images.
- **Firebase Admin:** push notifications for supported mobile workflows.
- **Mailtrap:** email-delivery integration and sandbox configuration.
- **PDF generation:** workout and physical-assessment document templates and rendering workflows.

Integration availability depends on the corresponding provider accounts and configuration. Dependencies or integrations from older commits may differ from the current implementation.

### Example API routes

These are representative paths wired through the current Express entry point or registered NestJS modules, **not a complete API specification**:

| Method | Route | Area |
| --- | --- | --- |
| `POST` | `/users/login` | Authentication |
| `GET` | `/students` | Student management |
| `POST` | `/treino/getTreinos` | Legacy workout routes |
| `POST` | `/contracts/newContract` | Contracts |
| `GET` | `/payments/getPayouts` | Payment operations |
| `POST` | `/mobile/login` | Student companion app |

Most operations require an appropriate token and application context. External integrations may also be necessary.

## Technology snapshot

| Area | Technologies and tooling |
| --- | --- |
| Server | Node.js, JavaScript, TypeScript, Express, NestJS |
| Database | MySQL, Sequelize, Sequelize CLI |
| Authentication | JSON Web Tokens, request middleware, NestJS throttling |
| Integrations | Asaas, Autentique, AWS SDK for S3, Firebase Admin, Mailtrap |
| Documents | Puppeteer, HTML-based PDF templates |
| Deployment | Docker, Docker Compose, PM2 |
| Testing / diagnostics | Jest configuration, k6 script, OpenTelemetry and monitoring configuration |

The repository contains tooling and configuration for testing and observability; this README does **not** claim an automated test suite or a fully configured monitoring deployment. `WorkoutsModule`, `PhysicalAssessmentsModule` and `ExercisesModule` are registered in `AppModule.imports`, although their runtime behavior has not been verified as part of this documentation review.

## Inside this repository

```text
index.js                  # Express entry point / HTTP server
main.ts                   # NestJS bootstrap on the Express instance
app.module.ts             # NestJS module composition
api/                      # Legacy JavaScript routes and controllers
modules/                  # Domain-oriented NestJS modules
  users/                  # Accounts and authentication
  companies/              # Companies and dashboards
  students/               # Student management
  workouts/               # Training, exercise data, PDFs
  physicalAssessments/    # Assessments and reports
  contracts/              # Contract workflows
  payments/               # Payment operations
  mobile/                 # Student-app API endpoints
  ...                     # Calendar, chat, events, services, etc.
database/                 # Sequelize models, migrations and seeders
shared/                   # Authentication middleware and shared utilities
infra/                    # Observability configuration
Dockerfile                # Container build
Docker Compose files      # Container orchestration examples
docs/legacy-workflows/    # Archived CI/CD workflows (not active on main)
```

## Running locally

This backend is part of a commercial multi-service system. A checkout of the source **does not provide a functioning development environment by itself**.

### Prerequisites

- Node.js and npm (the Dockerfile currently uses a Node 18 base image; review the runtime version before deployment).
- A reachable MySQL server and a database created for your development environment.
- Private configuration for services used by the modules you intend to run.
- A Firebase service-account JSON file for the current notifications initialization path, even when only bootstrapping the API.

### Configuration

```bash
npm install
cp .env.example .env
cp database/config.example.json database/config.json
```

Fill in only the credentials needed for your own development environment. **Never commit** `.env`, `database/config.json` or Firebase private-key files. `.env.example` is intentionally free of real secrets.

The Sequelize CLI reads `database/config.json` through `.sequelizerc`; the environment-variable file **does not replace that JSON file**. Set the development database name, user, password and host to values matching your local MySQL setup.

The current Firebase initialization in `modules/notifications/notifications.api.ts` references a **specific local JSON filename under `modules/notifications/keys/`**. Supply a development service account at the path expected by that code, or deliberately adapt the initialization for your own environment. This is not bundled with the public source.

After creating the database and supplying the required configuration:

```bash
npx sequelize-cli db:migrate
npm run dev
```

The Express server normally listens on **port 8070**; when `NODE_ENV=test`, it selects **8071**. The NestJS application is mounted onto that same Express instance.

For a TypeScript compilation check:

```bash
npm run build
```

**Important:** `npm run reset` is not the recommended setup shortcut here: the existing script recreates a database named `educapp`, while `database/config.example.json` uses example names beginning with `fitcpx_`. Confirm and align these settings before running destructive database commands. Also review the supplied Docker/Compose configuration before using it in any public environment.

The commands above document the existing scripts; they have **not been certified as a clean-install, end-to-end setup**.

**Docker security note:** the build context should exclude `.env*`, `database/config.json` and Firebase service-account JSON files. Do not rely on `.gitignore` to protect Docker images. Provide runtime secrets through secure environment configuration or mounted secret files; the current Firebase initialization expects a JSON file on disk. Review the Docker deployment process before changing a production setup.

## Connected FitCPX products

The backend supports the professional web platform and mobile-specific workflows for **FitCPX – Aluno**, the student companion app. The latter lets clients access their professional-assigned training and related information; it is **not** the separate, freely browsable exercise-library app.

- **Professional web application:** [fitcpx-web](https://github.com/Allyyssoonnn/fitcpx-web)
- **FitCPX – Aluno:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.alunofitcpx) · [App Store](https://apps.apple.com/br/app/fitcpx-aluno/id6749808580)
- **Standalone FitCPX exercise library:** [Google Play](https://play.google.com/store/apps/details?id=com.devcomplexlab.fitcpx) · [App Store](https://apps.apple.com/us/app/fitcpx/id6749830273)

The two mobile applications have their own codebases; neither app's source code is included in this repository.

## The history matters

The Git history has been deliberately retained across **2024–2026**, documenting actual development, architectural changes and maintenance decisions. Older approaches and incremental migrations are part of that record — not every historical implementation represents the current preferred design.

Large generated artifacts and sensitive historical material were removed before preparing the repository for public review. Preserving the engineering history does not imply that former production infrastructure or private service credentials are available.

## Product and source code

- **Official product:** [fitcpx.com](https://fitcpx.com)
- **Developer / project:** FitCPX, LAB COMPLEX DEV LTDA
- **Repository purpose:** engineering portfolio and source-code review

FitCPX is a commercial product. Unless the relevant rights holders explicitly provide a license, publication of this repository does **not** grant permission to reuse or redistribute the code. Do not publish production credentials or user data.

---

<p align="center"><sub>Built as a real product. Shared to show the work behind it.</sub></p>
