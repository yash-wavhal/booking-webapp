import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  

  return (
    <div className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <span className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          Hotel Booking
        </span>

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
      </div>
    </div>
  );
};

export default Navbar;
