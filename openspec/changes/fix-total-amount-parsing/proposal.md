# Fix Total Amount Parsing

## Summary
Fix registration total amount parsing so the total amount field uses only the first money value after the `總金額` label.

## Motivation
When a pasted `總金額` line includes both the total and itemized amounts, such as `總金額：$10460（團報優惠$10000、加購...$200）`, the current parser strips all non-numeric characters from the entire line. This concatenates every number into one invalid amount. General users see an incorrect received amount in the preview.

## Scope
- Parse `總金額` / `总金额` by extracting the first money value from the field text.
- Preserve itemized amount parsing inside parentheses.
- Validate the provided case resolves total amount to `10460`.
- Rebuild the packaged executable.

## Out of Scope
- No changes to Excel write columns.
- No changes to payment-date parsing.
- No changes to the app layout beyond values displayed from corrected parsing.
