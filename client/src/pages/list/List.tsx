import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

interface DateRangeItem {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface Options {
  adult: number;
  children: number;
  room: number;
}

const List: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const initialDestination = searchParams.get("destination") || "";
  const initialStartDate =
    searchParams.get("startDate") || new Date().toISOString();
  const initialEndDate =
    searchParams.get("endDate") || new Date().toISOString();
  const initialAdult = Number(searchParams.get("adult")) || 1;
  const initialChildren = Number(searchParams.get("children")) || 0;
  const initialRoom = Number(searchParams.get("room")) || 1;

  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState<DateRangeItem[]>([
    {
      startDate: new Date(initialStartDate),
      endDate: new Date(initialEndDate),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState<Options>({
    adult: initialAdult,
    children: initialChildren,
    room: initialRoom,
  });
  const [openOptions, setOpenOptions] = useState(false);

  const queryString = new URLSearchParams({
    destination,
    startDate: date[0].startDate.toISOString(),
    endDate: date[0].endDate.toISOString(),
    adult: String(options.adult),
    children: String(options.children),
    room: String(options.room),
  }).toString();

  const { data, loading, error } = useFetch(`/hotels/search?${queryString}`);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "destination") {
      setDestination(value);
    } else {
      setOptions((prev) => ({
        ...prev,
        [name]: Math.max(Number(value), name === "children" ? 0 : 1), // min values
      }));
    }
  };
  const handleSearch = () => {
    if (!destination.trim()) {
      alert("Please enter a destination");
      return;
    }

    navigate(`/hotels/search?${queryString}`);
  };

  const handleOption = (name: keyof Options, operation: "i" | "d") => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="bg-white rounded-xl p-4 w-full max-w-5xl mx-auto shadow-md">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Destination */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              name="destination"
              value={destination}
              onChange={handleInputChange}
              type="text"
              placeholder="Where are you going?"
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-blue-600">
              📍
            </span>
          </div>

          {/* Date Picker */}
          <div className="relative flex-1 min-w-[200px]">
            <div
              className="w-full px-4 py-2 pl-10 rounded-lg bg-white border border-gray-300 text-sm text-gray-700 cursor-pointer"
              onClick={() => {
                setOpenDate(!openDate);
                setOpenOptions(false);
              }}
            >
              📅{" "}
              {`${format(date[0].startDate, "MMM dd, yyyy")} - ${format(
                date[0].endDate,
                "MMM dd, yyyy"
              )}`}
            </div>
            {openDate && (
              <div className="absolute z-20 mt-2 shadow-lg bg-white rounded-lg">
                <DateRange
                  onChange={(item: { selection: DateRangeItem }) =>
                    setDate([item.selection])
                  }
                  ranges={date}
                  minDate={new Date()}
                />
              </div>
            )}
          </div>

          {/* Guest & Room Options */}
          <div className="relative flex-1 min-w-[200px]">
            <div
              className="w-full px-4 py-2 pl-10 rounded-lg border bg-white border-gray-300 text-sm text-gray-700 cursor-pointer"
              onClick={() => {
                setOpenOptions(!openOptions);
                setOpenDate(false);
              }}
            >
              🧑‍🤝‍🧑{" "}
              {`${options.adult} adult · ${options.children} children · ${options.room} room`}
            </div>
            {openOptions && (
              <div className="absolute z-20 mt-2 w-60 bg-white shadow-lg rounded-lg p-4">
                {(["adult", "children", "room"] as (keyof Options)[]).map(
                  (key) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 text-sm"
                    >
                      <span className="capitalize">{key}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOption(key, "d")}
                          disabled={
                            (key === "adult" && options.adult <= 1) ||
                            (key === "children" && options.children <= 0) ||
                            (key === "room" && options.room <= 1)
                          }
                          className="w-7 h-7 text-sm rounded-full bg-blue-100 text-blue-600 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-medium">
                          {options[key]}
                        </span>
                        <button
                          onClick={() => handleOption(key, "i")}
                          className="w-7 h-7 text-sm rounded-full bg-blue-100 text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="flex justify-center mt-6 px-4">
        <div className="w-full max-w-5xl flex flex-col gap-5">
          {loading ? (
            <p className="text-center text-gray-600 mt-10">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500 mt-10">
              Error loading hotels.
            </p>
          ) : data && data.length > 0 ? (
            data.map((hotel: any, idx: number) => (
              <SearchItem key={idx} hotel={hotel} />
            ))
          ) : (
            <p className="text-center text-gray-600 mt-10">No hotels found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
