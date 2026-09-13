// functions/_lib.ts — shared helpers
export function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
export function uid(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function sha256hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return bufToHex(buf);
}
export async function hashPassword(pass: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return bufToHex(bits);
}
function b64urlFromString(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function stringFromB64url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}
export async function signJWT(payload: Record<string, unknown>, secret: string, days = 30): Promise<string> {
  const header = b64urlFromString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = b64urlFromString(JSON.stringify({ ...payload, iat: now, exp: now + days * 86400 }));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const sigStr = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${data}.${sigStr}`;
}
export async function verifyJWT(token: string, secret: string): Promise<any | null> {
  try {
    const [h, b, s] = token.split(".");
    if (!h || !b || !s) return null;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const sig = Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(`${h}.${b}`));
    if (!ok) return null;
    const payload = JSON.parse(stringFromB64url(b));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}
export function getToken(context: any): string {
  return (context.request.headers.get("Authorization") || "").replace("Bearer ", "");
}
export const LIMITS: Record<string, number> = { trial: 3, starter: 60, growth: 225, scale: 540 };

export const MURTI_LIMITS: Record<string, number> = { trial: 3, starter: 15, growth: 30, scale: 60 };

// ═══ OTP + EMAIL ═══
export function otpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}
export async function sendOtpMail(env: any, to: string, code: string, heading: string): Promise<boolean> {
  const key = env.RESEND_API_KEY || "";
  if (!key) return false;
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#faf5ef;font-family:Arial,Helvetica,sans-serif;padding:32px">
  <div style="max-width:420px;margin:auto;background:#ffffff;border-radius:20px;padding:32px;text-align:center;border:1px solid #f0e4d7">
    <div style="font-size:36px">🪔</div>
    <div style="font-size:20px;font-weight:800;color:#1c1917;margin-top:6px">Bhakti<span style="color:#f97316">Media</span>.in</div>
    <p style="color:#57534e;font-size:14px;margin:18px 0 6px">${heading}</p>
    <div style="font-size:34px;font-weight:900;letter-spacing:8px;color:#ea580c;background:#fff7ed;border:1px dashed #fdba74;border-radius:14px;padding:14px;margin:14px 0">${code}</div>
    <p style="color:#a8a29e;font-size:12px">Ye code 10 minute tak valid hai. Kisi ke saath share na karein.</p>
    <p style="color:#d6d3d1;font-size:11px;margin-top:18px">© BhaktiMedia.in — Digital Devotion For Every Heart</p>
  </div></body></html>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "BhaktiMedia <otp@bhaktimedia.in>", to: [to], subject: `BhaktiMedia verification code: ${code}`, html }),
    });
    return r.ok;
  } catch { return false; }
}
export async function verifyOtp(DB: any, email: string, purpose: string, code: string): Promise<{ ok: boolean; error?: string }> {
  const row = await DB.prepare("SELECT * FROM otps WHERE email = ? AND purpose = ? AND used = 0 ORDER BY id DESC LIMIT 1").bind(email, purpose).first();
  if (!row) return { ok: false, error: "Pehle code bhejo" };
  if (Date.now() > (row.expires_at as number)) return { ok: false, error: "Code expire ho gaya — naya bhejo" };
  if ((row.attempts as number) >= 3) return { ok: false, error: "Bahut galat attempts — naya code bhejo" };
  const h = await sha256hex(code + email);
  if (h !== row.code_hash) {
    await DB.prepare("UPDATE otps SET attempts = attempts + 1 WHERE id = ?").bind(row.id).run();
    return { ok: false, error: "Code galat hai" };
  }
  await DB.prepare("UPDATE otps SET used = 1 WHERE id = ?").bind(row.id).run();
  return { ok: true };
}