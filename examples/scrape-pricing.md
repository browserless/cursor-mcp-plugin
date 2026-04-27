# Example — Scrape a pricing page

A one-shot use case for `browserless_smartscraper`. Drop the prompt below into Cursor chat once Browserless MCP is installed.

## Prompt

> Use `browserless_smartscraper` to fetch `https://stripe.com/pricing` as `formats: ["markdown", "links"]`. Then:
>
> 1. From the markdown, extract every plan name + headline price into a table (columns: Plan, Price, Best for).
> 2. From the links, list any URL containing the word "enterprise" or "contact".
>
> Return both as separate markdown sections.

## Why this works

- `markdown` gives the model clean text to summarize.
- `links` returns absolute URLs Stripe links to from the page — useful for follow-up navigation without re-rendering.
- Smart scraper handles Stripe's anti-bot rendering automatically; you don't need to spin up a headed browser.

## Variants

- Replace `https://stripe.com/pricing` with any vendor — Linear, Notion, Vercel, etc.
- Add `screenshot` to the formats list to also get a PNG of the rendered page.
- Add `pdf` if you want a printable archive of the page.

## Expected behavior

Cursor will surface a permission prompt the first time it calls the tool. After approval, the result lands inline in chat in roughly 5–15 seconds (depends on the target site).
