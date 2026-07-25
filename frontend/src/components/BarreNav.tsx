import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, LogOut, Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BarreNavProps {
  onToggleSidebar: () => void;
}

const BarreNav: React.FC<BarreNavProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <Menu size={24} className="text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Journal de Trading</h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition relative">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <img
              src={user?.profilePicture || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.id}
              alt="Profil"
              className="w-10 h-10 rounded-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate('/parametres')}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
              title="Paramètres"
            >
              <Settings size={20} className="text-slate-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition"
              title="Déconnexion"
            >
              <LogOut size={20} className="text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BarreNav;