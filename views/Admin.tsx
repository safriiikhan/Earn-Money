
import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { PackageType, Withdrawal, User, Payment } from '../types';
import { backend } from '../services/firebaseService';
import { PACKAGES } from '../constants';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'payments'>('payments');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In real app, these would come from Firestore
      const pendingPayments = await backend.getPendingPayments();
      setPayments(pendingPayments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (payment: any) => {
    if (!window.confirm(`Approve ${payment.package} plan for user ${payment.userId}?`)) return;
    
    try {
      await backend.approvePayment(payment.id, payment.userId, payment.package);
      alert("Package activated successfully!");
      fetchData(); // Refresh list
    } catch (e) {
      alert("Failed to approve payment.");
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    await backend.approveWithdrawal(id);
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'approved', approvalDate: Date.now() } : w));
    alert('Withdrawal Approved!');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': case 'success': return <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase">Success</span>;
      case 'rejected': case 'failed': return <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase">Rejected</span>;
      default: return <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-black text-white">Admin Command Center</h2>
        <p className="mt-1 text-sm text-gray-500">Real-time management of user requests and platform health.</p>
      </div>

      <div className="flex rounded-2xl bg-white/5 p-1">
        {(['users', 'withdrawals', 'payments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-xl py-2.5 text-xs font-bold capitalize transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
        <div className="bg-white/[0.02] p-4 flex justify-between items-center border-b border-white/10">
            <span className="font-bold text-xs uppercase tracking-widest text-gray-400">
               {activeTab} Queue
            </span>
            <button onClick={fetchData} className="text-[10px] text-blue-500 font-bold uppercase">Refresh</button>
        </div>

        <div className="p-4 space-y-4">
          {activeTab === 'payments' && (
            payments.length > 0 ? (
              payments.map((pay) => (
                <div key={pay.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 gap-4">
                    <div className="flex items-center gap-4">
                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500">
                          <i className="fa-solid fa-receipt text-xl"></i>
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                             <p className="text-sm font-bold text-white uppercase tracking-tight">{pay.package} PLAN</p>
                             {getStatusBadge(pay.status)}
                          </div>
                          <p className="text-[10px] text-gray-500 mono mt-1">TID: {pay.transactionId} • Method: {pay.method}</p>
                          <p className="text-[9px] text-gray-600 mt-1">User UID: {pay.userId}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-6 border-t border-white/5 pt-3 md:border-0 md:pt-0">
                        <div className="text-right">
                           <p className="text-xs font-bold text-gray-500 uppercase">Amount</p>
                           <p className="text-lg font-black text-blue-500 mono">${pay.amount}</p>
                        </div>
                        <button 
                          onClick={() => handleApprovePayment(pay)}
                          className="h-10 px-6 rounded-xl bg-blue-600 text-white font-bold text-[10px] uppercase shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                           Activate Plan
                        </button>
                    </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-600">
                <p className="text-sm">No pending payment requests to verify.</p>
              </div>
            )
          )}

          {activeTab === 'withdrawals' && (
             <div className="py-12 text-center text-gray-600 italic">
                <p className="text-sm">Withdrawal requests will appear here after users submit them.</p>
             </div>
          )}

          {activeTab === 'users' && (
             <div className="py-12 text-center text-gray-600 italic">
                <p className="text-sm">User database view is restricted to Master Admin.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
