import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Address, Order } from '../types';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Firestore getUserProfile fallback/offline:', error);
    return null;
  }
};

export const createUserProfile = async (uid: string, profile: UserProfile): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      ...profile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore createUserProfile fallback/offline:', error);
  }
};

export const updateUserProfileDoc = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore updateUserProfileDoc fallback/offline:', error);
  }
};

export const updateUserProfile = updateUserProfileDoc;

// Addresses
export const getCustomerAddressesFromFirestore = async (userId: string): Promise<Address[]> => {
  try {
    const q = query(collection(db, 'addresses'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const list: Address[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Address, 'id'>) });
    });
    return list;
  } catch (error) {
    console.warn('Firestore getCustomerAddresses fallback:', error);
    return [];
  }
};

export const saveCustomerAddressToFirestore = async (userId: string, address: Omit<Address, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'addresses'), {
      ...address,
      userId,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Firestore saveCustomerAddress fallback:', error);
    return 'addr-' + Date.now();
  }
};

export const deleteCustomerAddressFromFirestore = async (addressId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'addresses', addressId));
  } catch (error) {
    console.warn('Firestore deleteCustomerAddress fallback:', error);
  }
};

// Orders
export const getCustomerOrdersFromFirestore = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const list: Order[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
    });
    return list;
  } catch (error) {
    console.warn('Firestore getCustomerOrders fallback:', error);
    return [];
  }
};

export const getAllOrdersFromFirestore = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const list: Order[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
    });
    return list;
  } catch (error) {
    console.warn('Firestore getAllOrders fallback:', error);
    return [];
  }
};

export const saveOrderToFirestore = async (order: Order): Promise<void> => {
  try {
    await setDoc(doc(db, 'orders', order.id), {
      ...order,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveOrder fallback:', error);
  }
};

export const updateOrderStatusInFirestore = async (
  orderId: string, 
  updates: Partial<Order>
): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Firestore updateOrderStatus fallback:', error);
  }
};

// Cart per User
export const getUserCartFromFirestore = async (userId: string): Promise<any[]> => {
  try {
    const cartDoc = await getDoc(doc(db, 'carts', userId));
    if (cartDoc.exists()) {
      return cartDoc.data().items || [];
    }
    return [];
  } catch (error) {
    console.warn('Firestore getUserCart fallback:', error);
    return [];
  }
};

export const saveUserCartToFirestore = async (userId: string, items: any[]): Promise<void> => {
  try {
    await setDoc(doc(db, 'carts', userId), {
      userId,
      items,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveUserCart fallback:', error);
  }
};
