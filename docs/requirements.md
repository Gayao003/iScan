# Requirements

Requirements are grouped by priority so the POC remains small and demonstrable.

## Must have

- **R1:** A user can start and stop a camera scanner.
- **R2:** The scanner can recognize the agreed barcode and QR formats.
- **R3:** Camera permission states are explained to the user.
- **R4:** A successful scan produces a normalized code value.
- **R5:** The app looks up the code in a catalog.
- **R6:** A matched result displays item name, code, image, and configured details.
- **R7:** Unknown, invalid, and lookup-failure states are distinguishable.
- **R8:** A user can retry, scan another item, or enter a code manually.
- **R9:** The UI is responsive and touch-friendly.
- **R10:** The PWA includes a manifest, service-worker strategy, icons, and installable
  shell.
- **R11:** Desktop users get a usable layout and a sidebar or equivalent navigation.
- **R12:** Mobile users get a bottom navigation experience when navigation is needed.
- **R13:** Users can record a physical quantity for an item and location.
- **R14:** The system distinguishes physical count quantity from ERP system quantity.
- **R15:** The system calculates variance as counted quantity minus system quantity.
- **R16:** Future workflow stages support review before any approved adjustment is
  posted; no ERP posting is part of Phase 2.
- **R17:** Operational tables provide sorting, filtering, pagination, and responsive
  behavior.
- **R18:** Navigation provides contextual Back behavior and adaptive breadcrumbs.

## Should have

- Recent scan history stored locally.
- A demo catalog fixture for development and demonstrations.
- A detail view that can be shared by URL.
- Loading, empty, offline, and API error states.
- Keyboard-accessible controls and visible focus states.

## Could have

- Flashlight toggle where the browser and device support it.
- Search and filtering of the catalog.
- Optional authenticated catalog access.
- Install prompts and update notifications.
- Inventory counts by location with online/offline synchronization.
- IRA reports with export to Excel/PDF.
- Odoo adjustment integration after approval (future phase).

## Non-functional requirements

- **Performance:** show scanner UI quickly and avoid unnecessary camera restarts.
- **Privacy:** camera data is used only for scanning; do not upload frames by default.
- **Accessibility:** meet WCAG 2.2 AA intent for controls, contrast, labels, and focus.
- **Compatibility:** validate supported modern Android and iOS browsers explicitly.
- **Reliability:** every request and scan state has a visible user outcome.
- **Maintainability:** keep scanner, catalog, UI, and PWA concerns separately testable.
- **Consistency:** use shared UI components and documented table/navigation patterns.
- **Auditability:** preserve actor, timestamp, source data, approval, posting, and
  synchronization information for workflow actions.

## TBD requirements

The supervisor must confirm the catalog source, supported symbologies, item fields,
authentication, retention rules, deployment environment, location model, offline
sync rules, variance thresholds, IRA formula, approval roles, and future Odoo
integration.
