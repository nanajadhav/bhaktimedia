// functions/api/subscribe.ts — newsletter signup
import { json, uid } from "../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const body = await context.request.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: "Email sahi nahi hai" }, 400);
    const DB = context.env.DB;
    const existing = await DB.prepare("SELECT id FROM subscribers WHERE email = ?").bind(email).first();
    if (existing) return json({ ok: true, note: "pehle se subscribed ho!" });
    await DB.prepare("INSERT INTO subscribers (id, email, status, created_at) VALUES (?, ?, 'active', ?)").bind(uid(), email, Date.now()).run();

    const RESEND_KEY = context.env.RESEND_API_KEY || "";
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "BhaktiMedia.in <support@bhaktimedia.in>",
          to: [email],
          subject: "🪔 Bhakti Newsletter mein swagat hai!",
          html: `<div style="font-family:Arial,sans-serif;padding:32px"><p>Namaste 🙏</p><p>Aap <b>Bhakti Newsletter</b> se jud gaye ho — har mahine ek email: festival design packs, blessings aur behind-the-scenes seva.</p><p>Zero spam. Unsubscribe kabhi bhi.</p><p>🪔 BhaktiMedia.in</p></div>`,
        }),
      }).catch(() => {});
    }
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};