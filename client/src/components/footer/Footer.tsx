import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-auto mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Branding */}
          <div>
            <h2 className="text-4xl font-bold text-yellow-500">Hotel Booking</h2>
            <p className="mt-3 text-gray-400 text-sm">Your trusted travel partner for seamless hotel and accommodation bookings across the globe.</p>
            <div className="flex space-x-3 mt-4">
              <FaFacebookF className="hover:text-yellow-500 cursor-pointer" />
              <FaTwitter className="hover:text-yellow-500 cursor-pointer" />
              <FaInstagram className="hover:text-yellow-500 cursor-pointer" />
              <FaLinkedin className="hover:text-yellow-500 cursor-pointer" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white text-lg">Destination</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Countries", "Regions", "Cities", "Districts", "Airports", "Hotels"].map((item) => (
                <li key={item} className="hover:text-yellow-500 cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg">Stays</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Homes", "Apartments", "Resorts", "Villas", "Hostels", "Guest houses"].map((item) => (
                <li key={item} className="hover:text-yellow-500 cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white text-lg">Help & Resources</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {["Customer Service", "Careers", "Sustainability", "Press Center", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item} className="hover:text-yellow-500 cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">© 2022 Hotel Booking. All Rights Reserved</div>
          <div className="mt-4 md:mt-0 flex space-x-3 items-center">
            <input
              type="email"
              placeholder="Enter your email..."
              className="p-2 rounded-l bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none"
            />
            <button className="bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-r hover:bg-yellow-600">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;