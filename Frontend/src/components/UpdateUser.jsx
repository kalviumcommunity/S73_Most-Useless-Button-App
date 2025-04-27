import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data using cookies for authentication
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/users/me', {
          credentials: 'include' // Important for cookies
        });
        
        if (!response.ok) {
          throw new Error('Not authenticated');
        }
        
        const user = await response.json();
        setUserId(user._id);
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '',
        });
      } catch (err) {
        setMessage('User is not logged in or session expired.');
        navigate('/login');
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage('User is not logged in or userId is missing.');
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    
    try {
      const res = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies
      });

      if (!res.ok) throw new Error('Delete failed');

      navigate('/signup');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-8 bg-gray-100 shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Update Profile</h2>
        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <form onSubmit={handleUpdate} className="space-y-5">
          <input
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 border rounded-md"
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Email"
            readOnly
            className="w-full p-3 border rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
          />

          <input
            type="password"
            name="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full p-3 border rounded-md"
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Update
          </button>
        </form>

        <hr className="my-6" />

        <button
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
};

export default UpdateUser;