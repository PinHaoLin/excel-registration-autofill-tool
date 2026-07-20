# Fix Note Column

## Summary
Correct the Excel output mapping so the parsed note is written to column N instead of column L.

## Motivation
Column L is reserved for refund notes and must remain blank for newly inserted registration rows. The current implementation writes the parsed note to column L, which overwrites the intended refund-note field. The correct destination for the parsed note is column N.

## Scope
- Update Excel writing logic to keep column L blank.
- Write parsed notes to column N.
- Update README, Markdown guide, Word guide, and OpenSpec current-state documentation.
- Push the fix to the configured GitHub repository.

## Out of Scope
- No changes to text parsing behavior.
- No changes to payment, amount, or course-month calculations.
- No changes to the Excel row insertion position.
