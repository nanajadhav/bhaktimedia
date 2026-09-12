// functions/api/auth/signup.ts — OTP verified signup (name, email, mobile, city, pincode)
import { json, uid, hashPassword, signJWT, verifyOtp } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const pass = String(body.password || "");
    const code = String(body.code || "");
    const name = String(body.name || "").trim() || email.split("@")[0];
    const phone = String(body.phone || "").replace(/\D/g, "").slice(0, 15);
    const city = String(body.city || "").trim().slice(0, 60);
    const pincode = String(body.pincode || "").replace(/\D/g, "").slice(0, 10);

    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);
    if (pass.length < 6) return json({ error: "Password kam se kam 6 characters ka rakho" }, 400);
    if (phone && phone.length !== 10) return json({ error: "Mobile 10 digits ka hona chahiye" }, 400);
    if (pincode && pincode.length !== 6) return json({ error: "Pincode 6 digits ka hona chahiye" }, 400);

    const DB = context.env.DB;
    const v = await verifyOtp(DB, email, "signup", code);
    if (!v.ok) return json({ error: v.error }, 401);

    const exists = await DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (exists) return json({ error: "Is email se account pehle se hai — login karo" }, 409);

    const id = uid();
    const salt = uid();
    const pass_hash = await hashPassword(pass, salt);
    await DB.prepare("INSERT INTO users (id, email, pass_hash, salt, name, phone, city, pincode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(id, email, pass_hash, salt, name, phone, city, pincode).run();
    await DB.prepare("INSERT INTO profiles (user_id, plan) VALUES (?, 'trial')").bind(id).run();

    const token = await signJWT({ sub: id, email, name }, context.env.AUTH_SECRET, 30);
    return json({ token, user: { id, email, name } });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};