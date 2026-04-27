# Browserless MCP for Cursor

Headless browser automation for AI agents — scrape, navigate, fill forms, take screenshots, and run multi-step research from any MCP-compatible client.

This repository is the discovery surface for the **Browserless MCP server** hosted at [`https://mcp.browserless.io/mcp`](https://mcp.browserless.io/mcp). The server speaks the [Model Context Protocol](https://modelcontextprotocol.io) over streamable HTTP, authenticated with a Bearer token.

---

## Install

Add this to `~/.cursor/mcp.json` (global) or `<project>/.cursor/mcp.json` (per-project):

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

Get a token at [browserless.io/signup/email](https://www.browserless.io/signup/email). Restart Cursor, then check `Settings → MCP` — `browserless` should appear with all 9 tools enumerated.

### One-click deeplink

If you'd rather not edit `mcp.json` by hand, click this in any browser that has Cursor's URL handler registered. Cursor will pop a confirm dialog with the config pre-filled:

- **[Install with Bearer token](cursor://anysphere.cursor-deeplink/mcp/install?name=browserless&config=eyJ1cmwiOiJodHRwczovL21jcC5icm93c2VybGVzcy5pby9tY3AiLCJoZWFkZXJzIjp7IkF1dGhvcml6YXRpb24iOiJCZWFyZXIgWU9VUl9CUk9XU0VSTEVTU19UT0tFTiJ9fQ)** — replace the placeholder token after install.

See [docs/install-cursor.md](docs/install-cursor.md) for full install details and [docs/auth.md](docs/auth.md) for token management.

---

## Tools

The hosted server exposes 9 tools. Full schemas in [docs/tools.md](docs/tools.md).

| Tool | What it does |
|---|---|
| `browserless_agent` | Stateful, reasoning-driven browser session. Snapshot the page, click, type, evaluate JS, scroll, wait — multi-step automation where the model decides what to do next. |
| `browserless_smartscraper` | Fetch any URL and return content as `markdown`, `html`, `screenshot`, `pdf`, or `links`. Auto-handles JS, anti-bot, and multiple scraping strategies. |
| `browserless_search` | Web / news / image search via SearXNG, with optional per-result scraping. Geo-targetable, time-filterable. |
| `browserless_function` | Run arbitrary Puppeteer JS on the Browserless cloud. Receives `{ page, context }`, returns `{ data, type }`. |
| `browserless_download` | Run Puppeteer JS that triggers a file download in the browser; returns the downloaded file with its native Content-Type. |
| `browserless_export` | Fetch a URL and return its native content (HTML/PDF/image), or bundle the page + assets as a ZIP for offline use. |
| `browserless_map` | Discover all URLs on a site via sitemap + link extraction. Up to 5,000 URLs with optional titles and descriptions. |
| `browserless_performance` | Run a Lighthouse audit. Returns scores and metrics for accessibility, best-practices, performance, PWA, SEO. Supports custom budgets. |
| `browserless_crawl` | Recursively crawl + scrape every discovered page. Path filters, sitemap modes, depth control, retries. |

---

## Example prompts

Drop these straight into Cursor chat once installed:

### 1. Scrape a pricing page

> Use the browserless smart scraper to fetch `https://stripe.com/pricing` as markdown, then summarize each plan in one bullet.

### 2. Multi-step research with the agent

> Use the browserless agent to research the top 3 self-hosted vector databases on GitHub. For each, navigate to the repo, snapshot the README, and extract the license, language, and star count. Compare them in a table.

### 3. Map and audit a site

> Use `browserless_map` to discover all URLs on `https://example.com`. Then run `browserless_performance` on the top 5 pages by URL depth and report Lighthouse scores.

More examples in [examples/](examples/).

---

## Why this server?

- **Stateful agent loop** (`browserless_agent`) — one of the few MCP servers that gives an LLM a persistent browser session with snapshot/observe/act primitives, not just one-shot scraping.
- **100+ BrowserQL mutations** under the hood — anti-bot, residential proxy, captcha solving, session replay.
- **Geo-targetable** — country / state / city-level proxying across 10,000+ cities.
- **Built for production** — same backend that powers Browserless's enterprise self-hosted deployments.

---

## Resources

- Hosted server: [`https://mcp.browserless.io/mcp`](https://mcp.browserless.io/mcp)
- Get a token: [browserless.io/signup/email](https://www.browserless.io/signup/email)
- Browserless docs: [docs.browserless.io](https://docs.browserless.io)
- MCP spec: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

## License

MIT — see [LICENSE](LICENSE).

The Browserless server itself is licensed separately under SSPL-1.0.
