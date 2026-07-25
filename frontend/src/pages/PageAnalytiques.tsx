import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StrategyData {
  [key: string]: {
    trades: number;
    pnl: number;
    winRate: number;
  };
}

const PageAnalytiques: React.FC = () => {
  const [strategyData, setStrategyData] = useState<StrategyData>({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      const token = localStorage.getItem('token');

      const [strategiesRes, monthlyRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/${accountId}/strategies`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/analytics/${accountId}/monthly`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStrategyData(strategiesRes.data);
      setMonthlyData(
        Object.entries(monthlyRes.data).map(([month, pnl]) => ({
          month,
          pnl,
        }))
      );
    } catch (error) {
      console.error('Impossible de récupérer les analytiques:', error);
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

  const strategiesArray = Object.entries(strategyData).map(([name, data]) => ({
    name,
    ...data,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Analytiques</h1>
        <p className="text-slate-600">Analyse approfondie de vos métriques de performance de trading</p>
      </div>

      {/* Performance des stratégies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tableau des stratégies */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Performance des stratégies</h2>
          {strategiesArray.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 font-semibold text-slate-700">Stratégie</th>
                    <th className="text-center py-2 px-2 font-semibold text-slate-700">Trades</th>
                    <th className="text-right py-2 px-2 font-semibold text-slate-700">P&L</th>
                    <th className="text-right py-2 px-2 font-semibold text-slate-700">% Gain</th>
                  </tr>
                </thead>
                <tbody>
                  {strategiesArray.map((strategy) => (
                    <tr key={strategy.name} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {strategy.name}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2">{strategy.trades}</td>
                      <td
                        className={`text-right py-3 px-2 font-semibold ${
                          strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        ${strategy.pnl.toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-2">{strategy.winRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">Aucune donnée de stratégie disponible</p>
          )}
        </div>

        {/* Graphique de performance mensuelle */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Performance mensuelle</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pnl" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-slate-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageAnalytiques;