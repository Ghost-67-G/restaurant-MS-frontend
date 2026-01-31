import { useUpdateOrder } from "../../hooks/useOrder";
import { Clock, ChefHat, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function KitchenOrderCard({ order }) {
  const updateOrderMutation = useUpdateOrder();

  const handleStatusChange = (newStatus) => {
    updateOrderMutation.mutate(
      { orderId: order.id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Order ${newStatus === "preparing" ? "moved to preparing" : "marked ready"}!`);
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update order");
        },
      }
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    if (order.status === "pending") return "bg-yellow-100 border-yellow-300";
    if (order.status === "preparing") return "bg-blue-100 border-blue-300";
    return "bg-green-100 border-green-300";
  };

  const getStatusBadge = () => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
    };
    return badges[order.status] || badges.pending;
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusColor()} transition-all hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            #{order.id.slice(-6).toUpperCase()}
          </h3>
          <p className="text-sm text-slate-600">{formatTime(order.createdAt)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge()}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Items */}
      <div className="mb-4 space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between bg-white/60 rounded px-3 py-2">
            <span className="font-medium text-slate-900">
              {item.quantity}x {item.name}
            </span>
            <span className="text-sm text-slate-600">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between mb-4 pt-2 border-t border-slate-300">
        <span className="font-semibold text-slate-700">Total</span>
        <span className="text-lg font-bold text-slate-900">
          ${Number(order.totalAmount).toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {order.status === "pending" && (
          <button
            onClick={() => handleStatusChange("preparing")}
            disabled={updateOrderMutation.isPending}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ChefHat className="h-4 w-4" />
            Start Preparing
          </button>
        )}
        {order.status === "preparing" && (
          <button
            onClick={() => handleStatusChange("ready")}
            disabled={updateOrderMutation.isPending}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
}
