#!/usr/bin/env node

const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

async function ensureDir(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const part = argv[i];
    if (part.startsWith("--")) {
      const stripped = part.replace(/^--/, "");
      const eqIndex = stripped.indexOf("=");
      if (eqIndex >= 0) {
        const k = stripped.slice(0, eqIndex);
        const v = stripped.slice(eqIndex + 1);
        args[k] = v;
      } else {
        const k = stripped;
        const next = argv[i + 1];
        if (next && !String(next).startsWith("--")) {
          args[k] = next;
          i += 1;
        } else {
          args[k] = true;
        }
      }
    }
  }
  return args;
}

function sanitizeFileName(name) {
  return String(name).replace(/[:\\/\n\r\t]+/g, "_");
}

async function fetchJson(url, token) {
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

async function fetchBinary(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Download failed ${res.status} ${res.statusText}: ${text}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error("[error] Missing FIGMA_TOKEN env");
    process.exit(1);
  }

  const args = parseArgs(process.argv);
  const root = path.resolve(__dirname, "..", "..");
  const defaultOut = path.join(root, "assets");

  // Optional config file
  const configPath = path.join(__dirname, "figma.config.json");
  let config = {};
  if (fs.existsSync(configPath)) {
    try { config = JSON.parse(await fsp.readFile(configPath, "utf8")); } catch {}
  }

  const fileKey = args.file || config.fileKey;
  const nodeId = args.node || (config.nodes && config.nodes[0]);
  const outDir = path.resolve(args.out || defaultOut);
  const wantImages = (args.images || "").split(",").filter(Boolean);
  const scale = Number(args.scale || 2);

  if (!fileKey) {
    console.error("[error] Missing --file <fileKey>");
    process.exit(1);
  }
  if (!nodeId) {
    console.error("[error] Missing --node <nodeId>");
    process.exit(1);
  }

  await ensureDir(outDir);
  const nodesDir = path.join(outDir, "nodes");
  const imagesDir = path.join(outDir, "images");
  await ensureDir(nodesDir);
  await ensureDir(imagesDir);

  const encodedNode = encodeURIComponent(String(nodeId));

  // 1) Fetch node JSON
  const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodedNode}`;
  console.log(`[info] Fetching node JSON: ${nodesUrl}`);
  const json = await fetchJson(nodesUrl, token);
  const nodeKey = Object.keys(json.nodes || {})[0] || nodeId;
  const nodeData = json.nodes ? json.nodes[nodeKey] : json;

  const nodeFile = path.join(nodesDir, `${sanitizeFileName(nodeKey)}.json`);
  await fsp.writeFile(nodeFile, JSON.stringify(nodeData, null, 2), "utf8");
  console.log(`[ok] Saved node JSON -> ${nodeFile}`);

  // 2) Optionally export images (svg/png)
  if (wantImages.length > 0) {
    for (const format of wantImages) {
      const imagesUrl = new URL(`https://api.figma.com/v1/images/${fileKey}`);
      imagesUrl.searchParams.set("ids", String(nodeId));
      imagesUrl.searchParams.set("format", format);
      if (format === "png" && scale) imagesUrl.searchParams.set("scale", String(scale));

      console.log(`[info] Resolving ${format} URL: ${imagesUrl.toString()}`);
      const imgJson = await fetchJson(imagesUrl.toString(), token);
      const downloadUrl = imgJson.images && imgJson.images[nodeId];
      if (!downloadUrl) {
        console.warn(`[warn] No ${format} URL for node ${nodeId}`);
        continue;
      }
      const bin = await fetchBinary(downloadUrl);
      const outName = `${sanitizeFileName(nodeId)}.${format}`;
      const outPath = path.join(imagesDir, outName);
      await fsp.writeFile(outPath, bin);
      console.log(`[ok] Saved image -> ${outPath}`);
    }
  }

  console.log("[done] Figma fetch complete");
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
