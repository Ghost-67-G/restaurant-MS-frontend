export default function OrderRow({ order, onUpdateStatus, onClick }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr 
      className="border-b border-slate-200 hover:bg-slate-50 cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900">
          #{order.id.slice(-6).toUpperCase()}
        </div>
        <div className="text-xs text-slate-500">{formatDate(order.createdAt)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900">
          {order.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="mb-1">
              {item.quantity}x {item.name}
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-slate-500">
              +{order.items.length - 2} more item(s)
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-slate-900">
          ${Number(order.totalAmount).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            order.status === "completed"
              ? "bg-green-100 text-green-800"
              : order.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : order.status === "preparing"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
        <button
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          View
        </button>
      </td>
    </tr>
  );
}
