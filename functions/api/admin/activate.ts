// functions/api/admin/activate.ts — ADMIN: UTR verify → plan active → invoice email
import { json } from "../../_lib";

export const onRequestPost = async (context: any) => {
  try {
    const key = context.request.headers.get("x-admin-key") || "";
    if (!context.env.ADMIN_KEY || key !== context.env.ADMIN_KEY) return json({ error: "Admin key galat" }, 403);
    const body = await context.request.json();
    const utr = String(body.utr || "").trim();
    const DB = context.env.DB;
    const pay: any = await DB.prepare("SELECT * FROM payments WHERE utr = ? AND status = 'pending'").bind(utr).first();
    if (!pay) return json({ error: "Is UTR se koi pending payment nahi mili" }, 404);

    await DB.prepare("UPDATE payments SET status = 'paid' WHERE id = ?").bind(pay.id).run();
    await DB.prepare("UPDATE profiles SET plan = ? WHERE user_id = ?").bind(pay.plan, pay.user_id).run();
    const user: any = await DB.prepare("SELECT email, name FROM users WHERE id = ?").bind(pay.user_id).first();

    const RESEND_KEY = context.env.RESEND_API_KEY || "";
    if (RESEND_KEY && user) {
      const d = new Date(pay.created_at as number);
      const html = `
      <div style="font-family:Arial,sans-serif;background:#f6efe6;padding:32px">
        <div style="max-width:520px;margin:auto;background:#fffdf9;border-radius:20px;padding:32px;border:1px solid #f0c674">
          <div style="text-align:center;font-size:26px;font-weight:800">🪔 Bhakti<span style="color:#f97316">Media</span>.in</div>
          <p style="text-align:center;color:#8a6d4b;font-size:13px">Digital Devotion For Every Heart</p>
          <h2 style="text-align:center;margin:24px 0 4px">Payment Invoice ✅</h2>
          <p style="text-align:center;color:#8a6d4b;font-size:13px">Namaste ${user.name || ""}, aapka payment confirm ho gaya!</p>
          <table style="width:100%;margin-top:24px;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:10px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Plan</td><td style="padding:10px;border-bottom:1px solid #f0e2cc;font-weight:700;text-transform:uppercase">${pay.plan}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Amount</td><td style="padding:10px;border-bottom:1px solid #f0e2cc;font-weight:700">₹${pay.amount}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">UTR / Ref</td><td style="padding:10px;border-bottom:1px solid #f0e2cc;font-weight:700">${pay.utr}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f0e2cc;color:#8a6d4b">Date</td><td style="padding:10px;border-bottom:1px solid #f0e2cc;font-weight:700">${d.toLocaleDateString("en-IN")}</td></tr>
            <tr><td style="padding:10px;color:#8a6d4b">Status</td><td style="padding:10px;font-weight:800;color:#16a34a">PAID ✅</td></tr>
          </table>
          <p style="margin-top:24px;font-size:13px;color:#8a6d4b">Aapka plan turant active ho gaya hai — studio aur gallery mein naye limits lagu hain. 🙏</p>
          <p style="text-align:center;margin-top:16px;font-size:11px;color:#b39b77">© BhaktiMedia.in — ye computer-generated invoice hai</p>
        </div>
      </div>`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "BhaktiMedia Billing <billing@bhaktimedia.in>", to: [user.email], subject: `🪔 BhaktiMedia Invoice — ${String(pay.plan).toUpperCase()} plan (₹${pay.amount})`, html }),
      });
    }
    return json({ ok: true, plan: pay.plan, email: user?.email || null });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};