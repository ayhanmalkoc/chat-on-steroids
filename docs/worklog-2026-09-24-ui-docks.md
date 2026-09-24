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
