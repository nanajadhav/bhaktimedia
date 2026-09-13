// functions/api/plan-request.ts — user UTR submit karta hai, admin verify karega
import { json, getToken, verifyJWT, uid } from "../_lib";

const PRICES: Record<string, number> = { starter: 1, growth: 599, scale: 1199 }; // TEST MODE: Starter ₹1

export const onRequestPost = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Pehle login karo" }, 401);
    const body = await context.request.json();
    const plan = String(body.plan || "");
    const utr = String(body.utr || "").trim();
    if (!PRICES[plan]) return json({ error: "Galat plan" }, 400);
    if (utr.length < 8) return json({ error: "Sahi UTR / reference number daalo" }, 400);
    const DB = context.env.DB;
    const dup = await DB.prepare("SELECT id FROM payments WHERE user_id = ? AND plan = ? AND status = 'pending'").bind(payload.sub, plan).first();
    if (dup) return json({ error: "Aapki request pehle se verification mein hai — 24h mein activate hogi" }, 409);
    await DB.prepare("INSERT INTO payments (id, user_id, plan, amount, utr, status, created_at) VALUES (?, ?, ?, ?, ?, 'pending', ?)").bind(uid(), payload.sub, plan, PRICES[plan], utr, Date.now()).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};