import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, googleLogin } from "../features/userSlice";
import { useNavigate, Link } from "react-router";

const ResisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.user);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleErr, setGoogleErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser({ email, password, userName }));
    if (res.meta.requestStatus === "fulfilled") {
      // After successful register, navigate to login
      navigate("/login");
    }
  };

  // Load Google script and render Google button (can be used for signup via login)
  useEffect(() => {
    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleErr("VITE_GOOGLE_CLIENT_ID tidak ditemukan di .env");
      return;
    }
    const scriptId = "google-identity-services";
    if (document.getElementById(scriptId)) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = scriptId;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setGoogleErr("Gagal memuat Google SDK");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleReady) return;
    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (!(window && window.google)) return;
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          const idToken = response?.credential;
          if (!idToken) return;
          // Login via Google will auto-create the account on server if needed
          const res = await dispatch(googleLogin({ idToken }));
          if (res.meta.requestStatus === "fulfilled") {
            navigate("/");
          }
        },
      });
      const btn = document.getElementById("googleSignupBtn");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: 320,
        });
      }
    } catch (e) {
      console.error(e);
      setGoogleErr("Inisialisasi Google gagal");
    }
  }, [googleReady, dispatch, navigate]);

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
        <button
          className="btn btn-secondary"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Creating…" : "Register"}
        </button>
      </form>

      <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
        {googleErr && (
          <div style={{ color: "crimson", textAlign: "center" }}>
            {googleErr}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div id="googleSignupBtn" />
        </div>
        <div style={{ color: "#555", textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </main>
  );
};

export default ResisterPage;
