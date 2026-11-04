# Scanning and Camera Behavior

## Supported input

The final list of barcode symbologies is `TBD`. Confirm it with the supervisor
before optimizing a library configuration. The initial POC should support at
least one 2D format (QR) and the agreed 1D format if required.

## Permission states

Handle these states explicitly:

- **Not requested:** explain why the camera is needed and offer Start scanning.
- **Granted:** initialize the preview and scanning stream.
- **Denied:** explain how to enable permission in browser settings and offer
  manual entry.
- **Unavailable:** explain that the device/browser cannot provide a camera.
- **Error:** show a retry action and a useful diagnostic without exposing internals.

## Scan lifecycle

- Start the camera only when the scanner view is active.
- Stop tracks when leaving the scanner view or when scanning is paused.
- Debounce duplicate detections from the same frame sequence.
- Pause scanning after a valid code until lookup handling is complete.
- Normalize whitespace and define case sensitivity for code values.
- Never upload camera frames unless a later requirement explicitly demands it.

## Browser constraints

- Camera access normally requires HTTPS or localhost.
- iOS and Android browser capabilities vary; test on actual devices.
- A PWA does not remove browser permission rules.
- The app must remain useful when camera access is unavailable.r

## Adapter contract

Keep the scanner library behind an adapter with operations equivalent to:

```text
start(videoElement, formats, onDetected, onError)
pause()
resume()
stop()
```

The application layer should receive normalized scan events, not library-specific
objects. This makes the library replaceable and unit tests deterministic.

