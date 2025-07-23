import { useEffect, useState } from "react";
import CreateHotel from "../../components/createhotel/CreateHotel";
import RoomStep from "../../components/createroommodal/RoomStep";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BedDouble, CircleCheckBig, Hotel } from "lucide-react";

const HotelCreationStepper = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<number>(1);
  const [newHotelId, setNewHotelId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const urlStep = parseInt(searchParams.get("editRoomStep") || "", 10);
    const urlHotelId = searchParams.get("editHotelId");
    const localStep = localStorage.getItem("hotelCreationStep");
    const localHotelId = localStorage.getItem("newHotelId");

    // Hotel ID priority: URL param > localStorage
    if (urlHotelId) {
      setNewHotelId(urlHotelId);
      localStorage.setItem("newHotelId", urlHotelId);
    } else if (localHotelId) {
      setNewHotelId(localHotelId);
    }

    // Step priority: URL param > localStorage > default 1
    if (!isNaN(urlStep)) {
      setStep(urlStep);
      localStorage.setItem("hotelCreationStep", String(urlStep));
    } 
    else if (localStep) {
      setStep(parseInt(localStep));
    } 
    else {
      setStep(1);
    }

    setInitialized(true);
  }, [searchParams, initialized]);

  // const editHotelId = searchParams.get("editHotelId");
  // useEffect(() => {
  //   if (!editHotelId && !localStorage.getItem("newHotelId")) {
  //     localStorage.removeItem("newHotelId");
  //     localStorage.removeItem("hotelCreationStep");
  //     setStep(1);
  //   }
  // }, [editHotelId]);

  // Save to localStorage on every step change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("hotelCreationStep", String(step));
    }
  }, [step, initialized]);

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      if (newHotelId) {
        localStorage.removeItem("hotelCreationStep");
        localStorage.removeItem("newHotelId");
        navigate(`/hotels/${newHotelId}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, label: "Hotel Info" },
    { id: 2, label: "Rooms" },
  ];

  return (
    <div className="relative h-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex justify-center mb-6 space-x-4">
        <div className="flex gap-44">
          {steps.map((s) => (
            <button
              key={s.id}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition 
                ${step === s.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : step > s.id
                    ? "bg-green-100 text-green-500 font-bold border-green-500"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
            >
              {step > s.id ? (
                <CircleCheckBig />
              ) : step === s.id && s.id === 1 ? (
                <Hotel className="w-5 h-5" />
              ) : (
                <BedDouble className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {step === 1 && (
        <CreateHotel setStep={setStep} setNewHotelId={setNewHotelId} />
      )}

      {step === 2 && <RoomStep newHotelId={newHotelId} />}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        {step < 2 && (
          <button
            onClick={() => {
              if (!newHotelId) {
                alert("Please create the hotel first before proceeding to add rooms.");
              } else {
                setStep(step + 1);
              }
            }}
            className="absolute bottom-12 right-6 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Next
          </button>
        )}
        {step === 2 && (
          <button
            onClick={handleSubmitAll}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Submit All"}
          </button>
        )}
      </div>
    </div>
  );
};

export default HotelCreationStepper;