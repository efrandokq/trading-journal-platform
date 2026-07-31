import { useState } from 'react';
import Modal from './Modal';

interface Trade {
  id: number;
  symbol: string;
  trade_type: string;
  opened_at: string;
  closed_at: string | null;
  notes: string | null;
}

interface NotesModalProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tradeId: number, notes: string) => Promise<void>;
}

export default function NotesModal({
  trade,
  isOpen,
  onClose,
  onSave,
}: NotesModalProps) {
  const [notes, setNotes] = useState(trade?.notes || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!trade) return;
    setLoading(true);
    try {
      await onSave(trade.id, notes);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return null;

  return (
    <Modal
      isOpen={isOpen}
      title={`Note - ${trade.symbol} (${new Date(trade.closed_at || trade.opened_at).toLocaleString('fr-FR')})`}
      onClose={onClose}
      onSubmit={handleSave}
      submitLabel="Sauvegarder"
      loading={loading}
    >
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Analyse du trade, raison de l'entrée, lesson learned..."
        className="w-full h-40 bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </Modal>
  );
}
