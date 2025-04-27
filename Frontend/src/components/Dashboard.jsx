import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios to include credentials in all requests
axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [clicks, setClicks] = useState(0);
  const [wastedTime, setWastedTime] = useState(0);
  const [response, setResponse] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user and button stats when the component mounts
  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // First, check if user is logged in by fetching user data
        const userResponse = await axios.get('http://localhost:5000/users/me');
        setUser(userResponse.data);
        
        // Then fetch button stats
        const statsResponse = await axios.get('http://localhost:5000/button-stats');
        const { clicks, wastedTime } = statsResponse.data;
        setClicks(clicks || 0);
        setWastedTime(wastedTime || 0);
      } catch (err) {
        console.error('Error fetching data:', err);
        // Redirect to login if not authenticated
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };
    
    fetchUserAndStats();
  }, [navigate]);

  // Handle button click (increment click count and update wasted time)
  const handleButtonClick = async () => {
    const facts = [
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Bananas are berries, but strawberries aren't!",
      "A duck's quack doesn't echo (no one knows why).",
      "Fart sound loaded...",
      "Drum roll please...",
    ];
    const random = facts[Math.floor(Math.random() * facts.length)];
    setResponse(random);

    try {
      // Send updated button stats to backend
      const response = await axios.put(
        'http://localhost:5000/button-stats',
        { clicks: 1, wastedTime: 2 } // Increment by 1 click, 2 seconds wasted
      );

      // Update the UI with the new values
      setClicks(prevClicks => prevClicks + 1);
      setWastedTime(prevTime => prevTime + 2);
      console.log('Button stats updated');
    } catch (err) {
      console.error('Error updating button stats:', err);
      // Handle unauthenticated error
      if (err.response && err.response.status === 401) {
        navigate('/login');
      }
    }
  };

  if (!user) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-900 to-blue-700 text-white p-6 flex flex-col items-center justify-center relative">
      <h1 className="text-4xl font-bold mb-4 text-center">
        🎉 Welcome to the Most Useless Button App, {user.username}!
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
          Stats: You've wasted approximately{" "}
          <strong>{wastedTime} seconds</strong> of your life. 😎
        </p>
        <p className="text-sm mt-1 opacity-75">Keep going, champ!</p>
      </div>
    </div>
  );
};

export default Dashboard;