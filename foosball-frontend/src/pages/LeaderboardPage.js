// src/pages/LeaderboardPage.jsx
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Logged in successfully!"); // Display the banner on component mount
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await axios.get("https://foosball-leaderboard.onrender.com/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(res.data);
      } catch (err) {
        setError("Failed to fetch leaderboard. Please login again.");
      }
    } else {
      setError("Please log in to view the leaderboard.");
    }
  };

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 my-custom-background h-screen w-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Foosball Leaderboard
        </h1>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {players.length === 0 ? (
          <p className="text-center text-gray-500">{error || "No players yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Rank</th>
                  <th className="py-3 px-6 text-left">Username</th>
                  <th className="py-3 px-6 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player, index) => (
                  <tr
                    key={player.username}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-6 text-left">#{index + 1}</td>
                    <td className="py-3 px-6 text-left font-medium text-gray-900">
                      {player.username}
                    </td>
                    <td className="py-3 px-6 text-right font-bold text-blue-600">
                      {player.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isAdmin && localStorage.getItem("token") && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/admin")}
              className="bg-blue-700 text-white px-5 py-3 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}