# User Friendly Result Message

## Summary
Replace the developer-oriented JSON result output with a user-friendly status message in the app preview/result area.

## Motivation
The current result display shows raw JSON after a successful Excel write. This is useful for developers, but general users may mistake it for an error or broken state. The app should show plain-language success, idle, and error states.

## Scope
- Replace raw JSON rendering in the result area.
- Show a success summary with inserted count, sheet name, starting row, and output file.
- Show a calm idle message before writing.
- Show a user-friendly error message when writing fails.
- Rebuild the packaged executable.

## Out of Scope
- No changes to parsing behavior.
- No changes to Excel column mapping.
- No changes to workbook write behavior.
