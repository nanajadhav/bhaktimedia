// functions/api/credits.ts — AI credits + murti credits
import { json, getToken, verifyJWT, LIMITS, MURTI_LIMITS } from "../_lib";

export const onRequestGet = async (context: any) => {
  const token = getToken(context);
  const payload = token ? await verifyJWT(token, context.env.AUTH_SECRET) : null;
  if (!payload) return json({ error: "Login karo" }, 401);
  const DB = context.env.DB;
  const prof = await DB.prepare("SELECT plan FROM profiles WHERE user_id = ?").bind(payload.sub).first();
  const plan = (prof?.plan as string) || "trial";
  const period = new Date().toISOString().slice(0, 7);
  const row = await DB.prepare("SELECT used FROM usage WHERE user_id = ? AND feature = 'images' AND period = ?").bind(payload.sub, period).first();
  const mrow = await DB.prepare("SELECT used FROM usage WHERE user_id = ? AND feature = 'murti' AND period = ?").bind(payload.sub, period).first();
  return json({
    plan,
    used: (row?.used as number) || 0,
    limit: LIMITS[plan] ?? 3,
    murtiUsed: (mrow?.used as number) || 0,
    murtiLimit: MURTI_LIMITS[plan] ?? 3,
  });
};