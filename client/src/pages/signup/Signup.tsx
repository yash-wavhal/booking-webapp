import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [data, setData] = useState<SignupData>({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/register`, data);

      await axios.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          
          <label className="block font-medium text-gray-700" htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={data.username}
            onChange={handleChange}
            required
            placeholder="Your username"
            className="w-full p-3 mt-1 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          
          <label className="block font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            placeholder="Your email"
            className="w-full p-3 mt-1 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="email"
          />
          
          <label className="block font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
            className="w-full p-3 mt-1 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="password"
          />
          
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
