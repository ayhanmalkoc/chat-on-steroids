# Workspace docks — local integration log

## Part 1 — `feat/ui-dock-shell`

- Added a single renderer owner for the right dock frame, tabs, launcher, `+` menu,
  expand/restore and two top-right panel toggles. Existing Files and Sub-agents
  keep their own data and security boundaries; the existing bottom terminal keeps
  its PTY owner and receives the grouped bottom toggle.
- Hidden Files retires its watches; the dock does not create a filesystem or
  terminal IPC path. The right dock starts empty and disabled launchers cannot
  open tools without their exact project/session scope.
- Checks: `npm run typecheck`, five focused Vitest files (82 assertions), and
  `npm run build` passed. Isolated Electron terminal acceptance reached the
  appearance-color assertion after validating shell creation and terminal reuse;
  the detached connection popover reported transparent instead of the expected
  black in that fixture, so full runtime acceptance is not claimed yet.

## Part 2 — `feat/ui-dock-tools`

- Extended the single dock owner to right and bottom tab frames. Files and Terminal move
  as single renderer views; Sub-agents remains right-only. File drafts and terminal PTYs
  stay with their original modules rather than being reconstructed on each placement.
- Moved bottom height control to the dock frame. The per-tool bottom shortcut retains
  Ctrl+backtick; Ctrl+Shift+2/3/4 open right Terminal/Files/Sub-agents. A hidden dock
  retires Files watches while keeping terminal processes alive.
- Checks: typecheck, focused renderer/terminal suites, production renderer build and
  isolated Electron terminal scenario. Electron exercised hidden-panel continuity,
  right↔bottom reparenting of the same live PTY, a second tab, Ctrl+C, exit and sizing.
  The Electron fixture now compares the detached connection popover to the sidebar
  surface under a non-translucent test theme; the old assertion incorrectly equated
  sidebar and page background colors.

## Part 3 — `feat/ui-dock-review`

- Merged the existing read-only Git Changes commit as `088e4d8`, retaining its
  original authored commit and contributor trail. Added Review as a separate
  singleton dock view, available on the right or bottom alongside Files.
- Review shows current bounded Git changes and exact recorded `apply_patch` edit
  assets. It exposes no file-write toolbar or second file watcher. The Files
  toolbar's Changes action opens Review; historical edit buttons target Review
  and return to its list. No stage, commit, push, branch comparison or Ask agent.
- Checks on the feature branch: typecheck, 135 focused Git/renderer/IPC tests,
  the recorded-edit timeline case, and synthetic Electron Chromium inspection
  passed. The Electron fixture exercises the independent Review tab, working
  tree diff, return to Files, editor draft, PDF and responsive layouts. Final
  `dev` and package evidence are recorded separately below.
## Follow-up — dedicated bottom Terminal and working right actions

- Root cause of inert right shortcuts/`+` entries: Files, Review and Agents
  availability was inferred from their deliberately hidden legacy toggle
  buttons. The dock now uses the selected local project or chat identity.
- Removed the bottom generic launcher, tool tabs and `+` menu. Its control
  toggles the Terminal directly; right-side Terminal actions create a new
  bottom terminal tab. The top-right controls are ordered bottom, right,
  expansion, with expansion visible only while the right dock is open.
- Checks: typecheck, focused dock/File/Timeline tests, isolated Electron
  workspace UI and real PowerShell PTY scenarios passed. Electron exercised
  right Review/Agents/Files shortcuts, the Review `+` entry, right Terminal
  shortcut and `+` entry, bottom hide/reopen continuity and terminal tab close.
  `npm run verify` again passed privacy, notices and typecheck but reported the
  same two Windows UI Automation failures and PowerShell parser-recovery
  assertion; the broad run was stopped after those known failures. No
  full-suite pass is claimed. This follow-up was not packaged or installed.

## Follow-up — terminal in both docks and tab-adjacent actions

- Supersedes the previous bottom-only Terminal placement. Right Terminal opens a
  right tool tab with its own PTYs; bottom Terminal keeps separate PTYs and opens
  directly when its panel is shown. Bottom `+` creates another bottom tab, while
  right `+` opens Terminal on the right. Closing the last bottom tab also hides
  the bottom panel; toggling a panel still preserves any surviving processes.
- Moved each `+` immediately after its tab strip instead of stretching the strip
  across the header. Raised the terminal bar above its body so the bottom `+`
  popover is clickable. Removed the redundant right-dock close button and put
  the Codex-style expand/restore icon first in the top control group.
- Checks on the feature branch: typecheck, five dock tests, 42 Files tests,
  the exact recorded-edit timeline case and production build passed. The full
  timeline file was stopped after prolonged high memory use without a result.
  Isolated Electron workspace inspection and real PowerShell PTY acceptance passed,
  including visible bottom menu, independent right/bottom shells, hidden-panel
  continuity and last-tab close. One PTY fixture run returned exit code 1 after
  all assertions; the immediate repeat completed with exit code 0. Final `dev`
  merge, broader verification and package evidence are recorded separately.

## Follow-up — clickable right menu and terminal-first bottom panel

- Reproduced the right `+` failure with an actual Electron pointer click: its
  visible Terminal menu item hit the underlying Terminal tab because that tool's
  header had a higher stacking order. Raised the right tab bar above the tool
  header; the same pointer action now activates the menu item.
- With no right tabs, hide the tab bar/`+` and leave the launcher shortcuts.
  Bottom opening always shows the Terminal view, starts its shell when a selected
  project is available (including if the project arrives after opening), and has
  a right-aligned X that hides the panel without ending its process. The last
  terminal tab's X still closes the shell and the bottom panel.
- Feature-branch checks: dock/File Vitest 47/47, typecheck, build, isolated
  Electron PowerShell PTY and full workspace renderer fixture passed. The Electron test
  physically clicks right and bottom menus and the bottom X; it also exercises
  delayed project selection and no-tab right layout. `npm run verify` passed
  privacy, notices and typecheck but again reported the known Windows browser
  UIA, Windows accessibility and MCP parser-recovery failures; the broad test
  run was stopped after those failures, so no full-suite pass is claimed.
  A packaged/install test was not run for this follow-up.
