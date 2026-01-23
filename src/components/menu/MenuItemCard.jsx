import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function MenuItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 truncate">
            {item.name}
          </h3>
          <p className="text-2xl font-bold text-orange-500 mt-2">
            ${Number(item.price).toFixed(2)}
          </p>
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                item.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {item.isAvailable ? "Available" : "Disabled"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(item)}
            className="h-9 w-9"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(item)}
            className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
