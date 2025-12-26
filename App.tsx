
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './views/Dashboard';
import Auth from './views/Auth';
import Onboarding from './views/Onboarding';
import WatchEarn from './views/WatchEarn';
import Withdraw from './views/Withdraw';
import Referral from './views/Referral';
import Profile from './views/Profile';
import Admin from './views/Admin';
import Packages from './views/Packages';
import Layout from './components/Layout';
import { User, PackageType } from './types';
import { backend } from './services/firebaseService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarded');
  });

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    backend.logout();
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updates };
      
      try {
        // Sync with Backend (Firebase)
        if (updates.balance !== undefined || updates.todayAds !== undefined) {
          await backend.updateUserBalance(user.userId, newUser.balance, newUser.todayAds);
        }
        if (updates.package !== undefined) {
          await backend.purchasePackage(user.userId, updates.package as PackageType);
        }

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch (e) {
        console.error("Update failed:", e);
        alert("Failed to sync changes with server. Please check connection.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black">
        <div className="relative h-16 w-16">
          <div className="absolute top-0 h-full w-full rounded-full border-4 border-blue-500/20"></div>
          <div className="absolute top-0 h-full w-full animate-spin rounded-full border-4 border-t-blue-600"></div>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-500">Initializing AdVault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black p-6 text-center">
        <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 mb-4"></i>
        <h1 className="text-xl font-bold text-white">Initialization Error</h1>
        <p className="mt-2 text-sm text-gray-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 rounded-xl bg-white px-6 py-2 text-sm font-bold text-black"
        >
          Retry
        </button>
      </div>
    );
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => {
      setShowOnboarding(false);
      localStorage.setItem('onboarded', 'true');
    }} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={!user ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} />
        
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/auth" />} />
          <Route path="/packages" element={user ? <Packages user={user} onUpdateUser={updateUser} /> : <Navigate to="/auth" />} />
          <Route path="/watch" element={user?.package !== PackageType.NONE ? <WatchEarn user={user} onUpdateUser={updateUser} /> : <Navigate to="/packages" />} />
          <Route path="/withdraw" element={user?.package !== PackageType.NONE ? <Withdraw user={user} onUpdateUser={updateUser} /> : <Navigate to="/packages" />} />
          <Route path="/referral" element={user ? <Referral user={user} /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
