import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

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
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
