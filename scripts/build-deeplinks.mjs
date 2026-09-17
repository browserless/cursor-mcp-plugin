#!/usr/bin/env node
// Emits Cursor install deeplinks for the Browserless MCP server.
// These back the manual-install fallback only; the Marketplace listing is the
// primary install path.
// Run: node scripts/build-deeplinks.mjs
//
// Output is committed verbatim into README.md. Re-run when the server URL
// or default config changes.
//
// Format reference: https://cursor.com/docs/plugins/mcp/install-links
//   cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64
// Cursor does not publish an HTTPS fallback; the cursor:// scheme is the
// only supported install link.

const SERVER_URL = "https://mcp.browserless.io/mcp";
const NAME = "browserless";

const bearerCfg = {
  type: "http",
  url: SERVER_URL,
  headers: { Authorization: "Bearer YOUR_BROWSERLESS_TOKEN" },
};

const enc = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString("base64url");

const deeplink = (cfg) =>
  `cursor://anysphere.cursor-deeplink/mcp/install?name=${NAME}&config=${enc(cfg)}`;

console.log(`\n# Bearer (paste token)`);
console.log(`config (json): ${JSON.stringify(bearerCfg)}`);
console.log(`config (base64url): ${enc(bearerCfg)}`);
console.log(`deeplink: ${deeplink(bearerCfg)}`);
