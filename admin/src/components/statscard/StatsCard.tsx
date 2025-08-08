
interface Props {
  title: string;
  value: string;
  percentageChange: string;
  buttonLabel: string;
};

export const StatsCard = ({ title, value, percentageChange, buttonLabel }: Props) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between min-h-[120px]">
      <div>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <h2 className="text-2xl font-semibold">{value}</h2>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-green-600">{percentageChange}</span>
        <button className="text-blue-600 text-sm hover:underline">{buttonLabel}</button>
      </div>
    </div>
  );
};