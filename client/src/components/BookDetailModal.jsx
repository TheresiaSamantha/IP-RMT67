import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchBookDetail } from "../features/bookSlice";

const BookDetailModal = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestSummary = async () => {
    try {
      setLoading(true);
      const data = await dispatch(fetchBookDetail(book.id)).unwrap();
      setSummary(data?.aiSummary || "No summary available.");
    } catch (err) {
      setSummary("Failed to load AI summary.");
      console.error(err);
    } finally {
      setLoading(false);
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
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 1,
            paddingBottom: 8,
            marginBottom: 12,
            borderBottom: "1px solid #eee",
          }}
        >
          <h2>{book.title}</h2>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
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
              <button
                className="btn btn-secondary"
                onClick={requestSummary}
                disabled={loading}
              >
                {loading ? "Requesting…" : "Request AI summary"}
              </button>
            </div>
          </div>
        </section>

        {loading && (
          <section style={{ marginTop: 12 }}>
            <p>Generating summary…</p>
          </section>
        )}

        {summary && !loading && (
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
