# Recommended Technology Stack

This is the default stack for the POC unless the supervisor requires a
different platform. It favors fast delivery, a clean interface, Vercel
deployment, and a realistic path to a relational database such as Microsoft SQL
Server.

## Recommendation at a glance

| Concern | Recommendation | Reason |
|---|---|---|
| Application | Next.js with TypeScript | One codebase for responsive UI, server routes, and deployment |
| UI styling | Tailwind CSS | Utility-first responsive styling without a large custom CSS layer |
| UI components | shadcn/ui | Accessible, copy-in component primitives that remain owned by the project |
| Forms/validation | React Hook Form + Zod | Typed validation with good client/server reuse |
| Server data | Route handlers or server actions behind a service layer | Keeps database details out of components |
| ORM | Prisma | Strong TypeScript client and first-class PostgreSQL/MSSQL support |
| POC database | PostgreSQL | Free local development and strong Vercel/serverless options |
| Hosted POC database | Supabase PostgreSQL | Canonical Phase 2 database; plan limits and policies apply |
| Deployment | Vercel | Simple Next.js deployment, previews, and environment variables |
| Scanner | A maintained browser-compatible barcode library behind an adapter | Keeps camera integration replaceable |
| Testing | Vitest, Testing Library, and Playwright | Unit, component, and browser-flow coverage |

Versions should be selected during project initialization rather than hard-coded
in this document. Pin versions in the package manifest and lockfile.

## Why Next.js

Next.js can serve the responsive PWA frontend and small server-side API
boundaries from one project. This is convenient for a POC and supports Vercel
preview deployments. Keep the application organized so a future separate API
can be introduced without rewriting domain logic.

Do not put database queries directly in visual components. Use a service or
repository boundary so the PWA remains testable and the data source remains
replaceable.

## Why Tailwind CSS and shadcn/ui

shadcn/ui is not a hosted component runtime. It adds accessible component source
files to the project, usually built on Radix UI, while Tailwind provides the
styling primitives. This gives the team a professional starting point without
locking the product into an opaque theme package.

Use shadcn/ui for buttons, dialogs, cards, inputs, navigation, alerts, and
loading states. Keep scanner-specific visuals and responsive composition in
feature components. Do not copy entire templates unnecessarily.

## What an ORM is

An Object-Relational Mapper (ORM) maps application objects and typed queries to
relational database tables. Instead of writing every query as a raw SQL string,
the application can use a generated, type-aware client:

```text
catalogService.findItemByCode(code)
        -> repository
        -> Prisma Client
        -> PostgreSQL or SQL Server
```

An ORM does not eliminate database knowledge. Developers still need indexes,
constraints, transactions, migrations, query performance awareness, and safe
handling of untrusted input. Raw SQL should be an intentional, reviewed
exception.

## POC defaults

- Start with a mock repository and seed data so the scanner flow can be proven
  before backend credentials exist.
- Use Supabase PostgreSQL for the shared Phase 2 environment; local PostgreSQL is
  acceptable for isolated development.
- Keep all database access on the server side.
- Validate request inputs with Zod before calling the repository.
- Use environment variables for connection strings and feature flags.
- Never expose `DATABASE_URL` or database credentials to browser code.

## Environment variables

Example names only; never commit real values:

```text
DATABASE_URL=
DIRECT_DATABASE_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_ENABLE_HISTORY=false
```

`NEXT_PUBLIC_` values are intentionally public in Next.js. Database connection
strings must not use that prefix.

## When to choose alternatives

- **Drizzle ORM:** reasonable if SQL transparency and a smaller abstraction are
  more important than Prisma's generated client. Confirm current MSSQL support
  and migration tooling before selecting it.
- **MongoDB:** reasonable only if the catalog is genuinely document-shaped or
  schema flexibility is a primary requirement. It is not the default for this
  item lookup use case because item codes, uniqueness, indexes, and future
  inventory relationships are naturally relational.
- **Supabase:** useful when authentication, storage, and PostgreSQL APIs are
  needed quickly; keep the application behind repository/service boundaries.
- **Firebase:** possible, but it creates a different document/query model and is
  less convenient if MSSQL compatibility is a likely requirement.

## Stack risks

- Serverless functions and long-lived database connections require correct
  pooling or a serverless-compatible driver.
- Camera support is controlled by browsers and secure-context rules, not Next.js.
- Free hosted tiers have quotas, sleeping databases, and changing provider terms.
- shadcn/ui accelerates UI work but does not replace UX decisions or testing.
