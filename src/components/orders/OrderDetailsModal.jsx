import { useState } from "react";
import { X, Store, ShoppingBag, Truck, DollarSign, Ban, AlertCircle, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useOrderAdjustments, useRefundOrder, useVoidOrder } from "../../hooks/useAdjustments";
import { useOrderInvoice, useCreateInvoice } from "../../hooks/useInvoice";
import RefundVoidModal from "./RefundVoidModal";
import InvoiceModal from "./InvoiceModal";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "preparing", label: "Preparing", color: "bg-blue-100 text-blue-800" },
  { value: "ready", label: "Ready", color: "bg-lime-100 text-lime-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function OrderDetailsModal({ order, isOpen, onClose, onUpdateStatus, isUpdating = false, userRole = 'owner' }) {
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  
  const { data: adjustments } = useOrderAdjustments(order?.id);
  const { data: invoice, isLoading: loadingInvoice } = useOrderInvoice(order?.id);
  const createInvoiceMutation = useCreateInvoice();
  const refundMutation = useRefundOrder();
  const voidMutation = useVoidOrder();

  if (!isOpen || !order) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];

  const canChangeStatus = (newStatus) => {
    if (order.status === "cancelled") return false;

    // Only allow cancellation while order is pending or preparing.
    if (newStatus === "cancelled") {
      return order.status === "pending" || order.status === "preparing";
    }

    if (order.status === "completed") return false;
    if (order.status === "ready" && newStatus !== "completed") return false;
    return true;
  };

  const visibleStatusOptions = STATUS_OPTIONS.filter((status) => {
    if (status.value !== "cancelled") return true;
    return order.status === "pending" || order.status === "preparing";
  });

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getOrderTypeIcon = () => {
    const icons = {
      "dine-in": Store,
      takeaway: ShoppingBag,
      delivery: Truck,
    };
    return icons[order.orderType] || Store;
  };

  const getOrderTypeBadge = () => {
    const badges = {
      "dine-in": "bg-purple-100 text-purple-800",
      takeaway: "bg-orange-100 text-orange-800",
      delivery: "bg-cyan-100 text-cyan-800",
    };
    return badges[order.orderType] || badges["dine-in"];
  };

  const getOrderTypeLabel = () => {
    const labels = {
      "dine-in": "Dine In",
      takeaway: "Takeaway",
      delivery: "Delivery",
    };
    return labels[order.orderType] || "Dine In";
  };

  const OrderTypeIcon = getOrderTypeIcon();

  const handleRefund = async (data) => {
    try {
      await refundMutation.mutateAsync(data);
      toast.success('Order refunded successfully');
      setIsRefundModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to refund order');
    }
  };

  const handleVoid = async (data) => {
    try {
      await voidMutation.mutateAsync(data);
      toast.success('Order voided successfully');
      setIsVoidModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to void order');
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      // If order is not completed yet, complete it first.
      // Backend completion triggers inventory deduction automatically.
      if (order.status !== 'completed' && userRole !== 'kitchen') {
        await onUpdateStatus(order.id, 'completed');
      }

      await createInvoiceMutation.mutateAsync(order.id);
      toast.success('Invoice generated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate invoice');
    }
  };

  const handleViewInvoice = () => {
    if (invoice) {
      setIsInvoiceModalOpen(true);
    } else {
      handleGenerateInvoice();
    }
  };

  const canRefund = order.status === 'completed' && !order.isVoided;
  const canVoid =
    order.status !== 'completed' &&
    order.status !== 'cancelled' &&
    order.status !== 'ready' &&
    !order.isVoided;
  const canGenerateInvoice = order.status !== 'cancelled' && !order.isVoided && userRole !== 'kitchen';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Order Type & Details */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <span className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${getOrderTypeBadge()}`}>
                {/* eslint-disable-next-line react-hooks/static-components */}
                <OrderTypeIcon className="h-4 w-4" />
                {getOrderTypeLabel()}
              </span>
              {order.orderType === "dine-in" && order.tableNumber && (
                <span className="text-sm text-slate-600">
                  Table: <span className="font-semibold">{order.tableNumber}</span>
                </span>
              )}
              {order.orderType === "delivery" && order.deliveryFee > 0 && (
                <span className="text-sm text-slate-600">
                  Delivery Fee: <span className="font-semibold">${order.deliveryFee.toFixed(2)}</span>
                </span>
              )}
            </div>

            {/* Current Status */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Current Status</h4>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus.color}`}
              >
                {currentStatus.label}
              </span>
            </div>

            {/* Update Status */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {visibleStatusOptions.map((status) => {
                  const isCurrent = status.value === order.status;
                  const isDisabled = !canChangeStatus(status.value) || isCurrent;

                  return (
                    <button
                      key={status.value}
                      onClick={() => !isDisabled && onUpdateStatus(order.id, status.value)}
                      disabled={isDisabled || isUpdating}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCurrent
                          ? status.color
                          : isDisabled
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {status.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-3">Order Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Item
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                        Qty
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900 text-right">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-slate-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900 font-medium">
                    ${(order.subtotal || calculateSubtotal()).toFixed(2)}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Discount {order.discountType && order.discountValue && (
                        order.discountType === 'PERCENT' 
                          ? `(${order.discountValue}%)` 
                          : `($${Number(order.discountValue).toFixed(2)})`
                      )}
                    </span>
                    <span className="text-green-600 font-medium">
                      -${Number(order.discountAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {order.taxName || "Tax"} {order.taxPercentage && `(${order.taxPercentage}%)`}
                    </span>
                    <span className="text-slate-900 font-medium">
                      ${Number(order.taxAmount).toFixed(2)}
                    </span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Delivery Fee</span>
                    <span className="text-slate-900 font-medium">
                      ${Number(order.deliveryFee).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2">
                  <span className="text-slate-900">Total</span>
                  <span className="text-orange-600">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Adjustments Section */}
            {adjustments && adjustments.length > 0 && (
              <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Adjustments
                </h4>
                <div className="space-y-2">
                  {adjustments.map((adj) => (
                    <div key={adj.id} className="flex justify-between items-start text-sm p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            adj.type === 'REFUND' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {adj.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(adj.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs">{adj.reason}</p>
                      </div>
                      <span className={`font-semibold ${
                        adj.type === 'REFUND' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        -${Number(adj.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Void/Refund Status */}
            {(order.isVoided || order.isRefunded) && (
              <div className="border-t border-slate-200 pt-4 mt-4">
                {order.isVoided && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                      <Ban className="h-4 w-4" />
                      This order has been voided
                    </p>
                  </div>
                )}
                {order.isRefunded && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      This order has been fully refunded
                    </p>
                  </div>
                )}
                {order.refundedAmount > 0 && !order.isRefunded && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      Partially refunded: ${Number(order.refundedAmount).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Customer Info (if available) */}
            {order.customer && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Customer Information
                </h4>
                <div className="text-sm text-slate-600">
                  <p>{order.customer.name}</p>
                  {order.customer.phone && <p>{order.customer.phone}</p>}
                  {order.customer.email && <p>{order.customer.email}</p>}
                </div>
              </div>
            )}

            {/* Notes (if available) */}
            {order.notes && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Notes</h4>
                <p className="text-sm text-slate-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex gap-2">
              {canGenerateInvoice && (
                <Button
                  onClick={handleViewInvoice}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                  disabled={loadingInvoice || createInvoiceMutation.isPending}
                >
                  <FileText className="h-4 w-4" />
                  {invoice ? 'View Invoice' : order.status === 'completed' ? 'Generate Invoice' : 'Complete & Generate Invoice'}
                </Button>
              )}
              {canRefund && (
                <Button
                  onClick={() => setIsRefundModalOpen(true)}
                  variant="outline"
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Refund
                </Button>
              )}
              {canVoid && (
                <Button
                  onClick={() => setIsVoidModalOpen(true)}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
                >
                  <Ban className="h-4 w-4" />
                  Void
                </Button>
              )}
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Refund/Void Modals */}
      <RefundVoidModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSubmit={handleRefund}
        type="REFUND"
        order={order}
        isLoading={refundMutation.isPending}
      />
      <RefundVoidModal
        isOpen={isVoidModalOpen}
        onClose={() => setIsVoidModalOpen(false)}
        onSubmit={handleVoid}
        type="VOID"
        order={order}
        isLoading={voidMutation.isPending}
      />

      {/* Invoice Modal */}
      {invoice && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          invoice={invoice}
        />
      )}
    </div>
  );
}
