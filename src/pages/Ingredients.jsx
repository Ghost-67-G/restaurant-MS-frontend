import { useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import AddEditIngredientModal from '../components/ingredients/AddEditIngredientModal';
import UpdateStockModal from '../components/ingredients/UpdateStockModal';
import LedgerHistoryModal from '../components/ingredients/LedgerHistoryModal';
import IngredientRow from '../components/ingredients/IngredientRow';
import {
  useIngredients,
  useLowStockIngredients,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
  useUpdateStock,
} from '../hooks/useIngredients';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Ingredients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showLowStock, setShowLowStock] = useState(false);

  const { data: ingredientsData, isLoading } = useIngredients({
    page,
    limit: 10,
    name: searchQuery,
  });

  const { data: lowStockData } = useLowStockIngredients();

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();
  const updateStock = useUpdateStock();

  const ingredients = ingredientsData?.results || [];
  const lowStockIngredients = lowStockData || [];
  const displayIngredients = showLowStock ? lowStockIngredients : ingredients;

  const handleAddEdit = (formData) => {
    if (selectedIngredient) {
      updateIngredient.mutate(
        { id: selectedIngredient.id, data: formData },
        {
          onSuccess: () => {
            setIsAddEditModalOpen(false);
            setSelectedIngredient(null);
          },
        }
      );
    } else {
      createIngredient.mutate(formData, {
        onSuccess: () => {
          setIsAddEditModalOpen(false);
        },
      });
    }
  };

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsAddEditModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      deleteIngredient.mutate(id);
    }
  };

  const handleUpdateStock = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsStockModalOpen(true);
  };

  const handleStockUpdate = (quantity, reason) => {
    updateStock.mutate(
      { 
        id: selectedIngredient.id, 
        quantity, 
        reason,
        referenceType: 'MANUAL' 
      },
      {
        onSuccess: () => {
          setIsStockModalOpen(false);
          setSelectedIngredient(null);
        },
      }
    );
  };

  const handleViewHistory = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsHistoryModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedIngredient(null);
    setIsAddEditModalOpen(true);
  };

  return (
    <DashboardLayout>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ingredients</h1>
          <p className="text-slate-600 mt-1">Manage your kitchen ingredients and stock levels</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {lowStockIngredients.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-amber-900">Low Stock Alert</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {lowStockIngredients.length} ingredient(s) are running low on stock
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLowStock(!showLowStock)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              {showLowStock ? 'Show All' : 'View Low Stock'}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-600">Loading...</div>
        ) : displayIngredients.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            {searchQuery
              ? 'No ingredients found matching your search'
              : showLowStock
              ? 'No low stock ingredients'
              : 'No ingredients yet. Add your first ingredient to get started.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Low Stock Threshold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {displayIngredients.map((ingredient) => (
                  <IngredientRow
                    key={ingredient.id}
                    ingredient={ingredient}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUpdateStock={handleUpdateStock}
                    onViewHistory={handleViewHistory}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!showLowStock && ingredientsData && ingredientsData.totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Page {page} of {ingredientsData.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= ingredientsData.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <AddEditIngredientModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedIngredient(null);
        }}
        onSubmit={handleAddEdit}
        item={selectedIngredient}
        isLoading={createIngredient.isPending || updateIngredient.isPending}
      />

      <UpdateStockModal
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false);
          setSelectedIngredient(null);
        }}
        onSubmit={handleStockUpdate}
        ingredient={selectedIngredient}
        isLoading={updateStock.isPending}
      />

      <LedgerHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedIngredient(null);
        }}
        ingredient={selectedIngredient}
      />
    </div>
    </DashboardLayout>
  );
}
