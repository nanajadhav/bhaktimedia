// functions/api/auth/login.ts — password YA OTP code se login
import { json, signJWT, verifyOtp, hashPassword } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const code = String(body.code || "");
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);

    const DB = context.env.DB;
    const user = await DB.prepare("SELECT id, email, name, pass_hash, salt FROM users WHERE email = ?").bind(email).first();
    if (!user) return json({ error: "Is email se koi account nahi mila — signup karo" }, 404);

    if (code) {
      // ═══ OTP LOGIN: code verify hota hai (purpose: login) ═══
      const v = await verifyOtp(DB, email, "login", code);
      if (!v.ok) return json({ error: v.error }, 401);
    } else if (password) {
      // ═══ PASSWORD LOGIN ═══
      const hash = await hashPassword(password, (user.salt as string) || "");
      if (hash !== (user.pass_hash as string)) return json({ error: "Password galat hai — ya OTP se login karo" }, 401);
    } else {
      return json({ error: "Password ya OTP code — koi ek bharo" }, 400);
    }

    const token = await signJWT({ sub: user.id as string, email }, context.env.AUTH_SECRET, 60 * 60 * 24 * 7);
    return json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};