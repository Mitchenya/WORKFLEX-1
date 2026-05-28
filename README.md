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
| `npm run test` | Run unit tests (Vitest) |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Seed sample employee data |

## First run checklist

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Use `npm run db:seed` only if you want sample data.

## Testing

Run tests with:

```bash
npm test
```

Current test coverage focuses on key API route logic:
- Request validation and error handling (`400`, `404`)
- Success responses for CRUD endpoints (`200`, `201`, `204`)
- Project summary calculation (`totalCost`, `employeeCount`)

## Troubleshooting (Windows)

If `npm install` fails with an `EPERM` error mentioning:
`query_engine-windows.dll.node`

close running Node/Next processes (for example `npm run dev` terminals), then retry:

```bash
npm install
```

If needed, run:

```bash
npm install --ignore-scripts
```

then run Prisma generation manually after processes are stopped:

```bash
npx prisma generate
```

## API sanity checks

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/employees
```

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

- **Validation:** Request bodies for create and update are validated with Zod before database writes.

- **Route handler typing:** Next.js App Router route handlers use canonical RouteContext typing (async params) instead of inline context type literals; this standardizes typing only and does not change runtime behavior.

- **Patch / Put:** Employee edits are implemented with `PUT /api/employees/[id]` (full update) rather than `PATCH`, since the brief does not require partial updates.

## Development log per commit following scaffolding commit

- Implemented `GET /api/employees` with optional `project` and `status` query filters. Tested with `curl`; empty database returns `[]`. `curl http://localhost:3000/api/employees`

- Implemented `POST /api/employees` with Zod validation `employeeSchema.safeParse`. Returns `201` with the created employee; invalid JSON or validation errors return `400` with `fieldErrors`. Tested with `curl`. curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Anna\",\"surname\":\"Kowalska\",\"position\":\"Developer\",\"project\":\"Acme Portal\",\"hourlyRate\":85,\"hoursWorked\":120,\"status\":\"active\"}"

- Added `prisma/seed.ts` with 40 sample employees across five projects. Run `npm run db:seed` after migrate to populate the database; verified with `curl http://localhost:3000/api/employees`.

- Implemented `GET /api/employees/[id]` with id validation (`400` invalid id, `404` not found, `200` when the row exists). Tested with `curl -i http://localhost:3000/api/employees/<id>`.

- **Testing note:** Re-running `npm run db:seed` does not guarantee stable ids (SQLite keeps auto-incrementing). Use an `id` from `GET /api/employees`, or run `npx prisma migrate reset` for a fresh database.

- Implemented `PUT /api/employees/[id]` with path id validation and Zod request-body validation. Returns `200` with the updated employee; invalid id/JSON/schema return `400`, and missing employee returns `404`. Tested with: curl -i -X PUT http://localhost:3000/api/employees/5 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ewa\",\"surname\":\"Lewandowska\",\"position\":\"Program Manager\",\"project\":\"Gamma Analytics\",\"hourlyRate\":82,\"hoursWorked\":112,\"status\":\"active\"}"

- Implemented `DELETE /api/employees/[id]` with id validation. Returns `204` on success, `400` for invalid id, and `404` when employee is not found (tested with `curl`). `curl http://localhost:3000/api/employees`, `curl -i -X DELETE http://localhost:3000/api/employees/[id]`, confirm `curl -i http://localhost:3000/api/employees/[id]`

- Implemented `GET /api/employees/summary?project=X` to return project totals (`totalCost`) and `employeeCount`; verified with `curl` (e.g., `{"project":"Acme Portal","totalCost":30330,"employeeCount":3}`).

- Implemented frontend modularization by splitting `src/app/page.tsx` into reusable UI sections: `EmployeeFormSection`, `FiltersSection`, `ProjectSummarySection`, and `EmployeesTable`, and moved shared models/constants to `src/app/types/employee.ts`. Fixed TypeScript issues by switching to `@/app/components/...` imports, typing `id` as `number`, and replacing deprecated `React.FormEvent` with `React.SyntheticEvent<HTMLFormElement, SubmitEvent>` (validated with `npm run lint`). Tested with `npm run dev` by exercising `create`, `edit`, `delete`, `filter`, and `summary` flows, then confirming no TypeScript errors in the editor.

## With more time

- Add `PATCH /api/employees/[id]` alongside `PUT` to support partial updates (e.g., status-only changes) without requiring the full employee payload.
- Add pagination/sorting/search for `GET /api/employees` (`page`, `limit`, `sort`, `q`) to support larger datasets.
- Expand API route test coverage (PUT success paths, DELETE edge cases, summary with empty projects).
- Add optimistic UI updates + request deduping/caching (`React Query` or `SWR`) to reduce duplicate fetches and improve responsiveness.
- Add better money/time handling (currency formatting, decimal-safe math, validation rules for `hourlyRate`/`hoursWorked`).
- Add authentication/authorization (role-based actions for create/edit/delete).
- Add audit metadata (`createdBy`, `updatedBy`, change history) for traceability.
- Add stronger UX/accessibility: toast feedback, confirm modals, loading/empty/error states, keyboard and ARIA improvements.
- Add Docker + CI pipeline (`lint`, type-check, tests, build) for consistent local/dev deployment.
- Move `project` to a dedicated entity/table with foreign keys to improve data integrity and reporting.

