# WORKFLEX-1

TASK: a mini-application for employee and project management (context: WORKFLEX employee outsourcing).

Functional requirements:
- List of employees (name, surname, position, project, hourly rate, status)
- Add/edit/remove employee (CRUD)
- Filtering by project and status
- Endpoint REST GET /api/employees/summary?project=X - returns the total cost of the project (sum of hours × rate)

Technical requirements:
- Frontend: React + TypeScript (Next.js mile widziany)
- Backend: Node.js (Express / NestJS / inny wedle uznania)
- Database: any (PostgreSQL, MongoDB, SQLite)
- Validation on the backend side
- A short README.md: how to start, what assumptions, what would you add with more time

What we do NOT require: polished styling, authorization, deployment, E2E testing. Unit tests on key logic – welcome but optional.