import React, { useEffect, useState } from "react";
import "./user.css";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface User {
  _id: string;
  name: string;
  email: string;
  address: string;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:8000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/delete/user/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
      toast.success(response.data.message, { position: "top-right" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="userTable">
      <Link to="/add" className="btn btn-primary" role="button">
        Add User <i className="fa-solid fa-user-plus"></i>
      </Link>

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
              <td>{user.email} </td>
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
