import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, setIsAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="bg-blue-600 text-white p-4 flex justify-center">
        Loading...
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <span
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Hotel Booking
        </span>

        {!isAuthenticated ? (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-white text-blue-600 font-semibold rounded py-2 px-4 hover:bg-gray-100"
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-transparent border border-white text-white rounded py-2 px-4 hover:bg-white hover:text-blue-600"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="relative">
            <span
              className="cursor-pointer text-2xl font-bold"
              onClick={() => setShowMenu(!showMenu)}
            >
              ⋮
            </span>
            {showMenu && (
              <div className="z-50 absolute right-0 mt-2 w-40 bg-white rounded shadow-lg text-gray-800">
                <div
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </div>
                <div
                  onClick={() => {
                    navigate("/settings");
                    setShowMenu(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Settings
                </div>
                <div
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;