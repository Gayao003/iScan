# Database Strategy and MSSQL Transition

## Short answer

Yes, iScan can connect to Microsoft SQL Server later. The safest approach is to
keep database access behind a repository interface and use a relational schema
from the beginning. PostgreSQL is recommended for the free POC, but a future
MSSQL deployment is possible with a deliberate schema and data migration.

It is **not** safe to promise that changing only `.env` will switch between
PostgreSQL and MSSQL. A connection string changes the destination, but database
providers differ in SQL types, indexes, constraints, migrations, generated ORM
clients, and operational connectivity.

## Current implementation scope

The project is currently in **Phase 2**:

- Supabase PostgreSQL is the active application database.
- Prisma is the ORM/data-access layer.
- Vercel server-side routes or server actions access Supabase through a
  server-only repository/service boundary.
- The app may model Odoo-shaped fields for future compatibility, but it does not
  connect to Odoo or MSSQL.
- No MSSQL server, Odoo credentials, Odoo API, or private ERP network is needed
  to build or demonstrate this phase.

The extracted workflow describes the intended long-term process. Its Odoo
reconciliation and posting stages are future scope, not Phase 2 dependencies.

## Recommended progression

### Phase 1: no database dependency

Use an in-memory or static JSON repository with representative fixture data.
This proves scanning, lookup states, UI, and PWA behavior quickly.

### Phase 2: Supabase PostgreSQL (current)

Use Supabase PostgreSQL as the shared hosted database, subject to current plan
limits and policies. Use Prisma migrations and seed data. Local PostgreSQL may
be used for isolated development, but Supabase is the canonical Phase 2
environment. This provides realistic relational behavior without requiring a
paid MSSQL instance or Odoo connection.

### Phase 3: reconciliation and reporting

Add reconciliation, variance review, reports, and approval workflows using the
Supabase database. Continue using fixture/system-quantity adapters until the
actual ERP integration is approved.

### Phase 4: production or supervisor database

Choose PostgreSQL or MSSQL after the data source and hosting constraints are
known. Add Odoo integration only after its API, credentials, permissions, and
network model are confirmed. Keep the domain and repository interfaces stable
while replacing the infrastructure adapter and applying a reviewed migration.

## Why PostgreSQL first

- Free local development is straightforward.
- Managed free-tier options commonly integrate with serverless deployments.
- Relational constraints and indexes fit item-code lookup well.
- It keeps a practical path to other relational systems.

This is a POC recommendation, not a claim that PostgreSQL and MSSQL are
interchangeable.

## Suggested schema shape

Start with portable concepts:

- `items`: stable ID, unique normalized code, name, image URL, description,
  active status, timestamps
- `item_attributes`: optional structured attributes only if the supervisor
  requires flexible fields
- `scan_events`: add only if history/audit requirements are approved

Prefer portable types and avoid provider-specific features until required:

- strings with explicit lengths where practical;
- UTC timestamps;
- numeric IDs or UUIDs chosen deliberately;
- unique index on the normalized lookup code;
- foreign keys for real relationships;
- no database-specific JSON behavior in core lookup logic.

## Repository boundary

Application code should depend on behavior rather than Prisma:

```text
interface ItemRepository {
  findByCode(code: string): Promise<Item | null>
}
```

The implementation may use Prisma, but scanner and UI code should not import
Prisma. This allows a fixture repository in tests and reduces migration impact.

## Prisma and provider changes

Prisma supports relational providers including PostgreSQL and Microsoft SQL
Server, but a Prisma schema's provider and generated client must match the
selected database. A provider change normally requires:

1. review the schema for incompatible types and defaults;
2. configure the target provider and connection variables;
3. generate a client for that provider;
4. create or review target migrations;
5. migrate data and verify indexes/constraints;
6. run repository and end-to-end tests against the target;
7. switch traffic only after validation and rollback planning.

Keep migration history for each deployed provider. Do not edit an already
applied production migration to make it appear portable.

## Vercel and MSSQL connectivity

Vercel serverless functions can call a remotely reachable MSSQL server, but this
requires more operational planning than a managed serverless PostgreSQL service:

- the SQL Server must accept connections from the deployed environment;
- firewall and TLS settings must be configured safely;
- serverless connection pooling and cold starts must be handled;
- network latency and private-network/VPN restrictions may make direct access
  unsuitable;
- credentials must be stored as Vercel server-side environment variables;
- connection limits must be tested under concurrent function invocations.

If the MSSQL server is inside a private company network, a separate backend or
approved network bridge may be required. Do not expose an internal SQL Server
directly to the public internet merely to make a POC work.

## Environment configuration

Use separate environment values per environment:

```text
# Local development
DATABASE_URL=postgresql://...

# Preview/production PostgreSQL, if applicable
DATABASE_URL=postgresql://...

# Future only: MSSQL migration or production deployment
DATABASE_URL=sqlserver://...
```

For Phase 2, configure only the Supabase PostgreSQL connection. Do not add a
runtime provider switch or MSSQL fallback before there is an approved migration
need.

Do not put multiple providers behind runtime branching in ordinary application
code. Select the provider at build/deployment configuration time and validate
the connection during startup or health checks.

## Migration checklist

- [ ] Confirm the target database and hosting/network model.
- [ ] Export and classify existing data.
- [ ] Map types, defaults, nullability, and constraints.
- [ ] Preserve leading zeroes in barcode values.
- [ ] Recreate unique/index guarantees for code lookup.
- [ ] Define image storage separately from database rows.
- [ ] Test migration with a copy of representative data.
- [ ] Compare lookup results before and after migration.
- [ ] Plan rollback and backup before production cutover.
