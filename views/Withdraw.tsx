
import React, { useState } from 'react';
import { User, PackageType } from '../types';
import { PACKAGES } from '../constants';
import GlassCard from '../components/GlassCard';
import { backend } from '../services/firebaseService';

interface WithdrawProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const Withdraw: React.FC<WithdrawProps> = ({ user, onUpdateUser }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('binance');
  const [accountInfo, setAccountInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const minWithdraw = PACKAGES[user.package].minWithdraw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount < minWithdraw) {
      alert(`Minimum withdrawal for your package is $${minWithdraw}`);
      return;
    }

    if (withdrawAmount > user.balance) {
      alert("Insufficient balance.");
      return;
    }

    setLoading(true);
    try {
      await backend.requestWithdrawal(user.userId, withdrawAmount, method, accountInfo);
      onUpdateUser({ balance: user.balance - withdrawAmount });
      setAmount('');
      setAccountInfo('');
      alert("Withdrawal request submitted successfully! Admin will process it within 24-48 hours.");
    } catch (error) {
      alert("Failed to submit request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const methods = [
    { id: 'binance', name: 'Binance Pay', icon: 'fa-bitcoin' },
    { id: 'easypaisa', name: 'EasyPaisa', icon: 'fa-mobile-screen' },
    { id: 'jazzcash', name: 'JazzCash', icon: 'fa-money-bill-transfer' },
    { id: 'bank', name: 'Bank Transfer', icon: 'fa-building-columns' },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-black text-white">Withdraw Funds</h2>
        <p className="mt-1 text-sm text-gray-500">Fast processing to your preferred method.</p>
      </div>

      <GlassCard className="flex items-center justify-between border-blue-500/20 bg-blue-500/5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Withdrawable Balance</p>
          <h3 className="mt-1 text-4xl font-black text-white mono">${user.balance.toFixed(2)}</h3>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Minimum</p>
          <h3 className="mt-1 text-xl font-bold text-gray-400 mono">${minWithdraw}</h3>
        </div>
      </GlassCard>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Withdraw Amount ($)</label>
          <input
            required
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`Min $${minWithdraw}`}
            className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 px-6 text-xl font-black text-white focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 transition-all ${
                  method === m.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${method === m.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                  <i className={`fa-solid ${m.icon}`}></i>
                </div>
                <span className={`text-xs font-bold ${method === m.id ? 'text-white' : 'text-gray-400'}`}>{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {method === 'binance' ? 'Binance ID / Email' : 'Account Number / IBAN'}
          </label>
          <input
            required
            type="text"
            value={accountInfo}
            onChange={(e) => setAccountInfo(e.target.value)}
            placeholder="Enter destination details"
            className="w-full rounded-2xl bg-white/5 border border-white/10 py-4 px-6 text-sm text-white focus:border-blue-500/50 focus:outline-none"
          />
        </div>

        <button
          disabled={loading || !amount || parseFloat(amount) < minWithdraw}
          className="w-full rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 py-5 text-lg font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30"
        >
          {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Submit Withdrawal'}
        </button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Request History</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-2xl bg-white/[0.02] p-4 border border-white/5 opacity-50">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800">
                <i className="fa-solid fa-clock-rotate-left text-gray-600"></i>
             </div>
             <div className="flex-1">
                <p className="text-sm font-bold text-gray-400 italic">No recent withdrawals found</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
