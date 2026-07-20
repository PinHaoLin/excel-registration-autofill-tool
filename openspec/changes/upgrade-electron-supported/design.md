# Design

## Runtime Upgrade
The application should use `electron@43.1.1`, the current npm-published Electron stable version at the time of the change.

## Distribution Behavior
The portable executable produced by `electron-builder` bundles the Electron runtime, Chromium, Node runtime used internally by Electron, built frontend assets, and app code. End users do not need to install Node.js, Vite, or Electron separately.

## Validation
Run:

- `npm install` after updating the Electron dependency.
- `npm run build`.
- `npm run dist`.

The final packaged executable for this historical change was `release/Excel自動填寫工具-0.1.0.exe`; later release-version changes may produce newer artifact names.
