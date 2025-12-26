
import React from 'react';
import { User, PackageType } from '../types';
import { PACKAGES } from '../constants';
import GlassCard from '../components/GlassCard';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const expiryDate = user.expiryDate ? new Date(user.expiryDate).toLocaleDateString() : 'N/A';
  
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col items-center py-6">
        <div className="relative">
          <div className="h-32 w-32 rounded-[2.5rem] border-4 border-blue-500/20 p-1">
            <img src={`https://picsum.photos/seed/${user.userId}/128`} className="h-full w-full rounded-[2.2rem] object-cover" alt="Profile" />
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl">
            <i className="fa-solid fa-camera text-xs"></i>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-black text-white">{user.email.split('@')[0]}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <span className="mt-3 rounded-full bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500">
           {user.package === PackageType.NONE ? 'Free Tier' : `${PACKAGES[user.package].name} Member`}
        </span>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Account Security</h3>
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <i className="fa-solid fa-lock text-gray-500"></i>
                <span className="text-sm text-gray-300">Change Password</span>
             </div>
             <i className="fa-solid fa-chevron-right text-xs text-gray-700"></i>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-gray-500"></i>
                <span className="text-sm text-gray-300">Two-Factor Auth</span>
             </div>
             <div className="h-5 w-10 rounded-full bg-gray-800 p-1">
                <div className="h-3 w-3 rounded-full bg-gray-600"></div>
             </div>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Subscription Details</h3>
        <GlassCard className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Active Package</span>
            <span className="text-sm font-bold text-white capitalize">{user.package}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Subscription Date</span>
            <span className="text-sm font-bold text-white">{user.purchaseDate ? new Date(user.purchaseDate).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Expiry Date</span>
            <span className="text-sm font-bold text-red-400">{expiryDate}</span>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Danger Zone</h3>
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500/10 py-5 font-bold text-red-500 active:bg-red-500 active:text-white transition-all"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          Sign Out of AdVault
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-700">App Version 1.0.4-premium (Stable)</p>
    </div>
  );
};

export default Profile;
