import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home } from "./pages/Home";
import { CreatePost } from "./pages/CreatePost";
import { PostDetail } from "./pages/PostDetail";
import { EditPost } from "./pages/EditPost";
import { Categories } from "./pages/Categories";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Navbar } from "./components/Navbar"; // Import the Navbar component

export default function App() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setUser(data);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <Router>
      {/* Add the Navbar component here */}
      <Navbar user={user} logout={logout} search={search} setSearch={setSearch} />
      
      {/* Add padding to account for the fixed navbar */}
      <div className="pt-16">
        <div className="p-4">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            <Route path="/home" element={<Home search={search} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={user ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<EditPost />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}