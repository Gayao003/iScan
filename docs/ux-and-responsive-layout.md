# UX and Responsive Layout

## Mobile experience

Mobile is the primary experience:

- Use a single-column layout with large touch targets.
- Keep the scan action prominent and reachable.
- Use bottom navigation only for destinations that actually exist, such as Scan,
  History, and Settings.
- Avoid placing essential controls behind hover states.
- Respect safe-area insets on devices with notches and home indicators.
- Keep camera guidance and permission explanations near the scanner.
- Use contextual Back controls on detail and workflow screens; preserve the
  originating list and filters when returning.
- Hide or simplify desktop breadcrumbs on narrow screens without removing the
  ability to navigate back.

## Desktop experience

Desktop should not imitate the mobile bottom bar:

- Use a sidebar or top navigation for Scan, History, and Settings.
- Keep the scanner centered with a reasonable maximum width.
- Support manual code entry when camera hardware is unavailable.
- Preserve the same domain behavior and result details as mobile.
- Use a consistent page header with title, description, breadcrumbs, and actions.
- Use a sidebar for primary navigation and data tables with sorting, filtering,
  pagination, loading, empty, and error states.

## Core screens

1. **Scan:** camera preview, scan frame, instructions, manual-entry fallback.
2. **Item result:** image, item identity, code, attributes, and next actions.
3. **Not found:** scanned code, explanation, retry, and manual correction option.
4. **History:** recent successful scans, if included in the POC.
5. **Settings/help:** permissions, supported formats, and app information.
6. **Counts:** item, location, quantity, scan status, and save/sync state.
7. **Reconciliation:** system quantity, counted quantity, variance, interpretation,
   review, and approval state.
8. **Reports:** IRA summary, variance breakdown, charts, and item-level detail.
9. **Adjustment review (future):** approved changes, Odoo posting status, and
   audit trail.

## State requirements

Every screen must define: initial, loading, success, empty, error, and retry
behavior where applicable. Do not leave a blank screen when a permission, network,
or catalog operation fails.

## Accessibility

- Provide a text label for every icon-only control.
- Announce scan success and errors to assistive technology.
- Ensure focus is moved sensibly after navigation and result loading.
- Do not rely on color alone to communicate status.
- Provide a non-camera path for users who cannot or do not want to use a camera.
- Use shared components rather than one-off visual patterns. See
  [ui-standards-and-component-library.md](./ui-standards-and-component-library.md).

## Installability

The app should provide a normal browser install experience. Do not block core
functionality behind an install prompt, because iOS and Android browser support
and prompt behavior differ.
