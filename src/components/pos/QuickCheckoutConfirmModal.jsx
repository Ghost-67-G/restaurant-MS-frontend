import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCartStore } from "../../stores/cart.store";

export default function QuickCheckoutConfirmModal({ isOpen, onClose, onConfirm, isProcessing = false }) {
  const {
    items,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    getSubtotal,
    getTaxAmount,
    getDiscountAmount,
    getTotal,
    orderType,
    tableNumber,
    deliveryFee,
    selectedTax,
    discount,
    orderNote,
  } = useCartStore();

  if (!isOpen) return null;

  const getLineTotal = (item) => {
    const modifiersTotal = (item.selectedModifiers || []).reduce(
      (sum, modifier) => sum + Number(modifier.price || 0),
      0
    );
    return (Number(item.price || 0) + modifiersTotal) * item.quantity;
  };

  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const discountAmount = getDiscountAmount();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Confirm Quick Checkout</h3>
              <p className="text-sm text-slate-500">Review and adjust items before completion + invoice</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded p-3">
              <span className="font-medium capitalize">{orderType}</span>
              {orderType === "dine-in" && tableNumber ? ` | Table ${tableNumber}` : ""}
              {orderType === "delivery" && deliveryFee > 0 ? ` | Delivery $${Number(deliveryFee).toFixed(2)}` : ""}
            </div>

            {items.length === 0 ? (
              <div className="text-center text-slate-500 py-12">Cart is empty</div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        {item.selectedModifiers?.length > 0 && (
                          <p className="text-xs text-slate-500 mt-1">
                            Extras: {item.selectedModifiers.map((m) => `${m.name} (+$${Number(m.price || 0).toFixed(2)})`).join(", ")}
                          </p>
                        )}
                        {item.itemNote && <p className="text-xs text-slate-500 mt-1">Note: {item.itemNote}</p>}
                        <p className="text-xs text-slate-500 mt-1">Base: ${Number(item.price).toFixed(2)}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-900">${getLineTotal(item).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.id)}
                            className="w-7 h-7 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => incrementQuantity(item.id)}
                            className="w-7 h-7 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {orderNote && (
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Order Note</p>
                <p className="text-sm text-slate-700">{orderNote}</p>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
              {discount && discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {selectedTax && taxAmount > 0 && (
                <div className="flex justify-between"><span className="text-slate-600">{selectedTax.name} ({selectedTax.percentage}%)</span><span className="font-medium">${taxAmount.toFixed(2)}</span></div>
              )}
              {orderType === "delivery" && deliveryFee > 0 && (
                <div className="flex justify-between"><span className="text-slate-600">Delivery Fee</span><span className="font-medium">${Number(deliveryFee).toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-orange-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>Close</Button>
            <Button
              onClick={onConfirm}
              disabled={isProcessing || items.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessing ? "Processing..." : "Complete & Generate Invoice"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
