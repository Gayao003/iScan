# Decision Log

Record decisions that affect architecture, UX, data, or delivery. Newest entries
should be added at the top. Each entry should include the date and decision owner.

## Template

```text
### YYYY-MM-DD - Short decision title
- Status: proposed | accepted | superseded
- Owner:
- Decision:
- Reason:
- Alternatives considered:
- Consequences:
- Related requirements:
```

## Initial decisions

### 2026-11-04 - Use Supabase PostgreSQL for Phase 2
- Status: accepted
- Owner: Project team
- Decision: Phase 2 uses Supabase PostgreSQL as the shared database. MSSQL and
  Odoo integration are deferred to later phases.
- Reason: The current goal is to prove scanning, count capture, and persistence
  without requiring paid MSSQL infrastructure, Odoo credentials, or access to a
  private ERP network.
- Alternatives considered: Connect directly to MSSQL/Odoo during the POC.
- Consequences: Future ERP quantities may use fixtures or adapter stubs. A later
  integration will require reviewed migrations, network planning, permissions,
  and end-to-end validation.
- Related requirements: R5, R13, R14, R16

### 2026-11-04 - Prefer a serverless-friendly TypeScript stack
- Status: proposed
- Owner: Project team
- Decision: Use Next.js, TypeScript, Tailwind CSS, shadcn/ui, Prisma, and
  PostgreSQL as the default POC stack, deployed to Vercel where appropriate.
- Reason: This combination provides a fast, responsive UI workflow, a shared
  frontend/server boundary, typed database access, and inexpensive development.
- Alternatives considered: Flutter, a MongoDB-first design, manually styled UI,
  and a native app.
- Consequences: Database provider changes still require reviewed migrations;
  MSSQL connectivity from Vercel must be validated against network and pooling
  constraints.
- Related requirements: R5, R6, R9, R10

### 2026-11-04 - Use a PWA for the proof of concept
- Status: accepted
- Owner: Project team
- Decision: Build iScan as an installable, responsive PWA rather than a native app.
- Reason: It supports a shared implementation for Android, iOS, and desktop while
  avoiding a current requirement for Mac hardware and native iOS tooling.
- Alternatives considered: Flutter native app, separate Android and iOS apps.
- Consequences: Camera behavior, install prompts, and permissions remain subject
  to browser and platform support. Actual-device testing is still required.
- Related requirements: R1, R9, R10, R11, R12

### 2026-11-04 - Keep catalog access behind an adapter
- Status: accepted
- Owner: Project team
- Decision: The UI and application flow will depend on a catalog interface, not a
  selected backend or fixture format.
- Reason: The supervisor has not yet confirmed the catalog source.
- Alternatives considered: Hard-code a backend integration immediately.
- Consequences: The POC can use mock data now and replace it later with less churn.
- Related requirements: R5, R6, R7

## Open decisions

- Frontend framework and build tool
- Scanner library and exact supported symbologies
- Catalog source and API authentication
- Required item fields and image hosting
- Scan history and offline behavior
- Hosting, domain, and deployment pipeline
- Supported browser/device matrix
- Branding, localization, and final accessibility target
