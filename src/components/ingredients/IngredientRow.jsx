import { Edit2, Trash2, AlertTriangle, Package, History } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function IngredientRow({ ingredient, onEdit, onDelete, onUpdateStock, onViewHistory }) {
  const isLowStock = ingredient.currentStock <= ingredient.lowStockThreshold;

  const getUnitLabel = (unit) => {
    const units = {
      kg: 'kg',
      g: 'g',
      ltr: 'L',
      ml: 'ml',
      pcs: 'pcs',
    };
    return units[unit] || unit;
  };

  return (
    <tr className="hover:bg-slate-50 border-b border-slate-200">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <Package className="h-5 w-5 text-slate-400 mr-3" />
          <div>
            <p className="font-medium text-slate-900">{ingredient.name}</p>
            {isLowStock && (
              <div className="flex items-center mt-1 text-amber-600 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Low Stock
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isLowStock ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            {ingredient.currentStock} {getUnitLabel(ingredient.unit)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        {ingredient.lowStockThreshold} {getUnitLabel(ingredient.unit)}
      </td>
      <td className="px-6 py-4">
        <Badge variant={ingredient.isActive ? 'success' : 'secondary'}>
          {ingredient.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewHistory(ingredient)}
            title="View History"
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStock(ingredient)}
            title="Adjust Stock"
          >
            <Package className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(ingredient)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(ingredient.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
