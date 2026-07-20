# Design

## Correct Column Mapping
The inserted Excel row must use the following relevant columns:

- K: course month.
- L: refund note, intentionally blank for new rows.
- N: parsed registration/payment note.

## Implementation
When writing each inserted row:

1. Preserve the existing K course-month behavior.
2. Explicitly set cell 12 (column L) to `null` so copied template content does not populate refund notes.
3. Set cell 14 (column N) to the parsed `entry.note`, or `null` when there is no note.

## Documentation
All user-facing field mapping documentation must show:

- L: refund note, kept blank by this tool.
- N: notes, written from the pasted source text.
