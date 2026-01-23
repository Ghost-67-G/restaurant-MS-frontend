import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { ShoppingBag, DollarSign, Clock } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Today's Orders"
            value="0"
            icon={ShoppingBag}
            iconColor="text-orange-500"
          />
          <StatCard
            title="Today's Sales"
            value="$0"
            icon={DollarSign}
            iconColor="text-green-500"
          />
          <StatCard
            title="Active Orders"
            value="0"
            icon={Clock}
            iconColor="text-blue-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
