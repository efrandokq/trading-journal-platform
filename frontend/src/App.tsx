import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import PageConnexion from './pages/PageConnexion';
import PageInscription from './pages/PageInscription';
import Tableau from './pages/Tableau';
import PageTrades from './pages/PageTrades';
import PageAnalytiques from './pages/PageAnalytiques';
import PageParametres from './pages/PageParametres';
import ConnexionCTrader from './pages/ConnexionCTrader';

// Components
import BarreNav from './components/BarreNav';
import BarreMenu from './components/BarreMenu';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: any, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('accountId');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        {user ? (
          <div className="flex h-screen bg-slate-50">
            <BarreMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <BarreNav onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Tableau />} />
                  <Route path="/trades" element={<PageTrades />} />
                  <Route path="/analytiques" element={<PageAnalytiques />} />
                  <Route path="/ctrader" element={<ConnexionCTrader />} />
                  <Route path="/parametres" element={<PageParametres />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/connexion" element={<PageConnexion />} />
            <Route path="/inscription" element={<PageInscription />} />
            <Route path="*" element={<Navigate to="/connexion" replace />} />
          </Routes>
        )}
      </Router>
    </AuthContext.Provider>
  );
};

export default App;