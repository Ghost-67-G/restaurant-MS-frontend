import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import OrderRow from "../components/orders/OrderRow";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import Pagination from "../components/ui/pagination";
import { useOrders, useUpdateOrder } from "../hooks/useOrder";
import { useAuthStore } from "../stores/auth.store";
import { Loader2 } from "lucide-react";

export default function Orders() {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || "owner";

  // Determine default filter based on role
  const getDefaultFilter = () => {
    if (userRole === "cashier") return "pending";
    if (userRole === "kitchen") return "pending";
    return "";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState(getDefaultFilter());
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get available status tabs based on role
  const getAvailableTabs = () => {
    if (userRole === "cashier") {
      return [
        { label: "Pending", value: "pending" },
        { label: "Preparing", value: "preparing" },
        { label: "Ready", value: "ready" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ];
    }
    if (userRole === "kitchen") {
      return [
        { label: "All", value: "" },
        { label: "Pending", value: "pending" },
        { label: "Preparing", value: "preparing" },
        { label: "Ready", value: "ready" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ];
    }
    // Owner sees all tabs
    return [
      { label: "All", value: "" },
      { label: "Pending", value: "pending" },
      { label: "Preparing", value: "preparing" },
      { label: "Ready", value: "ready" },
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
    ];
  };

  const availableTabs = getAvailableTabs();

  const {
    data: ordersData = {
      results: [],
      page: 1,
      limit: 10,
      totalPages: 1,
      totalResults: 0,
    },
    isLoading,
    isError,
  } = useOrders({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter || undefined,
    sortBy: "createdAt:desc",
  });

  const updateOrderMutation = useUpdateOrder();

  // Get the selected order from the orders list to keep it in sync
  const selectedOrder = selectedOrderId
    ? ordersData.results.find((order) => order.id === selectedOrderId)
    : null;

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const updatedOrder = await updateOrderMutation.mutateAsync({
        orderId,
        data: { status },
      });
      toast.success("Order updated successfully!");
      return updatedOrder;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
      throw error;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOrderClick = (order) => {
    setSelectedOrderId(order.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
          <p className="text-slate-600 mt-1">
            {userRole === "cashier"
              ? "View pending orders"
              : userRole === "kitchen"
                ? "Manage kitchen orders"
                : "Manage your restaurant orders"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <div className="flex gap-2 flex-wrap">
              {availableTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === tab.value
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">Failed to load orders</p>
            </div>
          ) : ordersData.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-600">No orders found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Order ID / Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {ordersData.results.map((order) => (
                      <OrderRow
                        key={order.id}
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        onClick={() => handleOrderClick(order)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={ordersData.page}
                totalPages={ordersData.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={ordersData.limit}
                totalItems={ordersData.totalResults}
              />
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
        userRole={userRole}
      />
    </DashboardLayout>
  );
}
