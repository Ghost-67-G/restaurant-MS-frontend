import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import AddEditMenuItemModal from "../components/menu/AddEditMenuItemModal";
import MenuItemRow from "../components/menu/MenuItemRow";
import Pagination from "../components/ui/pagination";
import { Button } from "../components/ui/button";
import { useMenuItems, useDeleteMenuItem } from "../hooks/useMenu";
import { Plus, Loader2, Search } from "lucide-react";

export default function Menu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: menuItems = { results: [], page: 1, limit: 10, totalPages: 1, totalResults: 0}, isLoading, isError } = useMenuItems({
    page: currentPage,
    limit: itemsPerPage,
  });

  const deleteMutation = useDeleteMenuItem();

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Menu Items</h2>
            <p className="text-slate-600 mt-1">Manage your restaurant menu</p>
          </div>
          <Button
            onClick={handleAddItem}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow border border-slate-200">
          <div className="p-4 border-b border-slate-200">
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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">Failed to load menu items</p>
            </div>
          ) : menuItems.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery ? "No items found" : "No menu items yet"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddItem}
                  variant="outline"
                  className="text-orange-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Item
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Cost
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
                    {menuItems.results.map((item) => (
                      <MenuItemRow
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={menuItems.page}
                totalPages={menuItems.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={menuItems.limit}
                totalItems={menuItems.totalResults}
              />
            </>
          )}
        </div>
      </div>

      <AddEditMenuItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
      />
    </DashboardLayout>
  );
}
