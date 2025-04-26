import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [clicks, setClicks] = useState(0);
  const [wastedTime, setWastedTime] = useState(0);  // Track wasted time (in seconds)
  const [response, setResponse] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Get token from localStorage

  // Fetch button stats (clicks and wasted time) when the component mounts
  useEffect(() => {
    if (token) {
      axios
        .get('http://localhost:5000/button-stats', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { clicks, wastedTime } = response.data;
          setClicks(clicks || 0);   // Set the click count from the backend
          setWastedTime(wastedTime || 0); // Set the wasted time from the backend
        })
        .catch((err) => {
          console.error('Error fetching button stats:', err);
        });
    }
  }, [token]);

  // Handle button click (increment click count and update wasted time)
  const handleButtonClick = () => {
    const facts = [
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Bananas are berries, but strawberries aren't!",
      "A duck's quack doesn't echo (no one knows why).",
      "Fart sound loaded...",
      "Drum roll please...",
    ];
    const random = facts[Math.floor(Math.random() * facts.length)];
    setResponse(random);

    // Send updated button stats to backend
    if (token) {
      axios
        .put(
          'http://localhost:5000/button-stats',
          { clicks: 1, wastedTime: 2 },  // Increment by 1 click, 2 seconds wasted
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          // Update the UI immediately with the new values
          setClicks(prevClicks => prevClicks + 1);  // Increment the click count locally
          setWastedTime(prevTime => prevTime + 2);  // Increment the wasted time locally
          console.log('Button stats updated');
        })
        .catch((err) => {
          console.error('Error updating button stats:', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-900 to-blue-700 text-white p-6 flex flex-col items-center justify-center relative">
      <h1 className="text-4xl font-bold mb-4 text-center">
        🎉 Welcome to the Most Useless Button App!
      </h1>

      <p className="mb-6 text-lg text-center">
        You've clicked the button <span className="font-bold">{clicks}</span> times.
      </p>

      <button
        onClick={handleButtonClick}
        className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white text-xl rounded-full shadow-lg transition transform hover:scale-105"
      >
        🤪 Press Me!
      </button>

      {response && (
        <div className="mt-6 bg-white text-black p-4 rounded-lg shadow-md w-full max-w-lg text-center">
          <p className="text-lg font-semibold">{response}</p>
        </div>
      )}

      <div className="mt-10 text-center">
        <p>
          Stats: You’ve wasted approximately{" "}
          <strong>{wastedTime} seconds</strong> of your life. 😎
        </p>
        <p className="text-sm mt-1 opacity-75">Keep going, champ!</p>
      </div>
    </div>
  );
};

export default Dashboard;
