import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Button from '@mui/material/Button';
import "./user.css";


interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<{ name?: string; email?: string }>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get<any>(
        `http://localhost:8000/api/users/${currentPage}?${new URLSearchParams(filters).toString()}`
      );
      if (Array.isArray(response.data.docs)) {
        setUsers(response.data.docs);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Data.docs is not an array:", response.data.docs);
      }
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete/user/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.error(error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const toggleCardExpansion = (userId: string) => {
    setExpandedCards(prevState => {
      const newExpandedCards = new Set(prevState);
      if (newExpandedCards.has(userId)) {
        newExpandedCards.delete(userId);
      } else {
        newExpandedCards.add(userId);
      }
      return newExpandedCards;
    });
  };

  return (
    <div className="userTable">
      {/* Link to add user */}
      <Link to="/add" className="btn btn-primary" role="button">
        <Button variant="contained" color="primary">
          Add User <i className="fa-solid fa-user-plus"></i>
        </Button>
      </Link>

      {/* Filter form */}
      <form className="mb-4">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            className="form-control w-32" // Adjust width here
            id="name"
            name="name"
            value={filters.name || ""}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control w-32" // Adjust width here
            id="email"
            name="email"
            value={filters.email || ""}
            onChange={handleFilterChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={fetchData}>
          Filter
        </button>
      </form>

      {/* User cards */}
      <div className="grid grid-cols-3 gap-4"> {/* Adjust column count and gap */}
        {users.map(user => (
          <div
            key={user._id}
            className="border p-4 rounded shadow cursor-pointer w-48" // Adjust card width here
            onClick={() => toggleCardExpansion(user._id)}
          >
            <p>{user.name}</p>
            <p>{user.email}</p>
            {expandedCards.has(user._id) && (
              <div>
                <p>{user.address}</p>
                <div className="flex justify-end mt-2">
                  <Link to={`/update/${user._id}`} className="btn btn-info" role="button">
                    Edit
                  </Link>
                  <button onClick={() => deleteUser(user._id)} className="btn btn-danger ml-2">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Buttons for navigation */}
      <div className="pagination mb-3 mt-4">
        <Button
          variant="contained"
          color="primary"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="contained"
          color="primary"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default User;
