# Design

## Result States
The result area should support three user-facing states:

- Idle: tell the user to select an Excel file, paste data, confirm preview, and press write.
- Success: confirm the Excel file was updated and show concise details.
- Error: explain that writing did not complete and show the error text as support information.

## Success Details
The success state should show:

- Number of inserted rows.
- Worksheet name.
- Starting row.
- Output file name and full path.

## Presentation
The result area should use normal interface typography and compact key/value rows instead of monospaced JSON. This avoids making the successful state look like a crash log.
