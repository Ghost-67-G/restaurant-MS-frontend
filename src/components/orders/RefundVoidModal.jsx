import { useState } from 'react';
import { X, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export default function RefundVoidModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type, // 'REFUND' or 'VOID'
  order,
  isLoading = false 
}) {
  const [amount, setAmount] = useState(order?.totalAmount || 0);
  const [reason, setReason] = useState('');

  if (!isOpen || !order) return null;

  const isRefund = type === 'REFUND';
  const maxAmount = order.totalAmount - (order.refundedAmount || 0); // Maximum refundable amount

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ orderId: order.id, amount: parseFloat(amount), reason });
  };

  const canSubmit = () => {
    if (!reason.trim()) return false;
    if (isRefund) {
      const amountNum = parseFloat(amount);
      return amountNum > 0 && amountNum <= maxAmount;
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${isRefund ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {isRefund ? (
                  <DollarSign className={`h-5 w-5 ${isRefund ? 'text-yellow-600' : 'text-red-600'}`} />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {isRefund ? 'Refund Order' : 'Void Order'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-4">
                {isRefund 
                  ? 'Process a refund for this completed order. Inventory will be restored automatically.'
                  : 'Void this pending order. No inventory adjustments will be made.'}
              </p>

              {order.isRefunded && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    This order has already been refunded.
                  </p>
                </div>
              )}

              {order.refundedAmount > 0 && !order.isRefunded && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Already refunded: ${Number(order.refundedAmount).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {isRefund && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Refund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Maximum refundable: ${maxAmount.toFixed(2)}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
                placeholder={isRefund ? "e.g., Customer complaint, wrong order..." : "e.g., Duplicate order, customer cancelled..."}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!canSubmit() || isLoading}
                className={`${
                  isRefund 
                    ? 'bg-yellow-500 hover:bg-yellow-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {isLoading ? 'Processing...' : isRefund ? 'Process Refund' : 'Void Order'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
