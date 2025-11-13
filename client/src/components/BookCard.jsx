import React from "react";

import { useDispatch } from "react-redux";
import { addToMyList } from "../features/myListSlice";

const BookCard = ({
  book = {},
  onOpen,
  showAdd = true,
  note,
  canEditNote = false,
  onEditNote,
  canRemove = false,
  onRemove,
  onAdded,
}) => {
  const { title, author, coverUrl } = book;
  const dispatch = useDispatch();

  const handleAdd = async () => {
    if (!book?.id) return;
    try {
      const result = await dispatch(addToMyList(book.id)).unwrap();
      if (onAdded) onAdded(result, book);
    } catch (e) {
      // optional: could show an error toast here if desired
      console.error(e);
    }
  };

  return (
    <article
      style={{
        border: "1px solid #ddd",
        padding: 12,
        borderRadius: 6,
        height: 480,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`${title} cover`}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        ) : (
          <div style={{ color: "#888" }}>No cover</div>
        )}
      </div>
      <h3
        style={{
          fontSize: 16,
          marginTop: 8,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: 40,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "6px 0 12px",
          color: "#555",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: 18,
        }}
      >
        {author}
      </p>
      {typeof note === "string" && note !== "" && (
        <div
          style={{
            background: "#f8f9fa",
            border: "1px solid #eee",
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
            color: "#444",
            fontSize: 13,
            whiteSpace: "pre-wrap",
            maxHeight: 96,
            overflow: "hidden",
          }}
        >
          <strong style={{ display: "block", marginBottom: 4 }}>Note</strong>
          {note}
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "nowrap",
          marginTop: "auto",
        }}
      >
        <button onClick={() => onOpen && onOpen(book)}>Details</button>
        {showAdd && <button onClick={handleAdd}>Add</button>}
        {canEditNote && (
          <button onClick={() => onEditNote && onEditNote(book)}>
            Edit note
          </button>
        )}
        {canRemove && (
          <button onClick={() => onRemove && onRemove(book)}>Remove</button>
        )}
      </div>
    </article>
  );
};

export default BookCard;
