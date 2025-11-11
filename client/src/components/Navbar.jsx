import React from "react";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #eee",
      }}
    >
      <div style={{ fontWeight: 700 }}>Book Recommender</div>
      <div style={{ display: "flex", gap: 12 }}>
        <a href="/">Home</a>
        <a href="/mylist">My List</a>
      </div>
    </nav>
  );
};

export default Navbar;
