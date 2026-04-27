# Authentication

The Browserless MCP server authenticates with a Bearer token.

## Bearer token

Generate a token at [browserless.io/signup/email](https://www.browserless.io/signup/email). Paste it into your Cursor config as the `Authorization` header:

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

**Caveats:** the token is stored on disk in plaintext (in `mcp.json`). You can always generate a new token in your Account Page.

## Rotating tokens

Edit `~/.cursor/mcp.json`, replace the value after `Bearer `, and restart Cursor.
