import kv from "@/lib/kv";

export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL) {
      return Response.json({ ok: false, reason: "kv_not_configured" });
    }

    await kv.ping();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false });
  }
}
