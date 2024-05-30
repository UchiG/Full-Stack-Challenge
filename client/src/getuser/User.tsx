import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const response = await axios.get<any>(`http://localhost:8000/api/users/${currentPage}`);
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
      const response = await axios.delete(`http://localhost:7000/api/delete/user/${userId}`);
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

  return (
    <div className="userTable">
      {/* Buttons for navigation */}
      <div className="pagination mb-3">
        <button
          onClick={prevPage}
          className="btn btn-primary"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={nextPage}
          className="btn btn-primary"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Link to add user */}
      <Link to="/add" className="btn btn-primary" role="button">
        Add User <i className="fa-solid fa-user-plus"></i>
      </Link>

      {/* User table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td className="actionButtons">
                <Link to={`/update/${user._id}`} className="btn btn-info" role="button">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link>
                <button onClick={() => deleteUser(user._id)} className="btn btn-danger" type="button">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
