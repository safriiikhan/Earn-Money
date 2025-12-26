
import { User, PackageType, Withdrawal, Payment } from '../types';

export const mockUser: User = {
  userId: 'user_123',
  email: 'investor@example.com',
  package: PackageType.NONE,
  balance: 0,
  totalEarned: 0,
  todayAds: 0,
  referralCode: 'ADV-8821',
  referrals: [],
  role: 'user'
};

export const mockAdmin: User = {
  userId: 'admin_1',
  email: 'admin@advault.com',
  package: PackageType.PRO,
  balance: 1500,
  totalEarned: 0,
  todayAds: 100,
  referralCode: 'ADMIN-001',
  referrals: ['user_123'],
  role: 'admin'
};
