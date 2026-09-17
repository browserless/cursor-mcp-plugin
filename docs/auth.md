# Authentication

The Browserless MCP server supports two authentication methods. The plugin uses **OAuth**; the API token remains available for manual installs and scripts.

## OAuth (plugin install)

The plugin declares no credentials at all:

```json
{
  "mcpServers": {
    "browserless": {
      "type": "http",
      "url": "https://mcp.browserless.io/mcp"
    }
  }
}
```

Cursor discovers the server's OAuth metadata at `https://mcp.browserless.io/.well-known/oauth-protected-resource`, registers itself dynamically, and shows an **Authenticate** button. Clicking it opens the Browserless consent screen; approve, and Cursor stores the resulting tokens itself.

**No token is ever committed to this repository, pasted into a config file, or written to disk in plaintext.** Tokens refresh automatically and can be revoked from your Browserless account.

Re-authenticate at any time from **Settings → Plugins → Browserless**.

## API token (manual install)

If you configure the server by hand rather than installing the plugin, authenticate with a Bearer token:

```json
{
  "mcpServers": {
    "browserless": {
      "type": "http",
      "url": "https://mcp.browserless.io/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_BROWSERLESS_TOKEN"
      }
    }
  }
}
```

Generate a token at [account.browserless.io](https://account.browserless.io); sign up at [browserless.io/signup/email](https://www.browserless.io/signup/email). Note that the token sits in `mcp.json` in plaintext — prefer the plugin install if you would rather Cursor manage the credential.

The server also accepts `?token=` as a query parameter, which is convenient for scripts but exposes the token in URLs and logs.

## Rotating credentials

- **OAuth** — revoke the authorization in your Browserless account, then re-authenticate in Cursor.
- **API token** — generate a new token at [account.browserless.io](https://account.browserless.io), replace the value after `Bearer ` in `~/.cursor/mcp.json`, restart Cursor, then revoke the old token.
