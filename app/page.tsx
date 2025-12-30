// "use client";

// import { useState } from "react";

// export default function Home() {
//   const [content, setContent] = useState("");
//   const [url, setUrl] = useState("");
//   const [error, setError] = useState("");

//   async function submit() {
//     setError("");
//     setUrl("");

//     if (!content.trim()) {
//       setError("Content cannot be empty");
//       return;
//     }

//     const res = await fetch("/api/pastes", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Something went wrong");
//       return;
//     }

//     setUrl(data.url);
//   }

//   return (
//     <main
//       style={{
//         minHeight: "100vh",
//         padding: 24,
//         backgroundColor: "#ffffff",
//         color: "#000000",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h1>Pastebin Lite</h1>

//       <label htmlFor="content">Paste Content</label>

//       <textarea
//         id="content"
//         rows={10}
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         style={{
//           width: "100%",
//           marginTop: 8,
//           padding: 8,
//           backgroundColor: "#f9f9f9",
//           color: "#000",
//           border: "1px solid #ccc",
//           borderRadius: 4,
//         }}
//       />

//       <button
//         onClick={submit}
//         style={{
//           marginTop: 12,
//           padding: "8px 12px",
//           backgroundColor: "#0070f3",
//           color: "#fff",
//           border: "none",
//           borderRadius: 4,
//           cursor: "pointer",
//         }}
//       >
//         Create Paste
//       </button>

//       {url && (
//         <p style={{ marginTop: 12 }}>
//           Shareable URL:{" "}
//           <a href={url} target="_blank" rel="noreferrer">
//             {url}
//           </a>
//         </p>
//       )}

//       {error && (
//         <p style={{ color: "red", marginTop: 12 }}>{error}</p>
//       )}
//     </main>
//   );
// }



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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #7b2ff7, #f107a3)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 16,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          borderRadius: 20,
          padding: 32,
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          color: "#fff",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontSize: 32,
            fontWeight: "bold",
            textShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          Pastebin Lite
        </h1>

        <label
          htmlFor="content"
          style={{
            marginBottom: 8,
            fontWeight: 600,
            color: "#e0e0ff",
          }}
        >
          Paste Content
        </label>

        <textarea
          id="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste your content here..."
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #ccc",
            marginBottom: 16,
            fontSize: 16,
            resize: "vertical",
            outline: "none",
            color: "#fff",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            transition: "all 0.2s ease-in-out",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "#fff")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "#ccc")
          }
        />

        <button
          onClick={submit}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            color: "#fff",
            background: "linear-gradient(90deg, #ff6aff, #a200ff)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget.style.transform = "scale(1.05)"),
            (e.currentTarget.style.boxShadow =
              "0 6px 15px rgba(0,0,0,0.3)"))
          }
          onMouseLeave={(e) =>
            ((e.currentTarget.style.transform = "scale(1)"),
            (e.currentTarget.style.boxShadow = "none"))
          }
        >
          Create Paste
        </button>

        {url && (
          <p
            style={{
              marginTop: 20,
              fontSize: 16,
              wordBreak: "break-all",
              textAlign: "center",
              color: "#ffb3ff",
            }}
          >
            Shareable URL:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
        )}

        {error && (
          <p
            style={{
              marginTop: 20,
              fontSize: 14,
              color: "#ff6b6b",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
