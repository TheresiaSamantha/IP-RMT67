import React from "react";

const Footer = () => (
  <footer
    style={{
      padding: 18,
      borderTop: "1px solid #eee",
      marginTop: 32,
      textAlign: "center",
      color: "#666",
    }}
  >
    <small>© {new Date().getFullYear()} Book Recommender</small>
  </footer>
);

export default Footer;
