import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

const roleDisplayNames = {
  waiter: "Waiter",
  kitchen_manager: "Kitchen Manager",
  owner: "Owner",
  cashier: "Cashier",
  kitchen: "Kitchen"
};

const getRoleBadgeColor = (role) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800";
    case "kitchen_manager":
      return "bg-blue-100 text-blue-800";
    case "waiter":
      return "bg-green-100 text-green-800";
    case "cashier":
      return "bg-yellow-100 text-yellow-800";
    case "kitchen":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-slate-900">{user.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-slate-900">{user.email}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
          {roleDisplayNames[user.role] || user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(user)}
            className="text-slate-600 hover:text-orange-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(user.id)}
            className="text-slate-600 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}