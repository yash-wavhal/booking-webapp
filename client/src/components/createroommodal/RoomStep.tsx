import axios from "axios";
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

interface Room {
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: { number: number }[];
  photos?: string[];
  hotelId: string;
}

const RoomStep = ({ newHotelId }: { newHotelId: string }) => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Room form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(1);
  const [desc, setDesc] = useState("");
  const [roomNumbersInput, setRoomNumbersInput] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotoFiles(Array.from(e.target.files));
    }
  };

  const uploadPhotosToBackend = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const res = await axios.post(`${BASE_URL}/upload/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return res.data.imageUrls;
  };

  const handleAddRoom = async () => {
    if (!title || price <= 0 || maxPeople <= 0 || !desc) {
      alert("Please fill all required fields.");
      return;
    }

    const roomNumbers = roomNumbersInput
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => ({ number: Number(num) }));

    if (roomNumbers.some((r) => isNaN(r.number))) {
      alert("Please enter valid room numbers (comma separated numbers).");
      return;
    }

    let photoUrls: string[] = [];
    if (photoFiles.length > 0) {
      photoUrls = await uploadPhotosToBackend(photoFiles);
    }

    const newRoom: Room = {
      title,
      price,
      maxPeople,
      desc,
      roomNumbers,
      photos: photoUrls,
      hotelId: newHotelId,
    };

    setRooms((prev) => [...prev, newRoom]);

    // Reset form
    setTitle("");
    setPrice(0);
    setMaxPeople(1);
    setDesc("");
    setRoomNumbersInput("");
    setPhotoFiles([]);
    setShowModal(false);
  };

  const handleSubmitAll = async () => {
    try {
      for (const room of rooms) {
        await axios.post(`${BASE_URL}/rooms/${newHotelId}`, room, {
          withCredentials: true,
        });
      }
      alert("✅ Rooms added successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error while creating rooms");
    }
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
          {rooms.map((room, idx) => (
            <div key={idx} className="p-3 border rounded bg-gray-100">
              <p className="font-semibold">{room.title}</p>
              <p>₹{room.price} / night | Max {room.maxPeople} people</p>
              <p className="text-sm text-gray-600">{room.desc}</p>
              <p className="text-sm">Room Numbers: {room.roomNumbers.map(r => r.number).join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmitAll}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Submit All Rooms
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded shadow-lg">
            <h3 className="text-xl font-bold mb-4">Room Details</h3>

            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              placeholder="Deluxe Room"
            />

            <label className="block text-sm font-medium">Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
              placeholder="1200"
              min={0}
            />

            <label className="block text-sm font-medium">Max People</label>
            <input
              type="number"
              value={maxPeople}
              onChange={(e) => setMaxPeople(Number(e.target.value))}
              className="w-full p-2 border rounded mb-3"
              min={1}
            />

            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              rows={3}
              placeholder="Spacious room with balcony and sea view"
            />

            <label className="block text-sm font-medium">Room Numbers (comma separated)</label>
            <input
              type="text"
              value={roomNumbersInput}
              onChange={(e) => setRoomNumbersInput(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="101,102,103"
            />

            <label className="block text-sm font-medium">Upload Room Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2 border rounded"
            />

            {photoFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photoFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomStep;