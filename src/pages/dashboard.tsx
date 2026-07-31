import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Account {
  id: number;
  accountId: number;
  accountType: 'demo' | 'live';
  balance?: number;
  equity?: number;
  error?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

    // Fetch accounts
    fetch('/api/accounts')
      .then(r => r.json())
      .then(data => {
        setAccounts(data.accounts || []);
        if (data.accounts && data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching accounts:', err);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">Chargement...</div>
          <div className="text-gray-400">Connexion aux comptes cTrader en cours...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Navigation */}
      <nav className="bg-dark-secondary border-b border-dark-tertiary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-500">
              🏰 Empire Noble North
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
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
            <a
              href="/api/auth/logout"
              className="text-red-500 hover:text-red-400 transition"
            >
              Déconnexion
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Account Selector */}
        {accounts.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Comptes cTrader</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account)}
                  className={`card cursor-pointer transition ${
                    selectedAccount?.id === account.id
                      ? 'ring-2 ring-blue-500 bg-blue-500/10'
                      : 'hover:bg-dark-tertiary'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">Compte {account.accountId}</h3>
                      <span className={`text-xs font-bold ${
                        account.accountType === 'live' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {account.accountType === 'live' ? '🔴 LIVE' : '🟢 DEMO'}
                      </span>
                    </div>
                  </div>
                  {account.error ? (
                    <div className="text-xs text-red-400">{account.error}</div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      <div>Balance: ${account.balance?.toFixed(2)}</div>
                      <div>Equity: ${account.equity?.toFixed(2)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card bg-yellow-500/10 border-yellow-500/50 mb-8">
            <p className="text-yellow-400">⚠️ Aucun compte trouvé. Assurez-vous d'avoir des comptes actifs dans cTrader.</p>
          </div>
        )}

        {/* Welcome Section */}
        <div className="card mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Bienvenue au Dashboard</h1>
          <p className="text-gray-400 mb-4">
            Cette page sera prochainement complétée avec:
          </p>
          <ul className="space-y-2 text-gray-400">
            <li>✅ Positions ouvertes en temps réel</li>
            <li>✅ Métriques de performance (Win Rate, Sharpe Ratio, etc.)</li>
            <li>✅ Courbe d'équité</li>
            <li>✅ Calendrier P/L</li>
            <li>✅ Historique des trades</li>
            <li>✅ Gestion des positions (SL/TP)</li>
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-gray-400 text-sm font-semibold mb-1">POSITIONS OUVERTES</div>
            <div className="text-3xl font-bold text-blue-500">0</div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-sm font-semibold mb-1">WIN RATE</div>
            <div className="text-3xl font-bold text-green-500">-</div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-sm font-semibold mb-1">PROFIT FACTOR</div>
            <div className="text-3xl font-bold">-</div>
          </div>
          <div className="card text-center">
            <div className="text-gray-400 text-sm font-semibold mb-1">MAX DRAWDOWN</div>
            <div className="text-3xl font-bold text-red-500">-</div>
          </div>
        </div>
      </div>
    </div>
  );
}
