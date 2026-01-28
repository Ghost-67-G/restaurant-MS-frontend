import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { useDashboard } from "../hooks/useDashboard";
import { ShoppingBag, DollarSign, CheckCircle, Clock, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={stats?.totalOrders?.toString() || "0"}
            icon={ShoppingBag}
            iconColor="text-orange-500"
          />
          <StatCard
            title="Total Sales"
            value={`$${(stats?.totalSales || 0).toFixed(2)}`}
            icon={DollarSign}
            iconColor="text-green-500"
          />
          <StatCard
            title="Completed Orders"
            value={stats?.completedOrders?.toString() || "0"}
            icon={CheckCircle}
            iconColor="text-emerald-500"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.pendingOrders?.toString() || "0"}
            icon={Clock}
            iconColor="text-yellow-500"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
