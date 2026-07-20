# App Result Message Specification

## Purpose
The app SHALL show result messages that are understandable to general users.

## Requirements

### Idle State
Before writing to Excel, the result area SHALL explain that the user should select an Excel file, paste registration/payment text, confirm the preview, and press the write button.

### Success State
After a successful Excel write, the result area SHALL show a plain-language success message instead of raw JSON.

The success state SHALL include:

- Inserted row count.
- Worksheet name.
- Starting row.
- Output file name.
- Output file path.

### Error State
When writing fails, the result area SHALL say the write did not complete and show the error message as support information.

### Presentation
The result area SHALL use normal UI typography and compact key/value rows instead of monospaced JSON output.
