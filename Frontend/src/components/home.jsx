import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getAllUsersWithButtonStats");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Handle change when a user is selected
  const handleUserChange = (e) => {
    const user = users.find((u) => u._id === e.target.value);
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-6">
      <div className="text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">
          Welcome to the Most Useless Button App 😂
        </h1>

        <div className="my-4">
          <select
            onChange={handleUserChange}
            className="border p-2 rounded bg-blue-50 w-full max-w-xs mx-auto"
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && selectedUser.buttonStats && selectedUser.buttonStats.length > 0 ? (
          <div className="mt-6 space-y-6">
            <h2 className="text-3xl font-semibold text-blue-500">
              Stats for {selectedUser.username}
            </h2>

            {selectedUser.buttonStats.map((buttonStat, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-medium text-gray-700">Button Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Total Clicks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {buttonStat.clicks} {/* Ensure it's using 'clicks' */}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-lg font-semibold">Total Wasted Time (seconds)</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {buttonStat.wastedTime} {/* Ensure it's using 'wastedTime' */}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 text-gray-500">No stats available for this user yet.</div>
        )}
      </div>
    </div>
  );
};

export default Home;