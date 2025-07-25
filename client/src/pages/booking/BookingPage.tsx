import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import RoomPhotosLightbox from "../../components/roomDetails/RoomPhotosLightbox";
import { useState, useEffect } from "react";

interface Room {
    _id: string;
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
    roomNumbers: { number: number }[];
    hotelId: string;
    photos: string[];
    extraGuestCharge: number;
    maxExtraGuests: number;
    extraBedCharge: number;
    maxExtraBeds: number;
}

const BookingPage = () => {
    const { roomId } = useParams();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { data: room, loading, error } = useFetch<Room>(`/rooms/${roomId}`);

    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [roomsData, setRoomsData] = useState<
        { roomNumber: number; extraGuests: number; extraBeds: number }[]
    >([]);

    const toggleRoomSelection = (roomNumber: number) => {
        setSelectedRooms((prev) =>
            prev.includes(roomNumber)
                ? prev.filter((num) => num !== roomNumber)
                : [...prev, roomNumber]
        );
    };

    useEffect(() => {
        setRoomsData((prev) => {
            return selectedRooms.map((roomNum) => {
                const existing = prev.find((r) => r.roomNumber === roomNum);
                return existing || { roomNumber: roomNum, extraGuests: 0, extraBeds: 0 };
            });
        });
    }, [selectedRooms]);

    if (loading) return <p className="text-center mt-10">Loading room details...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">Error fetching room data!</p>;
    if (!room) return <p className="text-center mt-10">Room not found</p>;

    // Calculate totals
    const totalExtraGuestCharge = roomsData.reduce(
        (acc, r) => acc + r.extraGuests * room.extraGuestCharge,
        0
    );
    const totalExtraBedCharge = roomsData.reduce(
        (acc, r) => acc + r.extraBeds * room.extraBedCharge,
        0
    );
    const totalPrice =
        room.price * selectedRooms.length +
        totalExtraGuestCharge +
        totalExtraBedCharge;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {lightboxOpen && (
                <RoomPhotosLightbox
                    photos={room.photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
                    Book Your Stay
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* LEFT SECTION */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl overflow-hidden shadow-md mb-6">
                            <img
                                src={room.photos?.[0] || "https://via.placeholder.com/600"}
                                alt={room.title}
                                className="w-full h-80 object-cover cursor-pointer hover:opacity-80 transition"
                                onClick={() => {
                                    setLightboxIndex(0);
                                    setLightboxOpen(true);
                                }}
                            />
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{room.title}</h2>
                        <p className="text-gray-600 mb-4">{room.desc}</p>

                        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
                            <p>👥 Max People: {room.maxPeople}</p>
                            <p>🛏️ Price: ₹{room.price} / night</p>
                            <p>➕ Extra Bed Charge: ₹{room.extraBedCharge}</p>
                            <p>👤 Extra Guest Charge: ₹{room.extraGuestCharge}</p>
                        </div>

                        {/* ROOM TOGGLE */}
                        <div className="mt-3 mb-5">
                            <p className="text-gray-700 font-semibold mb-2">Available Rooms (Select rooms to book)</p>
                            <div className="flex flex-wrap gap-2">
                                {room.roomNumbers.map((r) => (
                                    <button
                                        key={r.number}
                                        className={`px-3 py-1 rounded-md text-sm border transition 
                      ${selectedRooms.includes(r.number)
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                            }`}
                                        onClick={() => toggleRoomSelection(r.number)}
                                    >
                                        #{r.number}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {roomsData.length > 0 && (
                            <div className="bg-gray-100 p-4 rounded-xl mb-6">
                                <h3 className="text-lg font-semibold mb-3">Customize Your Stay</h3>

                                {roomsData.map((data) => (
                                    <div
                                        key={data.roomNumber}
                                        className="mb-6 p-5 border rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
                                    >
                                        <h4 className="text-lg font-semibold mb-4 text-indigo-700">
                                            Room #{data.roomNumber}
                                        </h4>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            {/* Extra Guests */}
                                            <div>
                                                <label className="block font-medium mb-2 text-gray-700">
                                                    Extra Guests
                                                </label>
                                                <select
                                                    value={data.extraGuests}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        setRoomsData((prev) =>
                                                            prev.map((r) =>
                                                                r.roomNumber === data.roomNumber
                                                                    ? { ...r, extraGuests: value }
                                                                    : r
                                                            )
                                                        );
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                >
                                                    {[...Array(room.maxExtraGuests + 1).keys()].map((n) => (
                                                        <option key={n} value={n}>
                                                            {n} Guest{n !== 1 ? "s" : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block font-medium mb-2 text-gray-700">
                                                    Extra Beds
                                                </label>
                                                <select
                                                    value={data.extraBeds}
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        setRoomsData((prev) =>
                                                            prev.map((r) =>
                                                                r.roomNumber === data.roomNumber
                                                                    ? { ...r, extraBeds: value }
                                                                    : r
                                                            )
                                                        );
                                                    }}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                                >
                                                    {[...Array(room.maxExtraBeds + 1).keys()].map((n) => (
                                                        <option key={n} value={n}>
                                                            {n} Bed{n !== 1 ? "s" : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BOOKING SUMMARY */}
                    <div className="bg-indigo-50 p-7 rounded-xl shadow-md h-fit">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-900">
                            Booking Summary
                        </h3>

                        <div className="flex justify-between mb-2">
                            <span>
                                Room Price ({selectedRooms.length} room
                                {selectedRooms.length !== 1 ? "s" : ""})
                            </span>
                            <span>₹{room.price * selectedRooms.length}</span>
                        </div>

                        <div className="flex justify-between mb-2">
                            <span>Extra Guests</span>
                            <span>₹{totalExtraGuestCharge}</span>
                        </div>

                        <div className="flex justify-between mb-4 border-b pb-2">
                            <span>Extra Beds</span>
                            <span>₹{totalExtraBedCharge}</span>
                        </div>

                        <div className="flex justify-between text-lg font-semibold mb-6">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>

                        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;