# Changelog

All notable changes to this project are documented here. Versions follow semver; `Unreleased` lists changes on `main` that are not yet on the registry.

## Unreleased

- `AiActionsBar` is now self-contained: the client script and paste dialog moved out of the plugin's `PageTitle` override, so the documented "override `PageTitle` yourself and render `AiActionsBar`" recipe now yields fully working buttons. `PageTitle` is an assembly shell; `AiActionsBar` gains an optional `hint1` prop.
- Fix: a whitespace-only `prompt` (e.g. `' '`) now falls back to defaults, same as an empty string, instead of producing `?prompt=%20`.
- Fix: copy buttons no longer get stuck on the success label if a `labels` override sets the original label text to an empty string.
- `where.idPattern` is validated at build time with a `[starlight-ai-actions]`-prefixed error instead of a bare `SyntaxError`.
- Docs: the built-in icon list includes `deepseek`; Limitations now states there is no `<ClientRouter />` (View Transitions) support yet.

## 0.2.3 (2026-10-21)

- Fix: copy-feedback timer race — rapid re-clicks no longer leave a button stuck on the success label.
- Fix: empty-string `prompt` normalization is now consistent between validation and resolution.
- Fix: `labels` merging no longer lets an explicit `undefined` entry override a default.

## 0.2.2 (2026-10-20)

- Default `mdMenu` label simplified to bare `Markdown` in all three languages.

## 0.2.1 (2026-10-10)

- npm metadata: `homepage` and `bugs` fields; README gains a project-origin line.

## 0.2.0 (2026-10-10)

- Paste dialog: DeepSeek button added (7 paste providers).

## 0.1.0 (2026-10-09)

- Initial release: Markdown tools menu, AI-discussion direct links, paste-prompt dialog, `ai-actions` custom events, en/zh-CN/zh-TW labels.
