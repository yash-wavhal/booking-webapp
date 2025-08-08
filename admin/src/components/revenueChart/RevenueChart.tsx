import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Feb", revenue: 4000 },
  { month: "Mar", revenue: 4200 },
  { month: "Apr", revenue: 4700 },
  { month: "May", revenue: 5000 },
  { month: "Jun", revenue: 5300 },
  { month: "Jul", revenue: 5800 },
];

export const RevenueChart = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 h-[360px]">
      <h3 className="text-lg font-semibold mb-4">Last 6 Months (Revenue)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#revenueColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};