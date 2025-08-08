import axios from "axios";
import {
    LayoutDashboard,
    Users,
    Hotel,
    CalendarCheck,
    AlertTriangle,
    BarChart2,
    LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
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

    return (
        <div className="w-64 min-h-screen bg-white shadow-md p-4 justify-between">
            <div className="h-[50px] flex items-center justify-center">
                <Link to="/" className="text-xl font-bold text-purple-600">
                    AdminPanel
                </Link>
            </div>

            <hr className="border border-gray-200" />

            <div className="pl-2">
                <ul className="list-none m-0 p-0">
                    <p className="text-[10px] font-bold text-gray-500 mt-4 mb-1">MAIN</p>
                    <Link to="/" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <LayoutDashboard className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">Dashboard</span>
                        </li>
                    </Link>

                    <p className="text-[10px] font-bold text-gray-500 mt-6 mb-1">MANAGEMENT</p>
                    <Link to="/users" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">User Management</span>
                        </li>
                    </Link>

                    <Link to="/hotels" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <Hotel className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">Hotel Management</span>
                        </li>
                    </Link>

                    <Link to="/bookings" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <CalendarCheck className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">Booking Management</span>
                        </li>
                    </Link>

                    <Link to="/complaints" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <AlertTriangle className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">Complaints</span>
                        </li>
                    </Link>

                    <Link to="/analytics" className="no-underline">
                        <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                            <BarChart2 className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold text-gray-500 ml-2">Reports & Analytics</span>
                        </li>
                    </Link>

                    <p className="text-[10px] font-bold text-gray-500 mt-6 mb-1">ACCOUNT</p>
                    <li className="flex items-center p-1 cursor-pointer hover:bg-[#ece8ff] rounded-sm">
                        <LogOut className="w-4 h-4 text-purple-600" />
                        <span onClick={handleLogout} className="text-sm font-semibold text-gray-500 ml-2">Logout</span>
                    </li>
                </ul>
            </div>

            <div className="flex items-center m-3">
                <div className="w-5 h-5 rounded-sm border border-purple-600 cursor-pointer bg-[whitesmoke] mr-2"></div>
                <div className="w-5 h-5 rounded-sm border border-purple-600 cursor-pointer bg-[#333] mr-2"></div>
                <div className="w-5 h-5 rounded-sm border border-purple-600 cursor-pointer bg-[darkblue]"></div>
            </div>
        </div>
    );
};

export default Sidebar;