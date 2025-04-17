import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";

const isAuthenticated = () => !!localStorage.getItem("token");
const isAdmin = () => localStorage.getItem("isAdmin") === "true";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="my-custom-background h-screen w-screen">
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage onLogin={() => window.location.href = "/leaderboard"} />} />
        <Route path="/leaderboard" element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </div>
  );
}
