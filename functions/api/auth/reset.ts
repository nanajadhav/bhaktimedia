// functions/api/auth/reset.ts — OTP verify + naya password set
import { json, hashPassword, uid, verifyOtp } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const code = String(body.code || "");
    const pass = String(body.password || "");
    if (pass.length < 6) return json({ error: "Password kam se kam 6 characters ka rakho" }, 400);
    const DB = context.env.DB;
    const v = await verifyOtp(DB, email, "reset", code);
    if (!v.ok) return json({ error: v.error }, 401);
    const salt = uid();
    const pass_hash = await hashPassword(pass, salt);
    await DB.prepare("UPDATE users SET salt = ?, pass_hash = ? WHERE email = ?").bind(salt, pass_hash, email).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};