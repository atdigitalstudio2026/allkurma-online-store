import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { createUserProfile, getUserProfile } from './db';
import { UserProfile } from '../types';

export const loginFirebaseEmail = async (email: string, pass: string): Promise<{ firebaseUser: FirebaseUser; profile: UserProfile }> => {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const firebaseUser = credential.user;
  
  // Retrieve or initialize profile
  let profile = await getUserProfile(firebaseUser.uid);
  if (!profile) {
    profile = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || email.split('@')[0],
      email: firebaseUser.email || email,
      phone: firebaseUser.phoneNumber || '',
      role: 'customer',
      avatar: firebaseUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      tier: 'Bronze',
      rewardPoints: 100,
      totalOrders: 0,
      savedLists: 0,
      annualSpend: 0
    };
    await createUserProfile(firebaseUser.uid, profile);
  }
  return { firebaseUser, profile };
};

export const registerFirebaseCustomer = async (
  name: string, 
  email: string, 
  phone: string, 
  pass: string
): Promise<{ firebaseUser: FirebaseUser; profile: UserProfile }> => {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  const firebaseUser = credential.user;

  // Update Auth Profile Display Name
  await updateProfile(firebaseUser, {
    displayName: name.trim()
  });

  const profile: UserProfile = {
    id: firebaseUser.uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: 'customer', // strictly enforce customer role during registration
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    tier: 'Bronze',
    rewardPoints: 250, // Welcome bonus points
    totalOrders: 0,
    savedLists: 0,
    annualSpend: 0
  };

  await createUserProfile(firebaseUser.uid, profile);
  return { firebaseUser, profile };
};

export const loginFirebaseGoogle = async (): Promise<{ firebaseUser: FirebaseUser; profile: UserProfile }> => {
  const credential = await signInWithPopup(auth, googleProvider);
  const firebaseUser = credential.user;

  let profile = await getUserProfile(firebaseUser.uid);
  if (!profile) {
    // New customer registered via Google Authentication
    profile = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Pelanggan AllKurma',
      email: firebaseUser.email || '',
      phone: firebaseUser.phoneNumber || '',
      role: 'customer', // Strictly customer role, never admin
      avatar: firebaseUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      tier: 'Bronze',
      rewardPoints: 250, // Welcome bonus points
      totalOrders: 0,
      savedLists: 0,
      annualSpend: 0
    };
    await createUserProfile(firebaseUser.uid, profile);
  }

  return { firebaseUser, profile };
};

export const sendFirebasePasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

export const logoutFirebase = async (): Promise<void> => {
  await signOut(auth);
};

export const listenToAuthState = (callback: (firebaseUser: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
