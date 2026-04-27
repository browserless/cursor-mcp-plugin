# Install Browserless MCP in Cursor

This guide covers every install path for Cursor: manual config, deeplink, project-scoped config, and verification.

## Manual install (recommended)

Edit `~/.cursor/mcp.json` and paste:

```json
{
  "mcpServers": {
    "browserless": {
      "url": "https://mcp.browserless.io/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_BROWSERLESS_TOKEN"
      }
    }
  }
}
```

Replace `YOUR_BROWSERLESS_TOKEN` with a token from [browserless.io/signup/email](https://www.browserless.io/signup/email). Restart Cursor, then `Settings → MCP` should show `browserless` with all 9 tools.

## One-click deeplink

Cursor's [official deeplink format](https://cursor.com/docs/plugins/mcp/install-links) (`cursor://anysphere.cursor-deeplink/mcp/install?name=...&config=...`) pops an in-Cursor confirm dialog with the config pre-filled. Click this in any browser on a machine with Cursor installed:

- **[Install with Bearer token](cursor://anysphere.cursor-deeplink/mcp/install?name=browserless&config=eyJ1cmwiOiJodHRwczovL21jcC5icm93c2VybGVzcy5pby9tY3AiLCJoZWFkZXJzIjp7IkF1dGhvcml6YXRpb24iOiJCZWFyZXIgWU9VUl9CUk9XU0VSTEVTU19UT0tFTiJ9fQ)** — token comes through as a placeholder; replace it before approving.

Cursor registers the `cursor://` URL handler the first time it launches. If clicking does nothing, your browser may not have the handler registered yet — open Cursor once, then retry.

> Cursor does not publish an HTTPS fallback (e.g. `https://cursor.com/install-mcp`). The `cursor://` scheme is the only supported install link.

## Project-scoped install

Place the same JSON at `<project-root>/.cursor/mcp.json` to scope the server to a single project. Project config takes precedence over the global config when both are present.

## Verifying the install

1. Open Cursor → `Settings → MCP`.
2. Find `browserless` in the list. It should show **9 tools**: `browserless_agent`, `browserless_smartscraper`, `browserless_search`, `browserless_function`, `browserless_download`, `browserless_export`, `browserless_map`, `browserless_performance`, `browserless_crawl`.
3. In a chat, ask the model to use one — for example:

   > Use the browserless smart scraper to fetch example.com as markdown.

4. Cursor will prompt for permission to call the tool. Approve, and the result returns inline.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `browserless` shows 0 tools | Bad token or wrong URL | Re-check the `Authorization` header. Confirm `https://mcp.browserless.io/mcp` returns HTTP 400 to a plain `GET` (this is the expected MCP handshake response). |
| Tools enumerate but every call fails with 401 | Token revoked or expired | Generate a new token in your Browserless dashboard. |
| Tools enumerate but calls hit `429` | Account quota exceeded | Check usage in your Browserless dashboard; upgrade plan or wait for quota reset. |

## Uninstall

Remove the `browserless` block from `~/.cursor/mcp.json` (or the project-local file), then restart Cursor.
