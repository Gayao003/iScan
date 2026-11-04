# Product Brief

## One-sentence concept

iScan is an installable, mobile-first PWA that uses a phone camera to scan
inventory items, record counts by location, reconcile them against system
quantities, and support reporting and approved ERP adjustments.

## Problem

Users need a fast way to identify an item from a machine-readable code without
installing a platform-specific app or manually typing a code.

## POC goal

Prove the complete happy path:

1. Open iScan on a supported mobile browser.
2. Grant camera access.
3. Scan a supported barcode or QR code.
4. Resolve the code against a catalog.
5. Display the item details and image.

The current Phase 2 vertical slice should stop after item lookup, count capture,
and persistence in Supabase PostgreSQL. ERP reconciliation, reporting, approvals,
MSSQL connectivity, and Odoo posting are future stages and must remain explicit
workflow actions.

## Target users

- Primary: staff or operators identifying cataloged items in the field.
- Secondary: desktop users reviewing an item by entering a code manually.
- Development: AI agents and an orchestrator who need clear project constraints.

## Explicitly out of scope for the first POC

- Native Android or iOS applications
- Offline catalog synchronization
- Complex inventory transactions
- Automatic posting of adjustments after scanning
- MSSQL or Odoo connectivity in Phase 2
- Payments, ordering, or checkout
- Facial recognition or unrelated computer-vision features
- Final branding and production-grade analytics
- Assuming a specific backend before the data source is confirmed

## Success signals

- A real device can request camera permission and scan a supported code.
- A known code shows the correct item image and details.
- An unknown code produces a clear recovery action.
- The app remains usable on a desktop without camera access.
- The PWA can be installed from a supported browser.
- Count records can be persisted in Supabase PostgreSQL.
