import { notFound } from "next/navigation";
import { redis } from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { Paste } from "@/types/paste";
import { Clock, Eye, Calendar, Copy, ChevronLeft } from "lucide-react";
import Link from "next/link";

async function getPasteData(id: string): Promise<Paste | null> {
  const key = `paste:${id}`;

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

  try {
    const now = await nowMs();
    const result = await redis.eval(script, 1, key, now.toString()) as string | null;
    return result ? JSON.parse(result) : null;
  } catch (err) {
    console.error("Failed to fetch paste:", err);
    return null;
  }
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

  const formattedDate = new Date(paste.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0b] flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1 text-slate-500 hover:text-white transition-colors text-sm mb-4 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Paste</h1>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              {paste.remaining_views !== null && (
                <span className="flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/10">
                  <Eye className="w-3.5 h-3.5" />
                  {paste.remaining_views} views remaining
                </span>
              )}
              {paste.expires_at && (
                <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/10">
                  <Clock className="w-3.5 h-3.5" />
                  Expires shortly
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl overflow-hidden border border-white/10">
          <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Source Code</span>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy original code"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="p-0">
            <pre className="p-6 overflow-x-auto text-sm md:text-base leading-relaxed font-mono bg-black/40 text-slate-300">
              <code>{paste.content}</code>
            </pre>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-xs">
            This paste is encrypted and stored in a secure Redis cloud instance.
          </p>
        </div>
      </div>
    </main>
  );
}