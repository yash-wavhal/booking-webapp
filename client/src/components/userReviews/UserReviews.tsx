import React from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  review: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Ramesh Patel",
    avatar:
      "https://randomuser.me/api/portraits/men/20.jpg",
    rating: 5,
    review:
      "Amazing experience! The staff was incredibly helpful and the room was cozy and clean.",
  },
  {
    id: 2,
    name: "Navneet Sharma",
    avatar:
      "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
    review:
      "Very nice hotel in a convenient location. Will definitely stay here again.",
  },
  {
    id: 3,
    name: "Suresh Joshi",
    avatar:
      "https://randomuser.me/api/portraits/men/48.jpg",
    rating: 5,
    review:
      "Excellent service and beautiful rooms. Highly recommend for a comfortable stay.",
  },
];

const UserReviews: React.FC = () => {
  return (
    <div className="bg-inherit max-w-6xl mx-auto my-12 p-20 text-center">
      <h2 className="text-3xl font-bold text-gray-800">WHAT OUR GUESTS SAY</h2>
      <p className="text-gray-600 mt-2">Real reviews from satisfied customers</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {reviews.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg p-5 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            <div className="flex justify-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <div className="flex justify-center mt-1">
                {[...Array(user.rating)].map((_, index) => (
                  <Star key={`filled-${index}`} className="text-yellow-400 fill-yellow-400" />
                ))}
                {[...Array(5 - user.rating)].map((_, index) => (
                  <Star key={`empty-${index}`} className="text-gray-300" />
                ))}
              </div>
              <p className="text-gray-600 mt-3 italic">“{user.review}”</p>
            </div>
          </div>
        ))}
      </div>
      {/* <div className="mt-8">
        <a
          href="/reviews"
          className="inline-block bg-blue-600 text-white font-bold rounded px-6 py-2 hover:bg-blue-700 transition"
        >
          See All Reviews
        </a>
      </div> */}
    </div>
  );
};

export default UserReviews;
