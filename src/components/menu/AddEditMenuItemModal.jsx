import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useCreateMenuItem, useUpdateMenuItem } from "../../hooks/useMenu";

export default function AddEditMenuItemModal({ isOpen, onClose, item = null }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    isAvailable: true,
  });
  const [error, setError] = useState("");

  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();

  const isEditing = !!item;
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        costPrice: item.costPrice || "",
        isAvailable: item.isAvailable !== false,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        costPrice: "",
        isAvailable: true,
      });
    }
    setError("");
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Item name is required");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      setError("Valid price is required");
      return;
    }

    if (formData.costPrice && Number(formData.costPrice) < 0) {
      setError("Cost price cannot be negative");
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
      isAvailable: formData.isAvailable,
    };

    if (isEditing) {
      mutation.mutate(
        { id: item.id, data: submitData },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err) => {
            setError(err.response?.data?.message || "Failed to update item");
          },
        }
      );
    } else {
      mutation.mutate(submitData, {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Failed to create item");
        },
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Item Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Margherita Pizza"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-700 font-medium">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={mutation.isPending}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-slate-700 font-medium">
                Cost Price ($)
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={handleChange}
                disabled={mutation.isPending}
                className="h-11"
              />
              <p className="text-xs text-slate-500">Optional: Your cost for this item</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={handleChange}
                disabled={mutation.isPending}
                className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <Label htmlFor="isAvailable" className="text-slate-700 font-medium cursor-pointer">
                Available for sale
              </Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={mutation.isPending}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Item" : "Add Item"}</>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
