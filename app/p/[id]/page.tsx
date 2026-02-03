import { notFound } from "next/navigation";
import { redis } from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { Paste } from "@/types/paste";

async function getPasteData(id: string): Promise<Paste | null> {
  const key = `paste:${id}`;

  // Script logic duplicated here for direct server-side fetch
  const script = `
    local paste = redis.call('get', KEYS[1])
    if not paste then return nil end
    local data = cjson.decode(paste)
    
    if data.expires_at and ARGV[1] > tostring(data.expires_at) then
      return nil
    end

    if data.remaining_views ~= nil then
      if data.remaining_views <= 0 then
        return nil
      end
      data.remaining_views = data.remaining_views - 1
      redis.call('set', KEYS[1], cjson.encode(data))
    end
    
    return cjson.encode(data)
  `;

  const now = await nowMs();
  const result = await redis.eval(script, 1, key, now.toString()) as string | null;

  return result ? JSON.parse(result) : null;
}

export default async function PastePage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = params instanceof Promise ? await params : params;
  const paste = await getPasteData(id);

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: "24px", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#111",
          color: "#eee",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}