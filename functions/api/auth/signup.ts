// functions/api/auth/signup.ts
import { json, uid, hashPassword, signJWT } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const pass = String(body.password || "");
    const name = String(body.name || "").trim() || email.split("@")[0];
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);
    if (pass.length < 6) return json({ error: "Password kam se kam 6 characters ka rakho" }, 400);
    const DB = context.env.DB;
    const exists = await DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (exists) return json({ error: "Is email se account pehle se hai — login karo" }, 409);
    const id = uid();
    const salt = uid();
    const pass_hash = await hashPassword(pass, salt);
    await DB.prepare("INSERT INTO users (id, email, pass_hash, salt, name) VALUES (?, ?, ?, ?, ?)").bind(id, email, pass_hash, salt, name).run();
    await DB.prepare("INSERT INTO profiles (user_id, plan) VALUES (?, 'trial')").bind(id).run();
    const token = await signJWT({ sub: id, email, name }, context.env.AUTH_SECRET, 30);
    return json({ token, user: { id, email, name } });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};