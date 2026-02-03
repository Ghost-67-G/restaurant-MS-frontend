import { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useIngredients } from '../../hooks/useIngredients';

export default function RecipeSelector({ recipes, onChange }) {
  const [recipeList, setRecipeList] = useState(recipes || []);
  const { data: ingredientsData } = useIngredients({ limit: 1000 });
  
  const ingredients = ingredientsData?.results || [];

  // Update local state when recipes prop changes
  useEffect(() => {
    if (JSON.stringify(recipes) !== JSON.stringify(recipeList)) {
      setRecipeList(recipes || []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes]); // recipeList intentionally omitted to avoid loop

  // Notify parent of changes
  useEffect(() => {
    onChange(recipeList);
  }, [recipeList, onChange]);

  const addRecipe = () => {
    setRecipeList([
      ...recipeList,
      { ingredientId: '', quantityUsed: 0 },
    ]);
  };

  const removeRecipe = (index) => {
    setRecipeList(recipeList.filter((_, i) => i !== index));
  };

  const updateRecipe = (index, field, value) => {
    const updated = [...recipeList];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantityUsed' ? Number(value) : value,
    };
    setRecipeList(updated);
  };

  const getIngredientById = (id) => {
    return ingredients.find((ing) => ing.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Recipe (Ingredients)</Label>
        <Button type="button" size="sm" variant="outline" onClick={addRecipe}>
          <Plus className="h-4 w-4 mr-1" />
          Add Ingredient
        </Button>
      </div>

      {recipeList.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-500 text-sm">
            No ingredients added yet. Click "Add Ingredient" to start building your recipe.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recipeList.map((recipe, index) => {
            const ingredient = getIngredientById(recipe.ingredientId);
            return (
              <div
                key={index}
                className="flex items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex-1">
                  <Label className="text-xs">Ingredient</Label>
                  <Select
                    value={recipe.ingredientId}
                    onValueChange={(value) => updateRecipe(index, 'ingredientId', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id}>
                          {ing.name} ({ing.currentStock} {ing.unit} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <Label className="text-xs">
                    Quantity {ingredient ? `(${ingredient.unit})` : ''}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={recipe.quantityUsed}
                    onChange={(e) => updateRecipe(index, 'quantityUsed', e.target.value)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeRecipe(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {recipeList.length > 0 && (
        <div className="text-xs text-slate-500 bg-blue-50 p-3 rounded">
          <strong>Note:</strong> When an order containing this menu item is completed, the specified
          quantities will be automatically deducted from ingredient stock.
        </div>
      )}
    </div>
  );
}
