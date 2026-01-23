import { useCartStore } from "../../stores/cart.store";

export default function MenuItemButton({ item }) {
  const addItem = useCartStore((state) => state.addItem);

  if (!item.isAvailable) {
    return (
      <button
        disabled
        className="flex flex-col items-start justify-between p-4 bg-slate-100 rounded-lg border-2 border-slate-200 cursor-not-allowed opacity-60 h-28"
      >
        <div className="w-full">
          <h3 className="font-semibold text-slate-900 text-left line-clamp-2 mb-1">
            {item.name}
          </h3>
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-200 text-slate-600 rounded">
            Unavailable
          </span>
        </div>
        <p className="text-lg font-bold text-slate-400">${Number(item.price).toFixed(2)}</p>
      </button>
    );
  }

  return (
    <button
      onClick={() => addItem(item)}
      className="flex flex-col items-start justify-between p-4 bg-white rounded-lg border-2 border-slate-200 hover:border-orange-500 hover:shadow-md transition-all h-28 active:scale-95"
    >
      <div className="w-full">
        <h3 className="font-semibold text-slate-900 text-left line-clamp-2">
          {item.name}
        </h3>
      </div>
      <p className="text-lg font-bold text-orange-500">${Number(item.price).toFixed(2)}</p>
    </button>
  );
}
