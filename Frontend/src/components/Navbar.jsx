import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear(); // Clear all data including user
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-blue-700 text-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link className="text-2xl font-bold tracking-wide">
          RentSphere
        </Link>

        <div className="space-x-6 text-lg">
          {token ? (
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

