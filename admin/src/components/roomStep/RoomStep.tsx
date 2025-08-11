import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, X } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

interface Room {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: { number: number }[];
  photos?: string[];
  hotelId: string;
  extraGuestCharge: number;
  maxExtraGuests: number;
  extraBedCharge: number;
  maxExtraBeds: number;
}

const RoomStep = ({ newHotelId }: { newHotelId?: string }) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const hotelIdFromParam = searchParams.get("hotelId");
  const effectiveHotelId = hotelIdFromParam || newHotelId;
  const isRoomEdit = !!hotelIdFromParam;


  // console.log(user?._id);
  // console.log("newHotelId", newHotelId);
  const [showModal, setShowModal] = useState(() => {
    const saved = localStorage.getItem("showModal");
    if (saved === "undefined" || saved === null) {
      return false;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return false;
    }
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState(() => localStorage.getItem("title") || "");
  const [price, setPrice] = useState(() => {
    const saved = localStorage.getItem("price");
    return saved ? parseFloat(saved) : 0;
  });
  const [maxPeople, setMaxPeople] = useState(() => {
    const saved = localStorage.getItem("maxPeople");
    return saved ? parseInt(saved) : 1;
  });
  const [desc, setDesc] = useState(() => localStorage.getItem("desc") || "");
  const [roomNumbersInput, setRoomNumbersInput] = useState(() =>
    localStorage.getItem("roomNumbersInput") || ""
  );

  const [guestNumbers, setGuestNumbers] = useState(() => {
    const saved = localStorage.getItem("guestNumbers");
    return saved ? parseFloat(saved) : 0;
  });

  const [guestCharge, setGuestCharge] = useState(() => {
    const saved = localStorage.getItem("guestCharge");
    return saved ? parseFloat(saved) : 0;
  });

  const [bedNumbers, setBedNumbers] = useState(() => {
    const saved = localStorage.getItem("bedNumbers");
    return saved ? parseFloat(saved) : 0;
  });

  const [bedCharge, setBedCharge] = useState(() => {
    const saved = localStorage.getItem("bedCharge");
    return saved ? parseFloat(saved) : 0;
  });

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [editIdx, setEditIdx] = useState<string>("");
  // console.log("outsideidx", editIdx);
  const [isEditing, setIsEditing] = useState<boolean>(() => {
    const saved = localStorage.getItem("isEditing");
    return saved ? JSON.parse(saved) : false;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("title", title);
    localStorage.setItem("price", JSON.stringify(price));
    localStorage.setItem("maxPeople", JSON.stringify(maxPeople));
    localStorage.setItem("guestNumbers", JSON.stringify(guestNumbers));
    localStorage.setItem("guestCharge", JSON.stringify(guestCharge));
    localStorage.setItem("bedNumbers", JSON.stringify(bedNumbers));
    localStorage.setItem("bedCharge", JSON.stringify(bedCharge));
    localStorage.setItem("desc", desc);
    localStorage.setItem("roomNumbersInput", roomNumbersInput);
    localStorage.setItem("showModal", JSON.stringify(showModal));
    localStorage.setItem("isEditing", JSON.stringify(isEditing));
  }, [title, price, maxPeople, desc, roomNumbersInput, showModal, guestNumbers, guestCharge, bedNumbers, bedCharge, isEditing]);

  const clearLocalRoomForm = () => {
    const keys = [
      "title",
      "price",
      "maxPeople",
      "desc",
      "roomNumbersInput",
      "showModal",
      "isEditing",
      "guestNumbers",
      "guestCharge",
      "bedNumbers",
      "bedCharge"
    ];
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
        // console.log("Removing key:", key);
      } catch (e) {
        console.warn(`Could not remove ${key} from localStorage`, e);
      }
    });
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (!effectiveHotelId) {
        alert("No hotelid")
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/rooms/byhotel/${effectiveHotelId}`);
        // console.log(res);
        setRooms(res.data);
      } catch (err) {
        console.log(err);
        alert("Error during fetching rooms");
      }
    }
    fetchRooms();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotoFiles(Array.from(e.target.files));
    }
  };

  const uploadPhotosToBackend = async (): Promise<string[]> => {
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(`${BASE_URL}/upload/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data.imageUrls;
    } catch (err) {
      console.log(err);
      toast.error("Error during uploading photos to backend, please try again!")
      return [];
    }
  };

  const handleEditRoom = async () => {
    if (!title || price <= 0 || maxPeople <= 0 || !desc || roomNumbersInput.length == 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    const roomNumbers = roomNumbersInput
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => ({ number: Number(num) }));

    if (roomNumbers.some((r) => isNaN(r.number))) {
      toast.error("Please enter valid room numbers (comma separated numbers).");
      setIsLoading(false);
      return;
    }

    let newPhotoUrls: string[] = [];
    if (photoFiles.length > 0) {
      newPhotoUrls = await uploadPhotosToBackend();
    }

    // Get the current room being edited to access its old photos
    // console.log("edit", editIdx);
    const currentRoom = rooms.find((room) => room._id === editIdx);
    const existingPhotoUrls = currentRoom?.photos || [];

    // Combine old and new photos
    const combinedPhotoUrls = [...existingPhotoUrls, ...newPhotoUrls];

    const updatedRoom = {
      title,
      price,
      maxPeople,
      desc,
      roomNumbers,
      photos: combinedPhotoUrls,
      hotelId: effectiveHotelId,
      maxExtraGuests: guestNumbers,
      extraGuestCharge: guestCharge,
      maxExtraBeds: bedNumbers,
      extraBedCharge: bedCharge,
    };

    try {
      // console.log("user", user?._id);
      // console.log("hotelid", newHotelId);
      // console.log("editid", editIdx);
      const res = await axios.put(`${BASE_URL}/rooms/${user?._id}/${effectiveHotelId}/${editIdx}`, updatedRoom, {
        withCredentials: true,
      });

      toast.success('Room updated successfully!');


      setRooms((prev) =>
        prev.map((room) => (room._id === editIdx ? res.data : room))
      );

      // Reset form
      setTitle("");
      setPrice(0);
      setMaxPeople(1);
      setDesc("");
      setRoomNumbersInput("");
      setPhotoFiles([]);
      setEditIdx("");
      setGuestNumbers(0);
      setGuestCharge(0);
      setBedNumbers(0);
      setBedCharge(0);
      setIsEditing(false);
      setShowModal(false);
      clearLocalRoomForm();
    } catch (err) {
      console.error("Error updating room:", err);
      toast.error("Failed to update room, please try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const roomNumbers = roomNumbersInput
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => ({ number: Number(num) }));

    let photoUrls: string[] = [];
    if (photoFiles.length > 0) {
      photoUrls = await uploadPhotosToBackend();
    }

    const roomData = {
      title,
      price,
      maxPeople,
      desc,
      roomNumbers,
      photos: photoUrls,
      hotelId: effectiveHotelId,
      maxExtraGuests: guestNumbers,
      extraGuestCharge: guestCharge,
      maxExtraBeds: bedNumbers,
      extraBedCharge: bedCharge,
    };
    // console.log("submit id", newHotelId);
    // console.log(roomData);

    try {
      const res = await axios.post(`${BASE_URL}/rooms/${effectiveHotelId}/${user?._id}`, roomData, {
        withCredentials: true,
      });
      // console.log(res);

      setRooms(prev => [...prev, res.data]);
      toast.success('Room added successfully!');

      setTitle("");
      setPrice(0);
      setMaxPeople(1);
      setDesc("");
      setRoomNumbersInput("");
      setGuestNumbers(0);
      setGuestCharge(0);
      setBedNumbers(0);
      setBedCharge(0);
      setPhotoFiles([]);
      setIsLoading(false);
      setShowModal(false);
      clearLocalRoomForm();
    } catch (err) {
      console.error(err);
      toast.error("Error while creating room, please try again!");
    }
  };


  const handleCrossClick = async (idx: string) => {
    try {
      await axios.delete(`${BASE_URL}/rooms/${user?._id}/${idx}/${effectiveHotelId}`, {
        withCredentials: true,
      });
      toast.success("Room deleted successfully!");
      setRooms(prev => prev.filter(room => room._id !== idx));
    } catch (err) {
      console.log(err);
      toast.error("Error while deleting rooms, please try again!");
    }
  };


  const openEditModal = (room: Room, idx: string) => {
    setIsEditing(true);
    // console.log("idx", idx);
    setEditIdx(idx);
    setTitle(room.title);
    setPrice(room.price);
    setMaxPeople(room.maxPeople);
    setGuestNumbers(room.maxExtraGuests);
    setGuestCharge(room.extraGuestCharge);
    setBedNumbers(room.maxExtraBeds);
    setBedCharge(room.extraBedCharge);
    setDesc(room.desc);
    setRoomNumbersInput(room.roomNumbers.map(r => r.number).join(", "));
    setShowModal(true);
  }

  const navigate = useNavigate();

  const handleSubmitRooms = async () => {
    setSubmitting(true);
    toast.success('Rooms added successfully!');
    navigate(`/hotels/${hotelIdFromParam}`);
    toast.success('Congratulations! Your hotel has been created successfully!');
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Add Rooms</h2>

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        + Add Room
      </button>

      {rooms.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="text-lg font-semibold">Rooms Added:</h3>
          {rooms.map((room) => (
            <div key={room._id} className="p-3 border rounded bg-gray-100">
              <div className="flex justify-between items-start">
                <p className="font-semibold">{room.title}</p>
                <div className="flex gap-4 text-xl">
                  <Edit
                    className="w-5 h-5 text-blue-500 cursor-pointer"
                    onClick={() => openEditModal(room, room._id)}
                  />
                  <X
                    onClick={() => handleCrossClick(room._id)}
                    className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-600 transition"
                  />
                </div>
              </div>
              <p>₹{room.price} / night | Max {room.maxPeople} people</p>
              <p className="text-sm text-gray-600">{room.desc}</p>
              <p className="text-sm">
                Room Numbers: {room.roomNumbers.map(r => r.number).join(", ")}
              </p>
              <p className="text-sm">Max Extra Guests: {room.maxExtraGuests} guests can be allowed on request</p>
              <p className="text-sm">Extra Guest Charge: {room.extraGuestCharge} / Guest</p>
              <p className="text-sm">Max Extra Beds: {room.maxExtraBeds} beds can be added on request</p>
              <p className="text-sm">Extra Bed Charge: {room.extraBedCharge} / Bed</p>
              {room.photos && room.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {room.photos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Room photo ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 sm:p-8 shadow-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Room Details</h3>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  placeholder="Deluxe Room"
                />

                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  placeholder="1200"
                  min={0}
                />

                <label className="block text-sm font-medium text-gray-700">Max People</label>
                <input
                  type="number"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  min={1}
                />

                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  rows={3}
                  placeholder="Spacious room with balcony and sea view"
                />

                <label className="block text-sm font-medium text-gray-700">Room Numbers (comma separated)</label>
                <input
                  type="text"
                  value={roomNumbersInput}
                  onChange={(e) => setRoomNumbersInput(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                  placeholder="101,102,103"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Extra Guests</label>
                <input
                  type="number"
                  value={guestNumbers}
                  onChange={(e) => setGuestNumbers(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <label className="block text-sm font-medium text-gray-700">Extra Guest Charge</label>
                <input
                  type="number"
                  value={guestCharge}
                  onChange={(e) => setGuestCharge(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <label className="block text-sm font-medium text-gray-700">Max Extra Beds</label>
                <input
                  type="number"
                  value={bedNumbers}
                  onChange={(e) => setBedNumbers(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />

                <label className="block text-sm font-medium text-gray-700">Extra Bed Charge</label>
                <input
                  type="number"
                  value={bedCharge}
                  onChange={(e) => setBedCharge(Number(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Upload Room Photos</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-2 w-full p-2 border rounded-lg focus:outline-none"
              />

              {photoFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {photoFiles.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  clearLocalRoomForm();
                  setShowModal(false);
                  setTitle("");
                  setPrice(0);
                  setMaxPeople(0);
                  setDesc("");
                  setRoomNumbersInput("");
                  setShowModal(false);
                  setIsEditing(false);
                  setGuestNumbers(0);
                  setGuestCharge(0);
                  setBedNumbers(0);
                  setBedCharge(0);
                }}
                className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={isEditing ? handleEditRoom : handleSubmit}
                className={`px-5 py-2 font-medium text-white rounded-lg transition 
            ${isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"}`}
                disabled={isLoading}
              >
                {isLoading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Room" : "Save Room")}
              </button>
            </div>
          </div>
        </div>
      )}
      {isRoomEdit && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitRooms}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {submitting ? "Submitting..." : "Submit All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomStep;