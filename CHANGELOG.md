# Changelog

All notable changes to this plugin will be documented here.

## 1.0.0 — initial release

- Added the `.cursor-plugin/plugin.json` manifest so the repository installs as a Cursor plugin.
- Added the `browserless` MCP server pointing at `https://mcp.browserless.io/mcp` over streamable HTTP.
- Authenticates with OAuth: Cursor discovers the server's OAuth metadata, registers dynamically, and manages tokens itself. The plugin declares no credentials, and the API token remains documented for manual installs.
- Added `assets/logo.svg`: the Browserless mark on a padded dark tile.
- Added `scripts/verify-mcp.mjs` to check connectivity, tool discovery, and tool execution against the hosted server.
- Documented the two MCP resources the server exposes: `browserless://status` and `browserless://api-docs`.
- Corrected the documented tool set against `browserless-mcp` 1.30.0: 14 tools, not 9. `browserless_download` is no longer served; `browserless_skill`, `browserless_account`, `browserless_usage`, `browserless_logs`, `browserless_sessions`, and `browserless_profiles` were undocumented.
