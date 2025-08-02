import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, setIsAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuRef = useRef<HTMLDivElement>(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`);
      toast.success("You have logged out!");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <nav
        className={`bg-indigo-100 text-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-3 min-h-[56px] animate-pulse">
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-8 w-24 bg-gray-300 rounded-lg"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`${isScrolled ? "bg-white/40 backdrop-blur-xl" : "bg-indigo-100"
        } text-gray-900 shadow-md sticky top-0 z-50 transition-all duration-300`}
    >
      <div>
        <div className="max-w-[185vh] mx-auto flex justify-between items-center p-3">
          {/* Logo + Brand together */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              width={50}
              height={50}
              className="rounded"
              src="/Lodgr_logo.png"
              alt="logo"
            />
            <span className="text-3xl font-heading font-extrabold select-none tracking-wide drop-shadow-md">
              Lodgr
            </span>
          </div>

          {!isAuthenticated ? (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-gray-900 font-semibold rounded-lg px-5 py-2 shadow-md hover:bg-gray-900 hover:text-white transition"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-gray-900 font-semibold text-gray-900 rounded-lg px-5 py-2 hover:bg-gray-900 hover:text-white transition"
              >
                Login
              </button>
            </div>
          ) : (
            <div
              className="relative flex items-center space-x-3 md:space-x-4"
              ref={menuRef}
            >
              {/* Create Hotel Button */}
              <button
                onClick={() => navigate("/hotels/create")}
                aria-label="Create Hotel"
                className="border-2 border-gray-900 rounded-lg px-4 py-2 font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition"
              >
                Create Hotel
              </button>

              {/* User Menu Button */}
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                aria-label="User menu"
                className="flex items-center space-x-2 border-2 border-gray-900 rounded-lg px-4 py-2 font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition focus:outline-none focus:ring-gray-900"
              >
                <span className="select-none">User</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-4 mt-44 w-44 bg-white rounded-lg shadow-lg text-gray-900 font-medium ring-1 ring-black ring-opacity-5 origin-top-right z-50">
                  <div
                    onClick={() => {
                      navigate("/profile");
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 hover:bg-indigo-100 cursor-pointer rounded-t-lg"
                  >
                    Profile
                  </div>
                  <div
                    onClick={() => {
                      navigate("/settings");
                      setShowMenu(false);
                    }}
                    className="block px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                  >
                    Settings
                  </div>
                  <div
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600 rounded-b-lg"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
