import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Booking {
  amountPaid: number;
  createdAt: string; // ISO date string
}

interface RevenueProgressProps {
  bookings: Booking[];
  targetRevenue?: number;
}

export const RevenueProgress = ({
  bookings,
  targetRevenue = 10000,
}: RevenueProgressProps) => {
  const now = new Date();

  // Helper to sum commission for filtered bookings
  const calculateCommission = (filteredBookings: Booking[]) =>
    filteredBookings.reduce((sum, booking) => sum + booking.amountPaid * 0.15, 0);

  // Total revenue (all bookings)
  const totalRevenue = calculateCommission(bookings);

  // Revenue for last month
  const lastMonthRevenue = calculateCommission(
    bookings.filter((b) => {
      const bookingDate = new Date(b.createdAt);
      return (
        bookingDate.getFullYear() === now.getFullYear() &&
        bookingDate.getMonth() === now.getMonth() - 1
      );
    })
  );

  // Revenue for last year
  const lastYearRevenue = calculateCommission(
    bookings.filter((b) => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate.getFullYear() === now.getFullYear() - 1;
    })
  );

  const percentage = Math.min((totalRevenue / targetRevenue) * 100, 100);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Total Revenue (Commission)</h3>

      <div className="w-36 mx-auto mb-4">
        <CircularProgressbar
          value={percentage}
          text={`${Math.round(percentage)}%`}
          strokeWidth={6}
          styles={buildStyles({
            pathColor: "#3b82f6",
            textColor: "#111827",
          })}
        />
      </div>

      <p className="text-center text-xl font-medium">₹{totalRevenue.toLocaleString()}</p>
      <p className="text-center text-sm text-gray-500 mt-1">Total earnings today</p>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Target</span>
        <span>₹{targetRevenue.toLocaleString()}</span>
      </div>

      <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Last Month</span>
          <span>₹{lastMonthRevenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Year</span>
          <span>₹{lastYearRevenue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};