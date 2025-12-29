import kv from "./kv";
import { nowMs } from "./time";
import { Paste } from "@/types/paste";

export async function getPaste(id: string): Promise<Paste | null> {
  return await kv.get<Paste>(`paste:${id}`);
}

export async function savePaste(paste: Paste) {
  await kv.set(`paste:${paste.id}`, paste);
}

export async function isExpired(paste: Paste): Promise<boolean> {
  if (!paste.expires_at) return false;
  return (await nowMs()) > paste.expires_at;
}