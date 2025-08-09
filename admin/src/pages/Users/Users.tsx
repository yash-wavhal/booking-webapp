import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserCircle } from "lucide-react";
import Sidebar from "../../components/sideBar/SideBar";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  pfp: string;
  personalDetails: {
    dob: string;
    gender: "male" | "female" | "other";
    nationality: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>(`${BASE_URL}/users/`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting user, please try again!");
    }
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8 font-sans text-center text-gray-500">
        Loading users...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 font-sans">
      <h2 className="mb-5 text-2xl font-semibold">Users</h2>
      <div className="mb-5 flex-grow min-w-[200px] sm:min-w-[100px]">
        <input
          type="text"
          placeholder="Search user by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-600">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-center">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3 text-gray-700">{user._id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.pfp ? (
                      <img
                        src={user?.pfp}
                        alt={user?.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 text-gray-400" />
                    )}
                    <span>{user.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{user?.email ? user?.email : "N/A"}</td>
                <td className="px-4 py-3">{user?.address?.country ? user?.address?.country : "N/A"}</td>
                <td className="px-4 py-3">{user?.address?.city ? user?.address?.city : "N/A"}</td>
                <td className="px-4 py-3">{user?.phoneNumber ? user?.phoneNumber : "N/A"}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    className="mr-2 rounded border border-indigo-600 bg-white px-3 py-1 text-indigo-600 text-sm hover:bg-indigo-50"
                    type="button"
                    onClick={() => { navigate(`/users/${user._id}`) }}
                  >
                    View
                  </button>
                  <button
                    className="rounded border border-red-400 bg-white px-3 py-1 text-red-500 text-sm hover:bg-red-50"
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}