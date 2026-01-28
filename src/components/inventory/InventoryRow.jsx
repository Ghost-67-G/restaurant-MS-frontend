import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function InventoryRow({ item, onEdit, onDelete }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900">{item.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900">{item.quantity}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="text-slate-600 hover:text-orange-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            className="text-slate-600 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
