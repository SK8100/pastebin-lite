import { getPaste, isExpired } from "@/lib/paste";
import { redis } from "@/lib/kv";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const key = `paste:${params.id}`;
  const paste = await getPaste(params.id);

  if (!paste) {
    notFound();
  }

  if (await isExpired(paste)) {
    notFound();
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) notFound();
    paste.remaining_views -= 1;
    await redis.set(key, paste);
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {paste.content}
    </pre>
  );
}