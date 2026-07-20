# Registration Parser Specification

## Purpose
The registration parser SHALL convert pasted registration/payment text into preview entries that match the intended Excel output.

## Requirements

### Labeled Money Fields
For labeled amount fields such as `總金額`, `总金额`, `第一期金額`, `第一期金额`, and `第一期`, the parser SHALL use the first money value in the field text.

The parser SHALL NOT concatenate all numbers from a descriptive amount line.

Examples:

- `總金額：$10460（團報優惠$10000、加購生理學說明$200）` SHALL parse total amount as `10460`.
- `總金額：10460（團報優惠10000）` SHALL parse total amount as `10460`.
- `第一期：$4600` SHALL parse installment amount as `4600`.

### Itemized Amounts
When `總金額` includes parenthesized item details, itemized course amounts SHALL continue to be parsed from each individual item.

### Preview Consistency
The preview received amount SHALL use the corrected total amount when the record is not an installment record.

When a non-installment record is split into multiple itemized entries, each entry's received amount SHALL equal that entry's course amount.

When an installment record is split into multiple entries, only the first entry SHALL receive the installment payment amount; later entries SHALL keep the received amount blank.
