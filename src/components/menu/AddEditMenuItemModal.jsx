import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useCreateMenuItem, useUpdateMenuItem } from "../../hooks/useMenu";
import RecipeSelector from "./RecipeSelector";
import { recipeService } from "../../services/ingredient.service";

export default function AddEditMenuItemModal({ isOpen, onClose, item = null }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    costPrice: "",
    isAvailable: true,
    inventoryItemId: "",
  });
  const [recipes, setRecipes] = useState([]);
  const [modifiers, setModifiers] = useState([]);
  const [error, setError] = useState("");

  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();

  const isEditing = !!item;
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (item) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: item.name || "",
        price: item.price || "",
        costPrice: item.costPrice || "",
        isAvailable: item.isAvailable !== false,
        inventoryItemId: item.inventoryItemId || "",
      });
      setModifiers(
        (item.modifiers || []).map((m) => ({
          name: m.name || "",
          price: m.price ?? "",
        }))
      );
      // Load recipes for this menu item
      if (item.id) {
        recipeService.getRecipesByMenuItem(item.id).then((data) => {
          setRecipes(data.map(r => ({
            ingredientId: r.ingredientId.id || r.ingredientId,
            quantityUsed: r.quantityUsed
          })));
        }).catch(() => {
          setRecipes([]);
        });
      } else {
        setRecipes([]);
      }
    } else {
      setFormData({
        name: "",
        price: "",
        costPrice: "",
        isAvailable: true,
        inventoryItemId: "",
      });
      setModifiers([]);
      setRecipes([]);
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

    // Skip completely empty rows
    const filledModifiers = modifiers.filter(
      (m) => m.name.trim() || String(m.price).trim()
    );

    if (filledModifiers.some((m) => !m.name.trim())) {
      setError("Each extra needs a name");
      return;
    }

    if (filledModifiers.some((m) => Number(m.price || 0) < 0)) {
      setError("Extra price cannot be negative");
      return;
    }

    // POS toggles extras by name, so names must be unique
    const modifierNames = filledModifiers.map((m) => m.name.trim().toLowerCase());
    if (new Set(modifierNames).size !== modifierNames.length) {
      setError("Extra names must be unique");
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      costPrice: formData.costPrice ? Number(formData.costPrice) : 0,
      isAvailable: formData.isAvailable,
      modifiers: filledModifiers.map((m) => ({
        name: m.name.trim(),
        price: Number(m.price || 0),
      })),
    };

    // Only include inventoryItemId if one is selected
    if (formData.inventoryItemId) {
      submitData.inventoryItemId = formData.inventoryItemId;
    }

    if (isEditing) {
      mutation.mutate(
        { id: item.id, data: submitData },
        {
          onSuccess: async () => {
            // Update recipes if any
            if (recipes.length > 0) {
              try {
                const validRecipes = recipes.filter(r => r.ingredientId && r.quantityUsed > 0);
                if (validRecipes.length > 0) {
                  await recipeService.updateMenuItemRecipes(item.id, validRecipes);
                }
              } catch (err) {
                console.error('Failed to update recipes:', err);
              }
            }
            onClose();
          },
          onError: (err) => {
            setError(err.response?.data?.message || "Failed to update item");
          },
        }
      );
    } else {
      mutation.mutate(submitData, {
        onSuccess: async (newItem) => {
          // Create recipes if any
          if (recipes.length > 0 && newItem.id) {
            try {
              const validRecipes = recipes.filter(r => r.ingredientId && r.quantityUsed > 0);
              if (validRecipes.length > 0) {
                await recipeService.updateMenuItemRecipes(newItem.id, validRecipes);
              }
            } catch (err) {
              console.error('Failed to create recipes:', err);
            }
          }
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

  const addModifier = () => {
    setModifiers([...modifiers, { name: "", price: "" }]);
  };

  const removeModifier = (index) => {
    setModifiers(modifiers.filter((_, i) => i !== index));
  };

  const updateModifier = (index, field, value) => {
    setModifiers(
      modifiers.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
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
            {/* Inventory linking temporarily disabled - use Recipe section for ingredient tracking */}
            {/* <div className="space-y-2">
              <Label htmlFor="inventoryItemId" className="text-slate-700 font-medium">
                Link to Inventory (Optional - Legacy)
              </Label>
              <select
                id="inventoryItemId"
                name="inventoryItemId"
                value={formData.inventoryItemId}
                onChange={handleChange}
                disabled={mutation.isPending}
                className="w-full h-11 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">None</option>
                {inventoryData?.results?.map((inventoryItem) => (
                  <option key={inventoryItem.id} value={inventoryItem.id}>
                    {inventoryItem.name} (Qty: {inventoryItem.quantity})
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                Legacy inventory linking. Use Recipe section below for ingredient-level tracking.
              </p>
            </div> */}

            <div className="border-t border-slate-200 pt-4">
              <RecipeSelector recipes={recipes} onChange={setRecipes} />
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Extras (Modifiers)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addModifier}
                  disabled={mutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Extra
                </Button>
              </div>

              {modifiers.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <p className="text-slate-500 text-sm">
                    No extras added yet. Click "Add Extra" to offer add-ons like "Extra Cheese".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {modifiers.map((modifier, index) => (
                    <div
                      key={index}
                      className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <Label className="text-xs">Name</Label>
                        <Input
                          type="text"
                          value={modifier.name}
                          onChange={(e) => updateModifier(index, "name", e.target.value)}
                          placeholder="e.g., Extra Cheese"
                          disabled={mutation.isPending}
                          className="mt-1"
                        />
                      </div>

                      <div className="w-28">
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={modifier.price}
                          onChange={(e) => updateModifier(index, "price", e.target.value)}
                          placeholder="0.00"
                          disabled={mutation.isPending}
                          className="mt-1"
                        />
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeModifier(index)}
                        disabled={mutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
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
