import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);


  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      const isHotelFilled = Object.values(hotel).some((val) => val !== "");
      if (isHotelFilled) {
        localStorage.setItem("hotelFormData", JSON.stringify(hotel));
      }
    }
  }, [hotel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotel((prev: any) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const savedHotel = localStorage.getItem("hotelFormData");
    if (savedHotel) {
      setHotel(JSON.parse(savedHotel));
    }
    const savedId = localStorage.getItem("newHotelId");
    if (savedId) setNewHotelId(savedId);
    setIsLoading(false);
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  //   const isReload = navEntry?.type === "reload";

  //   if (isReload && photoFiles.length === 0 && localStorage.getItem("hotelFormData")) {
  //     alert("You will need to re-upload photos after refresh.");
  //   }
  // }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setIsCreating(true);
      // Upload photos and get URLs
      const photoUrls = await uploadPhotosToBackend();

      // Create hotel with photos URLs
      const hotelData = { ...hotel, photos: photoUrls };
      const hotelRes = await axios.post(`${BASE_URL}/hotels/create`, hotelData, { withCredentials: true });

      const newHotelId = hotelRes.data._id || hotelRes.data.id;

      if (!newHotelId) throw new Error("Hotel ID not returned");

      setNewHotelId(newHotelId);
      localStorage.setItem("newHotelId", newHotelId);
      localStorage.removeItem("hotelFormData");
      setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error creating hotel");
    } finally {
      setSubmitting(false);
      setIsCreating(true);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotoFiles(files);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


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
        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition"
      >
        {isCreating ? "Creating.." : "Create Hotel"}
      </button>
    </form>
  );
};

export default CreateHotel;
