import { redis } from "./kv";
import { nowMs } from "./time";
import { Paste } from "@/types/paste";

export async function getPaste(id: string): Promise<Paste | null> {
  const data = await redis.get(`paste:${id}`);
  if (!data) return null;
  try {
    return JSON.parse(data) as Paste;
  } catch (error) {
    console.error("Failed to parse paste data from Redis:", error);
    return null;
  }
}

export async function savePaste(paste: Paste) {
  await redis.set(`paste:${paste.id}`, JSON.stringify(paste));
}

export async function isExpired(paste: Paste): Promise<boolean> {
  if (!paste.expires_at) return false;
  return (await nowMs()) > paste.expires_at;
}