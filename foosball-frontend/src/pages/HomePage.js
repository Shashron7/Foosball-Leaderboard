// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import FoosballImage1 from "../foosball-image-1.jpeg";
import FoosballImage2 from "../foosball-image-2.jpeg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 my-custom-background h-screen w-screen">
      <div className="bg-gray-100 p-6 rounded-md shadow-md flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Welcome to Foosball Leaderboard @ HPE </h1>
        <div className="mb-4 flex justify-center gap-4">
          <img src={FoosballImage1} alt="Foosball Table 1" className="w-48 h-auto rounded-md shadow-md" />
          <img src={FoosballImage2} alt="Foosball Players" className="w-48 h-auto rounded-md shadow-md" />
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}