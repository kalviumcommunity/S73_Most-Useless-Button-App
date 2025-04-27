import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in on component mount and when navigation changes
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch('http://localhost:5000/users/me', {
          credentials: 'include' // Important for cookies
        });
        
        // If the request is successful, the user is logged in
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include' // Important for cookies
      });
      
      setIsLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-blue-700 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          ClickVoid
        </Link>

        <div className="space-x-6 text-lg">
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-300 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/update-user"
                className="hover:text-blue-300 transition duration-200"
              >
                Update Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-300 transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-blue-300 transition duration-200"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;