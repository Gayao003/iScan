# UI Standards and Component Library

The interface must look intentional and consistent across mobile PWA and
desktop web layouts. Agents should use shared components and established
patterns rather than inventing one-off CSS for each screen.

## Recommended UI tooling

Use the stack documented in [technology-stack.md](./technology-stack.md):

- Tailwind CSS for responsive styling and design tokens
- shadcn/ui for project-owned accessible primitives
- Radix UI primitives where shadcn/ui uses them
- Lucide React for a consistent icon set
- TanStack Table for sorting, filtering, visibility, and table state
- TanStack Query when server-state caching and refetching are needed
- React Hook Form and Zod for forms and validation
- date-fns for date formatting and range utilities

Install only the libraries required by a feature. Do not add a second component
library that duplicates shadcn/ui without a documented reason.

## Design-system rules

Define tokens centrally for color, spacing, typography, radius, shadows, and
status colors. Prefer Tailwind theme tokens and shared component variants.

- Use the same button variants everywhere (`primary`, `secondary`, `outline`,
  `destructive`, and `ghost` where needed).
- Use consistent status badges for `Draft`, `Pending`, `Approved`, `Rejected`,
  `Posted`, `Failed`, `Synced`, and `Offline`.
- Use semantic colors plus text or icons; color alone must not communicate meaning.
- Use a consistent page header with title, description, breadcrumbs, and actions.
- Use skeletons for known content shapes and clear empty states for no data.
- Keep touch targets at least 44 by 44 CSS pixels where practical.
- Avoid inline styles and page-specific CSS files unless a browser integration
  requires them.

## Navigation and back behavior

### Primary navigation

- Mobile: bottom navigation for the small set of primary destinations.
- Desktop: sidebar navigation with active route state and collapsible behavior
  only if it improves usability.
- Keep the same route model on both layouts; only the navigation presentation
  changes at responsive breakpoints.

### Back navigation

- Use the browser/router history for a normal Back action.
- Provide a visible contextual Back button on detail, review, and workflow
  screens where users need an obvious return path.
- Do not always send Back to the dashboard. Preserve the user's originating
  list, filters, page, and selected location when possible.
- Do not render both a redundant browser-style back control and a second
  identical contextual control in the same header.
- Unsaved count or approval changes must trigger a confirmation before leaving.

### Breadcrumbs

- Show breadcrumbs on desktop for nested workflows such as
  `Inventory > Counts > Reconciliation > Details`.
- Hide or simplify them on narrow mobile screens; the contextual Back control
  remains available.
- The current page is the final non-link breadcrumb.
- Breadcrumb labels must be human-readable, not raw IDs or database codes.
- Do not use breadcrumbs as the only navigation mechanism.

## Data-table standard

Use TanStack Table with shadcn/ui table primitives for operational datasets.
Do not hand-build a separate table pattern for each feature.

Every table should define:

- stable column identifiers and human-readable headers;
- sortable columns with visible sort direction;
- filter/search behavior appropriate to the dataset;
- pagination with page size selection and total/visible counts;
- loading skeleton, empty state, and error state;
- row selection only when the workflow supports a valid bulk action;
- responsive behavior: hide low-priority columns, allow horizontal scrolling,
  or switch to cards on small screens;
- keyboard-accessible controls and a clear focus indicator;
- a row action menu with a predictable placement;
- server-side pagination/filtering for large datasets.

For inventory and reconciliation tables, support as applicable:

- item and barcode;
- warehouse/location;
- system quantity;
- counted quantity;
- variance;
- variance interpretation;
- status and approval state;
- last updated timestamp;
- row-level detail/recount action.

Do not load an entire production dataset into the browser merely to paginate it.
Pagination, sorting, and filtering must be server-side once data volume requires it.

## Workflow-specific UI

- Count entry should make location and quantity prominent.
- Reconciliation should visually distinguish shortage, overage, and match while
  retaining text labels.
- Approval must show the source count, calculated variance, and audit context
  before an action is enabled.
- Future Odoo posting must be a deliberate action with confirmation, status
  feedback, idempotency protection, and a visible result. It is not a Phase 2
  action.
- Reports should provide summary cards, tables, and charts without hiding the
  underlying item-level data.

## Performance rules

- Lazy-load heavy charting, export, and scanner code when not needed at startup.
- Avoid large client-side table datasets.
- Reserve image dimensions to reduce layout shift.
- Keep the initial route focused on the scanner or the user's assigned workflow.
- Do not trade accessibility or error states for superficial visual minimalism.
