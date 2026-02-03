export const dynamic = "force-dynamic";

import { redis } from "@/lib/kv";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await redis.ping();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
