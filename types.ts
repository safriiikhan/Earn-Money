
export enum PackageType {
  NONE = 'none',
  STARTER = 'starter',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export interface PackageDetails {
  id: PackageType;
  name: string;
  price: number;
  totalReturn: number;
  dailyEarning: number;
  minWithdraw: number;
  duration: number;
  expiryDays: number;
}

export interface User {
  userId: string;
  email: string;
  package: PackageType;
  purchaseDate?: number;
  expiryDate?: number;
  balance: number;
  totalEarned: number;
  todayAds: number;
  referralCode: string;
  referrals: string[];
  role: 'user' | 'admin';
}

export interface Payment {
  id: string;
  userId: string;
  package: PackageType;
  amount: number;
  method: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
  transactionId: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: number;
  approvalDate?: number;
  adminNotes?: string;
}
