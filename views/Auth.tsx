
import React, { useState } from 'react';
import { User, PackageType } from '../types';
import { backend } from '../services/firebaseService';
import { mockUser } from '../services/mockDb';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let userData: User;
      if (isLogin) {
        userData = await backend.login(email, password);
      } else {
        userData = await backend.signUp(email, password, referral);
      }
      onLogin(userData);
    } catch (error: any) {
      alert(`Authentication Failed: ${error.message || "Please check your credentials or internet connection."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin(mockUser);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] px-6 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl shadow-blue-500/20">
          <i className="fa-solid fa-bolt text-2xl text-white"></i>
        </div>
        <h1 className="text-3xl font-black text-white">AdVault</h1>
        <p className="text-gray-500 text-sm tracking-wide uppercase">The Premium Earning Ecosystem</p>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full">
        <div className="mb-8 flex rounded-2xl bg-white/5 p-1 border border-white/5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${!isLogin ? 'bg-white text-black shadow-lg' : 'text-gray-400'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email Address</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Referral Code (Optional)</label>
              <div className="relative">
                <i className="fa-solid fa-ticket absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"></i>
                <input
                  type="text"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="ADV-0000"
                  className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button
            disabled={loading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-xl"></i>
            ) : (
              isLogin ? 'Login to Dashboard' : 'Create Premium Account'
            )}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
            <span className="bg-[#0a0a0a] px-4 text-gray-600">Or Experience Faster</span>
          </div>
        </div>

        <button
          onClick={handleDemoMode}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white/5 border border-white/10 py-4 font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
        >
          <i className="fa-solid fa-flask mr-2 text-blue-500"></i>
          Try Demo Mode
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] text-gray-700 uppercase tracking-widest font-bold">
        AdVault v1.0.5 • Secure Earning Node
      </p>
    </div>
  );
};

export default Auth;
