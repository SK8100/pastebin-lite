"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setUrl("");

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

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
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Pastebin Lite</h1>

      <label htmlFor="content">Paste Content</label>

      <textarea
        id="content"
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          marginTop: 8,
          padding: 8,
          backgroundColor: "#f9f9f9",
          color: "#000",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />

      <button
        onClick={submit}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Create Paste
      </button>

      {url && (
        <p style={{ marginTop: 12 }}>
          Shareable URL:{" "}
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 12 }}>{error}</p>
      )}
    </main>
  );
}
