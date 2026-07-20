# Design

## Non-Installment Payment Amounts
When `isInstallment` is false, each generated entry SHALL use its own `courseTotal` as `amount`.

Example:

- Item 1 course total `10000` -> received amount `10000`.
- Item 2 course total `200` -> received amount `200`.

## Installment Payment Amounts
When `isInstallment` is true, the first generated entry SHALL use the parsed installment amount, and later generated entries SHALL leave received amount blank.

## Formula Recalculation
After inserting rows and writing cells, the workbook SHALL request full recalculation when Excel opens the file.

The implementation should set the ExcelJS-supported workbook calculation property:

- `fullCalcOnLoad: true`

This keeps copied and shifted formulas from showing stale cached results.

## Documentation
All user-facing documents SHALL state:

- Non-installment records write received amount equal to course amount for each generated row.
- Installment records write the installment payment only on the first generated row.
- Formula columns are intended to recalculate automatically when the Excel file is opened.
