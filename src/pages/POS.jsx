import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import MenuItemButton from "../components/pos/MenuItemButton";
import CartPanel from "../components/pos/CartPanel";
import InvoiceModal from "../components/orders/InvoiceModal";
import { useInfiniteMenuItems } from "../hooks/useMenu";
import { useCreateOrder, useUpdateOrder } from "../hooks/useOrder";
import { useCreateInvoice } from "../hooks/useInvoice";
import { useTaxes } from "../hooks/useTax";
import { useCartStore } from "../stores/cart.store";
import { useDebounce } from "../hooks/useDebounce";
import { Loader2, Search } from "lucide-react";

export default function POS() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [quickInvoice, setQuickInvoice] = useState(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const observer = useRef();
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const createInvoiceMutation = useCreateInvoice();
  const { data: taxesData } = useTaxes();
  const { items, getTotal, getSubtotal, getTaxAmount, getDiscountAmount, clearCart, orderType, tableNumber, deliveryFee, selectedTax, setSelectedTax, discount } = useCartStore();

  // Set default tax (first available) when taxes load - only once
  useEffect(() => {
    if (taxesData?.results && taxesData.results.length > 0 && selectedTax === null) {
      setSelectedTax(taxesData.results[0]);
    }
  }, [taxesData]);

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

  const buildOrderPayload = () => {
    const subtotal = getSubtotal();
    const discountAmount = getDiscountAmount();
    const taxAmount = getTaxAmount();
    const total = getTotal();

    return {
      items: items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      ...(discount && {
        discountType: discount.type,
        discountValue: discount.value,
        discountAmount,
      }),
      taxName: selectedTax?.name,
      taxPercentage: selectedTax?.percentage,
      taxAmount,
      deliveryFee,
      totalAmount: total,
      orderType,
      ...(orderType === "dine-in" && { tableNumber }),
    };
  };

  const validateOrderBeforeSubmit = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return false;
    }

    if (orderType === "dine-in" && !tableNumber) {
      toast.error("Please enter table number for dine-in orders");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = () => {
    if (!validateOrderBeforeSubmit()) {
      return;
    }

    const orderData = buildOrderPayload();

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

  const handleQuickCompleteWithInvoice = async () => {
    if (!validateOrderBeforeSubmit()) {
      return;
    }

    try {
      const orderData = buildOrderPayload();
      const createdOrder = await createOrderMutation.mutateAsync(orderData);

      await updateOrderMutation.mutateAsync({
        orderId: createdOrder.id,
        data: { status: "completed" },
      });

      const invoice = await createInvoiceMutation.mutateAsync(createdOrder.id);
      clearCart();
      toast.success(`Completed & invoiced (${invoice.invoiceNumber})`);
      setQuickInvoice(invoice);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed quick checkout");
    }
  };

  const isSubmittingOrder =
    createOrderMutation.isPending || updateOrderMutation.isPending || createInvoiceMutation.isPending;

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
            <CartPanel
              onPlaceOrder={handlePlaceOrder}
              onQuickCompleteWithInvoice={handleQuickCompleteWithInvoice}
              isPlacingOrder={isSubmittingOrder}
            />
          </div>
        </div>
      </div>

      <InvoiceModal
        invoice={quickInvoice}
        isOpen={!!quickInvoice}
        onClose={() => setQuickInvoice(null)}
      />
    </DashboardLayout>
  );
}
