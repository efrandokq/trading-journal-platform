import { useState } from 'react';
import Modal from './Modal';

interface Position {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  profitLoss: number;
  profitLossPercent: number;
}

interface PositionActionsProps {
  position: Position;
  onModify: (positionId: number, stopLoss?: number, takeProfit?: number) => Promise<void>;
  onClose: (positionId: number) => Promise<void>;
  onBreakEven: (positionId: number) => Promise<void>;
}

export default function PositionActions({
  position,
  onModify,
  onClose,
  onBreakEven,
}: PositionActionsProps) {
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [sl, setSL] = useState(position.stopLoss?.toString() || '');
  const [tp, setTP] = useState(position.takeProfit?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [closingPosition, setClosingPosition] = useState(false);

  const handleModify = async () => {
    setLoading(true);
    try {
      await onModify(
        position.id,
        sl ? parseFloat(sl) : undefined,
        tp ? parseFloat(tp) : undefined
      );
      setShowModifyModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (confirm('Êtes-vous sûr de vouloir fermer cette position ?')) {
      setClosingPosition(true);
      try {
        await onClose(position.id);
      } finally {
        setClosingPosition(false);
      }
    }
  };

  const handleBreakEven = async () => {
    setLoading(true);
    try {
      await onBreakEven(position.id);
      setShowModifyModal(false);
    } finally {
      setLoading(false);
    }
  };

  const pipsDistance = Math.abs((position.currentPrice - position.entryPrice) * 10000);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowModifyModal(true)}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition"
          title="Modifier SL/TP"
        >
          ⚙️ SL/TP
        </button>
        <button
          onClick={handleBreakEven}
          disabled={loading}
          className="text-xs bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-2 py-1 rounded transition"
          title="Définir stop loss au prix d'entrée"
        >
          📍 BE
        </button>
        <button
          onClick={handleClose}
          disabled={closingPosition}
          className="text-xs bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-2 py-1 rounded transition"
          title="Fermer la position"
        >
          {closingPosition ? '...' : '✕ Close'}
        </button>
      </div>

      {/* Modify Modal */}
      <Modal
        isOpen={showModifyModal}
        title={`Modifier ${position.symbol}`}
        onClose={() => setShowModifyModal(false)}
        onSubmit={handleModify}
        submitLabel="Appliquer"
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold">Stop Loss (Pips: {pipsDistance.toFixed(0)})</label>
            <input
              type="number"
              step="0.00001"
              value={sl}
              onChange={(e) => setSL(e.target.value)}
              placeholder={position.stopLoss?.toFixed(5) || 'Pas de SL'}
              className="w-full bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 font-semibold">Take Profit</label>
            <input
              type="number"
              step="0.00001"
              value={tp}
              onChange={(e) => setTP(e.target.value)}
              placeholder={position.takeProfit?.toFixed(5) || 'Pas de TP'}
              className="w-full bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white mt-1"
            />
          </div>
          <div className="bg-dark-tertiary p-3 rounded text-xs text-gray-400">
            <p><strong>Prix d'entrée:</strong> {position.entryPrice.toFixed(5)}</p>
            <p><strong>Prix actuel:</strong> {position.currentPrice.toFixed(5)}</p>
            <p className={position.profitLoss > 0 ? 'text-green-500' : 'text-red-500'}>
              <strong>P/L Estimé:</strong> ${position.profitLoss.toFixed(2)} ({position.profitLossPercent.toFixed(2)}%)
            </p>
          </div>
          <button
            onClick={handleBreakEven}
            disabled={loading}
            className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-3 py-2 rounded transition text-sm font-semibold"
          >
            📍 Set SL to Break-Even
          </button>
        </div>
      </Modal>
    </>
  );
}
