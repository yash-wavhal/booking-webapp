import axios from "axios";
import { useEffect, useState } from "react";
import { Edit, X } from 'lucide-react';

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
}

const RoomStep = ({ newHotelId }: { newHotelId: string }) => {
  // console.log("newHotelId", newHotelId);
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Room form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(1);
  const [desc, setDesc] = useState("");
  const [roomNumbersInput, setRoomNumbersInput] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [editIdx, setEditIdx] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!newHotelId) {
        alert("No hotelid")
        return;
      }
      try {
        const res = await axios.get(`${BASE_URL}/rooms/byhotel/${newHotelId}`);
        // console.log(res);
        setRooms(res.data);
      } catch (err) {
        console.log(err);
        alert("Error during fetching rooms");
      }
    }
    fetchRooms();
  }, [])

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
      alert("Error during uploading Photos To Backend")
      return [];
    }
  };

  const handleEditRoom = async () => {
    if (!title || price <= 0 || maxPeople <= 0 || !desc || roomNumbersInput.length == 0) {
      alert("Please fill all required fields.");
      return;
    }

    setIsLoading(true);

    const roomNumbers = roomNumbersInput
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num !== "")
      .map((num) => ({ number: Number(num) }));

    if (roomNumbers.some((r) => isNaN(r.number))) {
      alert("Please enter valid room numbers (comma separated numbers).");
      setIsLoading(false);
      return;
    }

    let newPhotoUrls: string[] = [];
    if (photoFiles.length > 0) {
      newPhotoUrls = await uploadPhotosToBackend();
    }

    // Get the current room being edited to access its old photos
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
      hotelId: newHotelId,
    };

    try {
      const res = await axios.put(`${BASE_URL}/rooms/${newHotelId}/${editIdx}`, updatedRoom, {
        withCredentials: true,
      });

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
      setIsEditing(false);
      setShowModal(false);
    } catch (err) {
      console.error("Error updating room:", err);
      alert("Failed to update room.");
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
      hotelId: newHotelId,
    };
    // console.log("submit id", newHotelId);
    // console.log(roomData);

    try {
      const res = await axios.post(`${BASE_URL}/rooms/${newHotelId}`, roomData, {
        withCredentials: true,
      });
      // console.log(res);

      setRooms(prev => [...prev, res.data]);
      alert("Room added successfully!");

      setTitle("");
      setPrice(0);
      setMaxPeople(1);
      setDesc("");
      setRoomNumbersInput("");
      setPhotoFiles([]);
      setIsLoading(false);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error while creating room");
    }
  };


  const handleCrossClick = async (idx: string) => {
    try {
      // console.log("cross id", idx);
      const res = await axios.delete(`${BASE_URL}/rooms/${idx}/${newHotelId}`);
      // console.log(res);
      setRooms(res.data);
    } catch (err) {
      console.log(err);
      alert("Error while deleting rooms");
    }
  }

  const openEditModal = (room: Room, idx: string) => {
    setIsEditing(true);
    setEditIdx(idx);
    setTitle(room.title);
    setPrice(room.price);
    setMaxPeople(room.maxPeople);
    setDesc(room.desc);
    setRoomNumbersInput(room.roomNumbers.map(r => r.number).join(", "));
    setShowModal(true);
  }

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
                <X
                  onClick={() => handleCrossClick(room._id)}
                  className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-600 transition"
                />
                <Edit
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                  onClick={() => openEditModal(room, room._id)}
                />

              </div>
              <p>₹{room.price} / night | Max {room.maxPeople} people</p>
              <p className="text-sm text-gray-600">{room.desc}</p>
              <p className="text-sm">
                Room Numbers: {room.roomNumbers.map(r => r.number).join(", ")}
              </p>
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
              {isEditing ?
                <button
                  onClick={handleEditRoom}
                  className={`px-4 py-2 rounded text-white transition 
    ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isLoading ? "Updating..." : "Update Room"}
                </button>
                :
                <button
                  onClick={handleSubmit}
                  className={`px-4 py-2 rounded text-white transition 
    ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                  {isLoading ? "Saving..." : "Save Room"}
                </button>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomStep;