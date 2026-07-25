import React from 'react';
import { ArrowUpRight, ArrowDownLeft, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  volume: number;
  pnl: number;
  status: 'open' | 'closed' | 'cancelled';
  entryTime: Date;
  strategyTag?: string;
  sentiment?: string;
}

interface CartaTradeProps {
  trade: Trade;
  onEdit?: (trade: Trade) => void;
  onDelete?: (tradeId: string) => void;
}

const CartaTrade: React.FC<CartaTradeProps> = ({ trade, onEdit, onDelete }) => {
  const isProfit = trade.pnl >= 0;
  const isOpen = trade.status === 'open';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-lg transition">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`${
              trade.type === 'BUY'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            } w-10 h-10 rounded-full flex items-center justify-center`}
          >
            {trade.type === 'BUY' ? (
              <ArrowUpRight size={20} />
            ) : (
              <ArrowDownLeft size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900">{trade.symbol}</p>
            <p className="text-xs text-slate-500">
              {format(new Date(trade.entryTime), 'dd MMM yyyy HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
        <div className="relative group">
          <button className="p-2 hover:bg-slate-100 rounded transition">
            <MoreVertical size={16} className="text-slate-400" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-10">
            {onEdit && (
              <button
                onClick={() => onEdit(trade)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm"
              >
                Modifier
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(trade.id)}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Prix d'entrée</p>
          <p className="font-mono font-semibold text-slate-900">
            ${trade.entryPrice.toFixed(5)}
          </p>
        </div>
        {!isOpen && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Prix de sortie</p>
            <p className="font-mono font-semibold text-slate-900">
              ${trade.exitPrice?.toFixed(5) || 'N/A'}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-500 mb-1">Volume</p>
          <p className="font-mono font-semibold text-slate-900">{trade.volume}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">P&L</p>
          <p
            className={`font-mono font-semibold ${
              isProfit ? 'text-green-600' : 'text-red-600'
            }`}
          >
            ${trade.pnl.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Étiquettes */}
      <div className="flex flex-wrap gap-2">
        {trade.strategyTag && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            {trade.strategyTag}
          </span>
        )}
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isOpen
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {isOpen ? 'Ouvert' : 'Fermé'}
        </span>
      </div>
    </div>
  );
};

export default CartaTrade;