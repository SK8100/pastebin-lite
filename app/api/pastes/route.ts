export const dynamic = "force-dynamic";

import { nanoid } from "nanoid";
import { validateCreatePaste } from "@/lib/validators";
import { savePaste } from "@/lib/paste";
import { nowMs } from "@/lib/time";

export async function POST(req: Request) {
  const body = await req.json();
  const error = validateCreatePaste(body);

  if (error) {
    return Response.json({ error }, { status: 400 });
  }

  const id = nanoid(8);
  const created = await nowMs();

  const expires_at = body.ttl_seconds
    ? created + body.ttl_seconds * 1000
    : null;

  const paste = {
    id,
    content: body.content,
    created_at: created,
    expires_at,
    remaining_views: body.max_views ?? null,
  };

  await savePaste(paste);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}