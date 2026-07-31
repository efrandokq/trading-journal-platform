import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setIsAuthenticated(true);
          router.push('/dashboard');
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark-secondary to-dark">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-dark-tertiary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-500">🏰 Empire Noble North</div>
          <div className="text-gray-400">Trading Journal</div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Journal de Trading Professionnel
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Synchronisez avec cTrader, analysez vos performances en temps réel,
          et maîtrisez votre discipline de trading.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/api/auth/ctrader/login"
            className="btn-primary px-8 py-3 text-lg"
          >
            Se connecter avec cTrader
          </a>
          <button
            onClick={() => router.push('/about')}
            className="btn-secondary px-8 py-3 text-lg"
          >
            En savoir plus
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-bold mb-2">Positions en Temps Réel</h3>
          <p className="text-gray-400 text-sm">
            Synchronisation live avec cTrader via WebSocket ProtoOA
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-3">📈</div>
          <h3 className="text-lg font-bold mb-2">Métriques Avancées</h3>
          <p className="text-gray-400 text-sm">
            Sharpe Ratio, Profit Factor, Expectancy, Drawdown...
          </p>
        </div>

        <div className="card">
          <div className="text-3xl mb-3">📔</div>
          <h3 className="text-lg font-bold mb-2">Journal Trading</h3>
          <p className="text-gray-400 text-sm">
            Analysez vos trades et progressez en discipline
          </p>
        </div>
      </div>
    </div>
  );
}
