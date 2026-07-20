# Design

## Failure Mode
ExcelJS can throw while reading `cell.formula` for shared formulas when the shared formula master cannot be resolved. The failure happens before our code has a chance to write the workbook.

## Safe Formula Access
Formula reads SHALL go through a helper that catches ExcelJS translation errors.

If a formula can be read:

- Keep existing formula-copying and row-shifting behavior.

If a formula cannot be read:

- Use the cached result when available.
- Otherwise write `null`.
- Continue processing the workbook.

## Shared Formula Normalization
Shared formulas SHALL be normalized before writing where possible. Unresolvable shared formulas SHALL not block the registration write.

## Tradeoff
For cells with broken shared formula references, the tool may preserve the last cached value instead of preserving the formula. This is preferable to failing the entire user operation.
