import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export default function InventoryRow({ item, onEdit, onDelete, onRecordWaste }) {
  const isLowStock = item.quantity <= (item.lowStockThreshold || 10);

  return (
    <tr className={`border-b border-slate-200 hover:bg-slate-50 ${isLowStock ? 'bg-orange-50' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-slate-900">{item.name}</div>
          {isLowStock && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-orange-600 text-white rounded-full">
              <AlertTriangle className="h-3 w-3" />
              Low Stock
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900">
          {item.quantity}
          <span className="text-xs text-slate-500 ml-2">
            (threshold: {item.lowStockThreshold || 10})
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRecordWaste(item)}
            className="text-slate-600 hover:text-red-600"
            title="Record Waste"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="text-slate-600 hover:text-orange-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
