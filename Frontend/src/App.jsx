import React from "react";
import UserList from "./components/entities";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/home";
import UserForm from "./components/userForm";



const App = () => {
  return (
    <Router>
        
        <nav className="flex p-3 bg-blue-200">
  
  <div className="flex space-x-4 flex-1">
    <Link to="/" className="text-white border-2 p-2 bg-black rounded-lg">Home</Link>
    <Link to="/entities" className="text-white border-2 p-2 bg-black rounded-lg">Users</Link>
  </div>

  
  <Link to="/addUser" className="text-white border-2 p-2 bg-black rounded-lg">
    Add User
  </Link>
</nav>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entities" element={<UserList />} />
        <Route path="/addUser" element={<UserForm/>}/>

      </Routes>
    </Router>

  );
};

export default App;
