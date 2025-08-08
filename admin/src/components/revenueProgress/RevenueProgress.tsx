import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const RevenueProgress = () => {
  const percentage = 70;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Total Revenue</h3>
      <div className="w-36 mx-auto mb-4">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          strokeWidth={6}
          styles={buildStyles({
            pathColor: "#3b82f6",
            textColor: "#111827",
          })}
        />
      </div>
      <p className="text-center text-xl font-medium">$420</p>
      <p className="text-center text-sm text-gray-500 mt-1">Total sales made today</p>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Target</span>
        <span>$500</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Last Week</span>
        <span>$3,200</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Last Month</span>
        <span>$12,800</span>
      </div>
    </div>
  );
};