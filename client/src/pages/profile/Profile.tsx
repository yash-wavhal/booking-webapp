import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import HotelList from "../../components/hotelList/HotelList";
import { Pencil } from "lucide-react"; // for edit icon
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import HotelCardList from "../../components/horizontalHotelList/HotelCardList";

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
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    // console.log(selectedBooking);


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

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/bookings/user/${user?._id}`);
                setBookingHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch booking history hotels", err);
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
                        {bookingHistory && bookingHistory.length > 0 ?
                            <HotelCardList
                                data={bookingHistory.map(b => b.hotelId)}
                                loading={loading}
                                setSelectedHotel={(hotel) => {
                                    const booking = bookingHistory.find(b => b.hotelId._id === hotel._id);
                                    setSelectedBooking(booking || null);
                                }}
                            />
                            :
                            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                Your booking history will appear here.
                            </div>
                        }
                    </div>
                    {selectedBooking && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8 relative animate-fadeIn border border-gray-100">

                                {/* Header */}
                                <div className="flex justify-between items-center mb-6 border-b pb-3">
                                    <h2 className="text-3xl font-extrabold text-indigo-800 tracking-tight">
                                        {selectedBooking.hotelId.name}
                                    </h2>
                                    <button
                                        className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
                                        onClick={() => setSelectedBooking(null)}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Two-Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                                    {/* Left Column - Hotel Info */}
                                    <div>
                                        <div className="relative">
                                            <img
                                                src={
                                                    selectedBooking.hotelId.photos?.[0] ||
                                                    "/demo_hotel_image.avif"
                                                }
                                                alt={selectedBooking.hotelId.name}
                                                className="w-full h-64 object-cover rounded-xl shadow-lg"
                                            />
                                            <span className="absolute top-4 left-4 bg-indigo-600 text-white text-sm px-3 py-1 rounded-full shadow">
                                                {selectedBooking.hotelId.rating} ★
                                            </span>
                                        </div>

                                        <div className="mt-5 space-y-3">
                                            <p className="text-gray-700 text-lg leading-relaxed">
                                                {selectedBooking.hotelId.desc}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                📍 <span>{selectedBooking.hotelId.address}, {selectedBooking.hotelId.city}</span>
                                            </p>
                                            <p className="text-2xl font-bold text-indigo-700">
                                                ₹ {selectedBooking.roomId.price} / night
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - Booking Info */}
                                    <div>
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Details</h3>

                                        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-2 mb-5">
                                            <p><strong>Check-in:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
                                            <p><strong>Check-out:</strong> {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
                                        </div>

                                        <p className="text-xl font-bold text-indigo-800 mb-3">{selectedBooking.roomId.title}</p>

                                        <h4 className="text-lg font-semibold mb-3">Rooms Booked</h4>

                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scroll">
                                            {selectedBooking.roomDetails.map((room, index) => (
                                                <div
                                                    key={index}
                                                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gradient-to-r from-indigo-50 to-white"
                                                >
                                                    <p className="font-medium text-gray-800">🏨 Room Numbers: {room.roomNumbers.map(r => r.number).join(", ")}</p>
                                                    <p className="text-sm text-gray-700">👨 Guests: {room.people.adult} Adults, {room.people.children} Children</p>
                                                    <p className="text-sm">🛏 Extra Beds: {room.roomNumbers.reduce((acc, r) => acc + r.noOfExtraBeds, 0)}</p>
                                                    <p className="text-sm">➕ Extra Guests: {room.roomNumbers.reduce((acc, r) => acc + r.noOfExtraGuests, 0)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-8 flex justify-end gap-4 border-t pt-5">
                                    <button
                                        className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition shadow-sm"
                                        onClick={() => setSelectedBooking(null)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
                                        onClick={() => {
                                            navigate(`/hotels/${selectedBooking.hotelId._id}`);
                                            setSelectedBooking(null);
                                        }}
                                    >
                                        View Hotel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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