# Turkish interface

Based on `7777e51`, on `feat/turkish-language`.

## Change

- Add a Turkish catalog covering the union of the existing Spanish, Simplified Chinese,
  Traditional Chinese and Japanese catalogs, preserving every numbered argument.
- Register `tr` in the existing renderer language owner. Setup offers a Turkish flag with
  the native accessible name `Türkçe`; Appearance offers the same language in its dropdown.
  Both use the existing `cos.ui.language` preference, including renderer reloads.
- Localize elapsed-work minutes through the existing `{0}m` label, so Turkish uses `dk`.
- Apply the selected locale when folding settings searches, so Turkish `İ/i` and `I/ı`
  match correctly without changing the displayed text.
- Extend catalog, preference, draft-preservation and elapsed-work regression coverage.
  Extend the isolated Setup layout check to six flags and Turkish at normal, narrow and
  enlarged zoom, including native keyboard selection and persistence.

English remains the default. Authored messages, drafts, file paths, tool/model identifiers,
unknown errors and successful IPC data stay literal. Backend configuration, permissions,
browser pairing, extension protocol, dependency versions and release versions are unchanged.

## Validation

Validated on Windows with Node 24.19.0 and the lockfile dependencies installed by `npm ci`.

- The Turkish catalog has all **1,431** source keys, no empty values and matching numbered
  placeholders. A separate wording review checked permission, deletion, delivery and
  continuation messages, plus references to the app's own buttons.
- `npx vitest run test/renderer-i18n test/renderer-layout.test.ts test/renderer-timeline.test.ts`:
  **7 files / 252 tests passed**.
- `npm run typecheck`, `npm run build`, `npm run verify:privacy`, `npm run verify:notices`
  and `git diff --check` passed.
- `electron scripts/verify-setup-guide.cjs`: **72 setup/header layout checks passed**,
  including Turkish at 1100px, 1100px with 150% zoom, and 640px; native keyboard selection,
  persisted Turkish after reload, modal dismissal/focus restoration and optional disclosure
  also passed. Inspected narrow/dark and enlarged/light screenshots, including guide callouts.
  The fixture uses isolated user data and production renderer modules/styles; it starts no
  app backend, tunnel or provider session. Screenshots and results stay under ignored `outputs/`.

The full `npm run verify` passed its preparation/privacy/notices/typecheck gates, but its
main test phase finished with **215 files / 5,785 tests passed, 4 files / 5 tests failed,
and 5 files / 46 tests skipped**. The full gate is therefore **not green**.

Three failures were reproduced independently on an untouched `7777e51` worktree with the
same dependencies and Windows environment. Their tests and main-process implementation
are unchanged by this contribution:

- `mcp`: `scopes parser recovery to its failed batch command after an earlier mutation`.
  The host returns a Turkish PowerShell `ScriptBlock.Create` exception; the existing
  parser-recovery matcher expects its English wrapper, so the expected recovery note is absent.
- One native Windows integration failure each in `computer-windows-accessibility` and
  `computer-browser-uia`; detailed local diagnostics are excluded from this contribution.

Two `plugins-manager` tests also failed in the full parallel run: the pending-restart
credential gate did not arrive within its wait, and the following slow-startup test timed out.
Both passed together when isolated on untouched `7777e51` and on the completed contribution
tree (**2 tests passed** in each run); their source is unchanged.

Because the failed main phase stops the `&&` chain, the final serial stage was run explicitly:
`npx vitest run --maxWorkers=1 test/computer.test.ts test/mcp-shutdown.test.ts`:
**2 files / 26 tests passed**.

## Local Windows release acceptance

- `npm run dist:x64` passed and produced the Windows x64 NSIS installer for **2.1.14**
  from the contribution tree. Generated packages and host-specific notice changes are
  excluded from the source contribution.
- `node scripts/smoke-packaged-runtime.mjs --platform win32 --arch x64` passed against
  both the unpacked release and the actual installed application. Electron 44.3.0, Sharp
  0.35.4/libvips 8.18.6, PTY execution, tree-sitter and bundled executable checks passed.
- The per-user silent installer exited **0**. All **288 packaged files** matched their
  installed copies by SHA-256. The live executable and packaged renderer identities were
  verified before exercising the actual language control.
- Turkish selection, native option/flag synchronization and translated labels passed in the
  installed application. The preference survived renderer reload and full application restart.

Private installation evidence and acceptance helpers stay outside the contribution. The
existing full-suite limitations above still apply; packaging and installed runtime checks
do not make that earlier full test gate green. macOS/Linux packaging and provider/browser
behavior were not validated by this local Windows acceptance.
