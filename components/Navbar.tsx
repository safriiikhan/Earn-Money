
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, PackageType } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: 'fa-house', path: '/' },
    { label: 'Packages', icon: 'fa-box', path: '/packages' },
    { label: 'Watch & Earn', icon: 'fa-play', path: '/watch', restricted: true },
    { label: 'Withdraw', icon: 'fa-wallet', path: '/withdraw', restricted: true },
    { label: 'Refer & Earn', icon: 'fa-users', path: '/referral' },
    { label: 'My Profile', icon: 'fa-user', path: '/profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', icon: 'fa-shield-halved', path: '/admin' });
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 z-[70] flex h-16 w-full items-center justify-between border-b border-white/5 bg-black/80 px-4 backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-bolt text-white"></i>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">AdVault</span>
        </div>
        <button onClick={onLogout} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 active:bg-red-500/20 active:text-red-500">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-full w-64 flex-col border-r border-white/5 bg-[#0d0d0d] md:flex">
        <div className="flex h-24 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl shadow-blue-500/30">
              <i className="fa-solid fa-bolt text-xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">AdVault</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-500">Premium Earn</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const isLocked = item.restricted && (!user || user.package === PackageType.NONE);
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={isLocked ? '/packages' : item.path}
                className={`group relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-500 group-hover:text-white'}`}>
                  <i className={`fa-solid ${item.icon} text-sm`}></i>
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
                {isLocked && (
                  <i className="fa-solid fa-lock ml-auto text-xs text-gray-600"></i>
                )}
                {isActive && (
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-blue-500"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-4 ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-800">
                <img src={`https://picsum.photos/seed/${user?.userId}/40`} className="h-full w-full rounded-full" alt="User" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-bold text-white">{user?.email}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.package || 'Free User'}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
