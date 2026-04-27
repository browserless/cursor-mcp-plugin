# Example — Multi-step research with `browserless_agent`

Demonstrates the stateful agent loop: navigate → snapshot → act → re-snapshot → close.

## Prompt

> Use `browserless_agent` to research the top 3 self-hosted vector databases.
>
> Steps:
>
> 1. `goto` `https://github.com/search?q=vector+database+self-hosted&type=repositories&s=stars&o=desc`.
> 2. `snapshot` the page.
> 3. From the snapshot, identify the first 3 repository links and `goto` the first one.
> 4. On each repo page: `snapshot`, then extract the **language**, **license**, **star count**, and the first paragraph of the README.
> 5. After the third repo, `close` the session.
> 6. Return a comparison table (Name, Stars, Language, License, One-line summary).

## Why this works

- `browserless_agent` keeps a single browser session alive across all `goto` calls — cookies, redirects, and rate-limit cookies persist.
- `snapshot` returns interactive elements with `ref=` selectors, so the model never has to guess CSS selectors from training data.
- `close` releases the browser slot when done; without it the session sits idle until the server timeout.

## Tips

- **Always snapshot after a navigation.** A `goto` invalidates the prior snapshot.
- **Batch read-only actions** with the `commands` array (e.g. `evaluate` to count nodes + `text` to grab a heading) when they share page state. Don't batch across navigations.
- **Cookie banners are usually shadow DOM.** Look for `deep-ref=` selectors in the snapshot — pass them verbatim, including the leading `< `.

## Expected behavior

Multi-step prompts like this typically run in 30–90 seconds and consume more units than a one-shot scrape. If a step fails, the model can `snapshot` again and retry without restarting the browser.
