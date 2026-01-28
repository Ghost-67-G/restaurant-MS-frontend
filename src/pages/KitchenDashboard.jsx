import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import KitchenOrderCard from "../components/kitchen/KitchenOrderCard";
import { useOrders } from "../hooks/useOrder";
import { Loader2, ChefHat } from "lucide-react";

export default function KitchenDashboard() {
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: ordersData = { results: [], page: 1, limit: 100, totalPages: 1, totalResults: 0 }, isLoading, isError } = useOrders({
    page: 1,
    limit: 100,
    status: statusFilter || undefined,
    sortBy: "createdAt:asc", // Oldest first for kitchen
  }, {
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });

  const pendingCount = ordersData.results.filter(o => o.status === "pending").length;
  const preparingCount = ordersData.results.filter(o => o.status === "preparing").length;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-orange-500" />
              Kitchen Dashboard
            </h2>
            <p className="text-slate-600 mt-1">Manage order preparation</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-slate-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{preparingCount}</div>
              <div className="text-slate-600">Preparing</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pending Orders
          </button>
          <button
            onClick={() => setStatusFilter("preparing")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "preparing"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setStatusFilter("")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === ""
                ? "bg-orange-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Active
          </button>
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-600">Failed to load orders</p>
          </div>
        ) : ordersData.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-slate-300">
            <ChefHat className="h-16 w-16 text-slate-300 mb-4" />
            <p className="text-slate-600 text-lg font-medium">No orders to prepare</p>
            <p className="text-slate-500 text-sm mt-1">New orders will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ordersData.results.map((order) => (
              <KitchenOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
