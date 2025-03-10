import React from "react";
import UserList from "./components/entities";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";



const App = () => {
  return (
    <Router>
        
        <nav className="flex space-x-4 p-3 bg-blue-200">
          <Link to="/" className="text-white border-2 p-2 bg-black rounded-lg">Home</Link>
          <Link to="/entities" className="text-white border-2 p-2 bg-black rounded-lg">Users</Link>
        </nav>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entities" element={<UserList />} />
      </Routes>
    </Router>

  );
};

export default App;
