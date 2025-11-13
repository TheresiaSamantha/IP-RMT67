import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/userSlice";
import { useNavigate, Link } from "react-router";

const ResisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.user);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ email, password, userName }));
    if (res.meta.requestStatus === "fulfilled") {
      // After successful register, navigate to login
      navigate("/login");
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h1>Create Account</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 12 }}
      >
        <label>
          <div style={{ marginBottom: 4 }}>Username</div>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="yourname"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          <div style={{ marginBottom: 4 }}>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creating…" : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <button type="button" disabled title="Google signup coming soon">
          Sign up with Google
        </button>
        <div style={{ color: "#555" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </main>
  );
};

export default ResisterPage;
