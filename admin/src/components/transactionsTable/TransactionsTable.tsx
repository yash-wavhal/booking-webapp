
const transactions = [
  { id: 1, name: "John Doe", date: "2025-08-07", amount: "$120", status: "Success" },
  { id: 2, name: "Alice Smith", date: "2025-08-06", amount: "$85", status: "Pending" },
  { id: 3, name: "Bob Lee", date: "2025-08-05", amount: "$200", status: "Failed" },
];

export const TransactionsTable = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Latest Transactions</h3>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2">Customer</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="py-2">{t.name}</td>
              <td className="py-2">{t.date}</td>
              <td className="py-2">{t.amount}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    t.status === "Success"
                      ? "bg-green-100 text-green-700"
                      : t.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};