// functions/api/auth/otp.ts — OTP bhejo (signup / login / reset / change)
import { json, sha256hex, otpCode, sendOtpMail, verifyJWT, getToken } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    let email = String(body.email || "").trim().toLowerCase();
    const purpose = String(body.purpose || "");
    if (!["signup", "login", "reset", "change"].includes(purpose)) return json({ error: "Galat request" }, 400);
    const DB = context.env.DB;

    if (purpose === "change") {
      const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
      if (!payload) return json({ error: "Login zaroori hai" }, 401);
      email = payload.email;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);

    const user = await DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (purpose === "signup" && user) return json({ error: "Is email se account pehle se hai — login karo" }, 409);
    if (purpose !== "signup" && !user) return json({ error: "Is email se koi account nahi mila" }, 404);

    const now = Date.now();
    const last = await DB.prepare("SELECT created_at FROM otps WHERE email = ? AND purpose = ? ORDER BY id DESC LIMIT 1").bind(email, purpose).first();
    if (last && now - (last.created_at as number) < 60000) return json({ error: "60 second ruk kar dobara bhejo" }, 429);

    const code = otpCode();
    const code_hash = await sha256hex(code + email);
    await DB.prepare("INSERT INTO otps (email, purpose, code_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)").bind(email, purpose, code_hash, now + 600000, now).run();

    const headings: Record<string, string> = {
      signup: "Apna email verify karo — signup ke liye",
      login: "Login ke liye one-time code",
      reset: "Password reset karne ke liye code",
      change: "Password change karne ke liye code",
    };
    const ok = await sendOtpMail(context.env, email, code, headings[purpose]);
    if (!ok) return json({ error: "Email bhejna fail hua — Resend setup check karo" }, 500);
    return json({ sent: true, expires: 600 });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};