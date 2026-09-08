// proxy-server.mjs — OpenAI proxy (generations + edits)
import http from "node:http";
import fs from "node:fs";

function loadEnv() {
  try {
    const raw = fs.readFileSync(".env.local", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)\s*$/);
      if (m) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}
loadEnv();

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, model: MODEL, hasKey: !!OPENAI_KEY }));
    return;
  }

  if (req.method === "POST" && req.url === "/api/generate-image") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        if (!OPENAI_KEY) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "OPENAI_API_KEY missing" }));
          return;
        }
        const p = JSON.parse(body || "{}");
        console.log("🎨", p.photo ? "EDITS" : "GENERATE", "|", (p.prompt || "").slice(0, 60));
        let r;
        if (p.photo) {
          const form = new FormData();
          form.append("model", MODEL);
          form.append("prompt", p.prompt || "poster");
          form.append("size", p.size || "1024x1536");
          const b64 = String(p.photo).includes(",") ? String(p.photo).split(",")[1] : p.photo;
          form.append("image", new Blob([Buffer.from(b64, "base64")], { type: "image/png" }), "photo.png");
          r = await fetch("https://api.openai.com/v1/images/edits", {
            method: "POST",
            headers: { Authorization: `Bearer ${OPENAI_KEY}` },
            body: form,
          });
        } else {
          r = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
            body: JSON.stringify({ model: MODEL, prompt: p.prompt || "divine art", size: p.size || "1024x1024", n: 1 }),
          });
        }
        const data = await r.json();
        const item = data?.data?.[0];
        let img = item?.b64_json ? `data:image/png;base64,${item.b64_json}` : item?.url || null;
        if (img && img.startsWith("http")) {
          const ir = await fetch(img);
          img = `data:image/png;base64,${Buffer.from(await ir.arrayBuffer()).toString("base64")}`;
        }
        if (!img) {
          console.log("❌", data?.error?.message || "fail");
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: data?.error?.message || "Image fail" }));
          return;
        }
        console.log("✅ Image ready");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ image: img, used: "DEV", limit: "∞" }));
      } catch (e) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(e) }));
      }
    });
    return;
  }
  res.writeHead(404); res.end();
});

server.listen(3002, () => console.log("✅ Proxy ready: http://localhost:3002 | model:", MODEL, "| key:", OPENAI_KEY ? "SET ✅" : "MISSING ❌"));