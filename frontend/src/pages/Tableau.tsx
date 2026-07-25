import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CarteMetrique from '../components/CarteMetrique';
import CartaTrade from '../components/CartaTrade';
import { TrendingUp, DollarSign, Target, AlertCircle, Activity } from 'lucide-react';

interface Analytics {
  totalTrades: number;
  closedTrades: number;
  openTrades: number;
  totalPnL: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  drawdown: { current: number; max: number };
}

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

const Tableau: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [equityCurve, setEquityCurve] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        setError('Aucun compte sélectionné. Veuillez créer ou connecter un compte.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [analyticsRes, tradesRes, equityRes, monthlyRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/${accountId}`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/trades/${accountId}`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/${accountId}/equity-curve`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/${accountId}/monthly`, { headers }),
      ]);

      setAnalytics(analyticsRes.data);
      setTrades(tradesRes.data.slice(0, 5));
      setEquityCurve(equityRes.data);
      setMonthlyData(
        Object.entries(monthlyRes.data).map(([month, pnl]) => ({
          month,
          pnl,
        }))
      );
    } catch (err: any) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Tableau de bord</h1>
        <p className="text-slate-600">Bienvenue ! Voici un aperçu de vos performances de trading.</p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-gap-3">
          <AlertCircle className="text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Erreur</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Grille de métriques */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <CarteMetrique
            label="P&L total"
            value={`$${analytics.totalPnL.toFixed(2)}`}
            color={analytics.totalPnL >= 0 ? 'green' : 'red'}
            icon={<DollarSign size={24} />}
          />
          <CarteMetrique
            label="Taux de réussite"
            value={`${analytics.winRate.toFixed(1)}%`}
            color="blue"
            icon={<TrendingUp size={24} />}
          />
          <CarteMetrique
            label="Facteur de profit"
            value={analytics.profitFactor.toFixed(2)}
            color="purple"
            icon={<Target size={24} />}
          />
          <CarteMetrique
            label="Réduction max"
            value={`${analytics.drawdown.max.toFixed(2)}%`}
            color="red"
            icon={<Activity size={24} />}
          />
        </div>
      )}

      {/* Ligne de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courbe d'équité */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Courbe d'équité</h2>
          {equityCurve.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Performance mensuelle */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Performance mensuelle</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pnl" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>

      {/* Trades récents */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Trades récents</h2>
          <a href="/trades" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            Voir tout →
          </a>
        </div>
        {trades.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trades.map((trade) => (
              <CartaTrade key={trade.id} trade={trade} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Aucun trade pour l'instant. Commencez à suivre votre activité de trading !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tableau;