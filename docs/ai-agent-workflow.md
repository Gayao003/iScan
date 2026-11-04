# AI Agent Workflow

This project is intended to be implemented with AI coding agents under human
orchestration. Agents must optimize for traceability and small, verifiable steps.

## Before coding

1. Read `README.md`, `product-brief.md`, `requirements.md`, and the relevant
   technical document. For UI work, also read
   `ui-standards-and-component-library.md`; for inventory work, read
   `inventory-domain-and-workflow.md` and the source workflow document.
2. Inspect the existing source and package scripts.
3. Identify the requirement IDs being changed.
4. Check `decision-log.md` for unresolved assumptions.
5. State any missing supervisor decision instead of silently inventing one.

## During coding

- Make one coherent change at a time.
- Reuse existing helpers and project conventions.
- Keep browser, scanner, catalog, and UI responsibilities separated.
- Add or update tests with behavior changes.
- Preserve useful error information while avoiding sensitive logs.
- Do not add a dependency without explaining why it is needed.
- Do not make native-platform assumptions that contradict the PWA direction.

## After coding

1. Run the smallest relevant formatter, linter, type check, and test command.
2. Verify the actual user flow, not only a unit-level proxy.
3. Review mobile and desktop behavior when layout changes.
4. Update documentation and the decision log if behavior or assumptions changed.
5. Report changed files, validation commands, failures, and remaining `TBD`s.

## Prompt template

```text
Read docs/README.md, docs/product-brief.md, docs/requirements.md, and the
technical docs relevant to this task. For UI or inventory work, also read the
corresponding standards/workflow documents. Implement requirement R<number>: <goal>.
Do not invent unresolved supervisor decisions. Preserve the scanner/catalog
boundaries, handle loading/error/empty states, add focused tests, run the
smallest relevant checks, and report files changed plus validation results.
```

## Agent handoff format

```text
Implemented:
- Requirement IDs:
- Files changed:
- Behavior:
- Tests/checks:
- Known limitations:
- Decisions needing supervisor input:
```

## Guardrails

Agents must not commit secrets, upload camera frames by default, remove the
manual-entry fallback, or change the PWA direction without an explicit decision.
