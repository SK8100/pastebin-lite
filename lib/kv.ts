import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || process.env.REDIS_url || process.env.UPSTASH_REDIS_REST_URL;

// Prevent Redis from connecting during build time (Vercel/Next.js build)
const isBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.REDIS_URL;

if (!redisUrl && !isBuild) {
  console.warn("Redis environment variables are missing!");
}

export const redis = new Redis(redisUrl || "redis://localhost:6379", {
  lazyConnect: true,
});

// Prevent unhandled error events from crashing the process
redis.on("error", (err) => {
  // Only log if not during build to keep logs clean
  if (!isBuild) {
    console.error("Redis error:", err.message);
  }
});
