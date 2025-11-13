import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/BookDetailModal";
import { fetchBooks } from "../features/bookSlice";
import InfiniteScroll from "react-infinite-scroll-component";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, meta, status, error } = useSelector((s) => s.books);
  const token = useSelector((s) => s.user.token);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");

  // initial load
  useEffect(() => {
    if (status === "idle" || items.length === 0) {
      dispatch(fetchBooks({ page: 1, limit: meta.perPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to load next page for InfiniteScroll
  const loadMore = () => {
    if (status === "loading") return;
    if (meta.page >= meta.totalPages) return;
    const nextPage = meta.page + 1;
    dispatch(fetchBooks({ page: nextPage, limit: meta.perPage }));
  };

  const handleAdded = (result) => {
    const msg = result?.message || "Added";
    if (/Already in MyList/i.test(msg)) {
      setToast("buku sudah ada di list");
    } else {
      setToast("buku telah ditambahkan ke My List");
    }
    // Auto-hide after 2.5s
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <main style={{ padding: 20 }}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#e6ffed",
            border: "1px solid #b7f5c9",
            color: "#065f46",
            padding: "10px 14px",
            borderRadius: 8,
            zIndex: 1100,
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            maxWidth: 640,
            width: "calc(100% - 40px)",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}
      <h1 style={{ marginBottom: 8 }}>Home — Book List</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Explore our collection. Click a book to see details.
      </p>
      {!token && (
        <div
          style={{
            background: "#f6f8ff",
            border: "1px solid #dfe6ff",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            color: "#334",
          }}
        >
          <span>Want to build your reading list? </span>
          <Link to="/login">Login</Link>
          <span> to save books to My List.</span>
        </div>
      )}

      {status === "loading" && <p>Loading books…</p>}
      {status === "failed" && <p style={{ color: "crimson" }}>{error}</p>}

      {items?.length > 0 ? (
        <InfiniteScroll
          dataLength={items.length}
          next={loadMore}
          hasMore={meta.page < meta.totalPages}
          loader={<p style={{ marginTop: 12 }}>Loading more…</p>}
          endMessage={
            <p style={{ marginTop: 12, color: "#777" }}>
              You’ve reached the end.
            </p>
          }
          style={{ overflow: "visible" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            {items.map((book) => (
              <BookCard
                key={book.id ?? book.title}
                book={book}
                onOpen={setSelected}
                showAdd={Boolean(token)}
                onAdded={handleAdded}
              />
            ))}
          </div>
        </InfiniteScroll>
      ) : (
        status !== "loading" && <p>No books to display.</p>
      )}

      {/* InfiniteScroll renders loader/endMessage; no standalone sentinel needed. */}

      {selected && (
        <BookDetailModal book={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
};

export default HomePage;
