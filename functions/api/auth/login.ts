// functions/api/auth/login.ts
import { json, hashPassword, signJWT } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const pass = String(body.password || "");
    const DB = context.env.DB;
    const user = await DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!user) return json({ error: "Email ya password galat hai" }, 401);
    const hash = await hashPassword(pass, user.salt as string);
    if (hash !== user.pass_hash) return json({ error: "Email ya password galat hai" }, 401);
    const token = await signJWT({ sub: user.id as string, email, name: user.name as string }, context.env.AUTH_SECRET, 30);
    return json({ token, user: { id: user.id, email, name: user.name } });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};
