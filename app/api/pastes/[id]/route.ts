import kv from "@/lib/kv";
import { getPaste, isExpired } from "@/lib/paste";

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await getPaste(params.id);

  if (!paste || await isExpired(paste)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await kv.set(key, paste);
  }

  return Response.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}