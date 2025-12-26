
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { User } from '../types';
import Navbar from './Navbar';
import AdBanner from './AdBanner';
import ChatBot from './ChatBot';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] pb-20 md:pb-0 md:pl-64">
      {/* Top Ad */}
      <div className="fixed top-0 z-50 flex w-full justify-center bg-black/80 py-1 md:pl-64">
         <AdBanner position="top" />
      </div>

      {/* Sidebar/Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="mt-16 flex-1 px-4 py-8 md:px-8">
        <Outlet />
      </main>

      {/* AI ChatBot Assistant */}
      <ChatBot user={user} />

      {/* Bottom Ad */}
      <div className="fixed bottom-16 z-50 flex w-full justify-center bg-black/80 py-1 md:bottom-0 md:pl-64">
        <AdBanner position="bottom" />
      </div>

      {/* Mobile Footer Menu (Sticky Mobile Navigation) */}
      <div className="fixed bottom-0 left-0 z-[60] flex h-16 w-full items-center justify-around border-t border-white/10 bg-black/95 px-4 backdrop-blur-lg md:hidden">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-blue-500' : 'text-gray-400'}`}>
          <i className="fa-solid fa-house text-lg"></i>
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/watch" className={`flex flex-col items-center gap-1 ${location.pathname === '/watch' ? 'text-blue-500' : 'text-gray-400'}`}>
          <i className="fa-solid fa-play text-lg"></i>
          <span className="text-[10px]">Earn</span>
        </Link>
        <Link to="/withdraw" className={`flex flex-col items-center gap-1 ${location.pathname === '/withdraw' ? 'text-blue-500' : 'text-gray-400'}`}>
          <i className="fa-solid fa-wallet text-lg"></i>
          <span className="text-[10px]">Withdraw</span>
        </Link>
        <Link to="/referral" className={`flex flex-col items-center gap-1 ${location.pathname === '/referral' ? 'text-blue-500' : 'text-gray-400'}`}>
          <i className="fa-solid fa-users text-lg"></i>
          <span className="text-[10px]">Refer</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 ${location.pathname === '/profile' ? 'text-blue-500' : 'text-gray-400'}`}>
          <i className="fa-solid fa-user text-lg"></i>
          <span className="text-[10px]">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
