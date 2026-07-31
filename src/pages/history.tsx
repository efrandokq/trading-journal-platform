import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import TradeTable from '@/components/TradeTable';
import NotesModal from '@/components/NotesModal';

interface Trade {
  id: number;
  symbol: string;
  trade_type: string;
  volume: number;
  entry_price: number;
  exit_price: number | null;
  profit_loss: number | null;
  opened_at: string;
  closed_at: string | null;
  notes: string | null;
}

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (!data.user) {
          router.push('/');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/'));

    // Fetch trades
    fetch('/api/trades')
      .then(r => r.json())
      .then(data => {
        setTrades(data.trades || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trades:', err);
        setLoading(false);
      });
  }, [router]);

  const handleEditNotes = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowNotesModal(true);
  };

  const handleSaveNotes = async (tradeId: number, notes: string) => {
    setSavingNotes(true);
    try {
      const response = await fetch(`/api/trades/${tradeId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        const updatedTrade = await response.json();
        setTrades(trades.map(t => t.id === tradeId ? { ...t, notes } : t));
        setShowNotesModal(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSavingNotes(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-dark-tertiary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-500">
              🏰 Empire Noble North
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/positions" className="text-gray-300 hover:text-white transition">
                Positions
              </Link>
              <Link href="/history" className="text-blue-400 hover:text-blue-300 font-semibold">
                Historique
              </Link>
              <Link href="/goals" className="text-gray-300 hover:text-white transition">
                Objectifs
              </Link>
              <Link href="/journal" className="text-gray-300 hover:text-white transition">
                Journal
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user.email}</span>
            <a href="/api/auth/logout" className="text-red-500 hover:text-red-400 transition text-sm">
              Déconnexion
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Historique des Trades</h1>
          <p className="text-gray-400">Visualisez, filtrez et annotez tous vos trades fermés</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Total Trades</div>
            <div className="text-3xl font-bold text-blue-500">{trades.length}</div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Gagnants</div>
            <div className="text-3xl font-bold text-green-500">
              {trades.filter(t => t.profit_loss && t.profit_loss > 0).length}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Perdants</div>
            <div className="text-3xl font-bold text-red-500">
              {trades.filter(t => t.profit_loss && t.profit_loss < 0).length}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Avec Notes</div>
            <div className="text-3xl font-bold text-purple-500">
              {trades.filter(t => t.notes).length}
            </div>
          </div>
        </div>

        {/* Trade Table */}
        <TradeTable
          trades={trades}
          loading={loading}
          onEditNotes={handleEditNotes}
          onFilterChange={() => {}}
        />
      </div>

      {/* Notes Modal */}
      <NotesModal
        trade={selectedTrade}
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSave={handleSaveNotes}
      />
    </div>
  );
}
