import React from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((s) => s.user.token);

  const handleLogout = () => {
    dispatch(logout());
    // Best-effort cleanup of any persisted token
    try {
      localStorage.removeItem("token");
    } catch {
      /* ignore */
    }
    navigate("/");
  };

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
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        {token ? (
          <>
            <Link to="/mylist">My List</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
