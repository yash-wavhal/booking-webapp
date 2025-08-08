import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const { setIsAuthenticated, isAuthenticated, setUser } = useAuth();
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, data, {
        withCredentials: true,
      });
      toast.success("You have logged in!");
      setUser(res.data)
      setIsAuthenticated(true);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-8">Login</h2>
        <form onSubmit={handleSubmit}>

          <label className="block font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            required
            placeholder="Your email"
            className="w-full p-3 mt-1 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <label className="block font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={data.password}
            onChange={handleChange}
            required
            placeholder="Your password"
            className="w-full p-3 mt-1 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account?
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
