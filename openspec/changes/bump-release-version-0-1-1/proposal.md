# Bump Release Version 0.1.1

## Summary
Bump the packaged application release from `0.1.0` to `0.1.1` and rebuild the Windows portable executable.

## Motivation
The executable still uses the `0.1.0` artifact name even though multiple user-facing fixes have been shipped. End users may confuse older and newer files when receiving the tool through ZIP or LINE. A patch version bump makes the fixed executable easier to identify and support.

## Scope
- Update the project package version to `0.1.1`.
- Update user-facing documentation references from `Excel自動填寫工具-0.1.0.exe` to `Excel自動填寫工具-0.1.1.exe`.
- Regenerate the Word user guide from the repeatable builder.
- Rebuild the portable Windows executable.

## Non-Goals
- No feature behavior changes.
- No installer/signing workflow changes.
