import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/BookDetailModal";
import { fetchBooks } from "../features/bookSlice";
import InfiniteScroll from "react-infinite-scroll-component";

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

  // Helper to load next page for InfiniteScroll
  const loadMore = () => {
    if (status === "loading") return;
    if (meta.page >= meta.totalPages) return;
    const nextPage = meta.page + 1;
    dispatch(fetchBooks({ page: nextPage, limit: meta.perPage }));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Home — Book List</h1>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Explore our collection. Click a book to see details.
      </p>

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
