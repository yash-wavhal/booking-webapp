import { useEffect, useState } from "react";
import CreateHotel from "../../components/createhotel/CreateHotel";
import RoomStep from "../../components/roomStep/RoomStep";
import { useNavigate } from "react-router-dom";
import { BedDouble, CircleCheckBig, Hotel } from "lucide-react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import toast from "react-hot-toast";

const HotelCreationStepper = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(() => {
    const saved = localStorage.getItem("hotelCreationStep");
    return saved ? parseInt(saved) : 1;
  });

  const [newHotelId, setNewHotelId] = useState<string>(() => {
    return localStorage.getItem("newHotelId") || "";
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("hotelCreationStep", String(step));
  }, [step]);

  useEffect(() => {
    if (newHotelId) {
      localStorage.setItem("newHotelId", newHotelId);
    }
  }, [newHotelId]);

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      if (newHotelId) {
        localStorage.removeItem("hotelCreationStep");
        localStorage.removeItem("newHotelId");
        toast.success('Rooms added successfully!');
        navigate(`/hotels/${newHotelId}`);
        toast.success('Congratulations! Your hotel has been created successfully!');
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
    <div className="bg-indigo-50 p-8">
      <div className="relative h-full max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
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

        {step === 2 && (
          <RoomStep newHotelId={newHotelId} />
        )}

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
    </div>
  );
};

export default HotelCreationStepper;