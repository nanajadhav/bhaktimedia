// functions/api/razorpay-order.ts — Razorpay order create (UPI QR checkout)
// Consent shield: checkout ke checkbox se aaya policy consent
// Razorpay order notes mein record hota hai (har payment ka permanent proof)
import { json, getToken, verifyJWT, uid } from "../_lib";

const PRICES: Record<string, number> = {
    starter: 199, growth: 599, scale: 1199,
  "pack-30": 30, "pack-99": 99, "pack-299": 299, "pack-899": 899,
};

export const onRequestPost = async (context: any) => {
  try {
    const payload = await verifyJWT(getToken(context), context.env.AUTH_SECRET);
    if (!payload) return json({ error: "Pehle login karo" }, 401);
    const KEY = context.env.RAZORPAY_KEY_ID || "";
    const SECRET = context.env.RAZORPAY_KEY_SECRET || "";
    if (!KEY || !SECRET) return json({ error: "Razorpay setup baaki hai" }, 500);
    const body = await context.request.json();
    const plan = String(body.plan || body.pack || "");
    if (!PRICES[plan]) return json({ error: "Galat plan" }, 400);

    // ── consent record (checkout ke checkbox se aata hai) ──
    const consent = body.consent || {};
    const consentAccepted = consent.accepted === true;
    const consentAt = String(consent.at || "");
    const consentVersion = String(consent.version || "v1");

    const DB = context.env.DB;
    const r = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: "Basic " + btoa(KEY + ":" + SECRET), "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: PRICES[plan] * 100,
        currency: "INR",
        receipt: uid(),
        notes: {
          plan,
          user_id: payload.sub,
          policy_consent: consentAccepted ? "accepted-" + consentVersion : "not-accepted",
          consent_at: consentAt,
        },
      }),
    });
    const order = await r.json();
    if (!order.id) return json({ error: order.error?.description || "Order fail" }, 502);
    await DB.prepare("INSERT INTO payments (id, user_id, plan, amount, utr, status, created_at, rzp_order_id) VALUES (?, ?, ?, ?, '', 'pending', ?, ?)").bind(uid(), payload.sub, plan, PRICES[plan], Date.now(), order.id).run();
    return json({ orderId: order.id, amount: PRICES[plan] * 100, key: KEY, plan });
  } catch (e: any) {
    return json({ error: String(e) }, 500);
  }
};