---

## Polish version (`README` copy)

# WORKFLEX-1

Miniaplikacja do zarzadzania pracownikami i projektami (kontekst outsourcingu pracownikow WORKFLEX).

## Szybki start

**Wymagania wstepne:** Node.js 20+ oraz npm.

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

Otworz [http://localhost:3000](http://localhost:3000).

Sprawdz API: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### Skrypty

| Skrypt | Opis |
| --- | --- |
| `npm run dev` | Uruchamia serwer deweloperski |
| `npm run build` | Buduje wersje produkcyjna |
| `npm run db:migrate` | Wykonuje migracje Prisma |
| `npm run db:generate` | Regeneruje klienta Prisma |
| `npm run test` | Uruchamia testy jednostkowe (Vitest) |
| `npm run db:seed` | Seeduje przykladowe dane pracownikow |

## Pierwsze uruchomienie (checklista)

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Uzyj `npm run db:seed` tylko, jesli chcesz dodac dane przykladowe.

## Stos technologiczny

- **Frontend:** Next.js 15 (App Router) + React + TypeScript
- **Backend:** Next.js Route Handlers w `src/app/api`
- **Baza danych:** SQLite przez Prisma ORM
- **Walidacja:** schemat Zod w `src/lib/validations.ts`

## Oryginalne wymagania zadania

Wymagania funkcjonalne:

- Lista pracownikow (imie, nazwisko, stanowisko, projekt, stawka godzinowa, status)
- Dodawanie/edycja/usuwanie pracownika (CRUD)
- Filtrowanie po projekcie i statusie
- Endpoint REST GET `/api/employees/summary?project=X` — zwraca calkowity koszt projektu (suma godzin × stawka)

Wymagania techniczne:

- Frontend: React + TypeScript (preferowany Next.js)
- Backend: Node.js
- Baza danych: dowolna
- Walidacja po stronie backendu
- Krotki README.md: jak uruchomic, jakie zalozenia, co dodalbys przy wiekszej ilosci czasu

Poza zakresem: dopracowany styling, autoryzacja, wdrozenie, testy E2E. Testy jednostkowe kluczowej logiki — mile widziane, ale opcjonalne.

## Zalozenia

- **Architektura:** Jedna aplikacja Next.js (App Router) z trasami API pod `/api` i frontendem React w tym samym repozytorium.

- **Przepracowane godziny:** Wymaganie mowi o koszcie projektu jako `godziny × stawka`, ale nie wymienia pola godzin przy pracowniku. Kazdy pracownik ma pole `hoursWorked` do obliczania kosztu (uzywane przy implementacji endpointu podsumowania).

- **Projekt:** Przechowywany jako string przy pracowniku, bez osobnej encji Project. Filtry listy uzywaja dokladnego, wrazliwego na wielkosc liter dopasowania po `project`.

- **Status:** `active`, `inactive` lub `on_leave`. Niepoprawny `?status=` w `GET /api/employees` zwraca HTTP 400.

- **Zachowanie listy:** `GET /api/employees` zwraca wszystkie pasujace rekordy bez paginacji, posortowane po nazwisku, potem imieniu. Pusta baza zwraca `[]`.

- **Uwierzytelnianie:** Niezaimplementowane (poza zakresem tego zadania).

- **Baza danych:** SQLite przez Prisma do lokalnego developmentu (`prisma/dev.db`).

- **Backend:** Node.js przez Next.js Route Handlers (bez osobnego serwera Express/NestJS).

- **HTTP:** Poprawne utworzenie zwraca `201 Created`; lista zwraca `200` i tablice JSON (`[]` gdy pusta).

- **Walidacja:** Ciala zapytan dla create i update sa walidowane przez Zod przed zapisem do bazy.

- **Typowanie route handlerow:** Route handlery w Next.js App Router uzywaja kanonicznego typowania RouteContext (asynchroniczne params) zamiast inline literal types; to standaryzuje typy i nie zmienia zachowania runtime.

- **Patch / Put:** Edycja pracownika jest zaimplementowana przez `PUT /api/employees/[id]` (pelna aktualizacja), a nie `PATCH`, poniewaz zadanie nie wymaga czesciowych aktualizacji.

## Dziennik prac per commit po commicie scaffoldu

- Zaimplementowano `GET /api/employees` z opcjonalnymi filtrami query `project` i `status`. Przetestowano przez `curl`; pusta baza zwraca `[]`. `curl http://localhost:3000/api/employees`

- Zaimplementowano `POST /api/employees` z walidacja Zod `employeeSchema.safeParse`. Zwraca `201` z utworzonym pracownikiem; niepoprawny JSON lub bledy walidacji zwracaja `400` z `fieldErrors`. Przetestowano przez `curl`. curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Anna\",\"surname\":\"Kowalska\",\"position\":\"Developer\",\"project\":\"Acme Portal\",\"hourlyRate\":85,\"hoursWorked\":120,\"status\":\"active\"}"

- Dodano `prisma/seed.ts` z 40 przykladowymi pracownikami w pieciu projektach. Uruchom `npm run db:seed` po migracji, aby wypelnic baze; zweryfikowano przez `curl http://localhost:3000/api/employees`.

- Zaimplementowano `GET /api/employees/[id]` z walidacja id (`400` dla niepoprawnego id, `404` gdy nie znaleziono, `200` gdy rekord istnieje). Przetestowano przez `curl -i http://localhost:3000/api/employees/<id>`.

- **Uwaga testowa:** Ponowne uruchomienie `npm run db:seed` nie gwarantuje stabilnych id (SQLite kontynuuje auto-increment). Uzyj id z `GET /api/employees` albo uruchom `npx prisma migrate reset`, aby odswiezyc baze.

- Zaimplementowano `PUT /api/employees/[id]` z walidacja id w sciezce i walidacja ciala przez Zod. Zwraca `200` ze zaktualizowanym pracownikiem; niepoprawne id/JSON/schemat zwracaja `400`, a brak pracownika zwraca `404`. Test: curl -i -X PUT http://localhost:3000/api/employees/5 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ewa\",\"surname\":\"Lewandowska\",\"position\":\"Program Manager\",\"project\":\"Gamma Analytics\",\"hourlyRate\":82,\"hoursWorked\":112,\"status\":\"active\"}"

- Zaimplementowano `DELETE /api/employees/[id]` z walidacja id. Zwraca `204` przy sukcesie, `400` dla niepoprawnego id i `404` gdy pracownik nie istnieje (testowane przez `curl`). `curl http://localhost:3000/api/employees`, `curl -i -X DELETE http://localhost:3000/api/employees/[id]`, potwierdzenie: `curl -i http://localhost:3000/api/employees/[id]`

- Zaimplementowano `GET /api/employees/summary?project=X`, aby zwracac podsumowanie projektu (`totalCost`) i `employeeCount`; zweryfikowano przez `curl` (np. `{"project":"Acme Portal","totalCost":30330,"employeeCount":3}`).

- Zaimplementowano modularyzacje frontendu przez podzial `src/app/page.tsx` na reuzywalne sekcje UI: `EmployeeFormSection`, `FiltersSection`, `ProjectSummarySection` i `EmployeesTable`, oraz przeniesiono wspolne modele/stale do `src/app/types/employee.ts`. Naprawiono problemy TypeScript przez przejscie na importy `@/app/components/...`, jawne typowanie `id` jako `number` oraz zamiane przestarzalego `React.FormEvent` na `React.SyntheticEvent<HTMLFormElement, SubmitEvent>` (zweryfikowane przez `npm run lint`). Testowano przez `npm run dev`, przechodzac flow `create`, `edit`, `delete`, `filter` i `summary`, oraz potwierdzono brak bledow TypeScript w edytorze.

## Z dodatkowym czasem

- Dodac `PATCH /api/employees/[id]` obok `PUT`, aby wspierac czesciowe aktualizacje (np. sama zmiana statusu) bez wysylania calego payloadu pracownika.
- Dodac paginacje/sortowanie/wyszukiwanie dla `GET /api/employees` (`page`, `limit`, `sort`, `q`) pod wieksze zbiory danych.
- Rozszerzyc pokrycie testami API (sciezki sukcesu PUT, przypadki brzegowe DELETE, summary dla pustych projektow).
- Dodac optymistyczne aktualizacje UI + deduplikacje/cache zapytan (`React Query` lub `SWR`) w celu ograniczenia duplikatow fetch i poprawy responsywnosci.
- Dodac lepsza obsluge pieniedzy/czasu (formatowanie waluty, bezpieczna matematyka dziesietna, reguly walidacji dla `hourlyRate`/`hoursWorked`).
- Dodac uwierzytelnianie/autoryzacje (akcje oparte o role dla create/edit/delete).
- Dodac metadane audytowe (`createdBy`, `updatedBy`, historia zmian) dla pelnej sledzalnosci.
- Dodac lepszy UX/dostepnosc: toasty, modale potwierdzen, stany loading/empty/error, usprawnienia klawiaturowe i ARIA.
- Dodac Docker + pipeline CI (`lint`, type-check, testy, build) dla spojnego local/dev deploymentu.
- Przeniesc `project` do osobnej encji/tabeli z kluczami obcymi, aby poprawic integralnosc danych i raportowanie.