# Handle Broken Shared Formulas

## Summary
Prevent Excel writing from failing when a workbook contains shared formulas that ExcelJS cannot translate.

## Motivation
Some workbooks can contain shared-formula relationships where a formula cell points to a master formula that is missing or cannot be resolved after row insertion. ExcelJS throws `Cannot read properties of undefined (reading 'replace')` when accessing `cell.formula` in that state. Users see the write operation fail even though the workbook could otherwise be updated.

## Scope
- Add safe formula access around formula cloning and shared-formula normalization.
- Convert unresolvable shared formulas to their cached result or blank value instead of throwing.
- Keep valid formulas copied and shifted as before.
- Validate with a workbook containing an unresolvable shared formula.
- Rebuild the packaged executable.

## Out of Scope
- No changes to parsing behavior.
- No changes to Excel column mapping.
- No attempt to reconstruct broken formulas without an available master formula.
