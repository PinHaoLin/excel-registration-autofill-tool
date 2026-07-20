# Design

## Component Boundaries
The React UI SHALL be organized around the existing screen sections:

- `Toolbar`: title area and primary write button.
- `InputPanel`: workbook selector, pasted registration text input, and inline validation message.
- `PreviewPanel`: parsed summary, parsed entry cards, and write status.
- `ResultMessage`: success, error, and idle status messages.

`App.jsx` SHALL keep orchestration state and IPC handlers, while delegating presentation to components.

## Parsing Module
Registration parsing and validation SHALL be moved into a utility module so UI components do not own parsing business rules.

The exported parsing API SHALL preserve the existing data shape:

- `parseRegistrationText(text)`
- `validateEntries(entries)`
- `SAMPLE_TEXT`

## Cleanup
Generated debug artifacts that are not needed for source review or user distribution MAY be removed. Ignored dependency/build directories SHALL not be deleted unless they are clearly temporary or harmful.

## Compatibility
The refactor SHALL preserve the existing CSS class names where practical so the current styling remains unchanged.
