import React from "react";

const BookCard = ({ book = {}, onOpen }) => {
  const { title, author, coverUrl } = book;

  return (
    <article style={{ border: "1px solid #ddd", padding: 12, borderRadius: 6 }}>
      <div
        style={{
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {coverUrl ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={coverUrl}
            alt={`${title} cover`}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        ) : (
          <div style={{ color: "#888" }}>No cover</div>
        )}
      </div>
      <h3 style={{ fontSize: 16, marginTop: 8 }}>{title}</h3>
      <p style={{ margin: "6px 0 12px", color: "#555" }}>{author}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onOpen && onOpen(book)}>Details</button>
        <button>Add</button>
      </div>
    </article>
  );
};

export default BookCard;
