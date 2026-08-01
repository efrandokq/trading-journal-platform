import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Goal {
  id: number;
  goal_name: string;
  target_value: number;
  current_value: number;
  metric: string;
}

export default function GoalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    metric: 'win_rate',
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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

    // Fetch goals
    fetch('/api/goals')
      .then(r => r.json())
      .then(data => {
        setGoals(data.goals || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching goals:', err);
        setLoading(false);
      });
  }, [router]);

  const handleAddGoal = async () => {
    if (!newGoal.name.trim() || newGoal.target <= 0) {
      alert('Veuillez remplir tous les champs correctement');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal),
      });

      if (response.ok) {
        const data = await response.json();
        setGoals([...goals, data.goal]);
        setNewGoal({ name: '', target: 0, metric: 'win_rate' });
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  const metricLabels: Record<string, string> = {
    win_rate: 'Win Rate (%)',
    max_drawdown: 'Max Drawdown (%)',
    profit_factor: 'Profit Factor',
    sharpe_ratio: 'Sharpe Ratio',
    daily_profit: 'Profit Quotidien ($)',
  };

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
              <Link href="/history" className="text-gray-300 hover:text-white transition">
                Historique
              </Link>
              <Link href="/goals" className="text-blue-400 hover:text-blue-300 font-semibold">
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎯 Objectifs & Discipline</h1>
          <p className="text-gray-400">Définissez vos cibles et suivez votre progression</p>
        </div>

        {/* Add Goal Form */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Créer un Nouvel Objectif</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              type="text"
              placeholder="Nom de l'objectif"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white placeholder-gray-500"
            />
            <select
              value={newGoal.metric}
              onChange={(e) => setNewGoal({ ...newGoal, metric: e.target.value })}
              className="bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white"
            >
              <option value="win_rate">Win Rate (%)</option>
              <option value="max_drawdown">Max Drawdown (%)</option>
              <option value="profit_factor">Profit Factor</option>
              <option value="sharpe_ratio">Sharpe Ratio</option>
              <option value="daily_profit">Profit Quotidien ($)</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Valeur cible"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) })}
              className="bg-dark-tertiary px-3 py-2 rounded border border-dark-tertiary text-white placeholder-gray-500"
            />
            <button
              onClick={handleAddGoal}
              disabled={creating}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Création...' : '✨ Créer'}
            </button>
          </div>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="card text-center py-8">
            <p className="text-gray-400">Chargement des objectifs...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">Aucun objectif pour le moment</p>
            <p className="text-gray-500 text-sm mt-2">Créez votre premier objectif pour commencer à suivre votre progression! 🎯</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(goal => {
              const percentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
              const isCompleted = goal.current_value >= goal.target_value;

              return (
                <div key={goal.id} className={`card border-2 ${
                  isCompleted ? 'border-green-500 bg-green-500/5' : 'border-dark-tertiary'
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{goal.goal_name}</h3>
                      <p className="text-xs text-gray-400">{metricLabels[goal.metric]}</p>
                    </div>
                    {isCompleted && (
                      <span className="text-2xl">✅</span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="bg-dark-tertiary rounded-full h-3 overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-400">Actuel: </span>
                      <span className="font-semibold text-white">{goal.current_value.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Cible: </span>
                      <span className="font-semibold text-white">{goal.target_value.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${
                        isCompleted ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
