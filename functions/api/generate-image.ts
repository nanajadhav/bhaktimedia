// functions/api/generate-image.ts — D1 auth + credits (3⚡/creation, 6⚡/HD) + template-locked edits
import { json, getToken, verifyJWT, LIMITS } from "../_lib";

function bufToB64(buf: ArrayBuffer) {
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
function cleanText(s: string) {
  return String(s || "").replace(/["\n\r\\]/g, " ").trim();
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

    const body = await context.request.json();
    const hd = !!body.hd;
    const cost = hd ? 6 : 3;
    if (used + cost > limit) return json({ error: "Credits khatam! Plan upgrade karo." }, 402);
    const quality = hd ? "high" : "medium";

    let photoBytes: Uint8Array | null = null;
    if (body.photo) {
      const b64 = String(body.photo).includes(",") ? String(body.photo).split(",")[1] : String(body.photo);
      photoBytes = b64ToBytes(b64);
    }

    let templateBytes: Uint8Array | null = null;
    if (body.template) {
      const origin = new URL(context.request.url).origin;
      const tUrl = String(body.template).startsWith("http") ? String(body.template) : origin + String(body.template);
      const tr = await fetch(tUrl);
      if (tr.ok) templateBytes = new Uint8Array(await tr.arrayBuffer());
      else return json({ error: "Template load nahi hua: " + String(body.template) }, 500);
    }

    let r: Response;
    if (templateBytes && photoBytes) {
      const name = cleanText(body.name);
      const msg = cleanText(body.msg);
      const lang = String(body.lang || "mr");
      const langLine = lang === "mr"
        ? "render the name and the wish line in Devanagari script (Marathi), transliterating any Latin-script input"
        : "render the name and the wish line in English using Latin script";
      const prompt = `Image 1 = our official festival poster template.
Image 2 = the customer's photo (the person may be a child, boy, girl, man or woman).
Edit image 1 with ONLY these changes:
1. Completely REMOVE the existing person/figure from image 1. Place the person from image 2 in that freed area (or a suitable prominent side area if the space is tight), keeping the person's OWN face, appearance, clothing and natural pose from image 2. Blend the person cleanly into the poster's lighting, color grade and art style. The face must be clearly recognizable, respectful and dignified.
2. Write the name text exactly as: "${name}" and the wish line exactly as: "${msg}" in the template's existing decorative name-block style (create a matching decorative name block at the bottom if the template has none).
3. Language rule: ${langLine}.
Everything else must remain EXACTLY as image 1 — same layout, same deity artwork, same background, same colors, same borders, same ornaments, all other existing text unchanged and correctly spelled. Clean print-quality output, no extra watermarks or logos.`;
      const form = new FormData();
      form.append("model", MODEL);
      form.append("size", body.size || "1024x1536");
      form.append("quality", quality);
      form.append("image[]", new File([templateBytes], "template.png", { type: "image/png" }));
      form.append("image[]", new File([photoBytes], "photo.png", { type: "image/png" }));
      form.append("prompt", prompt);
      r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${OPENAI_KEY}` }, body: form });
    } else if (photoBytes) {
      const form = new FormData();
      form.append("model", MODEL);
      form.append("prompt", body.prompt || "poster");
      form.append("size", body.size || "1024x1536");
      form.append("quality", quality);
      form.append("image", new File([photoBytes], "photo.png", { type: "image/png" }));
      r = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${OPENAI_KEY}` }, body: form });
    } else {
      r = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({ model: MODEL, prompt: body.prompt || "divine art", size: body.size || "1024x1024", quality, n: 1 }),
      });
    }

    const data = await r.json();
    const item = data?.data?.[0];
    let img = item?.b64_json ? `data:image/png;base64,${item.b64_json}` : item?.url || null;
    if (!img) return json({ error: data?.error?.message || "Image fail" }, 502);
    if (img.startsWith("http")) img = `data:image/png;base64,${bufToB64(await (await fetch(img)).arrayBuffer())}`;

    if (row) await DB.prepare("UPDATE usage SET used = ? WHERE id = ?").bind(used + cost, row.id).run();
    else await DB.prepare("INSERT INTO usage (user_id, feature, used, period) VALUES (?, ?, ?, ?)").bind(payload.sub, "images", cost, period).run();
    return json({ image: img, plan, used: used + cost, limit, cost });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};