import { useEffect } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Navbar from "./components/layout/Navbar";
import Page404 from "./pages/Page404";
import { checkAuth } from "./features/auth/authSlice";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Posts from "./pages/admin/Post";
import User from "./pages/admin/User";
import Setting from "./pages/admin/Setting";
import { Toaster } from "sonner";

import Research from "./pages/NavbarPages/Research";
import Events from "./pages/NavbarPages/Events";
import News from "./pages/NavbarPages/News";
import Membership from "./pages/NavbarPages/Membership";
import About from "./pages/NavbarPages/About";
import EditorPage from "./pages/EditorPage";
import Footer from "./components/layout/Footer";
import ResearchCategory from "./pages/ResearchArea/ResearchCategory";
import ResearchDetails from "./pages/ResearchArea/ResearchDetails";

function App() {
  const { user, authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navLinks = [
    { name: "Research", path: "/research", element: <Research /> },
    { name: "Events", path: "/events", element: <Events /> },
    { name: "News", path: "/news", element: <News /> },
    { name: "Membership", path: "/membership", element: <Membership /> },
    { name: "About", path: "/about", element: <About /> },
  ];

  return (
    <>
      <Navbar navLinks={navLinks} />

      <Routes>

        {/* MAIN NAV PAGES */}
        {navLinks.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={user ? route.element : <Navigate to="/login" />}
          />
        ))}

        {/* Research main page */}
        <Route
          path="/research"
          element={user ? <Research /> : <Navigate to="/login" />}
        />

        {/* Dynamic category page 🔥 */}
        <Route
          path="/research/:category"
          element={user ? <ResearchCategory /> : <Navigate to="/login" />}
        />

        {/* Dynamic Description page 🔥 */}
        <Route
          path="/research/:category/:slug"
          element={user ? <ResearchDetails /> : <Navigate to="/login" />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* HOME */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            user && ["admin", "editor", "member"].includes(user.role)
              ? <AdminLayout><Dashboard /></AdminLayout>
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/posts"
          element={
            user && ["admin", "editor"].includes(user.role)
              ? <AdminLayout><Posts /></AdminLayout>
              : <Navigate to="/" />
          }
        />

        <Route
          path="/editor"
          element={
            user && ["admin", "editor"].includes(user.role)
              ? <AdminLayout><EditorPage /></AdminLayout>
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/users"
          element={
            user?.role === "admin"
              ? <AdminLayout><User /></AdminLayout>
              : <Navigate to="/" />
          }
        />

        <Route
          path="/admin/settings"
          element={
            user?.role === "admin"
              ? <AdminLayout><Setting /></AdminLayout>
              : <Navigate to="/" />
          }
        />

        <Route path="*" element={<Page404 />} />

      </Routes>

      <Toaster richColors position="top-right" />

      <Footer />
    </>
  );
}

export default App;