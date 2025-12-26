
import { PackageType, PackageDetails } from './types';

export const PACKAGES: Record<PackageType, PackageDetails> = {
  [PackageType.NONE]: {
    id: PackageType.NONE,
    name: 'None',
    price: 0,
    totalReturn: 0,
    dailyEarning: 0,
    minWithdraw: 0,
    duration: 0,
    expiryDays: 0
  },
  [PackageType.STARTER]: {
    id: PackageType.STARTER,
    name: 'Starter',
    price: 20,
    totalReturn: 25,
    dailyEarning: 1.67,
    minWithdraw: 10,
    duration: 15,
    expiryDays: 25
  },
  [PackageType.PREMIUM]: {
    id: PackageType.PREMIUM,
    name: 'Premium',
    price: 30,
    totalReturn: 40,
    dailyEarning: 2.67,
    minWithdraw: 15,
    duration: 15,
    expiryDays: 25
  },
  [PackageType.PRO]: {
    id: PackageType.PRO,
    name: 'Pro',
    price: 50,
    totalReturn: 70,
    dailyEarning: 4.67,
    minWithdraw: 25,
    duration: 15,
    expiryDays: 25
  }
};

export const AD_RATE = 0.01;
export const DAILY_AD_LIMIT = 100;
export const REFERRAL_BONUS = 1.00;

export const COLORS = {
  primary: '#4361ee',
  secondary: '#7209b7',
  accent: '#4cc9f0',
  success: '#00b09b',
  warning: '#f8961e',
  bg: '#0a0a0a'
};
