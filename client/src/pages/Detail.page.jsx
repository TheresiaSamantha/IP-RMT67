import React, { useEffect, useState } from "react";
import BookDetailModal from "../components/BookDetailModal";

const DetailPage = ({ bookId, initialBook }) => {
  // Props: if you use react-router, read `bookId` from params and fetch details.
  const [book, _setBook] = useState(initialBook ?? null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!book && bookId) {
      // TODO: fetch book by id from backend
      // fetch(`${import.meta.env.VITE_API_BASE_URL}/books/${bookId}`)...
    }
  }, [bookId, book]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Book Detail</h1>
      {!book ? (
        <p>
          No book loaded. Pass `initialBook` or implement fetch by `bookId`.
        </p>
      ) : (
        <section>
          <h2>{book.title}</h2>
          <p>Author: {book.author}</p>
          <img src={book.coverUrl} alt={book.title} style={{ maxWidth: 240 }} />
          <div style={{ marginTop: 12 }}>
            <button onClick={() => setShowModal(true)}>
              Open details / AI summary
            </button>
          </div>
        </section>
      )}

      {showModal && (
        <BookDetailModal book={book} onClose={() => setShowModal(false)} />
      )}
    </main>
  );
};

export default DetailPage;
