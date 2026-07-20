# Componentize React UI

## Summary
Refactor the React UI into smaller managed components while preserving the current application behavior.

## Motivation
`src/App.jsx` currently contains parsing helpers, validation logic, result rendering, and the full screen markup in one file. Splitting the UI into focused components makes future changes easier to review, test, and maintain.

## Scope
- Move user interface sections into dedicated React components.
- Move registration parsing and validation helpers out of `App.jsx`.
- Keep the existing visual layout, labels, validation behavior, and IPC calls unchanged.
- Remove clearly unnecessary generated/debug files that are not part of source control or distribution.

## Non-Goals
- No change to Excel writing behavior.
- No redesign of the UI.
- No version bump or executable repackaging unless separately requested.
