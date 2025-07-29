import { useAuth } from "../../context/AuthContext";
import HotelList from "../../components/hotelList/HotelList";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import HotelCardList from "../../components/horizontalHotelList/HotelCardList";
import BookingDetailsModal from "../../components/bookingDetailModal/BookingDetailsModal";
import HotelDetailModal from "../../components/hotelDetailModal/HotelDetailModal";

interface RoomNumberDetails {
    number: number;
    noOfExtraGuests: number;
    noOfExtraBeds: number;
}

interface RoomDetails {
    roomNumbers: RoomNumberDetails[];
    people: {
        adult: number;
        children: number;
    };
}

interface Room {
    _id: string;
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
}

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

interface Booking {
    _id: string;
    hotelId: Hotel;
    roomId: Room;
    roomDetails: RoomDetails[];
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    updatedAt: string;
}

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [savedHotels, setSavedHotels] = useState<Hotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        if (!user?._id) return;

        const fetchData = async () => {
            try {
                const [hotelsRes, bookingHistoryRes, upcomingBookingsRes, savedHotelsRes] = await Promise.all([
                    axios.get(`${BASE_URL}/hotels/user/${user._id}`),
                    axios.get(`${BASE_URL}/bookings/user/${user._id}`),
                    axios.get(`${BASE_URL}/bookings/upcoming/${user._id}`),
                    axios.get(`${BASE_URL}/users/saved-hotels/${user._id}`),
                ]);

                setHotels(hotelsRes.data);
                setBookingHistory(bookingHistoryRes.data);
                setUpcomingBookings(upcomingBookingsRes.data);
                setSavedHotels(savedHotelsRes.data);
            } catch (err) {
                console.error("Failed to fetch profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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

    const handleDeleteBooking = async (id: string) => {
        try {
            const res = await axios.delete(`${BASE_URL}/bookings/cancel/${id}/${user?._id}`);
            setBookingHistory(prev => prev.filter(booking => booking._id !== id));
            setUpcomingBookings(prev => prev.filter(booking => booking._id !== id));
            setSelectedBooking(null);
            alert("Booking cancelled successfully");
        } catch (err) {
            alert("Error canceling booking");
        }
    };

    const handleUnsaveHotel = async (hotelId: string) => {
        try {
            const res = await axios.post(`${BASE_URL}/users/unsave-hotel/${user?._id}/${hotelId}`);
            setSavedHotels(res.data.savedHotels);
            setSelectedHotel(null);
        } catch (err) {
            console.log(err);
            alert("Error unsaving hotel");
        }
    };

    const filteredHotels = hotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white">
            <Navbar />
            <div className=" max-w-5xl mx-auto px-4 py-8 space-y-16">
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
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Upcoming Bookings</h3>
                    <div className="w-full overflow-x-auto">
                        {upcomingBookings?.length > 0 ? (
                            <HotelCardList
                                data={upcomingBookings.map(b => b.hotelId)}
                                loading={loading}
                                setSelectedHotel={(hotel) => {
                                    const booking = upcomingBookings.find(b => b.hotelId._id === hotel._id);
                                    setSelectedBooking(booking || null);
                                }}
                            />
                        ) : (
                            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Upcoming bookings will appear here.
                            </div>
                        )}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Booking History</h3>
                    <div className="w-full overflow-x-auto">
                        {bookingHistory?.length > 0 ? (
                            <HotelCardList
                                data={bookingHistory.map(b => b.hotelId)}
                                loading={loading}
                                setSelectedHotel={(hotel) => {
                                    const booking = bookingHistory.find(b => b.hotelId._id === hotel._id);
                                    setSelectedBooking(booking || null);
                                }}
                            />
                        ) : (
                            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Your booking history will appear here.
                            </div>
                        )}
                    </div>
                </section>

                {selectedBooking && (
                    <BookingDetailsModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                        onDelete={handleDeleteBooking}
                    />
                )}

                <section>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Saved Hotels
                    </h3>
                    <div className="w-full overflow-x-auto">
                        {savedHotels && savedHotels.length > 0 ?
                            <HotelCardList
                                data={savedHotels}
                                loading={loading}
                                setSelectedHotel={(hotel) => {
                                    setSelectedHotel(hotel);
                                }}
                            />
                            :
                            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Your saved hotels will appear here.
                            </div>
                        }
                    </div>
                </section>

                {selectedHotel && (
                    <HotelDetailModal
                        selectedHotel={selectedHotel}
                        onView={() => {
                            navigate(`/hotels/${selectedHotel._id}`);
                            setSelectedHotel(null);
                        }}
                        onCancel={() => setSelectedHotel(null)}
                        onUnsave={handleUnsaveHotel}
                        isProfile={true}
                    />
                )}

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