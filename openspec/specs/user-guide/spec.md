# User Guide Specification

## Purpose
The project SHALL include a user-facing guide that helps general users operate the Excel registration auto-fill tool without needing engineering knowledge.

## Requirements

### Discoverability
The repository README SHALL link to the user guide.

### Content Coverage
The user guide SHALL explain:

- The purpose of the tool.
- Pre-use checklist items, including `.xlsx` format and backup guidance.
- The main screen layout.
- The operating flow from selecting a workbook to writing Excel rows.
- Expected input text content.
- Preview checks before writing.
- Excel output column mapping.
- Troubleshooting and safe usage notes.

### Visual Aids
The user guide SHALL include visual aids such as diagrams or tables to help users understand the workflow, interface areas, and Excel output mapping.

### Current Behavior Alignment
The user guide SHALL reflect the current application behavior:

- The workbook selector accepts `.xlsx` files.
- The app writes to the first worksheet.
- New entries are inserted starting at row 3.
- Output fields include payment date, payment method, payment code, amount, name, course/session name, course total, course month, and notes.

### Maintainability
The guide SHALL be maintained in Markdown under `docs/` so it can be reviewed and updated with source changes.
