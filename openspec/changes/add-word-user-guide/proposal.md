# Add Word User Guide

## Summary
Create a Word `.docx` version of the user guide for the Excel registration auto-fill tool.

## Motivation
Some general users are more comfortable reading, printing, or sharing Word documents than Markdown files. The Word guide should restate the tool workflow in clean Traditional Chinese and include an explicit Windows trust warning for unsigned or unknown-source application prompts.

## Scope
- Add a Word `.docx` user guide under `docs/`.
- Include step-by-step operating instructions, tables, checklists, and visual workflow diagrams.
- Add a section explaining that Windows may show an unknown-source or publisher warning, and users may need to trust/allow the application if it came from the internal project owner.
- Update documentation discoverability where appropriate.

## Out of Scope
- No application logic changes.
- No installer signing changes.
- No GitHub release publishing changes.
