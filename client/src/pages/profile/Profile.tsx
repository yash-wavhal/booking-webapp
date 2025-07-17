import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import HotelList from "../../components/hotelList/HotelList";
import { Pencil } from "lucide-react"; // for edit icon
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

interface Hotel {
    _id: string;
    name: string;
    city: string;
    address: string;
    distance: string;
    photos: string[];
    title: string;
    desc: string;
    rating: number;
    bookingsCount: number;
    cheapestPrice: number;
}

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/hotels/user/${user?._id}`);
                setHotels(res.data);
            } catch (err) {
                console.error("Failed to fetch hotels", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchHotels();
    }, [user?._id]);

    const getFormatedDate = (date: string | undefined): string => {
        if (!date) return "N/A";

        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDeleteHotel = async (id: string) => {
        try {
            await axios.delete(`${BASE_URL}/hotels/${id}`);
            setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
        } catch (err) {
            console.error(err);
            alert("Error deleting hotel");
        }
    };

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white">
            <Navbar />
            <div className=" max-w-5xl mx-auto px-4 py-8 space-y-12">
                <div className="bg-white shadow rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl text-indigo-600 font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user?.username}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Joined on {getFormatedDate(user?.createdAt)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/edit-profile")}
                        className="flex items-center gap-2 text-indigo-600 hover:underline"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </button>
                </div>

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Upcoming Bookings
                    </h3>
                    <div className="w-full overflow-x-auto">
                        {/* <UpcomingBookings /> */}
                        <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                            Upcoming bookings will appear here.
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Booking History
                    </h3>
                    <div className="w-full overflow-x-auto">
                        {/* <BookingHistory /> */}
                        <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                            Your booking history will appear here.
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Saved Hotels
                    </h3>
                    <div className="w-full overflow-x-auto">
                        {/* <SavedHotels /> */}
                        <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                            Your saved hotels will appear here.
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
                        <h3 className="text-xl font-semibold text-gray-800 flex-shrink-0">
                            Your Listed Hotels
                        </h3>
                        <div className="flex-grow ml-96 min-w-[200px] sm:min-w-[100px]">
                            <input
                                type="text"
                                placeholder="Search your hotels by name or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>


                    {loading ? (
                        <p>Loading your hotels...</p>
                    ) : filteredHotels.length === 0 ? (
                        <p className="text-gray-500">No hotels found.</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredHotels.map((hotel) => (
                                <HotelList key={hotel._id} hotel={hotel} isUser={true} onDelete={handleDeleteHotel} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Profile;