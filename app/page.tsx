"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function submit() {
    setError("");
    setUrl("");
    setLoading(true);

    if (!content.trim()) {
      setError("Content cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setUrl(data.url);
    } catch (err) {
      setError("Failed to create paste. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0b]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-3xl glass p-8 rounded-3xl animate-in fade-in duration-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Pastebin Lite
          </h1>
          <p className="text-slate-400">Secure, fast, and minimal code sharing</p>
        </div>

        {!url ? (
          <div className="space-y-6">
            <textarea
              placeholder="Paste your code or text here..."
              className="w-full h-80 textarea-premium"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={loading}
              className="w-full btn-premium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Secure Paste"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-400 w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Paste Created Successfully!</h2>
              <p className="text-slate-400 text-sm">Your shareable link is ready below</p>
            </div>

            <div className="flex gap-2">
              <input
                readOnly
                value={url}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-blue-400" />
              </a>
            </div>

            <button
              onClick={() => {
                setUrl("");
                setContent("");
              }}
              className="w-full py-3 text-slate-400 text-sm hover:text-white transition-colors"
            >
              Create another paste
            </button>
          </div>
        )}
      </div>

      <p className="mt-12 text-slate-600 text-sm">
        Built for developers who value simplicity and style.
      </p>
    </main>
  );
}
