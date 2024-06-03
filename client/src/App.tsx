import React from "react";
import "./App.css";
import AddUser from "./adduser/AddUser";
import User from "./getuser/User";
import Update from "./updateuser/Update";
import { Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/add" element={<AddUser />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </div>
  );
}

export default App;
