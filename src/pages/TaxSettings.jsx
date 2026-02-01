import { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useTaxes, useCreateTax, useUpdateTax, useDeleteTax } from "../hooks/useTax";
import { Loader2, Percent, Plus, Pencil, Trash2 } from "lucide-react";

export default function TaxSettings() {
  const { data: taxesData } = useTaxes();
  const createMutation = useCreateTax();
  const updateMutation = useUpdateTax();
  const deleteMutation = useDeleteTax();

  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    percentage: 0,
    isActive: true,
  });

  const handleOpenModal = (tax = null) => {
    if (tax) {
      setEditingTax(tax);
      setFormData({
        name: tax.name,
        percentage: tax.percentage,
        isActive: tax.isActive,
      });
    } else {
      setEditingTax(null);
      setFormData({
        name: "",
        percentage: 0,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTax(null);
    setFormData({
      name: "",
      percentage: 0,
      isActive: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Tax name is required");
      return;
    }

    if (formData.percentage < 0 || formData.percentage > 100) {
      toast.error("Tax percentage must be between 0 and 100");
      return;
    }

    const taxData = {
      name: formData.name.trim(),
      percentage: parseFloat(formData.percentage),
      isActive: formData.isActive,
    };

    if (editingTax) {
      updateMutation.mutate(
        { taxId: editingTax.id, data: taxData },
        {
          onSuccess: () => {
            toast.success("Tax updated successfully!");
            handleCloseModal();
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update tax");
          },
        }
      );
    } else {
      createMutation.mutate(taxData, {
        onSuccess: () => {
          toast.success("Tax created successfully!");
          handleCloseModal();
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create tax");
        },
      });
    }
  };

  const handleDelete = (taxId, taxName) => {
    if (!window.confirm(`Are you sure you want to delete "${taxName}"?`)) {
      return;
    }

    deleteMutation.mutate(taxId, {
      onSuccess: () => {
        toast.success("Tax deleted successfully!");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete tax");
      },
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const taxes = taxesData?.results || [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tax Configuration</h2>
            <p className="text-slate-600 mt-1">Manage tax configurations for orders</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-orange-500 hover:bg-orange-600 text-white h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tax
          </Button>
        </div>

        {/* Tax List */}
        <div className="bg-white rounded-lg shadow border border-slate-200">
          {taxes.length === 0 ? (
            <div className="p-12 text-center">
              <Percent className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No tax configurations found</p>
              <Button
                onClick={() => handleOpenModal()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Tax
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Tax Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {taxes.map((tax) => (
                    <tr key={tax.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{tax.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-600">{tax.percentage}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tax.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {tax.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(tax)}
                          className="text-orange-600 hover:text-orange-900 mr-4"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tax.id, tax.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tax Form Modal */}
        {showModal && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black opacity-50 transition-opacity"
          onClick={handleCloseModal}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  {editingTax ? "Edit Tax" : "Add New Tax"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-slate-700 font-medium">
                      Tax Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g., GST, VAT, Sales Tax"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="h-10 mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="percentage" className="text-slate-700 font-medium">
                      Tax Percentage (%)
                    </Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="percentage"
                        name="percentage"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="0.00"
                        value={formData.percentage}
                        onChange={handleChange}
                        required
                        disabled={createMutation.isPending || updateMutation.isPending}
                        className="h-10 pr-10"
                      />
                      <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    />
                    <Label htmlFor="isActive" className="text-slate-700 font-medium cursor-pointer">
                      Active
                    </Label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Note:</strong> Tax changes only apply to new orders. Existing orders keep their original tax.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-10"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : editingTax ? (
                        "Update Tax"
                      ) : (
                        "Create Tax"
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCloseModal}
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 h-10"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
