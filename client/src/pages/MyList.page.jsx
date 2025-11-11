import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";

const MyListPage = () => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    // TODO: fetch user's saved books from backend: GET /mylist
    setMyList([]);
  }, []);

  const handleRemove = (id) => {
    // TODO: call DELETE /mylist/:id and update local state
    setMyList((s) => s.filter((item) => item.id !== id));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>My List</h1>
      <p>
        Books you've saved. Implement CRUD actions to add notes, edit or remove.
      </p>

      {myList.length === 0 ? (
        <p>Your list is empty.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            gap: 12,
          }}
        >
          {myList.map((item) => (
            <div key={item.id}>
              <BookCard book={item.Book ?? item} />
              <div style={{ marginTop: 8 }}>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyListPage;
