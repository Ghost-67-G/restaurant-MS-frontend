import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  orderType: "dine-in", // dine-in, takeaway, delivery
  tableNumber: "",
  deliveryFee: 0,
  selectedTax: null, // Selected tax for this order

  setSelectedTax: (tax) => {
    set({ selectedTax: tax });
  },

  setOrderType: (type) => {
    set({ orderType: type });
  },

  setTableNumber: (number) => {
    set({ tableNumber: number });
  },

  setDeliveryFee: (fee) => {
    set({ deliveryFee: fee });
  },

  addItem: (menuItem) => {
    const items = get().items;
    const existingItem = items.find((item) => item.id === menuItem.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { ...menuItem, quantity: 1 }],
      });
    }
  },

  removeItem: (itemId) => {
    set({
      items: get().items.filter((item) => item.id !== itemId),
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    });
  },

  incrementQuantity: (itemId) => {
    set({
      items: get().items.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    });
  },

  decrementQuantity: (itemId) => {
    const items = get().items;
    const item = items.find((i) => i.id === itemId);

    if (item && item.quantity > 1) {
      set({
        items: items.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      });
    } else {
      get().removeItem(itemId);
    }
  },

  clearCart: () => {
    set({ 
      items: [],
      orderType: "dine-in",
      tableNumber: "",
      deliveryFee: 0,
      // Don't clear selectedTax as it should persist
    });
  },

  getSubtotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getTaxAmount: () => {
    const tax = get().selectedTax;
    if (!tax || !tax.percentage) {
      return 0;
    }
    const subtotal = get().getSubtotal();
    return (subtotal * tax.percentage) / 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const taxAmount = get().getTaxAmount();
    const deliveryFee = get().deliveryFee;
    return subtotal + taxAmount + deliveryFee;
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
