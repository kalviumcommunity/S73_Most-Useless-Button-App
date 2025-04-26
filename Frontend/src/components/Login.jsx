import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Login request
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const token = data.token;
      console.log("✅ Token received:", token);
      localStorage.setItem("token", token);

      // Fetch user profile using token
      const userRes = await fetch("http://localhost:5000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = await userRes.json();
      if (!userRes.ok) throw new Error(user.message || "Failed to fetch user");

      console.log("✅ User fetched:", user);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg text-black">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-3 border rounded-md"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-3 border rounded-md"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
