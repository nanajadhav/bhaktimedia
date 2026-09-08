// functions/api/generate-image.ts — Cloudflare (OpenAI generations + edits, credits, sab secret)
const SUPABASE_URL = "https://sbzlypodjpqoukhzxhfo.supabase.co";
const SUPABASE_ANON = "sb_publishable_m3drS7J8YIwutJQ9piiGJQ_sFaPj9js";

const LIMITS: Record<string, number> = { trial: 3, starter: 20, growth: 100, scale: 999999 };

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

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

    const token = (context.request.headers.get("Authorization") || "").replace("Bearer ", "");
    if (!token) return json({ error: "Pehle login karo" }, 401);

    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
    });
    if (!userRes.ok) return json({ error: "Session invalid — dobara login karo" }, 401);
    const user = await userRes.json();

    const profRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?select=plan&id=eq.${user.id}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` },
    });
    const prof = await profRes.json();
    const plan = prof?.[0]?.plan || "trial";
    const limit = LIMITS[plan] ?? 3;

    const period = new Date().toISOString().slice(0, 7);
    const useRes = await fetch(
      `${SUPABASE_URL}/rest/v1/usage?select=id,used&user_id=eq.${user.id}&feature=eq.images&period=eq.${period}`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` } }
    );
    const rows = await useRes.json();
    const used = rows?.[0]?.used ?? 0;
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
      r = await fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${OPENAI_KEY}` },
        body: form,
      });
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
    if (img.startsWith("http")) {
      const ir = await fetch(img);
      img = `data:image/png;base64,${bufToB64(await ir.arrayBuffer())}`;
    }

    const auth = { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=minimal" };
    if (rows.length) {
      await fetch(`${SUPABASE_URL}/rest/v1/usage?id=eq.${rows[0].id}`, { method: "PATCH", headers: auth, body: JSON.stringify({ used: used + 1 }) });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/usage`, { method: "POST", headers: auth, body: JSON.stringify({ user_id: user.id, feature: "images", used: 1, period }) });
    }

    return json({ image: img, plan, used: used + 1, limit });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};