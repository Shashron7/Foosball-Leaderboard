// src/pages/AdminPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [token] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [playerToIncrease, setPlayerToIncrease] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/leaderboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlayers(res.data);
    } catch (err) {
      console.error('Failed to fetch players:', err);
      toast.error('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseScoreClick = (username) => {
    setPlayerToIncrease(username);
    increaseScore(username); // Directly increase without confirmation for simplicity
  };

  const increaseScore = async (username) => {
    try {
      await axios.post(
        'http://localhost:8080/admin/increase-score',
        { username },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Score increased for ${username}`);
      fetchPlayers(); // refresh scores
    } catch (err) {
      console.error('Failed to increase score:', err);
      toast.error(`Failed to increase score for ${username}.`);
    } finally {
      setPlayerToIncrease(null);
    }
  };

  const handleClearLeaderboardClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmClear = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:8080/admin/clear-leaderboard',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Leaderboard cleared successfully!');
      fetchPlayers(); // refresh scores
    } catch (err) {
      console.error('Failed to clear leaderboard:', err);
      toast.error('Failed to clear leaderboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClear = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-xl border border-gray-200 relative">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Admin Panel</h1>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {loading ? (
        <div className="text-center py-4">
          <svg className="animate-spin h-6 w-6 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a1 1 0 012 0v3a8 8 0 018 8h3a1 1 0 010 2h-3a8 8 0 01-8 8v3a1 1 0 01-2 0v-3a8 8 0 01-8-8H1a1 1 0 010-2h3z"></path>
          </svg>
          <p className="text-gray-600 mt-2">Loading players...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Manage Players</h2>
          {players.length === 0 ? (
            <p className="text-gray-500">No players found.</p>
          ) : (
            <ul className="mb-8 divide-y divide-gray-200">
              {players.map((player) => (
                <li key={player.username} className="py-3 flex items-center justify-between">
                  <span className="font-medium text-gray-800">{player.username}</span>
                  <span className="text-gray-600 ml-4">Score: {player.score}</span>
                  <button
                    onClick={() => handleIncreaseScoreClick(player.username)}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    disabled={loading && playerToIncrease === player.username}
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H7a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    {loading && playerToIncrease === player.username ? (
                      <svg className="animate-spin h-4 w-4 text-white mr-1" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a1 1 0 012 0v3a8 8 0 018 8h3a1 1 0 010 2h-3a8 8 0 01-8 8v3a1 1 0 01-2 0v-3a8 8 0 01-8-8H1a1 1 0 010-2h3z"></path>
                      </svg>
                    ) : (
                      'Add 1'
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleClearLeaderboardClick}
              className="w-full sm:w-auto inline-flex justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              disabled={loading}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a1 1 0 012 0v3a8 8 0 018 8h3a1 1 0 010 2h-3a8 8 0 01-8 8v3a1 1 0 01-2 0v-3a8 8 0 01-8-8H1a1 1 0 010-2h3z"></path>
                </svg>
              ) : (
                'Clear Leaderboard'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Clear Leaderboard</h3>
            <p className="text-gray-700 mb-4">Are you sure you want to clear all player data? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V1a1 1 0 012 0v3a8 8 0 018 8h3a1 1 0 010 2h-3a8 8 0 01-8 8v3a1 1 0 01-2 0v-3a8 8 0 01-8-8H1a1 1 0 010-2h3z"></path>
                  </svg>
                ) : (
                  'Confirm Clear'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;