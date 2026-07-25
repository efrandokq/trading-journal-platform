import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CartaTrade from '../components/CartaTrade';
import { Plus, Filter } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  volume: number;
  pnl: number;
  status: 'open' | 'closed';
  entryTime: Date;
  strategyTag?: string;
}

const PageTrades: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'BUY',
    entryPrice: '',
    volume: '',
    strategyTag: '',
    notes: '',
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, statusFilter]);

  const fetchTrades = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;

      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/trades/${accountId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrades(response.data);
    } catch (error) {
      console.error('Impossible de récupérer les trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTrades = () => {
    if (statusFilter === 'all') {
      setFilteredTrades(trades);
    } else {
      setFilteredTrades(trades.filter((t) => t.status === statusFilter));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const accountId = localStorage.getItem('accountId');
      const token = localStorage.getItem('token');

      await axios.post(
        `${process.env.REACT_APP_API_URL}/trades`,
        {
          accountId,
          ...formData,
          entryPrice: parseFloat(formData.entryPrice),
          volume: parseFloat(formData.volume),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormData({
        symbol: '',
        type: 'BUY',
        entryPrice: '',
        volume: '',
        strategyTag: '',
        notes: '',
      });
      setShowForm(false);
      fetchTrades();
    } catch (error) {
      console.error('Impossible de créer le trade:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Trades</h1>
          <p className="text-slate-600">Gérez et analysez votre activité de trading</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Nouveau Trade
        </button>
      </div>

      {/* Formulaire de nouveau trade */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Ajouter un nouveau trade</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Symbole (EURUSD)"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BUY">ACHAT</option>
              <option value="SELL">VENTE</option>
            </select>
            <input
              type="number"
              step="0.00001"
              placeholder="Prix d'entrée"
              value={formData.entryPrice}
              onChange={(e) => setFormData({ ...formData, entryPrice: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="number"
              placeholder="Volume"
              value={formData.volume}
              onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Étiquette stratégie (optionnel)"
              value={formData.strategyTag}
              onChange={(e) => setFormData({ ...formData, strategyTag: e.target.value })}
              className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Notes (optionnel)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <div className="col-span-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
              >
                Créer le trade
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 py-2 rounded-lg transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-slate-600" />
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setStatusFilter('open')}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === 'open'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Ouverts
        </button>
        <button
          onClick={() => setStatusFilter('closed')}
          className={`px-4 py-2 rounded-lg transition ${
            statusFilter === 'closed'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Fermés
        </button>
      </div>

      {/* Grille de trades */}
      {filteredTrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrades.map((trade) => (
            <CartaTrade key={trade.id} trade={trade} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">Aucun trade trouvé</p>
        </div>
      )}
    </div>
  );
};

export default PageTrades;