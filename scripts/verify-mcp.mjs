#!/usr/bin/env node
// Verifies the hosted Browserless MCP server over streamable HTTP.
//
//   BROWSERLESS_TOKEN=... node scripts/verify-mcp.mjs
//   BROWSERLESS_TOKEN=... node scripts/verify-mcp.mjs --exec
//   BROWSERLESS_TOKEN=... node scripts/verify-mcp.mjs --json > tools.json
//
// Performs the same handshake Cursor performs after the plugin is installed:
// initialize -> notifications/initialized -> tools/list, then prints the
// advertised tools. With --exec, also calls browserless_smartscraper against
// example.com to confirm a tool round-trips. Exits non-zero on any failure.

const URL = process.env.BROWSERLESS_MCP_URL ?? "https://mcp.browserless.io/mcp";
const TOKEN = process.env.BROWSERLESS_TOKEN;
const EXEC = process.argv.includes("--exec");
const JSON_OUT = process.argv.includes("--json");

if (!TOKEN) {
  console.error("BROWSERLESS_TOKEN is not set.");
  process.exit(1);
}

let sessionId;

async function rpc(method, params, { notification = false } = {}) {
  const body = notification
    ? { jsonrpc: "2.0", method, params }
    : { jsonrpc: "2.0", id: Date.now(), method, params };

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: `Bearer ${TOKEN}`,
      ...(sessionId ? { "mcp-session-id": sessionId } : {}),
    },
    body: JSON.stringify(body),
  });

  sessionId ??= res.headers.get("mcp-session-id") ?? undefined;

  if (!res.ok) {
    throw new Error(`${method} -> HTTP ${res.status}: ${await res.text()}`);
  }
  if (notification || res.status === 202) return undefined;

  const text = await res.text();
  const payload = res.headers.get("content-type")?.includes("text/event-stream")
    ? text
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => JSON.parse(line.slice(5).trim()))
        .at(-1)
    : JSON.parse(text);

  if (payload?.error) {
    throw new Error(`${method} -> ${payload.error.message}`);
  }
  return payload?.result;
}

const init = await rpc("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "browserless-plugin-verify", version: "1.0.0" },
});
const log = JSON_OUT ? () => {} : console.log;

log(
  `Connected to ${init.serverInfo?.name ?? "server"} ${init.serverInfo?.version ?? ""}`.trim()
);

await rpc("notifications/initialized", {}, { notification: true });

const { tools } = await rpc("tools/list", {});

if (JSON_OUT) {
  let resources = [];
  try {
    ({ resources = [] } = (await rpc("resources/list", {})) ?? {});
  } catch {}
  console.log(JSON.stringify({ serverInfo: init.serverInfo, tools, resources }, null, 2));
  process.exit(0);
}

log(`\n${tools.length} tools:`);
for (const tool of tools) log(`  - ${tool.name}`);

// Resources are optional in MCP; a server that does not implement them
// answers with a method-not-found error, which is not a failure here.
try {
  const { resources = [] } = (await rpc("resources/list", {})) ?? {};
  log(`\n${resources.length} resources:`);
  for (const r of resources) log(`  - ${r.uri}${r.name ? `  (${r.name})` : ""}`);
} catch {
  log("\nresources/list not supported by this server.");
}

if (!EXEC) process.exit(0);

const target = "browserless_smartscraper";
if (!tools.some((tool) => tool.name === target)) {
  console.error(`\n${target} not advertised; skipping execution check.`);
  process.exit(1);
}

console.log(`\nCalling ${target} on https://example.com ...`);
const call = await rpc("tools/call", {
  name: target,
  arguments: { url: "https://example.com", formats: ["markdown"] },
});

if (call?.isError) {
  console.error(`${target} returned an error:`);
  console.error(JSON.stringify(call.content, null, 2).slice(0, 800));
  process.exit(1);
}

const preview = (call?.content ?? [])
  .map((part) => part.text ?? `<${part.type}>`)
  .join("\n")
  .trim()
  .slice(0, 300);

console.log(`${target} OK. First 300 chars of result:\n`);
console.log(preview);
