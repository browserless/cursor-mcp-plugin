# Browserless MCP — Tool Reference

The hosted server at `https://mcp.browserless.io/mcp` exposes **9 tools**. Each is documented below with its purpose, key parameters, and an example prompt that exercises it.

> The authoritative schemas live on the running server — Cursor pulls them via the standard MCP `tools/list` call. The summaries below match what the server returns at the time of writing.

---

## `browserless_agent`

A stateful, reasoning-driven browser session. The agent follows a ReAct loop: **Reason → Act → Observe**.

1. `goto` to navigate
2. `snapshot` to observe the page (returns interactive elements with `ref=` selectors)
3. Plan and `click` / `type` / `select` / `evaluate` etc.
4. Re-snapshot if the page changed
5. `close` when done

**Selectors come from the snapshot, never from training data.** Every interactable element is tagged with `ref=` (regular CSS) or `deep-ref=` (shadow DOM). Pass these directly to action commands.

Use `commands: [...]` to batch sequential actions on the same page state — e.g. fill a form in one call.

**Example prompt:**

> Use the browserless agent to log into hacker-news (assume credentials in env), open the front page, snapshot, and return the top 10 story titles + scores in markdown.

---

## `browserless_smartscraper`

Single-shot URL fetch with cascading strategies (HTTP fetch, proxy, headless browser, captcha solving) and pluggable output formats.

**Key params:** `url` (required), `formats` (`["markdown" | "html" | "screenshot" | "pdf" | "links"]`), `timeout`.

**Example prompt:**

> Use browserless_smartscraper on `https://stripe.com/pricing` and return both the markdown and the screenshot.

---

## `browserless_search`

Web/news/image search via SearXNG, with optional per-result scraping. Geo-targetable.

**Key params:** `query`, `sources` (`web` / `news` / `images`), `country`, `lang`, `tbs` (`day`/`week`/`month`/`year`), `categories` (`github`/`research`/`pdf`), `scrapeOptions`.

**Example prompt:**

> Use browserless_search to find the top 5 GitHub repos for "self-hosted vector database", `categories: ["github"]`, then scrape each as markdown via `scrapeOptions.formats: ["markdown"]` with `onlyMainContent: true`.

---

## `browserless_function`

Run arbitrary Puppeteer JS (ES Module) on the Browserless cloud. The default export receives `{ page, context }` and should return `{ data, type }`, where `type` becomes the HTTP `Content-Type`.

**Use when:** smartscraper isn't enough — multi-step interaction, custom DOM extraction, conditional logic, etc.

**Example prompt:**

> Use browserless_function to navigate to `https://example.com`, count the number of `<a>` tags, and return `{ data: { count }, type: "application/json" }`.

---

## `browserless_download`

Same shape as `browserless_function`, but the JS is expected to trigger a file download in the browser (e.g. clicking a download link). The downloaded file is returned with its original `Content-Type`.

**Example prompt:**

> Use browserless_download to fetch the CSV behind the "Export" button on `https://example.com/reports/123`.

---

## `browserless_export`

Server-side URL exporter. Returns the page's native content (HTML, PDF, image, etc.) with auto-detected `Content-Type`. Set `includeResources: true` to bundle the page plus all linked CSS/JS/images into a single ZIP archive.

**Example prompt:**

> Use browserless_export with `includeResources: true` on `https://example.com/article/42` and save the offline bundle.

---

## `browserless_map`

Sitemap + link-extraction crawler that returns a list of URLs (with optional titles and descriptions). Use the `search` parameter to rank results by relevance to a query.

**Key params:** `url`, `limit` (max 5000), `includeSubdomains`, `ignoreQueryParameters`, `sitemap` (`include` / `skip` / `only`), `search`.

**Example prompt:**

> Use browserless_map on `https://docs.browserless.io` with `search: "BrowserQL"`, return the top 30 URLs.

---

## `browserless_performance`

Run a Lighthouse audit. Returns scores and metrics for `accessibility`, `best-practices`, `performance`, `pwa`, `seo`. Optionally pass [Lighthouse performance budgets](https://developer.chrome.com/docs/lighthouse/performance/performance-budgets).

> Audits typically take 30s–120s.

**Example prompt:**

> Run browserless_performance on `https://example.com` for `categories: ["performance", "accessibility"]` and report scores.

---

## `browserless_crawl`

Recursively crawl + scrape a site. Starts from a seed URL and follows links up to a configurable depth. Returns the scraped content for every page.

**Key params:** `url`, `limit` (max 10,000), `maxDepth`, `includePaths` / `excludePaths` (regex), `allowSubdomains`, `allowExternalLinks`, `sitemap` (`auto` / `force` / `skip`), `delay`, `scrapeOptions`.

**Example prompt:**

> Use browserless_crawl on `https://docs.browserless.io` with `maxDepth: 3` and `limit: 50`, formats `["markdown"]`, `onlyMainContent: true`. Return the URL list and the markdown of the top result.
