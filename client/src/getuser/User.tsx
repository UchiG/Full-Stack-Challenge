import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
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

const fetchUsers = async (page: number, filters: { name?: string; email?: string }) => {
  const response = await axios.get<any>(
    `http://localhost:8000/api/users/${page}?${new URLSearchParams(filters).toString()}`
  );
  return response.data;
};

const deleteUser = async (userId: string) => {
  const response = await axios.delete(`http://localhost:8000/api/delete/user/${userId}`);
  return response.data;
};

const User: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{ name?: string; email?: string }>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery(
    ['users', currentPage, filters],
    () => fetchUsers(currentPage, filters),
    {
      keepPreviousData: true,
    }
  );

  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users', currentPage, filters]);
      toast.success("User deleted successfully", { position: "top-right" });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const handleDelete = (userId: string) => {
    mutation.mutate(userId);
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

  const nextPage = () => {
    if (currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
            className="form-control w-32"
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
            className="form-control w-32"
            id="email"
            name="email"
            value={filters.email || ""}
            onChange={handleFilterChange}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setCurrentPage(1)}>
          Filter
        </button>
      </form>

      {/* User cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {data.docs.map((user: User) => (
          <div
            key={user._id}
            className="border p-4 rounded shadow cursor-pointer w-48 mb-4"
            onClick={() => toggleCardExpansion(user._id)}
          >
            <p>{user.name}</p>
            <p>{user.email}</p>
            <div className="flex justify-end mt-2 space-x-2">
              <Link to={`/update/${user._id}`} className="btn btn-info" role="button">
                Edit
              </Link>
              <button onClick={() => handleDelete(user._id)} className="btn btn-danger">
                Delete
              </button>
            </div>
            {expandedCards.has(user._id) && (
              <div>
                <p>{user.address}</p>
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
        <span>Page {currentPage} of {data.totalPages}</span>
        <Button
          variant="contained"
          color="primary"
          onClick={nextPage}
          disabled={currentPage === data.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default User;