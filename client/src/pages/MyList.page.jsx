import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/BookDetailModal";
import {
  fetchMyList,
  removeFromMyList,
  updateMyListNote,
} from "../features/myListSlice";

const MyListPage = () => {
  const dispatch = useDispatch();
  const { items: myList, status, error } = useSelector((s) => s.myList);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchMyList());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromMyList(id));
  };

  const handleEditNote = (item) => {
    const current = typeof item.note === "string" ? item.note : "";
    // Simple prompt for editing; can be replaced with a nicer modal later
    const next = window.prompt("Edit note:", current);
    if (next == null) return; // user cancelled
    // Dispatch update thunk with MyList item id and new note
    dispatch(updateMyListNote({ id: item.id, note: next }));
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
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: 12,
          }}
        >
          {myList.map((item) => (
            <div key={item.id}>
              <BookCard
                book={item.Book ?? item}
                onOpen={setSelected}
                note={item.note}
                showAdd={false}
                canEditNote
                onEditNote={() => handleEditNote(item)}
                canRemove
                onRemove={() => handleRemove(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      {selected && (
        <BookDetailModal book={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
};

export default MyListPage;
