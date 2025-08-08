import { Link } from "react-router-dom";
import { RevenueChart } from "../../components/revenueChart/RevenueChart";
import { RevenueProgress } from "../../components/revenueProgress/RevenueProgress";
import Sidebar from "../../components/sideBar/SideBar";
import { StatsCard } from "../../components/statscard/StatsCard";
import { TransactionsTable } from "../../components/transactionsTable/TransactionsTable";

const statsData = [
    {
        href: "/users",
        title: "Users",
        value: "1,520",
        percentageChange: "+12%",
        buttonLabel: "See all users"
    },
    {
        href: "/bookings",
        title: "Bookings",
        value: "859",
        percentageChange: "+8%",
        buttonLabel: "View bookings"
    },
    {
        href: "/analytics",
        title: "Earnings",
        value: "$24,300",
        percentageChange: "+15%",
        buttonLabel: "Net earnings"
    },
    {
        href: "/analytics",
        title: "Balance",
        value: "$9,120",
        percentageChange: "+5%",
        buttonLabel: "Details"
    }
]

export default function DashboardPage() {
    return (
        <div className="flex-1 p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((data, idx) => (
                    <Link to={data.href}>
                        <StatsCard
                            title={data.title}
                            value={data.value}
                            percentageChange={data.percentageChange}
                            buttonLabel={data.buttonLabel}
                        />
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueProgress />
                <RevenueChart />
            </div>

            <div>
                <TransactionsTable />
            </div>
        </div>
    );
}