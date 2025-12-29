// import kv from "@/lib/kv";
// import { getPaste, isExpired } from "@/lib/paste";

// export async function GET(
//   _: Request,
//   { params }: { params: { id: string } }
// ) {
//   const key = `paste:${params.id}`;
//   const paste = await getPaste(params.id);

//   if (!paste || await isExpired(paste)) {
//     return Response.json({ error: "Not found" }, { status: 404 });
//   }

//   if (paste.remaining_views !== null) {
//     if (paste.remaining_views <= 0) {
//       return Response.json({ error: "Not found" }, { status: 404 });
//     }

//     paste.remaining_views -= 1;
//     await kv.set(key, paste);
//   }

//   return Response.json({
//     content: paste.content,
//     remaining_views: paste.remaining_views,
//     expires_at: paste.expires_at
//       ? new Date(paste.expires_at).toISOString()
//       : null,
//   });
// }


import { redis } from "@/lib/kv";
>>>>>>> 79e72a6 (Switch persistence to Upstash Redis)
import { getPaste, isExpired } from "@/lib/paste";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  // If params might be a promise, await it
  const { id } = params instanceof Promise ? await params : params;

  const key = `paste:${id}`;
  const paste = await getPaste(id);

  if (!paste || await isExpired(paste)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await redis.set(key, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
