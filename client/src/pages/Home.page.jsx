import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // TODO: replace with real fetch using useFetchBooks hook
    // Example: fetch(`${import.meta.env.VITE_API_BASE_URL}/books/search?q=some`)...
    setBooks([]); // placeholder
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1>Home — Book List</h1>
      <section style={{ marginTop: 16 }}>
        {books.length === 0 ? (
          <p>
            No books loaded. Hook up `useFetchBooks` or provide server data.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
              gap: 12,
            }}
          >
            {books.map((book) => (
              <BookCard key={book.id ?? book.title} book={book} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
