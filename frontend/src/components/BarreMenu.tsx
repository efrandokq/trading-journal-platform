import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Settings,
  Zap,
  ChevronRight,
  Book,
} from 'lucide-react';

interface BarreMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BarreMenu: React.FC<BarreMenuProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems = [
    { label: 'Tableau de bord', path: '/', icon: BarChart3 },
    { label: 'Trades', path: '/trades', icon: Book },
    { label: 'Analytiques', path: '/analytiques', icon: TrendingUp },
    { label: 'cTrader', path: '/ctrader', icon: Zap },
    { label: 'Paramètres', path: '/parametres', icon: Settings },
  ];

  return (
    <>
      {/* Superposition pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Barre de menu */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <h2 className="text-xl font-bold">TradeJournal</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                } w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={18} />}
              </button>
            );
          })}
        </nav>

        {/* Pied de page */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-700 bg-opacity-50 rounded-lg p-3">
            <p className="text-sm font-medium mb-1">Mise à niveau Pro</p>
            <p className="text-xs text-slate-400 mb-3">
              Obtenez des analytiques avancées et bien plus
            </p>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 rounded transition">
              Passer à Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BarreMenu;