import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/userSlice";
import { useNavigate, Link } from "react-router";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 420, margin: "0 auto" }}>
      <h1>Login</h1>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, marginTop: 12 }}
      >
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
          {status === "loading" ? "Signing in…" : "Login"}
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <button type="button" disabled title="Google login coming soon">
          Continue with Google
        </button>
        <div style={{ color: "#555" }}>
          Don’t have an account? <Link to="/resister">Create one</Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
