# User Guide Specification

## Purpose
The project SHALL include a user-facing guide that helps general users operate the Excel registration auto-fill tool without needing engineering knowledge.

## Requirements

### Discoverability
The repository README SHALL link to the user guide.

The repository README SHALL also link to the Word `.docx` version when it is available.

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
- Windows unknown-source or unsigned publisher prompts, including the need to confirm the file source before allowing execution.
- Packaged executable runtime requirements, including that end users do not need Node.js, Vite, or Electron installed.

### Visual Aids
The user guide SHALL include visual aids such as diagrams or tables to help users understand the workflow, interface areas, and Excel output mapping.

### Word Version
The project SHALL provide a Word `.docx` user guide under `docs/` for users who prefer opening, printing, or sharing Word documents.

The Word version SHALL be written in clean Traditional Chinese and SHALL include the same core operating guidance as the Markdown guide.

### Current Behavior Alignment
The user guide SHALL reflect the current application behavior:

- The workbook selector accepts `.xlsx` files.
- The app writes to the first worksheet.
- New entries are inserted starting at row 3.
- Output fields include payment date, payment method, payment code, amount, name, course/session name, course total, course month, refund note, and notes.
- Column L is the refund-note field and SHALL remain blank when this tool inserts new rows.
- Column N is the parsed note field and SHALL receive notes from the pasted source text.

### Maintainability
The guide SHALL be maintained in Markdown under `docs/` so it can be reviewed and updated with source changes.

The Word guide SHALL be generated from a repeatable builder script so future updates can be reproduced.
