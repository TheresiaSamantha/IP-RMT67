import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/BookDetailModal";
import { fetchBooks } from "../features/bookSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, meta, status, error } = useSelector((s) => s.books);
  const [selected, setSelected] = useState(null);

  // initial load
  useEffect(() => {
    if (status === "idle" || items.length === 0) {
      dispatch(fetchBooks({ page: 1, limit: meta.perPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll with IntersectionObserver
  const sentinelRef = useRef(null);
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const hasMore = meta.page < meta.totalPages;
    if (!hasMore) return; // nothing more to load

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (status !== "loading" && meta.page < meta.totalPages) {
            const nextPage = meta.page + 1;
            dispatch(fetchBooks({ page: nextPage, limit: meta.perPage }));
          }
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, meta.page, meta.perPage, meta.totalPages, status]);

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Home — Book List</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Explore our collection. Click a book to see details.
      </p>

      {status === "loading" && <p>Loading books…</p>}
      {status === "failed" && <p style={{ color: "crimson" }}>{error}</p>}

      {items?.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
          }}
        >
          {items.map((book) => (
            <BookCard
              key={book.id ?? book.title}
              book={book}
              onOpen={setSelected}
            />
          ))}
        </div>
      ) : (
        status !== "loading" && <p>No books to display.</p>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {status === "loading" && <p style={{ marginTop: 12 }}>Loading more…</p>}
      {meta.page >= meta.totalPages && items.length > 0 && (
        <p style={{ marginTop: 12, color: "#777" }}>You7ve reached the end.</p>
      )}

      {selected && (
        <BookDetailModal book={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
};

export default HomePage;
