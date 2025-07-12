import { useState } from "react";
import axios from "axios";
import CreateHotel from "../../components/createhotel/CreateHotel";
import RoomStep from "../../components/createroommodal/RoomStep";
import { useNavigate } from "react-router-dom";
import { BedDouble, CircleCheckBig, Hotel } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
interface Room {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: { number: number }[];
  photos?: string[] | File[];
}
const HotelCreationStepper = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [newHotelId, setNewHotelId] = useState("");

  const handleSubmitAll = async () => {
    if (newHotelId) {
      navigate(`/hotels/${newHotelId}`);
    }
  };

  const steps = [
    { id: 1, label: "Hotel Info" },
    { id: 2, label: "Rooms" },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      {/* Stepper Header */}
      <div className="flex justify-center mb-6 space-x-4">
        <div className="flex gap-44">
          {steps.map((s) => (
            <button
              key={s.id}
              disabled={step === s.id}
              onClick={() => setStep(s.id)}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition 
                  ${step === s.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : step > s.id
                    ? "bg-green-100 text-green-500 font-bold border-green-500"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
            >
              {step > s.id ? <CircleCheckBig /> : step === s.id && s.id === 1 ? (
                <Hotel className="w-5 h-5" />
              ) : (
                <BedDouble className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Hotel Info Form */}
      {step === 1 && (
        <CreateHotel
          setStep={setStep}
          setNewHotelId={setNewHotelId}
        />
      )}

      {/* Step 2: Rooms Form */}
      {step === 2 && (
        <RoomStep newHotelId={newHotelId} />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </button>
        )}
        {/* {step < 2 && (
          <button
            onClick={() => setStep(step + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Next
          </button>
        )} */}
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
