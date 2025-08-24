import { Link } from "react-router-dom";
import { RevenueChart } from "../../components/revenueChart/RevenueChart";
import { RevenueProgress } from "../../components/revenueProgress/RevenueProgress";
import { StatsCard } from "../../components/statscard/StatsCard";
import { TransactionsTable } from "../../components/transactionsTable/TransactionsTable";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface Booking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
  };
  hotelOwnerId: {
    _id: string;
    username: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  amountPaid: number;
  createdAt: string;
}

interface Hotel {
    _id: string;
    name: string;
    ownerId: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function DashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/bookings/`, { withCredentials: true });
                setBookings(res.data);
            } catch (err) {
                setError("Failed to fetch bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/hotels/${user?._id}`);
                setHotels(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching hotels");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);
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

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const totalCommission = bookings.reduce((sum, booking) => sum + booking.amountPaid * 0.15, 0);

    const statsData = [
        {
            href: "/users",
            title: "Users",
            value: users.length.toString(),
            percentageChange: "+12%",
            buttonLabel: "See all users",
        },
        {
            href: "/bookings",
            title: "Bookings",
            value: bookings.length.toString(),
            percentageChange: "+8%",
            buttonLabel: "View bookings",
        },
        {
            href: "/hotels",
            title: "Hotels",
            value: hotels.length.toString(),
            percentageChange: "+15%",
            buttonLabel: "View hotels",
        },
        {
            href: "/analytics",
            title: "Platform Earnings",
            value: `₹${totalCommission.toLocaleString()}`,
            percentageChange: "+5%",
            buttonLabel: "Details",
        },
    ];

    return (
        <div className="flex-1 p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((data, idx) => (
                    <Link to={data.href} key={idx}>
                        <StatsCard
                            title={data.title}
                            value={data.value}
                            percentageChange={data.percentageChange}
                            buttonLabel={data.buttonLabel}
                        />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueProgress bookings={bookings} targetRevenue={20000} />
                <RevenueChart />
            </div>

            <div>
                <TransactionsTable transactions={bookings} />
            </div>
        </div>
    );
}