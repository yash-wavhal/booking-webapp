import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Booking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
  };
  hotelOwnerId: {
    _id: string;
    username: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  amountPaid: number;
  createdAt: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const TransactionsTable = ({ transactions }: { transactions: Booking[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const statuses = ["Success", "Pending", "Failed"];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];

  const filteredTransactions = transactions.filter((t) => {
    const customer = t?.userId?.username?.toLowerCase() || "";
    const hotel = t?.hotelId?.name?.toLowerCase() || "";
    const email = t?.userId?.email?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return customer.includes(query) || hotel.includes(query) || email.includes(query);
  });

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Latest Transactions</h3>

      <input
        type="text"
        placeholder="Search by customer, hotel, or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border rounded-lg"
      />

      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Customer</th>
            <th className="py-2">Hotel Owner</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => {
            const status = getRandomStatus();
            return (
              <tr key={t._id} className="border-b">
                <td className="py-2">{t?.userId?.username || "N/A"}</td>
                <td className="py-2">{t?.hotelOwnerId?.username || "N/A"}</td>
                <td className="py-2">
                  {t.createdAt
                    ? new Date(t?.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="py-2">₹{t?.amountPaid || 0}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      status === "Success"
                        ? "bg-green-100 text-green-700"
                        : status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredTransactions.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">No transactions found</p>
      )}
    </div>
  );
};