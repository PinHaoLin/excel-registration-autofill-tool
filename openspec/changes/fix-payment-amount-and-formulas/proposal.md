# Fix Payment Amount And Formulas

## Summary
Update payment amount parsing/output rules and force workbook formulas to recalculate after rows are inserted.

## Motivation
Two user-facing issues remain:

1. When a registration is not an installment case, every generated row should use its own course/item amount as the received amount.
2. Excel formula cells, including installment-difference formulas in existing rows, may keep stale cached values until the user manually enters the formula cell. The workbook should request recalculation automatically after the tool writes rows.

## Scope
- For non-installment records, set each entry's received amount equal to its course amount.
- For installment records, keep the current behavior: first entry gets the installment amount and later entries keep the received amount blank.
- Request Excel workbook formula recalculation on open after writing.
- Update README, Markdown guide, Word guide, and OpenSpec current-state documentation.
- Rebuild the portable executable.

## Out of Scope
- No new UI workflow.
- No changes to workbook selection.
- No changes to the row insertion position.
