import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function UpdateStockModal({ isOpen, onClose, onSubmit, ingredient, isLoading }) {
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }
    onSubmit(quantity, reason);
    setQuantity(0);
    setReason('');
  };

  if (!isOpen || !ingredient) return null;

  const newStock = ingredient.currentStock + quantity;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Update Stock - {ingredient.name}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600">Current Stock</p>
              <p className="text-2xl font-bold text-slate-900">
                {Number(ingredient.currentStock || 0).toFixed(2)} {ingredient.unit}
              </p>
            </div>

            <div>
              <Label htmlFor="quantity">
                Adjustment (use + to add, - to subtract)
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="e.g., +10 or -5"
                required
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-1">
                Positive values add stock, negative values subtract stock
              </p>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Adjustment *</Label>
              <Input
                id="reason"
                name="reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Received delivery, Damaged goods, etc."
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                This will be recorded in the ledger for audit purposes
              </p>
            </div>

            {quantity !== 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">New Stock After Update</p>
                <p
                  className={`text-2xl font-bold ${
                    newStock < 0
                      ? 'text-red-600'
                      : newStock <= ingredient.lowStockThreshold
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {newStock} {ingredient.unit}
                </p>
                {newStock < 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    ⚠️ Warning: Stock cannot be negative
                  </p>
                )}
                {newStock >= 0 && newStock <= ingredient.lowStockThreshold && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ Warning: Stock will be below threshold
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || quantity === 0 || newStock < 0 || !reason.trim()}>
                {isLoading ? 'Updating...' : 'Update Stock'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
