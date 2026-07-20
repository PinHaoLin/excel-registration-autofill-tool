# Design

## Root Cause
`normalizeMoney(totalLine)` is appropriate only when the input is a single amount. It is unsafe for a descriptive line that contains multiple amounts because it removes non-numeric text and joins all digits together.

## Parser Rule
For labeled amount fields where only the primary amount should be used, the parser SHALL extract the first money value from the field text.

Examples:

- `總金額：$10460（團報優惠$10000、加購生理學說明$200）` -> `10460`
- `總金額：10460（團報優惠10000）` -> `10460`
- `第一期：$4600` -> `4600`

## Itemized Amounts
The parser SHALL continue to parse amounts inside the parenthesized item list separately for course/item totals.

## Validation Case
For the provided pasted text, the parsed summary total amount and first entry received amount SHALL be `10460`.
