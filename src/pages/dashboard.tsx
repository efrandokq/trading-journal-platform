import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TradeMetrics } from '@/types';

interface EquityData {
  date: string;
  equity: number;
  balance: number;
  trades: number;
}

interface SessionPerformance {
  sessionName: string;
  trades: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<TradeMetrics | null>(null);
  const [equityData, setEquityData] = useState<EquityData[]>([]);
  const [sessionPerformance, setSessionPerformance] = useState<any>(null);
  const [weekdayPerformance, setWeekdayPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

    // Fetch metrics
    Promise.all([
      fetch('/api/metrics').then(r => r.json()),
      fetch('/api/equity-curve').then(r => r.json()),
      fetch('/api/session-performance').then(r => r.json()),
      fetch('/api/weekday-performance').then(r => r.json()),
    ])
      .then(([metricsRes, equityRes, sessionRes, weekdayRes]) => {
        setMetrics(metricsRes.metrics);
        setEquityData(equityRes.equityData || []);
        setSessionPerformance(sessionRes);
        setWeekdayPerformance(weekdayRes);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">Chargement Dashboard...</div>
          <div className="text-gray-400">Calcul des métriques en cours...</div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-dark">
        <nav className="bg-dark-secondary border-b border-dark-tertiary">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-500">
              🏰 Empire Noble North
            </Link>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="card bg-yellow-500/10 border-yellow-500/50">
            <p className="text-yellow-400">⚠️ Aucune données de trades. Commencez à trader pour voir les métriques.</p>
          </div>
        </div>
      </div>
    );
  }

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
              <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-semibold">
                Dashboard
              </Link>
              <Link href="/positions" className="text-gray-300 hover:text-white transition">
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
            <span className="text-gray-400 text-sm">{user.email}</span>
            <a href="/api/auth/logout" className="text-red-500 hover:text-red-400 transition text-sm">
              Déconnexion
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">WIN RATE</div>
            <div className={`text-3xl font-bold ${
              metrics.winRate >= 50 ? 'text-green-500' : 'text-red-500'
            }`}>
              {metrics.winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">{metrics.winningTrades} / {metrics.totalTrades}</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">PROFIT FACTOR</div>
            <div className={`text-3xl font-bold ${
              metrics.profitFactor > 1.5 ? 'text-green-500' : metrics.profitFactor > 1 ? 'text-blue-500' : 'text-red-500'
            }`}>
              {metrics.profitFactor.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Gains / Pertes</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">SHARPE RATIO</div>
            <div className={`text-3xl font-bold ${
              metrics.sharpeRatio > 1 ? 'text-green-500' : 'text-orange-500'
            }`}>
              {metrics.sharpeRatio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Rendement/Risque</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">MAX DRAWDOWN</div>
            <div className="text-3xl font-bold text-red-500">
              {metrics.maxDrawdown.toFixed(2)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">Pire baisse</div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">EXPECTANCY</div>
            <div className={`text-2xl font-bold ${
              metrics.expectancy > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${metrics.expectancy.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Par trade</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">PAYOFF RATIO</div>
            <div className="text-2xl font-bold text-blue-500">
              {metrics.payoffRatio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Gain/Perte moy</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">WIN STREAK</div>
            <div className="text-2xl font-bold text-emerald-500">
              {metrics.currentWinStreak}
            </div>
            <div className="text-xs text-gray-500 mt-1">Série actuelle</div>
          </div>

          <div className="card text-center">
            <div className="text-gray-400 text-xs font-semibold mb-1 uppercase">TOTAL PROFIT</div>
            <div className={`text-2xl font-bold ${
              metrics.totalProfit > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              ${metrics.totalProfit.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total {metrics.totalTrades} trades</div>
          </div>
        </div>

        {/* Equity Curve */}
        {equityData.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">📈 Courbe d'Équité</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="equity"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Session Performance */}
        {sessionPerformance && (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">🌍 Performance par Session</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.values(sessionPerformance)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="sessionName" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="totalPnL" fill="#3b82f6" />
                <Bar dataKey="winRate" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekday Performance */}
        {weekdayPerformance && (
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4">📅 Performance par Jour</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekdayPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="dayName" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                <Legend />
                <Bar dataKey="totalPnL" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {weekdayPerformance.map((day: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={day.totalPnL >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
