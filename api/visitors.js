
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query.id;

  // Session IDs must be UUIDs.
  if (
    typeof id !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(id)
  ) {
    return res.status(400).json({ error: "Invalid session" });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return res.status(503).json({
      error: "Visitor counter is not configured"
    });
  }

  const key = "mens-power:active-visitors";
  const now = Date.now();
  const cutoff = now - 5 * 60 * 1000;

  async function redis(command) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(command)
    });

    if (!response.ok) {
      throw new Error("Redis request failed");
    }

    const result = await response.json();

    if (result.error) throw new Error(result.error);

    return result.result;
  }

  try {
    // Refresh this browser session's activity timestamp.
    await redis(["ZADD", key, String(now), id]);

    // Remove sessions inactive for over five minutes.
    await redis(["ZREMRANGEBYSCORE", key, "-inf", String(cutoff)]);

    const online = await redis(["ZCARD", key]);

    return res.status(200).json({
      online: Number(online)
    });
  } catch {
    return res.status(503).json({
      error: "Visitor count temporarily unavailable"
    });
  }
}
