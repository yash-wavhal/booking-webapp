import React from "react";
import {
  ShieldCheck,
  Headphones,
  Tag,
  RefreshCcw,
  Star,
  Clock,
} from "lucide-react";

interface Benefit {
  icon: React.ElementType;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: ShieldCheck,
    title: "Best Price Guarantee",
    description: "We match any lower rate you find online.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer service for peace of mind.",
  },
  {
    icon: Tag,
    title: "Exclusive Deals",
    description: "Special discounts available only here.",
  },
  {
    icon: RefreshCcw,
    title: "Free Cancellations",
    description: "Cancel your booking at no cost within the deadline.",
  },
  {
    icon: Star,
    title: "Top-rated Hotels",
    description: "Chosen for quality and customer satisfaction.",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Get an immediate confirmation upon booking.",
  },
];

const WhyBookHere: React.FC = () => {
  return (
    <div className="bg-gray-900 max-w-auto mx-auto p-20 text-center">
      <h2 className="text-3xl font-bold text-white">WHY TO BOOK HERE?</h2>
      <p className="text-white mt-2">
        Book with confidence and enjoy a seamless travel experience
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="flex justify-center">
                <div className="bg-blue-100 rounded-full p-3">
                  <Icon className="text-blue-600" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mt-4">{benefit.title}</h3>
              <p className="text-gray-600 mt-2">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyBookHere;
