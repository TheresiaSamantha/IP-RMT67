import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import "./App.css";

// import all pages and components here
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/Home.page.jsx";
import MyListPage from "./pages/MyList.page.jsx";
import Detail from "./pages/Detail.page.jsx";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/mylist" element={<MyListPage />} />
          <Route path=":bookId" element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
