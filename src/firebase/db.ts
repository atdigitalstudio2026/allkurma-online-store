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
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { UserProfile, Address, Order, Product, CategoryItem } from '../types';

// Recursively remove undefined values for Firestore serialization safety
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data
      .filter(item => item !== undefined)
      .map(item => sanitizeForFirestore(item)) as any;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as any;
  }
  return data;
}

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
    const sanitized = sanitizeForFirestore({
      ...profile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await setDoc(userDocRef, sanitized, { merge: true });
  } catch (error) {
    console.warn('Firestore createUserProfile fallback/offline:', error);
  }
};

export const updateUserProfileDoc = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const sanitized = sanitizeForFirestore({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    await updateDoc(userDocRef, sanitized);
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
    const sanitized = sanitizeForFirestore({
      ...order,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'orders', order.id), sanitized, { merge: true });
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

// Store Settings & Authorized Seller Staff Sync
export const getStoreSettingsFromFirestore = async (): Promise<any | null> => {
  try {
    const storeDoc = await getDoc(doc(db, 'store_settings', 'allkurma'));
    if (storeDoc.exists()) {
      return storeDoc.data();
    }
    return null;
  } catch (error) {
    console.warn('Firestore getStoreSettings fallback:', error);
    return null;
  }
};

export const saveStoreSettingsToFirestore = async (storeData: any): Promise<void> => {
  try {
    const sanitized = sanitizeForFirestore({
      ...storeData,
      updatedAt: new Date().toISOString()
    });
    await setDoc(doc(db, 'store_settings', 'allkurma'), sanitized, { merge: true });
  } catch (error) {
    console.warn('Firestore saveStoreSettings fallback:', error);
  }
};

export const listenToStoreSettingsFromFirestore = (
  onSuccess: (settings: any) => void
): (() => void) => {
  try {
    const unsubscribe = onSnapshot(
      doc(db, 'store_settings', 'allkurma'),
      (docSnap) => {
        if (docSnap.exists()) {
          onSuccess(docSnap.data());
        }
      },
      (err) => {
        console.warn('Store settings listener warning:', err);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Could not attach store settings listener:', e);
    return () => {};
  }
};

// ==========================================
// Products Real-time Synchronization across All Devices
// ==========================================

export const listenToProductsFromFirestore = (
  onSuccess: (products: Product[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  try {
    const productsColl = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsColl,
      (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, 'id'>)
          });
        });

        // Order products: newest first
        items.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        onSuccess(items);
      },
      (error) => {
        console.warn('Firestore listenToProducts snapshot error:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('Failed to attach products listener:', err);
    return () => {};
  }
};

export const getProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const list: Product[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
    });
    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    return list;
  } catch (error) {
    console.warn('Firestore getProducts fallback:', error);
    return [];
  }
};

export const saveProductToFirestore = async (product: Product): Promise<void> => {
  try {
    const prodRef = doc(db, 'products', product.id);
    const sanitized = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString()
    });
    await setDoc(prodRef, sanitized, { merge: true });
    console.log('[Firestore] Successfully synced product to cloud:', product.id, product.name);
  } catch (error) {
    console.error('[Firestore] Failed to save product to Firestore:', error);
    throw error;
  }
};

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.error('Failed to delete product from Firestore:', error);
    throw error;
  }
};

// ==========================================
// Product Categories Real-time Sync & Management
// ==========================================

export const listenToCategoriesFromFirestore = (
  onSuccess: (categories: CategoryItem[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  try {
    const categoriesColl = collection(db, 'categories');
    const unsubscribe = onSnapshot(
      categoriesColl,
      (snapshot) => {
        const items: CategoryItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<CategoryItem, 'id'>)
          });
        });

        // Sort categories: custom order or alphabetically
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        onSuccess(items);
      },
      (error) => {
        console.warn('Firestore listenToCategories snapshot warning:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    console.warn('Failed to attach categories listener:', err);
    return () => {};
  }
};

export const getCategoriesFromFirestore = async (): Promise<CategoryItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const list: CategoryItem[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<CategoryItem, 'id'>) });
    });
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return list;
  } catch (error) {
    console.warn('Firestore getCategories fallback:', error);
    return [];
  }
};

export const saveCategoryToFirestore = async (category: CategoryItem): Promise<void> => {
  try {
    const catRef = doc(db, 'categories', category.id);
    const sanitized = sanitizeForFirestore({
      ...category,
      updatedAt: new Date().toISOString()
    });
    await setDoc(catRef, sanitized, { merge: true });
    console.log('[Firestore] Successfully saved category to cloud:', category.id, category.name);
  } catch (error) {
    console.error('[Firestore] Failed to save category to Firestore:', error);
    throw error;
  }
};

export const deleteCategoryFromFirestore = async (categoryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    console.log('[Firestore] Successfully deleted category from cloud:', categoryId);
  } catch (error) {
    console.error('[Firestore] Failed to delete category from Firestore:', error);
    throw error;
  }
};


