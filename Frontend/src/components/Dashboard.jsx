import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [clicks, setClicks] = useState(0);
  const [response, setResponse] = useState('');
  const navigate = useNavigate();

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
    setClicks(prev => prev + 1);
  };

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token or any user info
//     sessionStorage.removeItem("token");
//     navigate('/login'); // Redirect to login page
//   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-900 to-blue-700 text-white p-6 flex flex-col items-center justify-center relative">
      {/* Logout button top right */}
      {/* <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
      >
        Logout
      </button> */}

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
          <strong>{clicks * 2} seconds</strong> of your life. 😎
        </p>
        <p className="text-sm mt-1 opacity-75">Keep going, champ!</p>
      </div>
    </div>
  );
};

export default Dashboard;
