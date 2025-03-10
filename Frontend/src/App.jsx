import React from "react";
import EntityCard from "./components/entities";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";

const dummyData = {
  name: "User123",
  score: 2500,
  rank: 5
};


const Leaderboard = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <EntityCard {...dummyData} />
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="">
        
        <nav className="flex space-x-4 p-3 bg-blue-200">
          <Link to="/" className="text-white border-2 p-2 bg-black rounded-lg">Home</Link>
          <Link to="/leaderboard" className="text-white border-2 p-2 bg-black rounded-lg">Leaderboard</Link>
        </nav>

        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
