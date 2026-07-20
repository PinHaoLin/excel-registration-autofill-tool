# Design

## User Audience
The guide targets general office users who know how to prepare an Excel workbook and copy payment or registration text, but may not understand the application internals.

## Document Structure
The guide will use the following structure:

1. What the tool does.
2. Before starting checklist.
3. Main screen layout diagram.
4. Step-by-step operating flow.
5. Input text example and field explanation.
6. Excel output column mapping.
7. Validation and troubleshooting.
8. Safe usage notes, including backup guidance.

## Visual Approach
Because the guide is Markdown-based and should remain easy to maintain in the repository, diagrams will be embedded using Mermaid and simple Markdown tables rather than binary screenshots. This keeps the guide portable and editable while still providing visual structure.

## Behavioral Source
The guide reflects current implementation behavior:

- Users select a `.xlsx` workbook through the app.
- Users paste registration or payment text into the input area.
- The app parses and previews one or more entries.
- The app inserts rows starting at row 3 in the first worksheet.
- The app writes payment date, method, payment code, amount, name, course/session name, course total, course month, and note fields.
