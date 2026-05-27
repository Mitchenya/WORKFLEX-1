# WORKFLEX-1

Mini-application for employee and project management (WORKFLEX employee outsourcing context).

## Quick start

**Prerequisites:** Node.js 20+ and npm.

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Verify the API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |

## Stack

- **Frontend:** Next.js 15 (App Router) + React + TypeScript
- **Backend:** Next.js Route Handlers under `src/app/api`
- **Database:** SQLite via Prisma ORM
- **Validation:** Zod schema in `src/lib/validations.ts`

## Original task brief

Functional requirements:

- List of employees (name, surname, position, project, hourly rate, status)
- Add/edit/remove employee (CRUD)
- Filtering by project and status
- Endpoint REST GET `/api/employees/summary?project=X` — returns the total cost of the project (sum of hours × rate)

Technical requirements:

- Frontend: React + TypeScript (Next.js preferred)
- Backend: Node.js
- Database: any
- Validation on the backend side
- A short README.md: how to start, what assumptions, what would you add with more time

Out of scope: polished styling, authorization, deployment, E2E testing. Unit tests on key logic — welcome but optional.

## Assumptions

- **Architecture:** Single Next.js app (App Router) with API routes under `/api` and a React frontend in the same repo.

- **Hours worked:** The brief requires project cost as `hours × rate`, but does not list a hours field on employees. Each employee has `hoursWorked` for cost calculation (used when the summary endpoint is implemented).

- **Project:** Stored as a string on each employee, not a separate Project entity. List filters use exact, case-sensitive match on `project`.

- **Status:** `active`, `inactive`, or `on_leave`. Invalid `?status=` on `GET /api/employees` returns HTTP 400.

- **List behaviour:** `GET /api/employees` returns all matches with no pagination, ordered by surname then name. An empty database returns `[]`.

- **Authentication:** Not implemented (out of scope for this task).

- **Database:** SQLite via Prisma for local development (`prisma/dev.db`).

## Development log per commit following scaffolding commit

- Implemented `GET /api/employees` with optional `project` and `status` query filters. Tested with `curl`; empty database returns `[]`. (curl http://localhost:3000/api/employees)

- Implemented `POST /api/employees` with Zod validation (`employeeSchema.safeParse`). Returns `201` with the created employee; invalid JSON or validation errors return `400` with `fieldErrors`. Tested with `curl`. (curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Anna\",\"surname\":\"Kowalska\",\"position\":\"Developer\",\"project\":\"Acme Portal\",\"hourlyRate\":85,\"hoursWorked\":120,\"status\":\"active\"}")