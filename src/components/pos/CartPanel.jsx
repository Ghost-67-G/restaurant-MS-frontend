import { Plus, Minus, X, Store, ShoppingBag, Truck, Tag } from "lucide-react";
import { useCartStore } from "../../stores/cart.store";
import { useTaxes } from "../../hooks/useTax";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function CartPanel({ onPlaceOrder, onOpenQuickCheckoutConfirm, isPlacingOrder = false }) {
  const { 
    items, 
    incrementQuantity, 
    decrementQuantity, 
    removeItem, 
    getTotal,
    getSubtotal,
    getTaxAmount,
    getDiscountAmount,
    clearCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    deliveryFee,
    setDeliveryFee,
    selectedTax,
    setSelectedTax,
    discount,
    setDiscount,
    orderNote,
    setOrderNote,
    setItemModifiers,
    setItemNote,
  } = useCartStore();

  const { data: taxesData } = useTaxes();

  const total = getTotal();
  const subtotal = getSubtotal();
  const taxAmount = getTaxAmount();
  const discountAmount = getDiscountAmount();

  const orderTypes = [
    { value: "dine-in", label: "Dine In", icon: Store },
    { value: "takeaway", label: "Takeaway", icon: ShoppingBag },
    { value: "delivery", label: "Delivery", icon: Truck },
  ];

  const getLineTotal = (item) => {
    const modifiersTotal = (item.selectedModifiers || []).reduce(
      (sum, modifier) => sum + Number(modifier.price || 0),
      0
    );
    return (Number(item.price || 0) + modifiersTotal) * item.quantity;
  };

  const toggleModifier = (item, modifier) => {
    const selected = item.selectedModifiers || [];
    const exists = selected.some((m) => m.name === modifier.name);
    const updated = exists
      ? selected.filter((m) => m.name !== modifier.name)
      : [...selected, { name: modifier.name, price: Number(modifier.price || 0) }];
    setItemModifiers(item.id, updated);
  };

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

      {/* Order Type Selection */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <label className="text-xs font-semibold text-slate-600 mb-2 block">
          ORDER TYPE
        </label>
        <div className="grid grid-cols-3 gap-2">
          {orderTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setOrderType(type.value)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  orderType === type.value
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Table Number for Dine-In */}
        {orderType === "dine-in" && (
          <div className="mt-3">
            <Input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        )}

        {/* Delivery Fee for Delivery */}
        {orderType === "delivery" && (
          <div className="mt-3">
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Delivery Fee (optional)"
              value={deliveryFee || ""}
              onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
              className="h-9 text-sm"
            />
          </div>
        )}

        {/* Tax Selection */}
        {taxesData?.results && taxesData.results.length > 0 && (
          <div className="mt-3">
            <label className="text-xs font-semibold text-slate-600 mb-2 block">
              TAX
            </label>
            <select
              value={selectedTax?.id || ""}
              onChange={(e) => {
                if (e.target.value === "") {
                  setSelectedTax(null);
                } else {
                  const tax = taxesData.results.find(t => t.id === e.target.value);
                  setSelectedTax(tax);
                }
              }}
              className="w-full h-9 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">No Tax</option>
              {taxesData.results.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.name} ({tax.percentage}%)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Discount */}
        <div className="mt-3">
          <label className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
            <Tag className="h-3 w-3" />
            DISCOUNT
          </label>
          <div className="flex gap-2">
            <select
              value={discount?.type || ""}
              onChange={(e) => {
                if (e.target.value === "") {
                  setDiscount(null);
                } else {
                  setDiscount({ type: e.target.value, value: discount?.value || 0 });
                }
              }}
              className="flex-1 h-9 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">No Discount</option>
              <option value="PERCENT">Percent (%)</option>
              <option value="FLAT">Flat ($)</option>
            </select>
            {discount && (
              <Input
                type="number"
                step="0.01"
                min="0"
                max={discount.type === 'PERCENT' ? 100 : undefined}
                placeholder={discount.type === 'PERCENT' ? '%' : '$'}
                value={discount.value || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setDiscount({ ...discount, value });
                }}
                className="w-24 h-9 text-sm"
              />
            )}
          </div>
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
                  ${getLineTotal(item).toFixed(2)}
                </p>
              </div>

              {item.modifiers?.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Extras</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.modifiers.map((modifier) => {
                      const isSelected = (item.selectedModifiers || []).some((m) => m.name === modifier.name);
                      return (
                        <button
                          key={modifier.name}
                          type="button"
                          onClick={() => toggleModifier(item, modifier)}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {modifier.name} (+${Number(modifier.price || 0).toFixed(2)})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-3">
                <Input
                  type="text"
                  value={item.itemNote || ""}
                  onChange={(e) => setItemNote(item.id, e.target.value)}
                  placeholder="Item note (e.g. less spicy)"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 mb-2 block">ORDER NOTE</label>
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            rows={2}
            placeholder="Optional note for kitchen"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {discount && discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Discount ({discount.type === 'PERCENT' ? `${discount.value}%` : `$${discount.value.toFixed(2)}`})
              </span>
              <span className="font-medium">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {selectedTax && taxAmount > 0 && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>{selectedTax.name} ({selectedTax.percentage}%)</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
          )}
          {orderType === "delivery" && deliveryFee > 0 && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-medium">${deliveryFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span className="text-orange-500">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={onOpenQuickCheckoutConfirm}
            disabled={items.length === 0 || isPlacingOrder}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold"
          >
            {isPlacingOrder ? "Processing..." : "Quick Complete + Invoice"}
          </Button>
          <Button
            onClick={onPlaceOrder}
            disabled={items.length === 0 || isPlacingOrder}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold"
          >
            {isPlacingOrder ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
