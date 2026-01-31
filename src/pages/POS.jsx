import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import MenuItemButton from "../components/pos/MenuItemButton";
import CartPanel from "../components/pos/CartPanel";
import { useInfiniteMenuItems } from "../hooks/useMenu";
import { useCreateOrder } from "../hooks/useOrder";
import { useCartStore } from "../stores/cart.store";
import { useDebounce } from "../hooks/useDebounce";
import { Loader2, Search } from "lucide-react";

export default function POS() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const observer = useRef();
  const createOrderMutation = useCreateOrder();
  const { items, getTotal, clearCart, orderType, tableNumber, deliveryFee } = useCartStore();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMenuItems({
    limit: 20,
    isAvailable: true,
    name: debouncedSearch || undefined,
  });

  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  const menuItems = data?.pages.flatMap((page) => page.results) || [];

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (orderType === "dine-in" && !tableNumber) {
      toast.error("Please enter table number for dine-in orders");
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: getTotal(),
      orderType,
      ...(orderType === "dine-in" && { tableNumber }),
      ...(orderType === "delivery" && deliveryFee > 0 && { deliveryFee }),
    };

    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/orders");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to place order");
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-96px)] bg-slate-50">
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
              ) : menuItems.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-400">
                    {searchQuery ? "No items found" : "No available menu items"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-w-7xl">
                    {menuItems.map((item, index) => {
                      if (menuItems.length === index + 1) {
                        return (
                          <div key={item.id} ref={lastItemRef}>
                            <MenuItemButton item={item} />
                          </div>
                        );
                      }
                      return <MenuItemButton key={item.id} item={item} />;
                    })}
                  </div>
                  {isFetchingNextPage && (
                    <div className="flex justify-center mt-4">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="w-96 shrink-0">
            <CartPanel onPlaceOrder={handlePlaceOrder} isPlacingOrder={createOrderMutation.isPending} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
