# Inventory Domain and Workflow

This document translates the extracted client workflow into implementation
guidance. The original source is
[iSCAN_Inventory_Workflow.md](./iSCAN_Inventory_Workflow.md); this document
should be updated when the supervisor confirms business rules that the source
does not define.

## Current Phase 2 scope

Phase 2 uses Supabase PostgreSQL as the only shared database. It covers:

- barcode/QR scanning;
- item lookup and item details;
- count capture by item and location;
- validation and persistence of physical count records;
- basic count list/detail views and synchronization status.

Phase 2 does **not** connect to MSSQL, Odoo, or an internal ERP network. Odoo
system quantities may be represented by fixtures or a repository stub only when
needed to design future reconciliation screens.

## Product scope expansion

iScan is not only a barcode-to-item lookup. The intended end-to-end workflow is:

1. Scan items on a mobile device.
2. Record physical counts by item and location.
3. Reconcile physical counts with ERP system quantities (future).
4. Generate Inventory Record Accuracy (IRA) and variance reports (future).
5. Post only approved adjustments to Odoo, then close the process (future).

The current scan/count POC remains the first vertical slice. Later stages must
not be implemented as automatic side effects of scanning or as hidden Phase 2
dependencies.

## Workflow stages

### 1. Scan items

Capture barcode, item identity, location, and quantity online. Offline capture
and synchronization are future scope for Phase 2. Required fields, supported
formats, and duplicate-scan behavior remain `TBD`.

### 2. Record physical counts

Save validated count records and synchronize them to a central database. Support
batch counting by location where confirmed. A physical count is the observed
quantity and must remain distinct from the ERP system quantity.

### 3. Analyze and reconcile

Match counts to the correct item and location, retrieve an ERP system quantity
(future; use a fixture or adapter stub before Odoo is available),
and calculate:

```text
variance = counted quantity - system quantity
```

- Negative: shortage
- Positive: overage
- Zero: match

A variance is a finding, not permission to change inventory. The reconciliation
screen should support investigation and an approval state where required.

### 4. Generate reports

Provide IRA summaries, variance breakdowns, item-level detail, and audit
support. Export to Excel or PDF only after format, filters, and accuracy-rate
formula are confirmed. The accuracy formula is currently `TBD`.

### 5. Post approved adjustments

Posting to Odoo is future scope and conditional on approval. When implemented,
the integration must preserve an
audit trail, handle failure and retry safely, avoid duplicate adjustments, and
verify the resulting balance before closure. The Odoo API/method, permissions,
rollback, and idempotency design are `TBD`.

## Core entities

| Entity | Purpose |
|---|---|
| Item | Product identity and barcode mapping |
| Location | Warehouse, aisle, bin, or confirmed location hierarchy |
| InventoryCount | Physical quantity observed for an item/location |
| SystemInventory | Quantity retrieved from Odoo |
| Reconciliation | Match between count and system quantity |
| Variance | Calculated difference and interpretation |
| Approval | Review decision and actor/audit context |
| Adjustment | Approved change prepared or posted to Odoo |
| Report | IRA summary and supporting detail |
| SyncOperation | Offline synchronization and retry status |
| AuditEvent | Immutable record of meaningful workflow actions |

Names are conceptual until the database schema is approved.

## State and control rules

Suggested states:

```text
Count: Draft -> Submitted -> Synced -> RecountRequired | Reconciled
Reconciliation: Pending -> UnderReview -> Approved | Rejected
Adjustment: Pending -> Posted | Failed | Reversed
```

These are proposals, not confirmed business rules. State transitions should be
server-validated and permission-checked; the client must not make an approved
or posted record appear valid by changing local state only.

## Required unresolved decisions

- item/barcode/Odoo product matching;
- location hierarchy and whether a count can span locations;
- duplicate scans and whether scans add to quantity or replace it;
- offline storage, synchronization, conflict resolution, and retry policy;
- quantity validation, units of measure, decimals, and negative values;
- variance thresholds requiring recount or approval;
- roles allowed to count, review, approve, post, reject, and close;
- IRA formula and report filters;
- Odoo integration API, authentication, rate limits, and idempotency key;
- audit retention and process closure checks.
