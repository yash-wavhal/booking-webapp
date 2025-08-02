import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import RoomPhotosLightbox from "../../components/roomDetails/RoomPhotosLightbox";
import { useState, useEffect } from "react";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { DateRange } from "react-date-range";
import axios from "axios";

interface Room {
    _id: string;
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
    roomNumbers: { number: number, unavailableDates: Date[] }[];
    hotelId: string;
    photos: string[];
    extraGuestCharge: number;
    maxExtraGuests: number;
    extraBedCharge: number;
    maxExtraBeds: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface DateRangeItem {
    startDate: Date;
    endDate: Date;
    key: string;
}

interface Options {
    adult: number;
    children: number;
}

const BookingPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const [isOpen, setIsOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { data: room, loading, error } = useFetch<Room>(`/rooms/${roomId}`);

    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [roomsData, setRoomsData] = useState<
        { roomNumber: number; extraGuests: number; extraBeds: number }[]
    >([]);

    const { user } = useAuth();

    const initialAdult = Number(searchParams.get("adult")) || 1;
    const initialChildren = Number(searchParams.get("children")) || 0;
    const initialStartDate = searchParams.get("startDate");
    const initialEndDate = searchParams.get("endDate");

    const [date, setDate] = useState<DateRangeItem[]>([
        {
            startDate: initialStartDate
                ? new Date(initialStartDate)
                : new Date(),
            endDate: initialEndDate
                ? new Date(initialEndDate)
                : new Date(new Date().getTime() + 86400000),
            key: "selection",
        },
    ]);

    const [options, setOptions] = useState<Options>({
        adult: initialAdult,
        children: initialChildren,
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const hasRequiredParams =
            searchParams.get("startDate") &&
            searchParams.get("endDate") &&
            searchParams.get("adult") &&
            searchParams.get("children");
        if (!hasRequiredParams) setShowModal(true);
    }, [location.search]);

    useEffect(() => {
        const savedData = localStorage.getItem(`booking-${roomId}`);
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setSelectedRooms(parsed.selectedRooms || []);
            setRoomsData(parsed.roomsData || []);
        }
    }, [roomId]);

    const toggleRoomSelection = (roomNumber: number) => {
        setSelectedRooms((prev) =>
            prev.includes(roomNumber)
                ? prev.filter((num) => num !== roomNumber)
                : [...prev, roomNumber]
        );
    };

    useEffect(() => {
        setRoomsData((prev) => {
            const prevMap = new Map(prev.map(r => [r.roomNumber, r]));
            return selectedRooms.map(roomNum => {
                if (prevMap.has(roomNum)) {
                    return prevMap.get(roomNum)!;
                }
                return {
                    roomNumber: roomNum,
                    extraGuests: 0,
                    extraBeds: 0,
                };
            });
        });
    }, [selectedRooms]);

    useEffect(() => {
        localStorage.setItem(
            `booking-${roomId}`,
            JSON.stringify({ selectedRooms, roomsData })
        );
    }, [selectedRooms, roomsData, roomId]);

    if (loading) return <p className="text-center mt-10">Loading room details...</p>;
    if (error) return <p className="text-center text-red-600 mt-10">Error fetching room data!</p>;
    if (!room) return <p className="text-center mt-10">Room not found</p>;

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

    const handleProceedToPayment = () => {
        toast.success("Almost done! Please complete payment to finalize your booking");
        const bookingData = {
            hotelId: room.hotelId,
            totalPrice,
        };
        localStorage.setItem("bookingData", JSON.stringify(bookingData));

        navigate(`/payment/${room._id}?${searchParams.toString()}`);
    };

    const handleConfirmModal = () => {
        const params = new URLSearchParams(location.search);
        params.set("startDate", date[0].startDate.toISOString());
        params.set("endDate", date[0].endDate.toISOString());
        params.set("adult", options.adult.toString());
        params.set("children", options.children.toString());

        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        setShowModal(false);
    };

    const isRoomUnavailable = (roomNumber: { number: number; unavailableDates: Date[] }) => {
        return roomNumber.unavailableDates.some((d) => {
            const unavailable = new Date(d).getTime();
            return (
                unavailable >= date[0].startDate.getTime() &&
                unavailable <= date[0].endDate.getTime()
            );
        });
    };

