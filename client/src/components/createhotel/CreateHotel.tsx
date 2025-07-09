// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import RoomModal from "../../components/createroommodal/RoomModal";

// interface Room {
//   title: string;
//   price: number;
//   maxPeople: number;
//   desc: string;
//   roomNumbers: { number: number }[];
//   photos?: string[];
// }

// interface Hotel {
//   name: string;
//   type: string;
//   city: string;
//   address: string;
//   distance: string;
//   title: string;
//   desc: string;
//   photos: string[];
// }

// const CreateHotel = () => {
//   const navigate = useNavigate();
//   const [hotel, setHotel] = useState<Omit<Hotel, "photos">>({
//     name: "",
//     type: "",
//     city: "",
//     address: "",
//     distance: "",
//     title: "",
//     desc: "",
//   });

//   const [photoFiles, setPhotoFiles] = useState<File[]>([]);
//   const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
//   const [uploading, setUploading] = useState(false);
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [showRoomModal, setShowRoomModal] = useState(false);

//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setHotel((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setPhotoFiles(files);
//       setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
//     }
//   };

//   const uploadPhotosToBackend = async (): Promise<string[]> => {
//     const formData = new FormData();
//     photoFiles.forEach((file) => formData.append("images", file));

//     const res = await axios.post(`${BASE_URL}/upload/images`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//       withCredentials: true,
//     });

//     return res.data.imageUrls;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setUploading(true);

//       const imageUrls = await uploadPhotosToBackend();

//       const finalHotel: Hotel & { rooms: Room[] } = {
//         ...hotel,
//         photos: imageUrls,
//         rooms, // send rooms array along with hotel
//       };

//       const response = await axios.post(`${BASE_URL}/hotels/create`, finalHotel, {
//         withCredentials: true,
//       });

//       alert("✅ Hotel created successfully!");
//       const newHotelId = response.data._id || response.data.id;
//       if (newHotelId) {
//         navigate(`/hotels/${newHotelId}`); // Navigate to hotel detail page
//       }
//     } catch (err: any) {
//       console.error(err);
//       alert("❌ Failed to create hotel.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleAddRoom = (room: Room) => {
//     setRooms((prev) => [...prev, room]);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
//       <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Create a New Hotel</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Hotel Name"
//           value={hotel.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <select
//           name="type"
//           value={hotel.type}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         >
//           <option value="">Select type</option>
//           <option value="Hotel">Hotel</option>
//           <option value="Apartment">Apartment</option>
//           <option value="Resort">Resort</option>
//           <option value="Villa">Villa</option>
//           <option value="Cabin">Cabin</option>
//         </select>
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={hotel.city}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={hotel.address}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="distance"
//           placeholder="Distance from City Center (e.g., 500m)"
//           value={hotel.distance}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="text"
//           name="title"
//           placeholder="Short Title"
//           value={hotel.title}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="desc"
//           placeholder="Description"
//           value={hotel.desc}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           rows={4}
//           required
//         />

//         <div>
//           <label className="block mb-1 font-semibold text-gray-700">Upload Photos:</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handlePhotoChange}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         {photoPreviews.length > 0 && (
//           <div className="flex gap-2 flex-wrap">
//             {photoPreviews.map((src, idx) => (
//               <img
//                 key={idx}
//                 src={src}
//                 alt="Preview"
//                 className="w-24 h-24 object-cover rounded"
//               />
//             ))}
//           </div>
//         )}

//         {/* Rooms Section */}
//         <div className="mt-6">
//           <h3 className="font-semibold mb-2">Rooms</h3>
//           {rooms.length === 0 && <p>No rooms added yet.</p>}
//           <ul className="space-y-1">
//             {rooms.map((room, idx) => (
//               <li key={idx} className="border p-2 rounded flex justify-between">
//                 <span>{`${room.title} - ${room.roomNumbers
//                   .map((r) => r.number)
//                   .join(", ")}`}</span>
//                 <span>{`₹${room.price} / night`}</span>
//               </li>
//             ))}
//           </ul>
//           <button
//             type="button"
//             onClick={() => setShowRoomModal(true)}
//             className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//           >
//             Add Room
//           </button>
//         </div>

//         <button
//           type="submit"
//           disabled={uploading}
//           className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition"
//         >
//           {uploading ? "Uploading..." : "Create Hotel"}
//         </button>
//       </form>

//       {showRoomModal && (
//         <RoomModal onClose={() => setShowRoomModal(false)} onSave={handleAddRoom} />
//       )}
//     </div>
//   );
// };

// export default CreateHotel;

import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

interface Hotel {
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  title: string;
  desc: string;
  photos?: string[];
}

interface HotelFormProps {
  setStep: Dispatch<SetStateAction<number>>;
  setNewHotelId: Dispatch<SetStateAction<string>>;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const CreateHotel = ({ setStep, setNewHotelId }: HotelFormProps) => {
  const [hotel, setHotel] = useState<Hotel>({
    name: "",
    type: "",
    city: "",
    address: "",
    distance: "",
    title: "",
    desc: "",
  });
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotel((prev: any) => ({ ...prev, [name]: value }));
  };

  const uploadPhotosToBackend = async (): Promise<string[]> => {
    const formData = new FormData();
    photoFiles.forEach((file) => formData.append("images", file));

    const res = await axios.post(`${BASE_URL}/upload/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return res.data.imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Upload photos and get URLs
      const photoUrls = await uploadPhotosToBackend();

      // Create hotel with photos URLs
      const hotelData = { ...hotel, photos: photoUrls };
      const hotelRes = await axios.post(`${BASE_URL}/hotels/create`, hotelData, { withCredentials: true });

      const newHotelId = hotelRes.data._id || hotelRes.data.id;

      if (!newHotelId) throw new Error("Hotel ID not returned");
      
      setNewHotelId(newHotelId);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error creating hotel");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotoFiles(files);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        placeholder="Hotel Name"
        value={hotel.name}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="type"
        value={hotel.type}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select type</option>
        <option value="Hotel">Hotel</option>
        <option value="Apartment">Apartment</option>
        <option value="Resort">Resort</option>
        <option value="Villa">Villa</option>
        <option value="Cabin">Cabin</option>
      </select>
      <input
        type="text"
        name="city"
        placeholder="City"
        value={hotel.city}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={hotel.address}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="distance"
        placeholder="Distance from City Center (e.g., 500m)"
        value={hotel.distance}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="title"
        placeholder="Short Title"
        value={hotel.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="desc"
        placeholder="Description"
        value={hotel.desc}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={4}
      />
      <div>
        <label className="block mb-1 font-semibold text-gray-700">Upload Photos:</label>
        <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="w-full border p-2 rounded" />
      </div>
      {photoFiles.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {photoFiles.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        Create Hotel
      </button>
    </form>
  );
};

export default CreateHotel;
