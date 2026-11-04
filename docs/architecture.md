# Proposed Architecture

## Principle

Build a browser-first application with replaceable adapters. The scanner should
not know where catalog data comes from, and UI components should not depend on a
specific barcode library.

## Logical layers

```text
Presentation
  Scanner screen, result screen, history, navigation, error states
Application
  Scan orchestration, lookup use case, normalization, state transitions
Domain
  Item, barcode, lookup result, validation rules
Infrastructure
  Camera/barcode adapter, catalog API adapter, local storage, service worker
  inventory repository, future ERP integration adapter, report/export adapters
```

## Suggested project boundaries

Names may change with the selected framework, but responsibilities should remain:

- `features/scanner`: scanner UI and scanner adapter integration
- `features/catalog`: item lookup and item detail presentation
- `features/history`: optional local history
- `features/inventory`: counts, locations, reconciliation, approvals, and reports
- `features/erp`: future Odoo adapter and adjustment posting boundary
- `shared/ui`: reusable controls and layout primitives
- `shared/config`: environment configuration and feature flags
- `shared/types`: API and domain types
- `lib/pwa`: manifest, service worker, and install behavior

## Runtime flow

1. User opens the scanner.
2. The camera adapter requests permission and emits scan events.
3. The application normalizes and de-duplicates the code.
4. The catalog adapter resolves the code.
5. The UI renders loading, success, empty, or error state.
6. The camera is paused or stopped while the result is shown.

The current inventory workflow saves counts to Supabase PostgreSQL. Future
reconciliation against an ERP, reporting, approval, and Odoo posting must remain
separate explicit stages. See
[inventory-domain-and-workflow.md](./inventory-domain-and-workflow.md).

## PWA strategy

- Cache the application shell for fast repeat visits.
- Treat catalog data as network data unless offline behavior is confirmed.
- Never cache private responses without an explicit policy.
- Make service-worker updates observable and recoverable.
- Use HTTPS in deployed environments; camera access generally requires a secure
  context (localhost is the normal development exception).

## Recommended implementation stack

The default implementation stack is Next.js with TypeScript, Tailwind CSS,
shadcn/ui, Zod, Prisma, PostgreSQL, and Vercel. See
[technology-stack.md](./technology-stack.md) for rationale and alternatives.
See [database-strategy-and-migrations.md](./database-strategy-and-migrations.md)
for the PostgreSQL-to-MSSQL transition plan.

Keep database access behind a repository/service boundary. This permits mock
data during the POC and prevents scanner or UI code from depending directly on
Prisma or a particular database provider.

## Architectural decisions still open

- Frontend framework and scanner package
- Catalog backend and authentication
- Whether the POC uses a mock API, static JSON, or a real service
- State-management complexity appropriate for the first release
