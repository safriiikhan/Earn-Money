
import React, { useState, useEffect } from 'react';
import { User, PackageType } from '../types';
import { PACKAGES, DAILY_AD_LIMIT } from '../constants';
import GlassCard from '../components/GlassCard';
import { getEarningTips } from '../services/aiService';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [aiTip, setAiTip] = useState('Generating your personalized earning tip...');
  const hasPackage = user.package !== PackageType.NONE;
  const currentPackage = PACKAGES[user.package];

  useEffect(() => {
    let isMounted = true;

    const fetchTip = async () => {
      try {
        const tip = await getEarningTips(user.balance, user.package);
        if (isMounted) {
          setAiTip(tip || "Keep watching your daily ads to reach your maximum earning potential!");
        }
      } catch (error) {
        if (isMounted) {
          setAiTip("Watch 100 ads daily to maximize your package's earning potential.");
        }
      }
    };

    fetchTip();

    return () => {
      isMounted = false;
    };
  }, [user.balance, user.package]);

  const stats = [
    { label: 'Available Balance', value: `$${user.balance.toFixed(2)}`, icon: 'fa-wallet', color: 'text-blue-500' },
    { label: "Today's Earnings", value: `$${(user.todayAds * 0.01).toFixed(2)}`, icon: 'fa-chart-line', color: 'text-purple-500' },
    { label: 'Ads Watched', value: `${user.todayAds}/${DAILY_AD_LIMIT}`, icon: 'fa-play', color: 'text-cyan-500' },
    { label: 'Total Referrals', value: user.referrals.length, icon: 'fa-users', color: 'text-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Hello, Smart Earner!</h2>
          <p className="text-sm text-gray-500">Welcome back to your dashboard.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-gray-400">
          <i className="fa-solid fa-bell"></i>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 text-white shadow-2xl shadow-blue-500/20">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-[60px]"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between opacity-80">
            <span className="text-sm font-bold uppercase tracking-widest">Net Balance</span>
            <i className="fa-solid fa-shield-check text-xl"></i>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold">$</span>
            <h1 className="text-6xl font-black tracking-tight mono">{user.balance.toFixed(2)}</h1>
          </div>
          <div className="mt-8 flex gap-3">
             <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition-transform active:scale-95">
                <i className="fa-solid fa-plus"></i> Add Funds
             </button>
             <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/20 px-4 py-3 text-sm font-bold text-white backdrop-blur-md transition-transform active:scale-95">
                <i className="fa-solid fa-arrow-up-right-from-square"></i> Withdraw
             </button>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <GlassCard className="border-blue-500/30 bg-blue-500/5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-400">AI Earning Assistant</h4>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{aiTip}</p>
          </div>
        </div>
      </GlassCard>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="p-4">
            <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${stat.color}`}>
              <i className={`fa-solid ${stat.icon} text-sm`}></i>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className="mt-1 text-lg font-black text-white mono">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Daily Progress */}
      {hasPackage ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Daily Ad Progress</h3>
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-500 uppercase">
                {currentPackage.name} Plan
            </span>
          </div>
          <GlassCard className="space-y-4">
            <div className="flex justify-between text-xs font-bold text-gray-400">
              <span>Earnings Progress</span>
              <span className="text-white">{Math.round((user.todayAds / DAILY_AD_LIMIT) * 100)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                style={{ width: `${(user.todayAds / DAILY_AD_LIMIT) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-[10px] font-medium text-gray-500">
              Watch {DAILY_AD_LIMIT - user.todayAds} more ads to hit your $1.00 daily bonus!
            </p>
          </GlassCard>
        </div>
      ) : (
        <GlassCard className="border-dashed border-gray-700 bg-transparent py-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900/50">
                <i className="fa-solid fa-lock text-2xl text-gray-700"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-400">Subscription Locked</h3>
            <p className="mx-auto mt-2 max-w-[240px] text-xs text-gray-600">
                You must purchase a package to unlock the Watch & Earn system and start making money.
            </p>
            <button className="mt-6 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95">
                Explore Packages
            </button>
        </GlassCard>
      )}

      {/* Recent Activity Mockup */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-white/[0.02] p-4 border border-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <i className="fa-solid fa-arrow-down"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Ad View Bonus</p>
                <p className="text-[10px] text-gray-500">Today at 10:45 AM</p>
              </div>
              <p className="text-sm font-bold text-green-500">+$0.01</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
