const redis = require("../db/redis");

const DEFAULT_TTL_SECONDS = 300;

// Simple in-memory counters for hit/miss instrumentation (resettable).
const stats = {
  hits: 0,
  misses: 0,
};

function resetCacheStats() {
  stats.hits = 0;
  stats.misses = 0;
}

function getCacheStats() {
  return { ...stats };
}

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
  if (cached !== null) {
    stats.hits += 1;
    return cached;
  }

  stats.misses += 1;
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
  getCacheStats,
  resetCacheStats,
};
