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
