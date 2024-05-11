import React, { useState, ChangeEvent, FormEvent } from "react";
import "./adduser.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  name: string;
  email: string;
  address: string;
}

const AddUser: React.FC = () => {
  const initialUser: User = {
    name: "",
    email: "",
    address: "",
  };
  const [user, setUser] = useState<User>(initialUser);
  const navigate = useNavigate();

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/user", user);
      toast.success(response.data.message, { position: "top-right" });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="addUser">
      <Link to="/" className="btn btn-secondary" role="button">
        <i className="fa-solid fa-backward"></i> Back
      </Link>

      <h3>Add New User</h3>
      <form className="addUserForm" onSubmit={submitForm}>
        <div className="inputGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            onChange={inputHandler}
            name="name"
            autoComplete="off"
            placeholder="Enter your Name"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            onChange={inputHandler}
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            onChange={inputHandler}
            name="address"
            autoComplete="off"
            placeholder="Enter your Address"
          />
        </div>
        <div className="inputGroup">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
