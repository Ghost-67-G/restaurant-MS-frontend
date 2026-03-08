import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useRecordWaste } from '../../hooks/useWaste';

const WASTE_REASONS = [
  { value: 'EXPIRED', label: 'Expired', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'BURNT', label: 'Burnt', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'SPOILED', label: 'Spoiled', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { value: 'DAMAGED', label: 'Damaged', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { value: 'OTHER', label: 'Other', color: 'bg-slate-100 text-slate-700 border-slate-300' },
];

export default function RecordWasteModal({ isOpen, onClose, ingredient }) {
  const [quantity, setQuantity] = useState('');
  const [wasteReason, setWasteReason] = useState('');
  const [notes, setNotes] = useState('');
  const recordWasteMutation = useRecordWaste();

  if (!isOpen || !ingredient) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quantity || !wasteReason) return;

    try {
      await recordWasteMutation.mutateAsync({
        ingredientId: ingredient.id,
        quantity: parseFloat(quantity),
        wasteReason,
        notes: notes || wasteReason,
      });
      
      // Reset form
      setQuantity('');
      setWasteReason('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Failed to record waste:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-900">Record Waste</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ingredient</label>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-900">{ingredient.name}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Current Stock: <span className="font-semibold text-slate-700">{Number(ingredient.currentStock || 0).toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
                Quantity Wasted <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.01"
                step="0.01"
                max={ingredient.currentStock}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Waste Reason <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WASTE_REASONS.map((reason) => (
                  <button
                    key={reason.value}
                    type="button"
                    onClick={() => setWasteReason(reason.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      wasteReason === reason.value
                        ? reason.color
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            {wasteReason === 'OTHER' && (
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Provide details about the waste..."
                />
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-slate-200">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!quantity || !wasteReason || recordWasteMutation.isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {recordWasteMutation.isPending ? 'Recording...' : 'Record Waste'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
