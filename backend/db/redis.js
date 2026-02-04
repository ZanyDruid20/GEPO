const Redis = require("ioredis");

// Create a shared Redis client for the app (TLS enabled for Upstash)
// Non-fatal on error so app can start without Redis
let redis;

try {
  redis = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: true },
    retryStrategy: (times) => Math.min(times * 50, 2000), // Retry with backoff
  });
} catch (err) {
  console.error("Failed to create Redis client:", err.message);
  redis = null;
}

if (redis) {
  redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
  });
  
  redis.on("connect", () => {
    console.log("Redis connected");
  });
}

module.exports = redis;