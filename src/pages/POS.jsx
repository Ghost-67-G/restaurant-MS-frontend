import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import MenuItemButton from "../components/pos/MenuItemButton";
import CartPanel from "../components/pos/CartPanel";
import { useMenuItems } from "../hooks/useMenu";
import { useCartStore } from "../stores/cart.store";
import { Loader2, Search } from "lucide-react";

export default function POS() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: menuItems = { results: [], page: 1, limit: 100, totalPages: 1, totalResults: 0 }, isLoading, isError } = useMenuItems({ limit: 100 });
  const clearCart = useCartStore((state) => state.clearCart);

  const handlePlaceOrder = () => {
    const items = useCartStore.getState().items;
    if (items.length === 0) return;

    // TODO: Implement order creation
    console.log("Place order:", items);
    alert("Order placed successfully!");
    clearCart();
  };

  const filteredItems = menuItems.results.filter(
    (item) =>
      item.isAvailable &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="fixed inset-0 md:pl-64 pt-16 bg-slate-50">
        <div className="h-full flex">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 bg-white border-b border-slate-200">
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-600">Failed to load menu items</p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">
                    {searchQuery ? "No items found" : "No available menu items"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-7xl">
                  {filteredItems.map((item) => (
                    <MenuItemButton key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-96 shrink-0">
            <CartPanel onPlaceOrder={handlePlaceOrder} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
