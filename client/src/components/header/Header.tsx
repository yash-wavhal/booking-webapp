import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Hotel, CalendarDays, User } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./header.css";
import { DateRange } from "react-date-range";

interface Options {
  adult: number;
  children: number;
  room: number;
}

interface DateRangeItem {
  startDate: Date;
  endDate: Date;
  key: string;
}

const Header: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState<Options>({ adult: 1, children: 0, room: 1 });
  const [date, setDate] = useState<DateRangeItem[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const navigate = useNavigate();

  const handleOption = (name: keyof Options, operation: "i" | "d") => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  const handleSearch = () => {
    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }
    const queryParams = new URLSearchParams({
      destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      adult: String(options.adult),
      children: String(options.children),
      room: String(options.room),
    });
    navigate(`/hotels/search?${queryParams.toString()}`);
  };

  const handleDateChange = (item: { selection: DateRangeItem }) => {
    setDate([item.selection]);
    setStartDate(item.selection.startDate);
    setEndDate(item.selection.endDate);
  };


  return (
    <div className="relative bg-gray-900 text-white">
      <div className="max-w-auto mx-auto px-6 py-32 flex flex-col items-center text-center">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-fadeIn">
          Find Your Perfect Stay
        </h1>
        <p className="max-w-2xl mb-8 text-lg font-light tracking-wide animate-fadeIn delay-200">
          Unlock exclusive deals, 24/7 support & free cancellations on every booking
        </p>

        <div className="flex space-x-10 mb-12 text-sm sm:text-base justify-center animate-fadeIn delay-400">
          <div className="flex items-center space-x-2">
            <img src="https://img.icons8.com/ios-filled/24/ffffff/checked--v1.png" alt="Best Price" className="w-6 h-6" />
            <span>Best Price Guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://img.icons8.com/ios-filled/24/ffffff/headset.png" alt="Support" className="w-6 h-6" />
            <span>24/7 Customer Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://img.icons8.com/ios-filled/24/ffffff/cancel.png" alt="Free Cancellations" className="w-6 h-6" />
            <span>Free Cancellations</span>
          </div>
        </div>

        <div className="bg-white flex flex-col gap-5 rounded-xl p-6 w-auto shadow-lg">
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="relative flex-1 min-w-[220px]">
              <Hotel className="absolute top-1/2 left-4 transform -translate-y-1/2 text-indigo-700" size={24} />
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full pl-12 py-3 min-w-[300px] rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:outline-none text-gray-900 font-medium"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="relative flex-1 min-w-[300px]">
              <span
                className="block w-full py-3 rounded-lg border border-gray-300 text-gray-900 font-medium cursor-pointer relative select-none"
                onClick={() => {
                  setOpenDate(!openDate);
                  setOpenOptions(false);
                }}
              >
                <CalendarDays
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-700 pointer-events-none"
                />
                {`${format(startDate, "MMM dd, yyyy")} to ${format(endDate, "MMM dd, yyyy")}`}
              </span>

              {openDate && (
                <div className="absolute z-20 mt-2 shadow-lg bg-white rounded-lg">
                  <DateRange
                    onChange={handleDateChange}
                    ranges={date}
                    minDate={new Date()}
                    className="custom-date-range"
                    editableDateInputs={true}
                    moveRangeOnFirstSelection={false}
                    rangeColors={["#4f46e5"]}
                  />
                </div>
              )}
            </div>


            <div className="relative flex-1 min-w-[300px] cursor-pointer">
              <User
                className="absolute top-1/2 left-4 transform -translate-y-1/2 text-indigo-700"
                size={24}
                onClick={() => {
                  setOpenOptions(!openOptions);
                  setOpenDate(false);
                }}
              />
              <span
                className="block w-full py-3 rounded-lg border border-gray-300 text-gray-900 font-medium"
                onClick={() => {
                  setOpenOptions(!openOptions);
                  setOpenDate(false);
                }}
              >
                {`${options.adult} adult · ${options.children} children · ${options.room} room`}
              </span>
              {openOptions && (
                <div className="absolute top-full left-0 z-30 mt-2 bg-white rounded-lg shadow-xl p-4 w-full max-w-xs text-gray-900">
                  {(["adult", "children", "room"] as (keyof Options)[]).map((name) => (
                    <div key={name} className="flex items-center justify-between py-2">
                      <span className="capitalize font-semibold">{name}</span>
                      <div className="flex items-center space-x-3">
                        <button
                          disabled={
                            (name === "adult" && options.adult <= 1) ||
                            (name === "children" && options.children <= 0) ||
                            (name === "room" && options.room <= 1)
                          }
                          onClick={() => handleOption(name, "d")}
                          className="w-8 h-8 rounded-full bg-indigo-100 disabled:bg-gray-300 disabled:cursor-not-allowed text-indigo-700 font-bold text-lg hover:bg-indigo-200 transition"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-semibold">{options[name]}</span>
                        <button
                          onClick={() => handleOption(name, "i")}
                          className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg hover:bg-indigo-200 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="items-center">
            <button
              onClick={handleSearch}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition transform hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>

        <p className="mt-8 max-w-xl mx-auto text-indigo-300 italic drop-shadow-md">
          “Hotel Booking made my vacation stress-free! Best prices and excellent support.” — <strong>Rohan S.</strong>
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-fadeIn.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fadeIn.delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Header;