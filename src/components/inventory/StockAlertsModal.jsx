import { useState } from 'react';
import { X, AlertTriangle, Check, CheckCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useActiveAlerts, useAcknowledgeAlert, useAcknowledgeMultipleAlerts } from '../../hooks/useAlerts';

export default function StockAlertsModal({ isOpen, onClose }) {
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const { data, isLoading, refetch } = useActiveAlerts();
  const acknowledgeMutation = useAcknowledgeAlert();
  const acknowledgeMultipleMutation = useAcknowledgeMultipleAlerts();

  if (!isOpen) return null;

  const alerts = data?.results || [];

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeMutation.mutateAsync(alertId);
      refetch();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const handleAcknowledgeMultiple = async () => {
    if (selectedAlerts.length === 0) return;

    try {
      await acknowledgeMultipleMutation.mutateAsync(selectedAlerts);
      setSelectedAlerts([]);
      refetch();
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error);
    }
  };

  const toggleSelectAlert = (alertId) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  const selectAll = () => {
    if (selectedAlerts.length === alerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(alerts.map((alert) => alert.id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-orange-50">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-slate-900">Low Stock Alerts</h3>
              {alerts.length > 0 && (
                <span className="px-2 py-1 text-xs font-semibold bg-orange-600 text-white rounded-full">
                  {alerts.length}
                </span>
              )}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            {alerts.length > 0 && (
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.length === alerts.length}
                    onChange={selectAll}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
                  />
                  <span className="text-sm text-slate-600">
                    {selectedAlerts.length > 0
                      ? `${selectedAlerts.length} selected`
                      : 'Select all'}
                  </span>
                </div>
                {selectedAlerts.length > 0 && (
                  <Button
                    onClick={handleAcknowledgeMultiple}
                    size="sm"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    disabled={acknowledgeMultipleMutation.isPending}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Acknowledge Selected
                  </Button>
                )}
              </div>
            )}

            <div className="overflow-y-auto max-h-[calc(80vh-200px)]">
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading alerts...</div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No active alerts</p>
                  <p className="text-sm text-slate-400 mt-1">All ingredient stocks are above threshold</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={() => toggleSelectAlert(alert.id)}
                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">
                              {alert.ingredientId?.name || 'Unknown Ingredient'}
                            </h4>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-slate-500">Current Stock:</span>
                                <span className="ml-1 font-semibold text-orange-600">
                                  {Number(alert.currentStock || 0).toFixed(2)} {alert.ingredientId?.unit || ''}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Threshold:</span>
                                <span className="ml-1 font-semibold text-slate-700">
                                  {alert.threshold}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              Triggered: {new Date(alert.triggeredAt).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleAcknowledge(alert.id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 border-green-600 text-green-600 hover:bg-green-50"
                            disabled={acknowledgeMutation.isPending}
                          >
                            <Check className="h-3 w-3" />
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
