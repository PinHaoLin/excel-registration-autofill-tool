# React UI Structure Specification

## Purpose
The React frontend SHALL keep screen orchestration, reusable UI sections, and registration parsing concerns separated so future UI changes remain easy to maintain.

## Requirements

### App Orchestration
`src/App.jsx` SHALL own application state, parsed data memoization, validation state, workbook selection, and write-to-Excel IPC calls.

`src/App.jsx` SHALL delegate visible screen sections to components instead of containing the full page markup.

### Components
The UI SHALL organize the main screen into focused components under `src/components/`:

- `Toolbar` for the title area and primary write button.
- `InputPanel` for workbook selection, pasted text input, and inline validation.
- `PreviewPanel` for parsed summary, parsed entry cards, and status placement.
- `ResultMessage` for idle, success, and error write states.

Components SHALL preserve the existing user-facing labels and CSS class names unless a deliberate UI change is specified.

### Parser Utility
Registration parsing and validation logic SHALL live outside UI components under `src/utils/registrationParser.js`.

The parser utility SHALL export:

- `SAMPLE_TEXT`
- `parseRegistrationText(text)`
- `validateEntries(entries)`

### Cleanup
Generated debug files that are not needed for source control or user distribution SHALL be removed when discovered.

Ignored build and dependency directories MAY remain locally because they are reproducible or required for local development.
