// functions/api/contact.ts — DB mein save + owner ko email + user ko confirmation
import { json, uid } from "../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const topic = String(body.topic || "General");
    const message = String(body.message || "").trim();
    if (name.length < 2) return json({ error: "Naam sahi bharo" }, 400);
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);
    if (message.length < 10) return json({ error: "Message thoda detail mein likho (kam se kam 10 characters)" }, 400);

    const DB = context.env.DB;

    // spam check: same email se 5 minute mein 3 se zyada messages nahi
    const fiveMin = Date.now() - 5 * 60 * 1000;
    const spam: any = await DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE email = ? AND created_at > ?").bind(email, fiveMin).first();
    if ((spam?.n as number) >= 3) return json({ error: "Bahut saare messages bhej diye — thodi der baad try karo" }, 429);

    // 1) PEHLE DB MEIN SAVE (message kabhi nahi khoyega)
    await DB.prepare("INSERT INTO messages (id, name, email, topic, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)").bind(uid(), name, email, topic, message, Date.now()).run();

    // 2) PHIR EMAILS
    const RESEND_KEY = context.env.RESEND_API_KEY || "";
    if (RESEND_KEY) {
      const html = `
      <div style="font-family:Arial,sans-serif;background:#f6efe6;padding:32px">
        <div style="max-width:520px;margin:auto;background:#fffdf9;border-radius:20px;padding:32px;border:1px solid #f0c674">
          <div style="text-align:center;font-size:24px;font-weight:800">📩 Naya Contact Message</div>
          <table style="width:100%;margin-top:20px;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Naam</td><td style="padding:8px;border-bottom:1px solid #f0e2cc;font-weight:700">${name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Email</td><td style="padding:8px;border-bottom:1px solid #f0e2cc;font-weight:700">${email}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Topic</td><td style="padding:8px;border-bottom:1px solid #f0e2cc;font-weight:700">${topic}</td></tr>
          </table>
          <div style="margin-top:16px;background:#fff7ea;border-radius:12px;padding:16px;font-size:14px;white-space:pre-wrap">${message}</div>
          <p style="margin-top:16px;font-size:12px;color:#8a6d4b">Reply karne ke liye is email par seedha "Reply" karo (reply_to set hai).</p>
        </div>
      </div>`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "BhaktiMedia Contact <contact@bhaktimedia.in>", to: ["nanajadhavui@gmail.com"], reply_to: email, subject: `📩 Contact: ${topic} — ${name}`, html }),
      }).catch(() => {});
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "BhaktiMedia.in <support@bhaktimedia.in>", to: [email], subject: "🪔 Aapka message mil gaya — 24 ghante mein jawab", html: `<div style="font-family:Arial,sans-serif;padding:32px"><p>Namaste ${name},</p><p>Aapka message mil gaya hai. Hamari team <b>24 ghante ke andar</b> jawab degi.</p><p>🪔 BhaktiMedia.in — Digital Devotion For Every Heart</p></div>` }),
      }).catch(() => {});
    }

    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};