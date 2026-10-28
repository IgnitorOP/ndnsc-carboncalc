// GET  /api/count  -> { count }   current number of people who calculated
// POST /api/count  -> { count }   adds one (called once per browser after a calculation)
//
// Storage: Upstash Redis, added from the Vercel Marketplace. The integration
// injects the credentials as environment variables; both naming schemes work.
const crypto = require("crypto");

const KEY = "ndnsc:calculations";
const PER_IP_DAILY_LIMIT = 30; // stops one device or script inflating the number

function creds() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redis(c, ...parts) {
  const path = parts.map((p) => encodeURIComponent(String(p))).join("/");
  const r = await fetch(`${c.url}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.token}` },
  });
  if (!r.ok) throw new Error(`upstash ${r.status}`);
  return (await r.json()).result;
}

function clientKey(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const ip = fwd || req.socket?.remoteAddress || "unknown";
  // Store only a one-way hash of the address, never the address itself.
  return "ndnsc:ip:" + crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const c = creds();
  if (!c) return res.status(503).json({ error: "storage_not_configured" });

  try {
    if (req.method === "GET") {
      const n = await redis(c, "get", KEY);
      return res.status(200).json({ count: Number(n) || 0 });
    }

    if (req.method === "POST") {
      const ipKey = clientKey(req);
      const hits = Number(await redis(c, "incr", ipKey));
      if (hits === 1) await redis(c, "expire", ipKey, 86400);
      if (hits > PER_IP_DAILY_LIMIT) {
        const n = await redis(c, "get", KEY);
        return res.status(200).json({ count: Number(n) || 0, limited: true });
      }
      const n = await redis(c, "incr", KEY);
      return res.status(200).json({ count: Number(n) });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "method_not_allowed" });
  } catch (e) {
    return res.status(502).json({ error: "storage_unavailable" });
  }
};
