import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import { fetchMyList, removeFromMyList } from "../features/myListSlice";

const MyListPage = () => {
  const dispatch = useDispatch();
  const { items: myList, status, error } = useSelector((s) => s.myList);

  useEffect(() => {
    dispatch(fetchMyList());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromMyList(id));
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>My List</h1>
      <p>
        Books you've saved. Implement CRUD actions to add notes, edit or remove.
      </p>

      {status === "loading" && <p>Loading…</p>}
      {status === "failed" && (
        <p style={{ color: "crimson" }}>{error || "Failed to load."}</p>
      )}

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
