// functions/api/murti-download.ts — quota check karke full-res URL do
import { json, getToken, verifyJWT, MURTI_LIMITS } from "../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Pehle login karo" }, 401);
    const body = await context.request.json();
    const id = String(body.id || "");
    const cat = String(body.cat || "").toLowerCase();
    if (!/^[a-z0-9-]+$/i.test(id)) return json({ error: "Galat image id" }, 400);
    if (!/^[a-z]{2,20}$/.test(cat)) return json({ error: "Galat category" }, 400);
    const DB = context.env.DB;
    const prof = await DB.prepare("SELECT plan FROM profiles WHERE user_id = ?").bind(payload.sub).first();
    const plan = (prof?.plan as string) || "trial";
    const limit = MURTI_LIMITS[plan] ?? 10;
    const period = new Date().toISOString().slice(0, 7);
    const row = await DB.prepare("SELECT id, used FROM usage WHERE user_id = ? AND feature = 'murti' AND period = ?").bind(payload.sub, period).first();
    const used = (row?.used as number) || 0;
    if (used >= limit) return json({ error: "Murti quota khatam! Plan upgrade karo." }, 402);
    if (row) await DB.prepare("UPDATE usage SET used = ? WHERE id = ?").bind(used + 1, row.id).run();
    else await DB.prepare("INSERT INTO usage (user_id, feature, used, period) VALUES (?, ?, ?, ?)").bind(payload.sub, "murti", 1, period).run();
    return json({ ok: true, url: `/murti/${cat}/full/${id}.png`, left: limit - used - 1, cost: 0.5 });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};