import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PositionActions from '@/components/PositionActions';

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

export default function PositionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

    // Fetch positions
    fetchPositions();

    // Refresh every 5 seconds
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions');
      const data = await response.json();
      setPositions(data.positions || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setLoading(false);
    }
  };

  const handleModifyPosition = async (
    positionId: number,
    stopLoss?: number,
    takeProfit?: number
  ) => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/positions/${positionId}/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stopLoss, takeProfit }),
      });

      if (response.ok) {
        await fetchPositions();
      } else {
        alert('Erreur lors de la modification');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleClosePosition = async (positionId: number) => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/positions/${positionId}/close`, {
        method: 'POST',
      });

      if (response.ok) {
        setPositions(positions.filter(p => p.id !== positionId));
      } else {
        alert('Erreur lors de la fermeture');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleBreakEven = async (positionId: number) => {
    const position = positions.find(p => p.id === positionId);
    if (position) {
      await handleModifyPosition(positionId, position.entryPrice);
    }
  };

  if (!user) return null;

  const totalPnL = positions.reduce((sum, p) => sum + p.profitLoss, 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.volume * p.entryPrice * 0.01, 0); // 1% margin assumption

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
              <Link href="/positions" className="text-blue-400 hover:text-blue-300 font-semibold">
                Positions
              </Link>
              <Link href="/history" className="text-gray-300 hover:text-white transition">
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
            <button
              onClick={fetchPositions}
              disabled={refreshing}
              className="text-xs text-blue-400 hover:text-blue-300 transition disabled:opacity-50"
            >
              🔄 {refreshing ? 'Actualisation...' : 'Actualiser'}
            </button>
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
          <h1 className="text-3xl font-bold text-white mb-2">Positions Ouvertes</h1>
          <p className="text-gray-400">Gestion en temps réel de vos positions actives</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Positions Ouvertes</div>
            <div className="text-3xl font-bold text-blue-500">{positions.length}</div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Total P/L</div>
            <div className={`text-3xl font-bold ${
              totalPnL >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Buys</div>
            <div className="text-3xl font-bold text-green-500">
              {positions.filter(p => p.type === 'BUY').length}
            </div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">Sells</div>
            <div className="text-3xl font-bold text-red-500">
              {positions.filter(p => p.type === 'SELL').length}
            </div>
          </div>
        </div>

        {/* Positions Table */}
        {loading ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">Chargement des positions...</p>
          </div>
        ) : positions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">✅ Aucune position ouverte</p>
            <p className="text-gray-500 text-sm mt-2">Lancez votre prochain trade dès que vous êtes prêt!</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-tertiary border-b border-dark-tertiary">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Symbole</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Volume</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Entrée</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Actuel</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">SL</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">TP</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">P/L</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">P/L %</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, idx) => (
                  <tr
                    key={position.id}
                    className={`border-b border-dark-tertiary hover:bg-dark-secondary transition ${
                      idx % 2 === 0 ? '' : 'bg-dark-secondary/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-white">{position.symbol}</td>
                    <td className={`px-4 py-3 font-bold ${
                      position.type === 'BUY' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.type}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300">{position.volume.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{position.entryPrice.toFixed(5)}</td>
                    <td className="px-4 py-3 text-right text-gray-300">{position.currentPrice.toFixed(5)}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {position.stopLoss ? position.stopLoss.toFixed(5) : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-400 text-xs">
                      {position.takeProfit ? position.takeProfit.toFixed(5) : '-'}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      position.profitLoss > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${position.profitLoss.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      position.profitLossPercent > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {position.profitLossPercent > 0 ? '+' : ''}{position.profitLossPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PositionActions
                        position={position}
                        onModify={handleModifyPosition}
                        onClose={handleClosePosition}
                        onBreakEven={handleBreakEven}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
