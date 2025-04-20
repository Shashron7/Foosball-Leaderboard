// src/pages/LoginPage.jsx
import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://foosball-leaderboard.onrender.com/api/login", {
        username,
        password,
      });

      const { token, is_admin } = res.data;
      
      console.log("token is ",token)
      console.log("isadmin is ",is_admin)
      // Save token and admin status to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", is_admin);

      // Callback to redirect
      onLogin();
    } catch (err) {
      console.log(err)
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 my-custom-background h-screen w-screen">
    <div className="bg-gray-100 p-6 rounded-md shadow-md flex flex-col items-center justify-center gap-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Foosball Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded font-semibold"
        >
          Login
        </button>
      </form>
    </div>
    </div>
  );
}
