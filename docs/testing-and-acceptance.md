# Testing and Acceptance

## Test layers

- **Unit:** code normalization, validation, lookup-result mapping, state reducers.
- **Component:** scanner states, result states, errors, empty states, accessibility.
- **Integration:** scanner adapter events flowing into catalog lookup.
- **End-to-end:** open app, grant camera, scan fixture, view item result.
- **Device smoke:** at least one supported Android browser and one supported iOS
  browser when access to those devices is available.

## POC acceptance checklist

- [ ] App loads in a current desktop browser.
- [ ] App loads on a current Android mobile browser.
- [ ] App loads on a current iOS mobile browser when tested.
- [ ] Scanner explains camera permission before requesting it.
- [ ] A supported QR code produces a result.
- [ ] The agreed 1D barcode produces a result, if required.
- [ ] Duplicate detections do not trigger duplicate lookups.
- [ ] Known code displays image, name, and code.
- [ ] Unknown code offers retry and manual entry.
- [ ] Denied/unavailable camera still permits manual lookup.
- [ ] Network failure has a clear recovery path.
- [ ] Desktop navigation uses a sidebar or equivalent non-mobile layout.
- [ ] Mobile navigation uses the agreed bottom navigation behavior.
- [ ] PWA manifest and icons are valid.
- [ ] Service-worker behavior does not expose private data.
- [ ] Keyboard and screen-reader basic flows are usable.
- [ ] Shared navigation uses contextual Back behavior and adaptive breadcrumbs.
- [ ] Inventory tables support sorting, filtering, pagination, responsive layout,
  loading, empty, and error states.
- [ ] Counted quantity remains distinct from system quantity.
- [ ] Variance equals counted quantity minus system quantity.
- [ ] Future reconciliation cannot post to Odoo without the required approval.
- [ ] Future synchronization or posting can be retried without duplicate records.
- [ ] Phase 2 persists count records using the Supabase PostgreSQL environment.

## Test fixtures

Keep at least these fixtures:

- one known QR code;
- one known 1D barcode, if supported;
- one syntactically valid but unknown code;
- one malformed manual input;
- one item with a missing image;
- simulated permission, network, and server failures.

## Definition of done for a feature

The feature is not done until its requirement is documented, its error states
are implemented, focused tests pass, and the relevant acceptance checkbox can be
verified on the target layout.
