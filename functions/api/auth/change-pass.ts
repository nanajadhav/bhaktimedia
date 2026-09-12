// functions/api/auth/change-pass.ts — login ke baad password change (OTP se)
import { json, hashPassword, uid, verifyOtp, verifyJWT, getToken } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Login zaroori hai" }, 401);
    const body = await context.request.json();
    const code = String(body.code || "");
    const pass = String(body.password || "");
    if (pass.length < 6) return json({ error: "Password kam se kam 6 characters ka rakho" }, 400);
    const DB = context.env.DB;
    const v = await verifyOtp(DB, payload.email, "change", code);
    if (!v.ok) return json({ error: v.error }, 401);
    const salt = uid();
    const pass_hash = await hashPassword(pass, salt);
    await DB.prepare("UPDATE users SET salt = ?, pass_hash = ? WHERE id = ?").bind(salt, pass_hash, payload.sub).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};