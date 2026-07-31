import { useState } from 'react';

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

interface TradeTableProps {
  trades: Trade[];
  loading?: boolean;
  onEditNotes: (trade: Trade) => void;
  onFilterChange: (filters: any) => void;
}

export default function TradeTable({
  trades,
  loading = false,
  onEditNotes,
  onFilterChange,
}: TradeTableProps) {
  const [filters, setFilters] = useState({
    symbol: '',
    result: 'all', // all, win, loss
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const filteredTrades = trades.filter(t => {
    if (filters.symbol && !t.symbol.includes(filters.symbol.toUpperCase())) return false;
    if (filters.result === 'win' && (t.profit_loss === null || t.profit_loss <= 0)) return false;
    if (filters.result === 'loss' && (t.profit_loss === null || t.profit_loss >= 0)) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="card text-center py-8">
        <p className="text-gray-400">Chargement des trades...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Filtrer par symbole (ex: EURUSD)"
          value={filters.symbol}
          onChange={(e) => handleFilterChange({ ...filters, symbol: e.target.value })}
          className="flex-1 min-w-[200px] bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white placeholder-gray-500"
        />
        <select
          value={filters.result}
          onChange={(e) => handleFilterChange({ ...filters, result: e.target.value })}
          className="bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white"
        >
          <option value="all">Tous les trades</option>
          <option value="win">✅ Gagnants</option>
          <option value="loss">❌ Perdants</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto card">
        {filteredTrades.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Aucun trade trouvé
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-dark-tertiary border-b border-dark-tertiary">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date/Heure</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Symbole</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Volume</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Entrée</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Sortie</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Profit Net</th>
                <th className="px-4 py-3 text-center text-gray-300 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade, idx) => (
                <tr key={trade.id} className={`border-b border-dark-tertiary hover:bg-dark-secondary transition ${
                  idx % 2 === 0 ? '' : 'bg-dark-secondary/50'
                }`}>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(trade.closed_at || trade.opened_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{trade.symbol}</td>
                  <td className={`px-4 py-3 font-bold ${
                    trade.trade_type === 'BUY' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.trade_type}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-300">{trade.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-300">{trade.entry_price.toFixed(5)}</td>
                  <td className="px-4 py-3 text-right text-gray-300">
                    {trade.exit_price ? trade.exit_price.toFixed(5) : '-'}
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${
                    trade.profit_loss === null
                      ? 'text-gray-400'
                      : trade.profit_loss > 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {trade.profit_loss !== null ? (
                      <>
                        {trade.profit_loss > 0 ? '+' : ''}{trade.profit_loss.toFixed(2)}
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onEditNotes(trade)}
                      className="text-blue-400 hover:text-blue-300 transition font-semibold"
                      title="Ajouter/Éditer une note"
                    >
                      {trade.notes ? '📑' : '📏'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Affichage de {filteredTrades.length} sur {trades.length} trade(s)
      </div>
    </div>
  );
}
