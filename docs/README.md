# iScan Documentation

This folder is the working knowledge base for the iScan proof of concept (POC).
Agents should read this file first, then the documents relevant to their task.

## Current direction

- Product: iScan
- Form: installable Progressive Web App (PWA)
- Primary interaction: scan a barcode or QR code with a device camera
- Result: show the matched item, including its image and useful details
- Platforms: mobile-first Android and iOS, with a responsive desktop experience
- Status: Phase 2 POC; Supabase PostgreSQL is the active backend
- Deferred: MSSQL connectivity and Odoo integration

## Document map

| Document | Purpose |
|---|---|
| [product-brief.md](./product-brief.md) | Problem, goals, users, and POC boundaries |
| [requirements.md](./requirements.md) | Functional and non-functional requirements |
| [architecture.md](./architecture.md) | Proposed PWA architecture and boundaries |
| [technology-stack.md](./technology-stack.md) | Recommended framework, UI, ORM, deployment, and tooling |
| [database-strategy-and-migrations.md](./database-strategy-and-migrations.md) | Supabase PostgreSQL Phase 2 and future MSSQL transition guidance |
| [ux-and-responsive-layout.md](./ux-and-responsive-layout.md) | Mobile and desktop navigation behavior |
| [ui-standards-and-component-library.md](./ui-standards-and-component-library.md) | Uniform UI, navigation, tables, pagination, and component rules |
| [inventory-domain-and-workflow.md](./inventory-domain-and-workflow.md) | Phase 2 counts plus future reconciliation, reports, and Odoo workflow |
| [iSCAN_Inventory_Workflow.md](./iSCAN_Inventory_Workflow.md) | Extracted client workflow source document |
| [scanning-and-camera.md](./scanning-and-camera.md) | Camera, barcode, QR, and permission behavior |
| [data-model-and-api.md](./data-model-and-api.md) | Catalog lookup contract and data shape |
| [security-and-privacy.md](./security-and-privacy.md) | Security, privacy, and browser constraints |
| [testing-and-acceptance.md](./testing-and-acceptance.md) | Test strategy and POC acceptance criteria |
| [ai-agent-workflow.md](./ai-agent-workflow.md) | How coding agents should work in this project |
| [decision-log.md](./decision-log.md) | Decisions, assumptions, and open questions |

## How to use this knowledge base

1. Read the product brief and requirements before implementing a feature.
2. Check the decision log for unresolved assumptions before choosing an approach.
3. Keep implementation details in source code and stable project knowledge here.
4. Update the relevant document when a requirement or architectural decision changes.
5. Mark unknowns as `TBD` rather than inventing supervisor-specific behavior.

## Supervisor input needed

- Catalog or inventory data source
- Supported barcode formats
- Required item fields
- Authentication and user roles
- Whether scans or lookup history must be saved
- Deployment target and hosting constraints
- Branding, accessibility, and localization requirements
