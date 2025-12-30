const Redis = require("ioredis");

// Create a shared Redis client for the app (TLS enabled for Upstash)
const redis = new Redis(process.env.REDIS_URL, {
  tls: { rejectUnauthorized: true },
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

module.exports = redis;