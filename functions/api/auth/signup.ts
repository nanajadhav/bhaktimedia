// functions/api/auth/login.ts — password YA OTP se login
import { json, hashPassword, signJWT, verifyOtp } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const DB = context.env.DB;
    const user = await DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!user) return json({ error: "Email ya password galat hai" }, 401);

    if (body.code) {
      const v = await verifyOtp(DB, email, "login", String(body.code));
      if (!v.ok) return json({ error: v.error }, 401);
    } else {
      const hash = await hashPassword(String(body.password || ""), user.salt as string);
      if (hash !== user.pass_hash) return json({ error: "Email ya password galat hai" }, 401);
    }

    const token = await signJWT({ sub: user.id as string, email, name: user.name as string }, context.env.AUTH_SECRET, 30);
    return json({ token, user: { id: user.id, email, name: user.name } });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};