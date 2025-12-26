
import React from 'react';
import { User } from '../types';
import GlassCard from '../components/GlassCard';
import { REFERRAL_BONUS } from '../constants';

const Referral: React.FC<{ user: User }> = ({ user }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Invite & Earn</h2>
        <p className="mt-1 text-sm text-gray-500">Build your network and earn passive income.</p>
      </div>

      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-pink-700 p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <i className="fa-solid fa-gift text-3xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black">Get ${REFERRAL_BONUS.toFixed(2)}</h3>
              <p className="text-sm opacity-80">For every friend you invite!</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Unique Code</label>
        <div className="flex gap-2">
          <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 py-5 px-6 text-center text-2xl font-black tracking-widest text-white mono">
            {user.referralCode}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black active:scale-95"
          >
            <i className="fa-solid fa-copy text-xl"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Referrals</p>
          <h4 className="mt-1 text-3xl font-black text-white mono">{user.referrals.length}</h4>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Referral Bonus</p>
          <h4 className="mt-1 text-3xl font-black text-green-500 mono">${(user.referrals.length * REFERRAL_BONUS).toFixed(2)}</h4>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">How it works</h3>
        <div className="space-y-4">
          {[
            { step: 1, text: "Share your referral code with friends and family." },
            { step: 2, text: "They sign up using your unique link or code." },
            { step: 3, text: "You get $1 instantly added to your main balance." }
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-blue-500 font-black">
                {item.step}
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white/5 border border-white/10 py-5 font-bold text-white transition-colors hover:bg-white/10 active:scale-95">
        <i className="fa-solid fa-share-nodes text-lg"></i>
        Share with Contacts
      </button>
    </div>
  );
};

export default Referral;
