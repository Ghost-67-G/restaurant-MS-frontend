import { Plus, Minus, X } from "lucide-react";
import { useCartStore } from "../../stores/cart.store";
import { Button } from "../ui/button";

export default function CartPanel({ onPlaceOrder }) {
  const { items, incrementQuantity, decrementQuantity, removeItem, getTotal, clearCart } = useCartStore();

  const total = getTotal();

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Current Order</h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-slate-600 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <p className="text-sm">No items in cart</p>
            <p className="text-xs mt-1">Select items to add</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-lg p-3 border border-slate-200"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-slate-900 text-sm flex-1 line-clamp-2">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrementQuantity(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-semibold text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => incrementQuantity(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <p className="font-bold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span className="text-orange-500">${total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={onPlaceOrder}
          disabled={items.length === 0}
          className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}
