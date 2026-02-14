import { useState } from 'react';
import { Bell } from 'lucide-react';
import { usePendingAlertsCount } from '../../hooks/useAlerts';
import StockAlertsModal from '../inventory/StockAlertsModal';

export default function AlertBadge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = usePendingAlertsCount();

  const count = data?.count || 0;

  if (count === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative p-2 text-slate-600 hover:text-orange-600 transition-colors"
        title={`${count} low stock alert${count > 1 ? 's' : ''}`}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
          {count > 9 ? '9+' : count}
        </span>
      </button>

      <StockAlertsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
