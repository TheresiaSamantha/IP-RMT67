import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";
import "./App.css";

// import all pages and components here
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home.page.jsx";
import MyListPage from "./pages/MyList.page.jsx";
import Detail from "./pages/Detail.page.jsx";
import LoginPage from "./pages/login.page.jsx";
import ResisterPage from "./pages/resister.page.jsx";

// layout component to wrap pages with navbar and footer
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Guard component to protect routes that require authentication
function RequireAuth({ children }) {
  const token = useSelector((s) => s.user.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/mylist"
            element={
              <RequireAuth>
                <MyListPage />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/resister" element={<ResisterPage />} />
          <Route path=":bookId" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
