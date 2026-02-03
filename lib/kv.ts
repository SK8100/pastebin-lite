import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || process.env.REDIS_url || process.env.UPSTASH_REDIS_REST_URL;

if (!redisUrl) {
  console.warn("Redis environment variables are missing!");
}

export const redis = new Redis(redisUrl!);

// Prevent unhandled error events from crashing the process during build or runtime
redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});
