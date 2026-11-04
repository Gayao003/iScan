# Data Model and API Contract

## Domain item

The initial item shape should be deliberately small:

```json
{
  "id": "item-123",
  "code": "0123456789012",
  "name": "Example item",
  "imageUrl": "https://example.test/items/item-123.jpg",
  "description": "Optional short description",
  "attributes": {
    "category": "Example"
  }
}
```

Required fields are `code`, `name`, and `imageUrl` unless the supervisor changes
that decision. Optional fields must not break the result view when absent.

## Inventory count

The inventory workflow requires a separate count record rather than adding
quantity directly to the item:

```json
{
  "id": "count-123",
  "itemId": "item-123",
  "code": "0123456789012",
  "locationId": "aisle-1",
  "countedQuantity": 120,
  "status": "submitted",
  "capturedAt": "2026-11-04T05:00:00Z"
}
```

The exact location hierarchy, units of measure, decimal rules, and count status
are `TBD`.

## Reconciliation

```json
{
  "itemId": "item-123",
  "locationId": "aisle-1",
  "systemQuantity": 120,
  "countedQuantity": 120,
  "variance": 0,
  "interpretation": "match",
  "approvalStatus": "pending"
}
```

The server should calculate variance rather than trusting a client-supplied
value. An approved adjustment must be a separate record and must not be implied
by a successful scan or count submission.

## Lookup contract

Suggested endpoint:

```text
GET /api/items/by-code/{encodedCode}
```

Expected outcomes:

- `200`: item payload
- `404`: valid code, no matching item
- `400`: malformed or unsupported code
- `401/403`: authentication or authorization required
- `429`: rate limited
- `5xx` or network failure: service unavailable

The frontend should map these outcomes to user-safe messages and actions. It
should not display raw server errors or assume that every failure means "not found."

## Mock data

Until a real catalog is confirmed, use a small fixture or mock adapter that
contains known demonstration codes. Keep the mock behind the same catalog
interface as the future API.

## Normalization rules

Document the exact rules when confirmed:

- trim surrounding whitespace
- preserve or normalize letter case: `TBD`
- preserve leading zeroes
- reject empty values
- encode the code safely for a URL

## Image behavior

- Provide useful alt text based on the item name.
- Show a placeholder when an image is missing or fails to load.
- Do not treat an image URL as trusted HTML.
- Define allowed image hosts and caching rules before production use.
