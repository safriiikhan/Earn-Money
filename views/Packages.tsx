
import React, { useState } from 'react';
import { User, PackageType } from '../types';
import { PACKAGES } from '../constants';
import GlassCard from '../components/GlassCard';
import { backend } from '../services/firebaseService';

interface PackagesProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const Packages: React.FC<PackagesProps> = ({ user, onUpdateUser }) => {
  const [checkoutPkg, setCheckoutPkg] = useState<PackageType | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('binance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const hasSubscription = user.package !== PackageType.NONE;

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPkg || !transactionId) return;

    setIsSubmitting(true);
    try {
      await backend.submitPaymentRequest(user.userId, checkoutPkg, transactionId, paymentMethod);
      alert("Payment submitted! Admin will verify your Transaction ID and activate your plan within 1-6 hours.");
      setCheckoutPkg(null);
      setTransactionId('');
    } catch (err) {
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const packageList = [PackageType.STARTER, PackageType.PREMIUM, PackageType.PRO];

  const getBinanceLink = (type: PackageType) => {
    switch (type) {
        case PackageType.STARTER: return "https://s.binance.com/Z5TuZooY";
        case PackageType.PREMIUM: return "https://s.binance.com/dIJA3mpv";
        case PackageType.PRO: return "https://s.binance.com/o1ADRkc6";
        default: return "";
    }
  };

  if (checkoutPkg) {
    const pkg = PACKAGES[checkoutPkg];
    const binanceUrl = getBinanceLink(checkoutPkg);

    return (
      <div className="space-y-6 pb-10 animate-in fade-in duration-500">
        <button onClick={() => setCheckoutPkg(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-arrow-left"></i>
            Back to Plans
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-black text-white">Complete Payment</h2>
          <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">Plan: {pkg.name} • ${pkg.price}</p>
        </div>

        <GlassCard className="border-blue-500/20 bg-blue-500/5">
            <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-circle-info"></i>
                Transfer Instructions
            </h3>
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Binance Quick Pay</p>
                    <div className="flex flex-col gap-2 mt-2">
                        <a 
                          href={binanceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center justify-between rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-transform active:scale-95"
                        >
                            Pay ${pkg.price} via Binance
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <p className="text-[9px] text-gray-400">Click the button above to pay directly via Binance App/Web.</p>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">JazzCash (Pakistan)</p>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <span className="text-lg font-black text-white mono block">0312-6770166</span>
                            <span className="text-[10px] text-blue-400 font-bold">Name: Muhammad Akbar</span>
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText('03126770166');
                                alert("Number copied!");
                            }} 
                            className="text-blue-500 text-xs font-bold uppercase"
                        >
                            Copy
                        </button>
                    </div>
                </div>
                
                <p className="text-[9px] text-gray-500 italic">EasyPaisa is currently unavailable. Please use JazzCash or Binance.</p>
            </div>
        </GlassCard>

        <form onSubmit={handleManualPayment} className="space-y-4">
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Select Paid Via</label>
                <select 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 py-4 px-4 text-white focus:outline-none"
                >
                    <option value="binance">Binance Pay</option>
                    <option value="jazzcash">JazzCash</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Transaction ID (TID)</label>
                <input 
                    required
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Paste your TID/Ref ID here"
                    className="w-full rounded-xl bg-white/5 border border-white/10 py-4 px-4 text-white placeholder:text-gray-700 focus:outline-none"
                />
            </div>

            <button 
                disabled={isSubmitting || !transactionId}
                className="w-full rounded-2xl bg-blue-600 py-4 font-black text-white shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
                {isSubmitting ? <i className="fa-solid fa-circle-notch animate-spin"></i> : 'Submit Proof'}
            </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-black text-white">Select Your Tier</h2>
        <p className="mt-2 text-sm text-gray-500">Choose a plan to start your earning journey.</p>
      </div>

      <div className="space-y-6">
        {packageList.map((type) => {
          const pkg = PACKAGES[type];
          const isCurrent = user.package === type;

          return (
            <GlassCard
              key={type}
              className={`relative overflow-hidden transition-all ${isCurrent ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 rounded-bl-2xl bg-blue-600 px-4 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                  Active Plan
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">{pkg.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-blue-500">${pkg.price}</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">One-time Fee</span>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  type === PackageType.PRO ? 'bg-orange-500/10 text-orange-500' :
                  type === PackageType.PREMIUM ? 'bg-purple-500/10 text-purple-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  <i className={`fa-solid ${type === PackageType.PRO ? 'fa-crown' : type === PackageType.PREMIUM ? 'fa-gem' : 'fa-star'} text-xl`}></i>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Daily Max</p>
                  <p className="text-lg font-black text-blue-400">${pkg.dailyEarning}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Withdraw Min</p>
                  <p className="text-lg font-black text-white">${pkg.minWithdraw}</p>
                </div>
              </div>

              <button
                disabled={isCurrent}
                onClick={() => setCheckoutPkg(type)}
                className={`mt-6 w-full rounded-2xl py-4 font-black transition-all active:scale-[0.98] ${
                  isCurrent 
                  ? 'bg-white/5 text-gray-500 cursor-default' 
                  : 'bg-white text-black hover:bg-gray-100 shadow-xl shadow-white/10'
                }`}
              >
                {isCurrent ? 'Current Plan Active' : 'Purchase Plan'}
              </button>
            </GlassCard>
          );
        })}
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
        <i className="fa-solid fa-shield-halved mb-3 text-2xl text-blue-500"></i>
        <h4 className="text-sm font-bold text-white">Verified Activation</h4>
        <p className="mt-1 text-xs text-gray-500">Payments are processed securely via Binance and JazzCash.</p>
      </div>
    </div>
  );
};

export default Packages;
