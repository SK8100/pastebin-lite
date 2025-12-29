import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/kv";
import { nowMs } from "@/lib/time";
import type { Paste } from "@/types/paste";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const paste = (await redis.get(`paste:${id}`)) as Paste | null;

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // TTL check
  if (paste.expiresAt && nowMs() >= paste.expiresAt) {
    await redis.del(`paste:${id}`);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  // View limit check
  if (paste.remainingViews !== null) {
    if (paste.remainingViews <= 0) {
      await redis.del(`paste:${id}`);
      return NextResponse.json(
        { error: "View limit exceeded" },
        { status: 404 }
      );
    }
    paste.remainingViews -= 1;
  }

  await redis.set(`paste:${id}`, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remainingViews,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
