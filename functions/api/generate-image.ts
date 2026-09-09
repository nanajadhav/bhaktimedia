// functions/api/generate-image.ts — Cloudflare D1 auth + OpenAI
import { json, getToken, verifyJWT, LIMITS } from "../_lib";

function bufToB64(buf: ArrayBuffer) {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export const onRequestPost = async (context: any) => {
  try {
    const OPENAI_KEY = context.env.OPENAI_API_KEY || "";
    const MODEL = context.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
    if (!OPENAI_KEY) return json({ error: "Server key missing" }, 500);

    const token = getToken(context);
    const payload = token ? await verifyJWT(token, context.env.AUTH_SECRET) : null;
    if (!payload) return json({ error: "Pehle login karo" }, 401);

    const DB = context.env.DB;
    const prof = await DB.prepare("SELECT plan FROM profiles WHERE user_id = ?").bind(payload.sub).first();
    const plan = (prof?.plan as string) || "trial";
    const limit = LIMITS[plan] ?? 3;
    const period = new Date().toISOString().slice(0, 7);
    const row = await DB.prepare("SELECT id, used FROM usage WHERE user_id = ? AND feature = 'images' AND period = ?").bind(payload.sub, period).first();
    const used = (row?.used as number) || 0;
    if (used >= limit) return json({ error: "Credits khatam! Plan upgrade karo." }, 402);

    const body = await context.request.json();
    let r: Response;
    if (body.photo) {
      const b64 = String(body.photo).includes(",") ? String(body.photo).split(",")[1] : body.photo;
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const form = new FormData();
      form.append("model", MODEL);
      form.append("prompt", body.prompt || "poster");
      form.append("size", body.size || "1024x1536");
      form.append("image", new File([bytes], "photo.png", { type: "image/png" }));
      r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${OPENAI_KEY}` }, body: form });
    } else {
      r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: MODEL, prompt: body.prompt || "divine art", size: body.size || "1024x1024", n: 1 }),
      });
    }
    const data = await r.json();
    const item = data?.data?.[0];
    let img = item?.b64_json ? `data:image/png;base64,${item.b64_json}` : item?.url || null;
    if (!img) return json({ error: data?.error?.message || "Image fail" }, 502);
    if (img.startsWith("http")) img = `data:image/png;base64,${bufToB64(await (await fetch(img)).arrayBuffer())}`;

    if (row) await DB.prepare("UPDATE usage SET used = ? WHERE id = ?").bind(used + 1, row.id).run();
    else await DB.prepare("INSERT INTO usage (user_id, feature, used, period) VALUES (?, ?, ?, ?)").bind(payload.sub, "images", 1, period).run();

    return json({ image: img, plan, used: used + 1, limit });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};