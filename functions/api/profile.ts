// functions/api/profile.ts — GET: profile+plan+credits | PUT: details update
import { json, verifyJWT, getToken } from "../_lib";

export const onRequestGet = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Login zaroori hai" }, 401);
    const DB = context.env.DB;
    const user = await DB.prepare("SELECT id, email, name, phone, city, pincode FROM users WHERE id = ?").bind(payload.sub).first();
    if (!user) return json({ error: "User nahi mila" }, 404);
    const prof = await DB.prepare("SELECT plan FROM profiles WHERE user_id = ?").bind(payload.sub).first();
    const nowD = new Date();
    const used = await DB.prepare("SELECT COUNT(*) AS n FROM usage WHERE user_id = ? AND month = ? AND year = ?").bind(payload.sub, nowD.getUTCMonth() + 1, nowD.getUTCFullYear()).first();
    return json({ ...user, plan: (prof && prof.plan) || "trial", used: (used && used.n) || 0 });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};

export const onRequestPut = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Login zaroori hai" }, 401);
    const body = await context.request.json();
    const name = String(body.name || "").trim().slice(0, 60);
    const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
    const city = String(body.city || "").trim().slice(0, 60);
    const pincode = String(body.pincode || "").replace(/\D/g, "").slice(0, 10);
    if (!name) return json({ error: "Naam zaroori hai" }, 400);
    const DB = context.env.DB;
    await DB.prepare("UPDATE users SET name = ?, phone = ?, city = ?, pincode = ? WHERE id = ?").bind(name, phone, city, pincode, payload.sub).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};