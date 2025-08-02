import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DateRange } from "react-date-range";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import toast from "react-hot-toast";

interface DateRangeItem {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface Options {
  adult: number;
  children: number;
}

interface RoomData {
  roomNumber: number;
  extraGuests: number;
  extraBeds: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
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

  const isDisabled = date[0].endDate <= date[0].startDate || options.adult < 1;

  const { roomId } = useParams();

  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hotelId, setHotelId] = useState("");
  const navigate = useNavigate();

  const room = useFetch(`/rooms/${roomId}`);
  // console.log(room.data)

  useEffect(() => {
    const savedBooking = localStorage.getItem(`booking-${roomId}`);
    const bookingData = localStorage.getItem("bookingData");

    if (savedBooking) {
      const parsed = JSON.parse(savedBooking);
      if (parsed.roomsData) {
        setRoomsData(parsed.roomsData);
      }
    }

    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      if (parsed.totalPrice) {
        setTotalPrice(parsed.totalPrice);
      }
      if (parsed.hotelId) {
        setHotelId(parsed.hotelId);
      }
    }
  }, [roomId]);

  const roomDetails = roomsData.map((roomItem) => ({
    roomId,
    roomNumbers: [
      {
        number: roomItem.roomNumber,
        noOfExtraGuests: roomItem.extraGuests,
        noOfExtraBeds: roomItem.extraBeds,
      },
    ],
    people: {
      adult: options.adult,
      children: options.children,
    },
  }));

  const handlePayment = async () => {
    if (!hotelId || !roomId || !user?._id) {
      alert("Missing booking data or user information.");
      return;
    }

    const payload = {
      hotelId,
      hotelOwnerId: room?.data?.hotelId?.ownerId,
      userId: user._id,
      roomId: roomId,
      roomDetails,
      checkInDate: date[0].startDate,
      checkOutDate: date[0].endDate,
    };

    try {
      const res = await axios.post(`${BASE_URL}/bookings/${user?._id}`, payload);
      toast.success("Thank you! Your stay is confirmed. You can view your booking details in your profile");
      navigate(`/hotels/${hotelId}`)

      localStorage.removeItem("bookingData");
      localStorage.removeItem(`booking-${roomId}`);
    } catch (error) {
      toast.error("Booking failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-12 drop-shadow-lg">
          Confirm Your Booking & Payment
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 sm:p-14">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
              Your Stay Dates
            </h2>
            <DateRange
              editableDateInputs={true}
              onChange={(item: { selection: DateRangeItem }) =>
                setDate([item.selection as DateRangeItem])
              }
              moveRangeOnFirstSelection={false}
              ranges={date}
              minDate={new Date()}
              rangeColors={["#6366F1"]}
              className="rounded-lg shadow-lg border border-indigo-300"
            />
            {date[0].endDate <= date[0].startDate && (
              <p className="mt-2 text-red-600 font-semibold">
                Check-out date must be after check-in date.
              </p>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-indigo-700">Members</h2>
            <p className="mb-3 text-gray-500">(Total {room?.data?.maxPeople} members are allowed)</p>
            <div className="flex gap-10 max-w-sm">
              <div className="flex flex-col">
                <label
                  htmlFor="adults"
                  className="font-medium mb-3 text-gray-700 tracking-wide"
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
                    const maxAdults = room.data.maxPeople - options.children;
                    setOptions((prev) => ({
                      ...prev,
                      adult: newAdult > maxAdults ? maxAdults : newAdult,
                    }));
                  }}
                  className="border border-indigo-300 rounded-lg px-3 py-2 w-28 text-center font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="children"
                  className="font-medium mb-3 text-gray-700 tracking-wide"
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
                    const maxChildren = room.data.maxPeople - options.adult;
                    setOptions((prev) => ({
                      ...prev,
                      children: newChildren > maxChildren ? maxChildren : newChildren,
                    }));
                  }}
                  className="border border-indigo-300 rounded-lg px-3 py-2 w-28 text-center font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
                />
              </div>
            </div>
          </section>


          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
              Selected Rooms & Extras
            </h2>

            {roomsData.length === 0 ? (
              <p className="text-gray-500 text-lg">No rooms selected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {roomsData.map((room) => (
                  <div
                    key={room.roomNumber}
                    className="border border-indigo-300 rounded-xl p-5 bg-indigo-50 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-lg font-semibold text-indigo-900 mb-2">
                      Room #{room.roomNumber}
                    </p>
                    <p className="text-gray-700">
                      Extra Guests:{" "}
                      <span className="font-medium">{room.extraGuests}</span>
                    </p>
                    <p className="text-gray-700">
                      Extra Beds:{" "}
                      <span className="font-medium">{room.extraBeds}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border-t border-indigo-300 pt-8">
            <h2 className="text-2xl font-semibold mb-7 text-indigo-700">
              Booking Summary
            </h2>
            <div className="flex gap-36 text-gray-800 text-md">
              <div>
                <p>
                  <span className="font-semibold">Check-in:</span>{" "}
                  <time dateTime={date[0].startDate.toISOString()}>
                    {date[0].startDate.toDateString()}
                  </time>
                </p>
                <p>
                  <span className="font-semibold">Check-out:</span>{" "}
                  <time dateTime={date[0].endDate.toISOString()}>
                    {date[0].endDate.toDateString()}
                  </time>
                </p>
              </div>

              <div>
                <p>
                  <span className="font-semibold">Guests:</span> {options.adult} Adult
                  {options.adult > 1 ? "s" : ""}, {options.children} Child
                  {options.children !== 1 ? "ren" : ""}
                </p>
                <p>
                  <span className="font-semibold">Total Price:</span> ₹
                  {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

          </section>

          <button
            disabled={isDisabled}
            className={`mt-12 w-full py-2 rounded-3xl font-extrabold text-xl text-white transition 
            ${isDisabled
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-700 hover:bg-indigo-800 shadow-lg"
              }`}
            onClick={handlePayment}
            aria-disabled={isDisabled}
            title={isDisabled ? "Fix errors before proceeding" : "Confirm & Pay"}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentPage;