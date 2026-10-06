import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Upload, MessageSquare, User, LogOut } from 'lucide-react';
import api from '../api';

function Navbar({ user, setUser }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Feed' },
    { path: '/upload', icon: Upload, label: 'Upload' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-64 md:h-full md:border-r md:border-t-0 md:px-4 md:py-8">
      <div className="hidden md:block mb-8 text-2xl font-bold text-brand-primary">BlueLink</div>

      <div className="flex md:flex-col gap-8 md:gap-4 w-full md:w-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 rounded-lg transition-colors ${
              location.pathname === path ? 'text-brand-primary' : 'text-slate-500 hover:text-brand-primary'
            }`}
          >
            <Icon size={24} />
            <span className="text-xs md:text-base font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto hidden md:flex flex-col gap-4 w-full">
        {user ? (
          <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
              {user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="btn-primary text-center">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
