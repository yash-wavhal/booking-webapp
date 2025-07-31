import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Navbar from "../../components/navbar/Navbar";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface User {
    username: string;
    email: string;
    phoneNumber: string;
    pfp: string;
    personalDetails: {
        dob: string;
        gender: "male" | "female" | "other";
        nationality: string;
    };
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pinCode: string;
    };
}

const EditProfile = () => {
    const { user } = useAuth();
    const { data: userDetails, loading, error } = useFetch<User>(`/users/${user?._id}`);
    const [formData, setFormData] = useState<User>({
        username: "",
        email: "",
        phoneNumber: "",
        pfp: "",
        personalDetails: { dob: "", gender: "other", nationality: "" },
        address: { street: "", city: "", state: "", country: "", pinCode: "" },
    });
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        if (userDetails) setFormData(userDetails);
    }, [userDetails]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;

        const name = e.target.name;
        const value = e.target.value;

        if (name.includes("personalDetails.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                personalDetails: {
                    ...formData.personalDetails,
                    [key]: value
                }
            });
        } else if (name.includes("address.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [key]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            setSaving(true);
            await axios.put(`${BASE_URL}/users/${user?._id}`, formData);
            setSuccessMsg("Profile updated successfully ✅");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <h2 className="text-center text-lg font-semibold">Loading...</h2>;
    if (error) return <h2 className="text-center text-red-500">Error fetching user details...</h2>;

    return (
        <div className="bg-indigo-50">
            <Navbar />
            <div className="m-10 mb-0 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Profile</h2>

                {successMsg && (
                    <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">{successMsg}</p>
                )}

                {formData && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border bg-gray-200 rounded-lg"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Date of Birth</label>
                            <input
                                type="date"
                                name="personalDetails.dob"
                                value={formData?.personalDetails?.dob.split("T")[0]}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block font-medium">Gender</label>
                            <select
                                name="personalDetails.gender"
                                value={formData?.personalDetails?.gender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium">Nationality</label>
                            <input
                                type="text"
                                name="personalDetails.nationality"
                                value={formData?.personalDetails?.nationality}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>

                        <h3 className="text-lg font-semibold mt-4">Address</h3>
                        {(["street", "city", "state", "country", "pinCode"] as (keyof User["address"])[]).map((field) => (
                            <div key={field}>
                                <label className="block font-medium capitalize">{field}</label>
                                <input
                                    type="text"
                                    name={`address.${field}`}
                                    value={formData?.address?.[field] || ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={saving}
                            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition ${saving
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditProfile;