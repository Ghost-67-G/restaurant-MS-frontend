import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function MenuItemRow({ item, onEdit, onDelete }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{item.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-900 font-semibold">
          ${Number(item.price).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-600">
          ${Number(item.costPrice || 0).toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            item.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {item.isAvailable ? "Available" : "Disabled"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
