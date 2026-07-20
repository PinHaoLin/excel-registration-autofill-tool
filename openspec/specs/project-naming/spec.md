# Project Naming Specification

## Purpose
The project SHALL use a GitHub-compatible repository name for publication.

## Target Repository Name
The target project and repository name SHALL be:

`excel-registration-autofill-tool`

## Rename Support
The project SHALL provide a repeatable rename helper script when the active workspace folder cannot be renamed live because Windows reports that it is in use.

## Rename Helper
The helper script SHALL:

- Resolve the current project folder from the script location.
- Refuse to overwrite an existing `excel-registration-autofill-tool` folder.
- Rename the project folder to `excel-registration-autofill-tool`.
- Exit successfully if the project is already using the target name.

## Operational Note
On Windows, users may need to close Codex, terminals, editors, or File Explorer windows opened inside the project before the folder can be renamed.
