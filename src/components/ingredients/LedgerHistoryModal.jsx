import { useState } from 'react';
import { X, History, TrendingUp, TrendingDown, AlertCircle, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLedgerByIngredient } from '../../hooks/useIngredients';
import { format } from 'date-fns';

const TYPE_CONFIG = {
  IN: { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Stock In' },
  OUT: { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Stock Out' },
  WASTE: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Waste' },
  ADJUSTMENT: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Adjustment' },
};

export default function LedgerHistoryModal({ isOpen, onClose, ingredient }) {
  const [page, setPage] = useState(1);
  
  const { data: ledgerData, isLoading } = useLedgerByIngredient(ingredient?.id, { page, limit: 20 });

  if (!isOpen || !ingredient) return null;

  const ledgerEntries = ledgerData?.results || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <History className="h-6 w-6 text-slate-600" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Stock Ledger History</h3>
                <p className="text-sm text-slate-600">{ingredient.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-center py-8 text-slate-600">Loading...</div>
            ) : ledgerEntries.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                No stock movements recorded yet
              </div>
            ) : (
              <div className="space-y-3">
                {ledgerEntries.map((entry) => {
                  const config = TYPE_CONFIG[entry.type];
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={entry.id}
                      className={`border rounded-lg p-4 ${config.bg} border-slate-200`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded ${config.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {config.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {entry.referenceType}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-slate-900">{entry.reason}</p>
                            <p className="text-xs text-slate-600 mt-1">
                              By: {entry.createdBy?.name || 'System'} •{' '}
                              {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p
                            className={`text-lg font-bold ${
                              entry.quantity > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {entry.quantity > 0 ? '+' : ''}
                            {entry.quantity} {ingredient.unit}
                          </p>
                          <p className="text-xs text-slate-600">
                            Balance: {entry.balanceAfter} {ingredient.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {ledgerData && ledgerData.totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Page {page} of {ledgerData.totalPages}
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
                  disabled={page >= ledgerData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end p-6 border-t border-slate-200">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
