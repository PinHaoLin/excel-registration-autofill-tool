# Excel Workbook Output Specification

## Purpose
The workbook writer SHALL insert parsed registration entries into the target Excel workbook while preserving workbook formulas and layout.

## Requirements

### Row Insertion
The writer SHALL insert new rows starting at row 3 of the first worksheet.

### Amount Columns
Column E SHALL receive the parsed received amount for each entry.

Column H SHALL receive the course amount for each entry.

For non-installment entries, column E SHALL equal column H for each generated row.

For installment entries, column E SHALL be populated only for the first generated row unless a future requirement defines later installment rows.

### Formula Recalculation
After writing rows, the workbook SHALL request full formula recalculation when Excel opens the file.

The writer SHALL set the workbook calculation property `fullCalcOnLoad` so Excel recalculates formulas when the file is opened.

### Shared Formula Safety
The writer SHALL not fail the entire registration write when ExcelJS cannot resolve a shared formula.

When a shared formula cannot be resolved, the writer SHALL preserve the cached result if available, otherwise write a blank value.

### Notes Columns
Column L SHALL remain blank for refund notes.

Column N SHALL receive parsed notes from the pasted registration/payment text.
