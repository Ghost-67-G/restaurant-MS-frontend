import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import InventoryRow from "../components/inventory/InventoryRow";
import AddEditInventoryModal from "../components/inventory/AddEditInventoryModal";
import Pagination from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import {
  useInventoryItems,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
} from "../hooks/useInventory";
import { Plus, Loader2 } from "lucide-react";

export default function Inventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: inventoryData = { results: [], page: 1, limit: 10, totalPages: 1, totalResults: 0 }, isLoading, isError } = useInventoryItems({
    page: currentPage,
    limit: itemsPerPage,
  });

  const createMutation = useCreateInventoryItem();
  const updateMutation = useUpdateInventoryItem();
  const deleteMutation = useDeleteInventoryItem();

  const handleOpenAddModal = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = (formData) => {
    if (selectedItem) {
      updateMutation.mutate(
        { inventoryId: selectedItem.id, data: formData },
        {
          onSuccess: () => {
            toast.success("Inventory item updated successfully!");
            handleCloseModal();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update item");
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Inventory item created successfully!");
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create item");
        },
      });
    }
  };

  const handleDelete = (itemId) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      deleteMutation.mutate(itemId, {
        onSuccess: () => {
          toast.success("Inventory item deleted successfully!");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete item");
        },
      });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Inventory</h2>
            <p className="text-slate-600 mt-1">Manage your inventory items</p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">Failed to load inventory items</p>
            </div>
          ) : inventoryData.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-600">No inventory items found</p>
              <p className="text-slate-500 text-sm mt-1">
                Click "Add Item" to create your first inventory item
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {inventoryData.results.map((item) => (
                      <InventoryRow
                        key={item.id}
                        item={item}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={inventoryData.page}
                totalPages={inventoryData.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={inventoryData.limit}
                totalItems={inventoryData.totalResults}
              />
            </>
          )}
        </div>
      </div>

      <AddEditInventoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        item={selectedItem}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </DashboardLayout>
  );
}
