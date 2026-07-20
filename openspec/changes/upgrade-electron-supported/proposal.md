# Upgrade Electron Supported

## Summary
Upgrade Electron from the unsupported 33.x line to the currently supported 43.x line and rebuild the portable Windows executable.

## Motivation
Electron 33.x is no longer supported by the Electron project. The packaged executable should use a supported Electron runtime before being distributed to general users.

## Scope
- Upgrade the `electron` development dependency to `43.1.1`.
- Rebuild the production frontend and portable Windows executable.
- Verify the packaged app can be produced successfully.
- Document that end users do not need Node.js, Vite, or a separate Electron install to run the packaged `.exe`.

## Out of Scope
- No app feature changes.
- No code-signing certificate setup.
- No installer target changes beyond the existing portable executable.
