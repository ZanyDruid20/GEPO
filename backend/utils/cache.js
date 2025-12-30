const redis = require("../db/redis");

const DEFAULT_TTL_SECONDS = 300;

function tokenKey(token) {
  return token ? "auth" : "anon";
}

async function getJSON(key) {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Redis get failed", err.message);
    return null;
  }
}

async function setJSON(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
  if (value === undefined) return;
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.warn("Redis set failed", err.message);
  }
}

async function withCache(key, ttlSeconds, fetcher) {
  const ttl = ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const cached = await getJSON(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  if (fresh !== undefined) {
    await setJSON(key, fresh, ttl);
  }
  return fresh;
}

module.exports = {
  DEFAULT_TTL_SECONDS,
  getJSON,
  setJSON,
  withCache,
  tokenKey,
};
