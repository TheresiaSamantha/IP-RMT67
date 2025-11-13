import React, { useState } from "react";
import { apiKey } from "../helpers/http-client";

const BookDetailModal = ({ book, onClose }) => {
  const [summary, setSummary] = useState(null);

  const requestSummary = async () => {
    try {
      const { data } = await apiKey.get(`/books/${book.id}`);
      setSummary(data?.aiSummary || "No summary available.");
    } catch (err) {
      setSummary("Failed to load AI summary.");
      console.error(err);
    }
  };

  if (!book) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 20,
          maxWidth: 720,
          width: "90%",
          borderRadius: 8,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>{book.title}</h2>
          <button onClick={onClose}>Close</button>
        </header>

        <section style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={book.title}
              style={{ maxHeight: 240 }}
            />
          )}
          <div>
            <p>
              <strong>Author:</strong> {book.author}
            </p>
            <p>{book.description}</p>
            <div style={{ marginTop: 12 }}>
              <button onClick={requestSummary}>Request AI summary</button>
            </div>
          </div>
        </section>

        {summary && (
          <section style={{ marginTop: 12 }}>
            <h3>AI Summary</h3>
            <p>{summary}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default BookDetailModal;
