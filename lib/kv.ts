import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || process.env.REDIS_url || process.env.UPSTASH_REDIS_REST_URL;

// Prevent Redis from connecting during build time
const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL);

if (!redisUrl && !isBuild) {
  console.warn("Redis environment variables (REDIS_URL, REDIS_url, or UPSTASH_REDIS_REST_URL) are missing!");
}

// Log connection attempt (obfuscated)
if (!isBuild && redisUrl) {
  const url = new URL(redisUrl.startsWith('redis') ? redisUrl : `redis://${redisUrl}`);
  console.log(`[Redis] Connecting to ${url.hostname}:${url.port}...`);
}

export const redis = new Redis(redisUrl || "redis://localhost:6379", {
  lazyConnect: true,
  connectTimeout: 10000, // 10 seconds
  maxRetriesPerRequest: 3, // Fail faster if the server is unreachable
  // Enable TLS if the URL starts with rediss://
  tls: redisUrl?.startsWith("rediss://") ? {} : undefined,
});

redis.on("error", (err) => {
  if (!isBuild) {
    console.error("Redis Connection Error:", err.message);
  }
});
