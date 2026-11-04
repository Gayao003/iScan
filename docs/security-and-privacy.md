# Security and Privacy

## Camera privacy

- Request camera access only in response to a clear user action.
- Explain the purpose before requesting permission.
- Stop camera tracks when scanning ends.
- Do not store or transmit raw camera frames for the POC.
- Provide a manual-entry alternative.

## Input and output safety

- Treat scanned codes and manual input as untrusted data.
- Validate length, format, and allowed characters before lookup.
- URL-encode path parameters.
- Render catalog values as text, not injected HTML.
- Validate image URLs and use a safe image loading policy.

## Network and storage

- Use HTTPS outside local development.
- Do not put secrets in frontend code or environment values exposed to the browser.
- Do not store sensitive catalog or user data in local storage without an explicit
  retention decision.
- If scan history is added, define deletion and retention behavior first.
- Avoid logging full codes if codes could identify sensitive items.

## Authentication

Authentication is `TBD`. If it is introduced:

- keep tokens out of URLs;
- use the repository's approved auth pattern;
- protect private API responses from service-worker caching;
- handle expired sessions visibly.

## Threats to consider

- malicious QR content being mistaken for a trusted item code;
- reflected or stored XSS through catalog fields;
- leaking private item data through browser caches or history;
- denial of service through repeated camera detections or lookup requests.

## Reporting

Errors should be useful to the user but should not reveal stack traces, secrets,
internal URLs, or sensitive payloads.

