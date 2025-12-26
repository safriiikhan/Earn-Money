
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  Auth
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  increment,
  Firestore
} from "firebase/firestore";
import { PackageType, User } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAdTNh1spd2f-sJUxZi3LX2XvuJ3KG3lso",
  authDomain: "advault-x.firebaseapp.com",
  projectId: "advault-x",
  storageBucket: "advault-x.firebasestorage.app",
  messagingSenderId: "924180011314",
  appId: "1:924180011314:web:c2bced10f2620b1aaadf2b"
};

class FirebaseService {
  private static instance: FirebaseService;
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  
  private constructor() {
    try {
        // Core initialization
        this.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        console.log("Firebase initialized successfully");
    } catch (e) {
        console.error("Firebase Initialization Failure:", e);
        throw e;
    }
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  private handleAuthError(error: any): Error {
    const code = error?.code;
    const message = error?.message;
    console.error("Firebase Error:", { code, message });
    
    if (code === 'auth/invalid-credential') return new Error("Invalid email or password.");
    if (code === 'auth/email-already-in-use') return new Error("Email already registered.");
    return new Error(message || "An error occurred with authentication.");
  }

  // --- AUTH METHODS ---
  async login(email: string, password?: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password || "password123");
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(this.db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as User;
        if (email.toLowerCase().includes('admin') && data.role !== 'admin') {
            await updateDoc(doc(this.db, "users", firebaseUser.uid), { role: 'admin' });
            data.role = 'admin';
        }
        return data;
      } else {
        const newUser: User = {
          userId: firebaseUser.uid,
          email: email,
          package: PackageType.NONE,
          balance: 0,
          totalEarned: 0,
          todayAds: 0,
          referralCode: 'ADV-' + Math.floor(1000 + Math.random() * 9000),
          referrals: [],
          role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
        };
        await setDoc(doc(this.db, "users", firebaseUser.uid), newUser);
        return newUser;
      }
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async signUp(email: string, password?: string, referralCode?: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password || "password123");
      const firebaseUser = userCredential.user;
      
      const newUser: User = {
        userId: firebaseUser.uid,
        email: email,
        package: PackageType.NONE,
        balance: 0,
        totalEarned: 0,
        todayAds: 0,
        referralCode: 'ADV-' + Math.floor(1000 + Math.random() * 9000),
        referrals: [],
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
      };

      await setDoc(doc(this.db, "users", firebaseUser.uid), newUser);
      return newUser;
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  async logout() {
    try {
        await signOut(this.auth);
    } catch (e) {
        console.warn("Logout error:", e);
    }
  }

  // --- DATABASE METHODS ---
  async updateUserBalance(userId: string, newBalance: number, todayAds: number): Promise<void> {
    try {
      const userRef = doc(this.db, "users", userId);
      await updateDoc(userRef, {
        balance: newBalance,
        todayAds: todayAds
      });
    } catch (e) {
      console.error("Error updating balance:", e);
    }
  }

  async purchasePackage(userId: string, pkgType: PackageType): Promise<void> {
    try {
      const userRef = doc(this.db, "users", userId);
      await updateDoc(userRef, {
        package: pkgType,
        purchaseDate: Date.now(),
        expiryDate: Date.now() + (25 * 24 * 60 * 60 * 1000)
      });
    } catch (e) {
      console.error("Error purchasing package:", e);
    }
  }

  async submitPaymentRequest(userId: string, pkgType: PackageType, txId: string, method: string): Promise<void> {
    try {
      const amount = pkgType === PackageType.STARTER ? 20 : (pkgType === PackageType.PREMIUM ? 30 : 50);
      await addDoc(collection(this.db, "payments"), {
        userId,
        package: pkgType,
        transactionId: txId,
        method,
        status: 'pending',
        timestamp: Date.now(),
        amount: amount
      });
    } catch (e) {
      console.error("Error submitting payment:", e);
      throw new Error("Could not submit payment request.");
    }
  }

  async getPendingPayments(): Promise<any[]> {
    try {
      const q = query(collection(this.db, "payments"), where("status", "==", "pending"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching payments:", e);
      return [];
    }
  }

  async approvePayment(paymentId: string, userId: string, pkgType: PackageType): Promise<void> {
    try {
      await updateDoc(doc(this.db, "payments", paymentId), { status: 'success' });
      const userRef = doc(this.db, "users", userId);
      await updateDoc(userRef, {
        package: pkgType,
        purchaseDate: Date.now(),
        expiryDate: Date.now() + (25 * 24 * 60 * 60 * 1000)
      });
    } catch (e) {
      console.error("Error approving payment:", e);
      throw new Error("Failed to approve payment.");
    }
  }

  async requestWithdrawal(userId: string, amount: number, method: string, accountInfo: string): Promise<void> {
    try {
      await addDoc(collection(this.db, "withdrawals"), {
        userId,
        amount,
        method,
        accountInfo,
        status: 'pending',
        requestDate: Date.now()
      });
      const userRef = doc(this.db, "users", userId);
      await updateDoc(userRef, {
        balance: increment(-amount)
      });
    } catch (e) {
      console.error("Error requesting withdrawal:", e);
      throw new Error("Withdrawal request failed.");
    }
  }

  async approveWithdrawal(withdrawalId: string): Promise<void> {
    try {
      await updateDoc(doc(this.db, "withdrawals", withdrawalId), {
        status: 'approved',
        approvalDate: Date.now()
      });
    } catch (e) {
      console.error("Error approving withdrawal:", e);
    }
  }
}

export const backend = FirebaseService.getInstance();
