# Add User Guide

## Summary
Create a user-facing guide that explains how non-technical users can operate the Excel auto-fill tool from start to finish.

## Motivation
The tool currently has implementation files and a brief developer README, but general users need a clearer document with visual structure, workflow steps, input examples, Excel output mapping, validation notes, and troubleshooting guidance.

## Scope
- Add a Markdown user guide under `docs/`.
- Include visual aids such as flow diagrams, interface layout diagrams, and tables.
- Explain the expected input text, Excel workbook requirements, preview confirmation, and final write operation.
- Link the guide from `README.md` so users can discover it easily.

## Out of Scope
- No runtime behavior changes.
- No parser or Excel writing logic changes.
- No packaging or installer changes.
