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

- **Backend:** Node.js via Next.js Route Handlers (no separate Express/NestJS server).

- **HTTP:** Successful create returns `201 Created`; list returns `200` with a JSON array (`[]` when empty).

- **Validation:** Request bodies for create (and update, when implemented) are validated with Zod before database writes.

- **Route handler typing** Next.js App Router route handlers use canonical RouteContext typing (async params) instead of inline context type literals; this standardizes typing only and does not change runtime behavior.

- **Patch / Put** Employee edits are implemented with `PUT /api/employees/[id]` (full update) rather than `PATCH`, since the brief does not require partial updates.

## Development log per commit following scaffolding commit

- Implemented `GET /api/employees` with optional `project` and `status` query filters. Tested with `curl`; empty database returns `[]`. `curl http://localhost:3000/api/employees`

- Implemented `POST /api/employees` with Zod validation `employeeSchema.safeParse`. Returns `201` with the created employee; invalid JSON or validation errors return `400` with `fieldErrors`. Tested with `curl`. curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Anna\",\"surname\":\"Kowalska\",\"position\":\"Developer\",\"project\":\"Acme Portal\",\"hourlyRate\":85,\"hoursWorked\":120,\"status\":\"active\"}"

- Added `prisma/seed.ts` with 10 sample employees across three projects. Run `npm run db:seed` after migrate to populate the database; verified with `curl http://localhost:3000/api/employees`.

- Implemented `GET /api/employees/[id]` with id validation (`400` invalid id, `404` not found, `200` when the row exists). Tested with `curl -i http://localhost:3000/api/employees/<id>`.

- **Testing note:** Re-running `npm run db:seed` does not guarantee ids 1–10 (SQLite keeps auto-incrementing). Use an `id` from `GET /api/employees`, or run `npx prisma migrate reset` for a fresh database.

- Implemented `PUT /api/employees/[id]` with path id validation and Zod request-body validation. Returns `200` with the updated employee; invalid id/JSON/schema return `400`, and missing employee returns `404`. Tested with: curl -i -X PUT http://localhost:3000/api/employees/5 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ewa\",\"surname\":\"Lewandowska\",\"position\":\"Program Manager\",\"project\":\"Gamma Analytics\",\"hourlyRate\":82,\"hoursWorked\":112,\"status\":\"active\"}"

- Implemented `DELETE /api/employees/[id]` with id validation. Returns `204` on success, `400` for invalid id, and `404` when employee is not found (tested with `curl`). `curl http://localhost:3000/api/employees`, `curl -i -X DELETE http://localhost:3000/api/employees/[id]`, confirm `curl -i http://localhost:3000/api/employees/[id]`

- Implemented `GET /api/employees/summary?project=X` to return project totals (`totalCost`) and `employeeCount`; verified with `curl` (e.g., `{"project":"Acme Portal","totalCost":30330,"employeeCount":3}`).

- Implemented frontend modularization by splitting `src/app/page.tsx` into reusable UI sections: `EmployeeFormSection`, `FiltersSection`, `ProjectSummarySection`, and `EmployeesTable`, and moved shared models/constants to `src/app/types/employee.ts`. Fixed TypeScript issues by switching to `@/app/components/...` imports, typing `id` as `number`, and replacing deprecated `React.FormEvent` with `React.SyntheticEvent<HTMLFormElement, SubmitEvent>` (validated with `npm run lint`). Tested with `npm run dev` by exercising `create`, `edit`, `delete`, `filter`, and `summary` flows, then confirming no TypeScript errors in the editor.

## With more time

- Add `PATCH /api/employees/[id]` alongside `PUT` to support partial updates (e.g., status-only changes) without requiring the full employee payload.