    return (
        <div>
            <Navbar />
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-5xl shadow-2xl relative animate-fadeIn">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                        >
                            ✕
                        </button>

                        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                            Before Proceeding Fill Following Information
                        </h1>

                        <div className="grid grid-cols-2 gap-24">
                            {/* Stay Dates */}
                            <div className="border border-indigo-200 p-4 rounded-xl shadow-sm">
                                <h2 className="text-lg font-semibold mb-3 text-indigo-700">
                                    Your Stay Dates
                                </h2>
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={(item: { selection: DateRangeItem }) =>
                                        setDate([item.selection])
                                    }
                                    moveRangeOnFirstSelection={false}
                                    ranges={date}
                                    minDate={new Date()}
                                    rangeColors={["#6366F1"]}
                                    className="rounded-lg border border-indigo-300"
                                />
                                {date[0].endDate <= date[0].startDate && (
                                    <p className="mt-2 text-red-600 font-semibold text-sm">
                                        Check-out date must be after check-in date.
                                    </p>
                                )}
                            </div>

                            {/* Members Section */}
                            <div className="border border-indigo-200 p-4 rounded-xl shadow-sm">
                                <h2 className="text-lg font-semibold text-indigo-700 mb-2">Guests</h2>
                                <p className="text-gray-500 mb-4">
                                    (Max {room.maxPeople} members allowed)
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Adults */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="adults"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Adults
                                        </label>
                                        <input
                                            id="adults"
                                            type="number"
                                            min={1}
                                            value={options.adult}
                                            onChange={(e) => {
                                                const newAdult = Math.max(1, Number(e.target.value));
                                                const maxAdults = room.maxPeople - options.children;
                                                setOptions((prev) => ({
                                                    ...prev,
                                                    adult: newAdult > maxAdults ? maxAdults : newAdult,
                                                }));
                                            }}
                                            className="border border-indigo-300 rounded-lg px-3 py-2 text-center font-semibold text-lg focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>

                                    {/* Children */}
                                    <div className="flex flex-col">
                                        <label
                                            htmlFor="children"
                                            className="text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Children
                                        </label>
                                        <input
                                            id="children"
                                            type="number"
                                            min={0}
                                            value={options.children}
                                            onChange={(e) => {
                                                const newChildren = Math.max(0, Number(e.target.value));
                                                const maxChildren = room.maxPeople - options.adult;
                                                setOptions((prev) => ({
                                                    ...prev,
                                                    children:
                                                        newChildren > maxChildren ? maxChildren : newChildren,
                                                }));
                                            }}
                                            className="border border-indigo-300 rounded-lg px-3 py-2 text-center font-semibold text-lg focus:ring-2 focus:ring-indigo-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmModal}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
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

                                {room.maxExtraBeds > 0 && (
                                    <p>➕ Extra Bed Charge: ₹{room.extraBedCharge}</p>
                                )}

                                {room.maxExtraGuests > 0 && (
                                    <p>👤 Extra Guest Charge: ₹{room.extraGuestCharge}</p>
                                )}

                                {room.maxExtraBeds === 0 && room.maxExtraGuests === 0 && (
                                    <p className="col-span-2 text-gray-500 italic">
                                        Extra beds and guests are not available for this room.
                                    </p>
                                )}
                            </div>

                            <div className="mt-3 mb-5">
                                <p className="text-gray-700 font-semibold mb-2">
                                    Available Rooms (Select rooms to book)
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {room.roomNumbers.map((r) => {
                                        const isDisabled = isRoomUnavailable(r);

                                        return (
                                            <button
                                                key={r.number}
                                                disabled={isDisabled} // ✅ Disable if room is unavailable
                                                className={`px-3 py-1 rounded-md text-sm border transition 
                                                        ${selectedRooms.includes(r.number)
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : isDisabled
                                                            ? "bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed"
                                                            : "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                                    }`}
                                                onClick={() => !isDisabled && toggleRoomSelection(r.number)} // ✅ Prevent toggle if disabled
                                            >
                                                #{r.number}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {roomsData.length > 0 && (room.maxExtraGuests > 0 || room.maxExtraBeds > 0) && (
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
                                                {room.maxExtraGuests > 0 && (
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
                                                )}

                                                {room.maxExtraBeds > 0 && (
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
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

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

                            {room.maxExtraGuests > 0 && (
                                <div className="flex justify-between mb-2">
                                    <span>Extra Guests</span>
                                    <span>₹{totalExtraGuestCharge}</span>
                                </div>
                            )}

                            {room.maxExtraBeds > 0 && (
                                <div className="flex justify-between mb-4 border-b pb-2">
                                    <span>Extra Beds</span>
                                    <span>₹{totalExtraBedCharge}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-semibold mb-6">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>

                            <button
                                onClick={handleProceedToPayment}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BookingPage;