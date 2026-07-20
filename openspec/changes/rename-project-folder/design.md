# Design

## Target Name
The GitHub-ready project folder name is `excel-registration-autofill-tool`.

## Naming Rules
The folder name uses:

- Lowercase English words.
- Hyphen separators.
- A descriptive repository-style name that communicates Excel registration auto-fill behavior.

## Operational Constraint
Windows may prevent renaming the active workspace folder while Codex, a terminal, or another process has an open handle inside the folder. If that happens, the rename must be retried after closing the process that holds the folder.

## Fallback
If the live rename is blocked, provide a repeatable script that performs the same rename after the workspace is no longer in use.
