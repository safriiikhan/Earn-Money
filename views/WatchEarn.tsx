
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { DAILY_AD_LIMIT, AD_RATE } from '../constants';
import GlassCard from '../components/GlassCard';
import AdBanner from '../components/AdBanner';

interface WatchEarnProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const WatchEarn: React.FC<WatchEarnProps> = ({ user, onUpdateUser }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const startWatching = () => {
    if (user.todayAds >= DAILY_AD_LIMIT) {
      alert("Daily limit reached! Come back tomorrow.");
      return;
    }
    
    setIsWatching(true);
    setTimeLeft(5); // Simulate 5-second ad view
  };

  useEffect(() => {
    // Fixed: Replaced NodeJS.Timeout with any to fix 'Cannot find namespace NodeJS' error in browser
    let timer: any;
    if (isWatching && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isWatching && timeLeft === 0) {
      setIsWatching(false);
      onUpdateUser({
        todayAds: user.todayAds + 1,
        balance: user.balance + AD_RATE,
        totalEarned: user.totalEarned + AD_RATE
      });
    }
    return () => clearTimeout(timer);
  }, [isWatching, timeLeft, onUpdateUser, user.balance, user.todayAds, user.totalEarned]);

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Watch & Earn</h2>
        <p className="mt-1 text-sm text-gray-500">Watch short ads to earn real money daily.</p>
      </div>

      {/* Ad Center */}
      <div className="relative">
         <GlassCard className="flex min-h-[400px] flex-col items-center justify-center text-center">
            {isWatching ? (
              <div className="space-y-6">
                <AdBanner position="center" />
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Watching Sponsor Ad...</p>
                    <div className="mx-auto h-16 w-16 items-center justify-center flex rounded-full bg-blue-500/10 border border-blue-500/20">
                        <span className="text-2xl font-black text-white mono">{timeLeft}s</span>
                    </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30">
                  <i className="fa-solid fa-play text-4xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Ready to Earn?</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
                    Watch this short sponsor ad to get <span className="text-green-500 font-bold">$0.01</span> instantly added to your balance.
                  </p>
                </div>
                <button
                  onClick={startWatching}
                  disabled={user.todayAds >= DAILY_AD_LIMIT}
                  className="w-full max-w-[200px] rounded-2xl bg-white py-4 font-black text-black transition-all active:scale-95 disabled:opacity-50"
                >
                  {user.todayAds >= DAILY_AD_LIMIT ? 'Limit Reached' : 'Watch Ad Now'}
                </button>
              </div>
            )}
         </GlassCard>
      </div>

      {/* Progress & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Today's Progress</p>
          <div className="mt-2 flex items-end justify-between">
            <h4 className="text-2xl font-black text-white mono">{user.todayAds}</h4>
            <span className="text-[10px] font-bold text-gray-600">/ {DAILY_AD_LIMIT}</span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/5">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(user.todayAds / DAILY_AD_LIMIT) * 100}%` }}
            ></div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Earned Today</p>
          <div className="mt-2">
            <h4 className="text-2xl font-black text-green-500 mono">${(user.todayAds * AD_RATE).toFixed(2)}</h4>
            <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">Real-time Credit</p>
          </div>
        </GlassCard>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">
        <div className="flex gap-3">
          <i className="fa-solid fa-circle-info text-orange-500 mt-0.5"></i>
          <p className="text-xs leading-relaxed text-orange-200/70">
            Ensure you have a stable internet connection. Closing the app before the ad timer finishes will result in no credit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WatchEarn;
