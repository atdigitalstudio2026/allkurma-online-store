import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  CartItem,
  Order,
  UserProfile,
  Address,
  StockMovement,
  PromotionVoucher,
  RewardItem,
  PointTransaction,
  WholesaleInvoice,
  ReturnRequest,
  RolePermission,
  SystemSettings,
  UserRoleType,
  WholesaleTier,
  ProductVariation,
  CustomerReview,
  ChatMessage,
  AppNotification,
  SellerStoreProfile,
  SellerStaffMember,
  ShopeeChatMessage,
  ShopeeNotification
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_PROMOTIONS,
  INITIAL_REWARDS,
  INITIAL_POINT_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_RETURNS,
  INITIAL_ROLES,
  INITIAL_SETTINGS,
  WHOLESALE_TIERS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SELLER_STORE
} from '../data/mockData';
import { normalizeImageUrl } from '../utils/imageUrlHelper';
import { listenToAuthState, logoutFirebase } from '../firebase/auth';
import { getUserProfile, getStoreSettingsFromFirestore, saveStoreSettingsToFirestore } from '../firebase/db';

export type AppView =
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'my-orders'
  | 'b2b-portal'
  | 'b2b-quick-order'
  | 'b2b-bulk-upload'
  | 'b2b-tiers'
  | 'b2b-invoices'
  | 'loyalty-hub'
  | 'point-history'
  | 'rewards-catalog'
  | 'personalized-offers'
  | 'request-return'
  | 'rma-management'
  | 'admin-dashboard'
  | 'admin-add-product'
  | 'admin-orders'
  | 'admin-stock'
  | 'admin-customers'
  | 'admin-promotions'
  | 'admin-roles'
  | 'admin-settings'
  | 'my-profile'
  | 'account-settings'
  | 'address-book'
  | 'allkurma-games'
  | 'allkurma-vouchers'
  | 'allkurma-wallet'
  | 'shopee-games'
  | 'shopee-vouchers'
  | 'shopee-wallet'
  | 'kurma-points'
  | 'wishlist'
  | 'seller-center'
  | 'seller-dashboard'
  | 'seller-products'
  | 'seller-orders'
  | 'seller-settings'
  | 'seller-vouchers'
  | 'seller-finances'
  | 'seller-reviews'
  | 'seller-login'
  | 'seller-register'
  | 'customer-login'
  | 'customer-register'
  | 'customer-forgot-password'
  | 'customer-dashboard'
  | 'access-denied';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // User & Persona
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  switchRole: (role: UserRoleType) => void;
  tiers: WholesaleTier[];
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;
  
  // Cart & Variations
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  addToCartWithVariation: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number, variationId?: string) => void;
  removeFromCart: (productId: string, variationId?: string) => void;
  clearCart: () => void;
  appliedVoucher: PromotionVoucher | null;
  applyVoucher: (code: string) => boolean;
  removeVoucher: () => void;
  useCoinsInCheckout: boolean;
  setUseCoinsInCheckout: (use: boolean) => void;
  coinsDeduction: number;
  cartTotals: {
    subtotal: number;
    wholesaleDiscount: number;
    voucherDiscount: number;
    coinsDiscount: number;
    shippingCost: number;
    tax: number;
    total: number;
    totalItems: number;
    totalSavings: number;
  };
  
  // Orders
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  
  // Addresses
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  
  // Stock Movements
  stockMovements: StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  
  // Promotions & Vouchers
  promotions: PromotionVoucher[];
  createPromotion: (promo: Omit<PromotionVoucher, 'id' | 'usedCount'>) => void;
  togglePromotionStatus: (id: string) => void;
  claimedVoucherIds: string[];
  claimVoucher: (id: string) => void;
  claimAllVouchers: () => void;
  
  // Rewards & Loyalty
  rewards: RewardItem[];
  pointTransactions: PointTransaction[];
  redeemReward: (reward: RewardItem) => boolean;
  
  // Kurma Customer & Gamification Features
  kurmaPoints: number;
  shopeeCoins: number; // backward compatibility
  checkInStreak: number;
  lastCheckInDate: string | null;
  claimDailyCoin: () => boolean;
  spinWheel: () => { prize: string; coins?: number; voucher?: string };
  plantCoinLevel: number;
  waterCoinPlant: () => { gainedCoins: number; isHarvest: boolean };
  
  kurmaPayBalance: number;
  shopeePayBalance: number; // backward compatibility
  topUpKurmaPay: (amount: number) => void;
  topUpShopeePay: (amount: number) => void;
  payLaterLimit: number;
  spayLaterLimit: number;
  payLaterUsed: number;
  spayLaterUsed: number;
  
  wishlistProductIds: string[];
  toggleWishlist: (productId: string) => void;
  
  reviews: CustomerReview[];
  addReview: (review: Omit<CustomerReview, 'id' | 'date' | 'helpfulCount'>) => void;
  markReviewHelpful: (reviewId: string) => void;
  
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, productCard?: Product) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  unreadChatCount: number;
  
  notifications: AppNotification[];
  isNotifOpen: boolean;
  setIsNotifOpen: (open: boolean) => void;
  markNotifAsRead: (id: string) => void;
  markAllNotifsRead: () => void;
  unreadNotifCount: number;
  addNotification: (notif: Omit<AppNotification, 'id'>) => void;
  
  // Follow Store Feature
  isFollowingStore: boolean;
  toggleFollowStore: () => void;
  broadcastToFollowers: (title: string, message: string, promoCode?: string) => void;
  
  // Seller Center Management
  sellerStore: SellerStoreProfile;
  updateSellerStore: (updates: Partial<SellerStoreProfile>) => void;
  withdrawSellerBalance: (amount: number) => boolean;
  toggleSellerCourier: (courierId: string) => void;
  replySellerReview: (reviewId: string, replyText: string) => void;
  addSellerStaff: (staff: Omit<SellerStaffMember, 'id' | 'addedAt'>) => void;
  removeSellerStaff: (id: string) => void;
  toggleSellerStaffStatus: (id: string) => void;
  isEmailAuthorizedSeller: (email: string) => boolean;
  
  // Wholesale Invoices
  invoices: WholesaleInvoice[];
  payInvoice: (id: string) => void;
  
  // Returns & RMA
  returns: ReturnRequest[];
  createReturnRequest: (req: Omit<ReturnRequest, 'id' | 'returnCode' | 'createdAt' | 'status'>) => void;
  updateReturnStatus: (id: string, status: ReturnRequest['status'], notes?: string, adjustedCredit?: number, resolution?: ReturnRequest['resolutionStatus']) => void;
  selectedReturnId: string | null;
  setSelectedReturnId: (id: string | null) => void;
  
  // Roles & RBAC
  roles: RolePermission[];
  updateRolePermissions: (id: string, permissions: RolePermission['permissions']) => void;
  
  // System Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Auth & Roles
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'customer_login' | 'customer_register' | 'seller_login';
  setAuthModalMode: (mode: 'customer_login' | 'customer_register' | 'seller_login') => void;
  loginCustomer: (email: string, customName?: string) => void;
  registerCustomer: (name: string, email: string, phone: string) => void;
  loginSeller: (email?: string) => void;
  logout: () => void;
  
  // UI & Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  isQuickOrderOpen: boolean;
  setIsQuickOrderOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);

  // Core Data States with localStorage fallback
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('allkurma_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('allkurma_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge any old dummy simulation products ('prod-01' to 'prod-09')
          const realUserProducts = parsed.filter((p: Product) => p?.id && !/^prod-0[1-9]$/.test(p.id));
          if (realUserProducts.length !== parsed.length) {
            localStorage.setItem('allkurma_products', JSON.stringify(realUserProducts));
          }
          return realUserProducts;
        }
      } catch (e) {
        console.error('Failed to parse allkurma_products:', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('allkurma_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item: CartItem) => item?.product && !/^prod-0[1-9]$/.test(item.product.id));
        }
      } catch (e) {
        console.error('Failed to parse allkurma_cart:', e);
      }
    }
    return [];
  });

  const [appliedVoucher, setAppliedVoucher] = useState<PromotionVoucher | null>(null);
  const [useCoinsInCheckout, setUseCoinsInCheckout] = useState(false);

  // Shopee Coins & Gamification States
  const [shopeeCoins, setShopeeCoins] = useState<number>(() => {
    const saved = localStorage.getItem('allkurma_coins');
    return saved ? JSON.parse(saved) : 15450;
  });

  const [checkInStreak, setCheckInStreak] = useState<number>(() => {
    const saved = localStorage.getItem('allkurma_streak');
    return saved ? JSON.parse(saved) : 3;
  });

  const [lastCheckInDate, setLastCheckInDate] = useState<string | null>(() => {
    return localStorage.getItem('allkurma_last_checkin') || null;
  });

  const [plantCoinLevel, setPlantCoinLevel] = useState<number>(() => {
    const saved = localStorage.getItem('allkurma_plant_level');
    return saved ? JSON.parse(saved) : 60;
  });

  // ShopeePay & SPayLater Wallet
  const [shopeePayBalance, setShopeePayBalance] = useState<number>(() => {
    const saved = localStorage.getItem('allkurma_shopeepay');
    return saved ? JSON.parse(saved) : 450000;
  });
  const spayLaterLimit = 5000000;
  const [spayLaterUsed, setSpayLaterUsed] = useState<number>(() => {
    const saved = localStorage.getItem('allkurma_spaylater_used');
    return saved ? JSON.parse(saved) : 750000;
  });

  // Wishlist / Favorit
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('allkurma_wishlist');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id: string) => !/^prod-0[1-9]$/.test(id));
        }
      } catch {}
    }
    return [];
  });

  // Reviews
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('allkurma_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Live Chat
  const [chatMessages, setChatMessages] = useState<ShopeeChatMessage[]>(() => {
    const saved = localStorage.getItem('allkurma_chat');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Seller Store State
  const [sellerStore, setSellerStore] = useState<SellerStoreProfile>(() => {
    const saved = localStorage.getItem('allkurma_seller_store');
    return saved ? JSON.parse(saved) : INITIAL_SELLER_STORE;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('allkurma_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Claimed Vouchers
  const [claimedVoucherIds, setClaimedVoucherIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('allkurma_claimed_vouchers');
    return saved ? JSON.parse(saved) : ['promo-01'];
  });

  // Follow Store State
  const [isFollowingStore, setIsFollowingStore] = useState<boolean>(() => {
    const saved = localStorage.getItem('allkurma_is_following_store');
    return saved ? JSON.parse(saved) : false;
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('allkurma_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('allkurma_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('allkurma_stock');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  const [promotions, setPromotions] = useState<PromotionVoucher[]>(() => {
    const saved = localStorage.getItem('allkurma_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [rewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(() => {
    const saved = localStorage.getItem('allkurma_points');
    return saved ? JSON.parse(saved) : INITIAL_POINT_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<WholesaleInvoice[]>(() => {
    const saved = localStorage.getItem('allkurma_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [returns, setReturns] = useState<ReturnRequest[]>(() => {
    const saved = localStorage.getItem('allkurma_returns');
    return saved ? JSON.parse(saved) : INITIAL_RETURNS;
  });

  const [roles, setRoles] = useState<RolePermission[]>(() => {
    const saved = localStorage.getItem('allkurma_roles');
    return saved ? JSON.parse(saved) : INITIAL_ROLES;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('allkurma_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('allkurma_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('allkurma_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('allkurma_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('allkurma_coins', JSON.stringify(shopeeCoins));
  }, [shopeeCoins]);

  useEffect(() => {
    localStorage.setItem('allkurma_streak', JSON.stringify(checkInStreak));
  }, [checkInStreak]);

  useEffect(() => {
    localStorage.setItem('allkurma_shopeepay', JSON.stringify(shopeePayBalance));
  }, [shopeePayBalance]);

  useEffect(() => {
    localStorage.setItem('allkurma_wishlist', JSON.stringify(wishlistProductIds));
  }, [wishlistProductIds]);

  useEffect(() => {
    localStorage.setItem('allkurma_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('allkurma_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('allkurma_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('allkurma_claimed_vouchers', JSON.stringify(claimedVoucherIds));
  }, [claimedVoucherIds]);

  useEffect(() => {
    localStorage.setItem('allkurma_is_following_store', JSON.stringify(isFollowingStore));
  }, [isFollowingStore]);

  useEffect(() => {
    localStorage.setItem('allkurma_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('allkurma_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('allkurma_stock', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('allkurma_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('allkurma_returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('allkurma_points', JSON.stringify(pointTransactions));
  }, [pointTransactions]);

  useEffect(() => {
    localStorage.setItem('allkurma_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('allkurma_seller_store', JSON.stringify(sellerStore));
  }, [sellerStore]);

  // Sync Store Settings & Staff Whitelist from Firestore on Startup
  useEffect(() => {
    const fetchCloudStoreSettings = async () => {
      try {
        const cloudSettings = await getStoreSettingsFromFirestore();
        if (cloudSettings) {
          setSellerStore(prev => {
            // Merge authorized staff ensuring no duplicates
            const currentStaff = prev.authorizedStaff || [];
            const cloudStaff = cloudSettings.authorizedStaff || [];
            const mergedMap = new Map();
            [...currentStaff, ...cloudStaff].forEach(s => {
              if (s?.email) mergedMap.set(s.email.toLowerCase().trim(), s);
            });

            return {
              ...prev,
              ...cloudSettings,
              authorizedStaff: Array.from(mergedMap.values())
            };
          });
        }
      } catch (err) {
        console.warn('Could not sync store settings from Firestore:', err);
      }
    };

    fetchCloudStoreSettings();
  }, []);

  // Listen to Firebase Auth State changes for secure session persistence
  useEffect(() => {
    const unsubscribe = listenToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser(profile);
          } else {
            // Document might still be creating or default to customer
            setUser(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: firebaseUser.displayName || prev.name,
              email: firebaseUser.email || prev.email,
              avatar: firebaseUser.photoURL || prev.avatar,
              role: 'customer'
            }));
          }
        } catch (err) {
          console.warn('Could not sync user profile from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Modal States & Functions
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'customer_login' | 'customer_register' | 'seller_login'>('customer_login');

  const loginCustomer = (email: string, customName?: string) => {
    const cleanEmail = email.trim();
    const derivedName = customName || (cleanEmail.includes('@') 
      ? cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
      : 'Pelanggan AllKurma');

    setUser({
      id: `cust-${Date.now().toString(36)}`,
      name: derivedName,
      email: cleanEmail,
      phone: '+62 812-9876-5432',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tier: 'Silver',
      rewardPoints: 100,
      totalOrders: 3,
      savedLists: 2,
      annualSpend: 2400000,
      defaultAddressId: 'addr-01'
    });
    showToast(`Selamat datang kembali, ${derivedName}! (Akun Pembeli)`, 'success');
  };

  const registerCustomer = (name: string, email: string, phone: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    setUser({
      id: `cust-${Date.now().toString(36)}`,
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim() || '+62 812-3456-7890',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      tier: 'Bronze',
      rewardPoints: 50,
      totalOrders: 0,
      savedLists: 0,
      annualSpend: 0,
      defaultAddressId: 'addr-01'
    });
    showToast(`Pendaftaran berhasil! Selamat datang di AllKurma, ${cleanName}.`, 'success');
  };

  const loginSeller = (email = 'seller@allkurma.id') => {
    setUser({
      id: 'seller-001',
      name: 'AllKurma Official Store',
      email: email.trim(),
      phone: '+62 811-2345-6789',
      role: 'seller',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
      tier: 'Platinum',
      rewardPoints: 10000,
      totalOrders: 240,
      savedLists: 5,
      annualSpend: 250000000,
      companyName: 'AllKurma Official Store',
      defaultAddressId: 'addr-01'
    });
    showToast('Berhasil masuk ke Toko Seller! Akses penuh diaktifkan.', 'success');
    setCurrentView('seller-dashboard');
  };

  const logout = () => {
    try {
      logoutFirebase();
    } catch (e) {
      console.error(e);
    }
    setUser({
      id: `guest-${Date.now().toString(36)}`,
      name: 'Tamu AllKurma',
      email: 'tamu@allkurma.id',
      phone: '',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      tier: 'Bronze',
      rewardPoints: 0,
      totalOrders: 0,
      savedLists: 0,
      annualSpend: 0
    });
    localStorage.removeItem('allkurma_user');
    setCurrentView('home');
    showToast('Anda telah keluar dari akun', 'info');
  };

  // Role Switching Helper
  const switchRole = (newRole: UserRoleType) => {
    let name = 'Ahmad Fauzi';
    let email = 'ahmad.fauzi@example.com';
    let companyName = 'PT Berkah Pangan Mandiri';
    let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Gold';

    if (newRole === 'customer') {
      name = 'Budi Santoso';
      email = 'budi.santoso@gmail.com';
      companyName = undefined;
      tier = 'Silver';
    } else if (newRole === 'seller') {
      name = 'AllKurma Official Store';
      email = 'seller@allkurma.id';
      companyName = 'AllKurma Official Store';
      tier = 'Platinum';
    } else if (newRole === 'wholesale_partner') {
      name = 'H. Ahmad Jaelani';
      email = 'ahmad.j@berkahgrosir.co.id';
      companyName = 'CV Berkah Grosir Nusantara';
      tier = 'Platinum';
    } else if (newRole === 'warehouse_manager') {
      name = 'Hadi Sutrisno (Logistik)';
      email = 'warehouse.lead@allkurma.enterprise';
      companyName = 'AllKurma Central Hub';
    } else if (newRole === 'sales_rep') {
      name = 'Citra Dewi (Sales Exec)';
      email = 'citra.sales@allkurma.enterprise';
    } else if (newRole === 'marketing_admin') {
      name = 'Rian Pratama (Marketing)';
      email = 'rian.mkt@allkurma.enterprise';
    }

    setUser(prev => ({
      ...prev,
      name,
      email,
      role: newRole,
      companyName,
      tier
    }));

    showToast(`Beralih ke mode akun: ${newRole.replace('_', ' ').toUpperCase()}`, 'info');
  };

  // Products CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now().toString(36)}`;
    const normalizedImages = newProd.images?.map(img => normalizeImageUrl(img)).filter(Boolean) || [];
    const defaultFallbackImg = 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80';
    const finalImages = normalizedImages.length > 0 ? normalizedImages : [defaultFallbackImg];
    const productWithId: Product = {
      ...newProd,
      images: finalImages,
      id
    };
    setProducts(prev => {
      const updated = [productWithId, ...prev];
      localStorage.setItem('allkurma_products', JSON.stringify(updated));
      return updated;
    });
    
    // Notify followers of new product arrival!
    addNotification({
      title: `✨ Produk Baru: ${productWithId.name}`,
      message: `Toko Official AllKurma baru saja merilis produk kurma segar pilihan: ${productWithId.name}. Cek stoknya sekarang!`,
      type: 'promo',
      time: 'Baru saja',
      isRead: false
    });

    showToast(`Produk "${productWithId.name}" berhasil ditambahkan & disiarkan ke pengikut!`, 'success');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    const sanitizedUpdated = { ...updated };
    if (updated.images) {
      sanitizedUpdated.images = updated.images.map(img => normalizeImageUrl(img));
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...sanitizedUpdated } : p));
    showToast('Data produk berhasil diperbarui');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem('allkurma_products', JSON.stringify(filtered));
      return filtered;
    });
    setCart(prev => prev.filter(item => item.product?.id !== id));
    setWishlistProductIds(prev => prev.filter(pId => pId !== id));
    setSelectedProductId(prev => (prev === id ? null : prev));
    showToast('Produk berhasil dihapus dari etalase toko', 'success');
  };

  const clearAllProducts = () => {
    setProducts([]);
    setCart([]);
    setWishlistProductIds([]);
    setSelectedProductId(null);
    localStorage.removeItem('allkurma_products');
    localStorage.removeItem('allkurma_cart');
    showToast('Semua produk katalog telah berhasil dikosongkan', 'success');
  };

  // Cart Management with Variations & Dynamic Wholesale Pricing
  const addToCart = (product: Product, quantity = 1) => {
    addToCartWithVariation(product, product.variations?.[0], quantity);
  };

  const addToCartWithVariation = (product: Product, variation?: ProductVariation, quantity = 1) => {
    setCart(prev => {
      const varId = variation?.id;
      const existing = prev.find(item => item.product.id === product.id && item.selectedVariation?.id === varId);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedVariation?.id === varId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, selectedVariation: variation, quantity }];
      }
    });
    const label = variation ? `${product.name} (${variation.name})` : product.name;
    showToast(`${quantity}x ${label} dimasukkan ke keranjang`);
  };

  const updateCartQuantity = (productId: string, quantity: number, variationId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variationId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        const match = variationId
          ? item.product.id === productId && item.selectedVariation?.id === variationId
          : item.product.id === productId;
        return match ? { ...item, quantity } : item;
      })
    );
  };

  const removeFromCart = (productId: string, variationId?: string) => {
    setCart(prev =>
      prev.filter(item => {
        if (variationId) {
          return !(item.product.id === productId && item.selectedVariation?.id === variationId);
        }
        return item.product.id !== productId;
      })
    );
    showToast('Item dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    setUseCoinsInCheckout(false);
  };

  // Calculate Wholesale Discounts, Coins, & Totals
  const calculateCartTotals = () => {
    let subtotal = 0;
    let originalRegularTotal = 0;
    let wholesaleDiscount = 0;
    let totalItems = 0;

    cart.forEach(item => {
      const varPrice = item.selectedVariation
        ? (item.selectedVariation.discountPrice || item.selectedVariation.regularPrice)
        : (item.product.discountPrice || item.product.regularPrice);
      const regularPrice = item.selectedVariation?.regularPrice || item.product.regularPrice;

      originalRegularTotal += regularPrice * item.quantity;
      const regularLineTotal = varPrice * item.quantity;
      subtotal += regularLineTotal;
      totalItems += item.quantity;

      // Check item-level wholesale tier rules
      if (item.product.wholesalePrices && item.product.wholesalePrices.length > 0) {
        const matchedTier = item.product.wholesalePrices.find(
          rule => item.quantity >= rule.minQty && (!rule.maxQty || item.quantity <= rule.maxQty)
        );
        if (matchedTier && matchedTier.pricePerUnit < varPrice) {
          const discountPerUnit = varPrice - matchedTier.pricePerUnit;
          wholesaleDiscount += discountPerUnit * item.quantity;
        }
      }
    });

    // Check user B2B tier discount (if wholesale user)
    if (user.role === 'wholesale_partner' && wholesaleDiscount === 0) {
      const tierObj = WHOLESALE_TIERS.find(t => t.name === user.tier);
      if (tierObj) {
        wholesaleDiscount = subtotal * (tierObj.discountPercent / 100);
      }
    }

    let voucherDiscount = 0;
    if (appliedVoucher) {
      if (appliedVoucher.discountType === 'percentage') {
        voucherDiscount = (subtotal - wholesaleDiscount) * (appliedVoucher.discountValue / 100);
        if (appliedVoucher.maxDiscountCap && voucherDiscount > appliedVoucher.maxDiscountCap) {
          voucherDiscount = appliedVoucher.maxDiscountCap;
        }
      } else {
        voucherDiscount = appliedVoucher.discountValue;
      }
    }

    // Shopee Coins calculation: 1 coin = Rp 1, max 25% of net purchase or available coins
    const maxCoinDeductible = Math.min(shopeeCoins, Math.floor((subtotal - wholesaleDiscount - voucherDiscount) * 0.25));
    const coinsDiscount = useCoinsInCheckout ? Math.max(0, maxCoinDeductible) : 0;

    const shippingCost = subtotal > 500000 || user.tier === 'Platinum' ? 0 : 20000;
    const tax = 0;
    const total = Math.max(0, subtotal - wholesaleDiscount - voucherDiscount - coinsDiscount + shippingCost + tax);
    const totalSavings = (originalRegularTotal - subtotal) + wholesaleDiscount + voucherDiscount + coinsDiscount;

    return {
      subtotal,
      wholesaleDiscount,
      voucherDiscount,
      coinsDiscount,
      shippingCost,
      tax,
      total,
      totalItems,
      totalSavings
    };
  };

  const cartTotals = calculateCartTotals();
  const coinsDeduction = cartTotals.coinsDiscount;

  // Voucher validation
  const applyVoucher = (code: string): boolean => {
    const found = promotions.find(p => p.code.toUpperCase() === code.trim().toUpperCase() && p.status === 'Active');
    if (!found) {
      showToast('Kode voucher tidak valid atau telah kedaluwarsa', 'error');
      return false;
    }
    if (cartTotals.subtotal < found.minPurchase) {
      showToast(`Minimal belanja Rp ${found.minPurchase.toLocaleString('id-ID')} untuk menggunakan voucher ini`, 'error');
      return false;
    }
    setAppliedVoucher(found);
    showToast(`Voucher ${found.code} berhasil dipasang!`, 'success');
    return true;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('Voucher dihapus', 'info');
  };

  // Orders Management
  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `INV/${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}/${user.role === 'wholesale_partner' ? 'WS' : 'MPL'}/${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

    const newOrder: Order = {
      id: `ord-${Date.now().toString(36)}`,
      orderNumber: orderNum,
      createdAt: dateStr,
      customerId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      customerType: user.role === 'wholesale_partner' ? 'Wholesale' : 'Retail',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        image: item.product.images[0],
        unitPrice: item.product.discountPrice || item.product.regularPrice,
        quantity: item.quantity,
        lineTotal: (item.product.discountPrice || item.product.regularPrice) * item.quantity
      })),
      subtotal: cartTotals.subtotal,
      wholesaleDiscount: cartTotals.wholesaleDiscount,
      voucherDiscount: cartTotals.voucherDiscount,
      voucherCode: appliedVoucher?.code,
      shippingCost: cartTotals.shippingCost,
      tax: cartTotals.tax,
      total: cartTotals.total,
      status: 'Diproses',
      paymentMethod: orderData.paymentMethod || 'Virtual Account BCA',
      paymentStatus: 'Paid',
      shippingAddress: orderData.shippingAddress || defaultAddr,
      courierName: orderData.courierName || 'JNE Regular',
      trackingNumber: `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      notes: orderData.notes,
      poNumber: orderData.poNumber,
      appliedTier: user.tier ? `${user.tier} Partner` : undefined,
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    
    // Award loyalty points (1 point per Rp 10,000)
    const pointsEarned = Math.floor(newOrder.total / 10000);
    if (pointsEarned > 0) {
      setUser(prev => ({
        ...prev,
        rewardPoints: prev.rewardPoints + pointsEarned,
        totalOrders: prev.totalOrders + 1,
        annualSpend: prev.annualSpend + newOrder.total
      }));
      setPointTransactions(prev => [
        {
          id: `pt-${Date.now().toString(36)}`,
          date: 'Hari Ini',
          title: `Purchase - Order #${newOrder.orderNumber}`,
          type: 'earned',
          points: pointsEarned,
          description: `Poin dari pembayaran order #${newOrder.orderNumber}`,
          referenceId: newOrder.id
        },
        ...prev
      ]);
    }

    // Deduct stock
    setProducts(prev =>
      prev.map(p => {
        const item = newOrder.items.find(i => i.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity), soldCount: p.soldCount + item.quantity };
        }
        return p;
      })
    );

    // If B2B Net Terms, also generate wholesale invoice
    if (newOrder.paymentMethod.includes('Net 30') || newOrder.paymentMethod.includes('Wholesale Billing')) {
      const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      setInvoices(prev => [
        {
          id: `inv-${Date.now().toString(36)}`,
          invoiceNumber: invNumber,
          orderNumber: newOrder.orderNumber,
          dateIssued: 'Hari Ini',
          dueDate: `${dueDate.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][dueDate.getMonth()]} ${dueDate.getFullYear()}`,
          amount: newOrder.total,
          status: 'Unpaid',
          companyName: user.companyName || user.name,
          itemsSummary: newOrder.items.map(i => `${i.productName} (${i.quantity}x)`).join(', ')
        },
        ...prev
      ]);
    }

    clearCart();
    
    // Trigger confetti celebration!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`Pesanan #${newOrder.orderNumber} berhasil dibuat!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Status pesanan diperbarui menjadi: ${status}`);
  };

  // Addresses CRUD
  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now().toString(36)}`;
    const fullAddr: Address = { ...newAddr, id };
    if (fullAddr.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(fullAddr));
    } else {
      setAddresses(prev => [...prev, fullAddr]);
    }
    showToast('Alamat baru berhasil disimpan');
  };

  const updateAddress = (id: string, updated: Partial<Address>) => {
    setAddresses(prev =>
      prev.map(a => {
        if (a.id === id) {
          return { ...a, ...updated };
        }
        if (updated.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
    showToast('Alamat berhasil diperbarui');
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Alamat telah dihapus', 'info');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast('Alamat utama berhasil diubah');
  };

  // Stock Movement Logging
  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const dateStr = 'Hari Ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const newEntry: StockMovement = {
      ...movement,
      id: `mov-${Date.now().toString(36)}`,
      date: dateStr
    };
    setStockMovements(prev => [newEntry, ...prev]);

    // Update product stock in catalog
    const product = products.find(p => p.sku === movement.sku || p.name === movement.productName);
    if (product) {
      updateProduct(product.id, {
        stock: Math.max(0, product.stock + movement.quantityChange)
      });
    }
    showToast(`Pencatatan pergerakan stok "${movement.productName}" berhasil!`);
  };

  // Promotions Management
  const createPromotion = (promo: Omit<PromotionVoucher, 'id' | 'usedCount'>) => {
    const newPromo: PromotionVoucher = {
      ...promo,
      id: `promo-${Date.now().toString(36)}`,
      usedCount: 0
    };
    setPromotions(prev => [newPromo, ...prev]);

    // Broadcast to followers
    addNotification({
      title: `🔥 Promo Baru: ${newPromo.name}`,
      message: `Gunakan kode [${newPromo.code}] untuk mendapatkan diskon ${newPromo.discountValue}${newPromo.discountType === 'percentage' ? '%' : ' Rupiah'}. Berlaku s/d ${newPromo.endDate}.`,
      type: 'promo',
      time: 'Baru saja',
      isRead: false
    });

    showToast(`Promo voucher ${newPromo.code} berhasil diterbitkan & disiarkan ke pengikut!`, 'success');
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Expired' : 'Active';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
    showToast('Status promosi berhasil diubah');
  };

  // Rewards & Loyalty
  const redeemReward = (reward: RewardItem): boolean => {
    if (user.rewardPoints < reward.pointsCost) {
      showToast(`Poin Anda (${user.rewardPoints} Pts) tidak mencukupi untuk menukar hadiah ini (${reward.pointsCost} Pts)`, 'error');
      return false;
    }

    setUser(prev => ({
      ...prev,
      rewardPoints: prev.rewardPoints - reward.pointsCost
    }));

    setPointTransactions(prev => [
      {
        id: `pt-${Date.now().toString(36)}`,
        date: 'Hari Ini',
        title: `Redemption - ${reward.title}`,
        type: 'redeemed',
        points: reward.pointsCost,
        description: `Penukaran reward poin untuk ${reward.title}`
      },
      ...prev
    ]);

    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    showToast(`Selamat! Penukaran "${reward.title}" berhasil!`, 'success');
    return true;
  };

  // Wholesale Invoices
  const payInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    showToast('Tagihan invoice telah berhasil dibayarkan / diselesaikan!');
  };

  // RMA Returns
  const createReturnRequest = (req: Omit<ReturnRequest, 'id' | 'returnCode' | 'createdAt' | 'status'>) => {
    const code = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReturn: ReturnRequest = {
      ...req,
      id: `rma-${Date.now().toString(36)}`,
      returnCode: code,
      createdAt: 'Hari Ini',
      status: 'Pending Review'
    };
    setReturns(prev => [newReturn, ...prev]);
    showToast(`Pengajuan retur #${code} berhasil dikirim untuk diinspeksi`);
  };

  const updateReturnStatus = (
    id: string,
    status: ReturnRequest['status'],
    notes?: string,
    adjustedCredit?: number,
    resolution?: ReturnRequest['resolutionStatus']
  ) => {
    setReturns(prev =>
      prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            status,
            inspectionNotes: notes ?? r.inspectionNotes,
            creditAdjusted: adjustedCredit ?? r.creditAdjusted,
            resolutionStatus: resolution ?? r.resolutionStatus
          };
        }
        return r;
      })
    );
    showToast(`Status retur diperbarui: ${status}`);
  };

  // Roles & RBAC
  const updateRolePermissions = (id: string, permissions: RolePermission['permissions']) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, permissions } : r));
    showToast('Hak akses modul role berhasil disimpan');
  };

  // Shopee Gamification & Coins
  const claimDailyCoin = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCheckInDate === today) {
      showToast('Anda sudah check-in hari ini. Kembali lagi besok ya!', 'info');
      return false;
    }
    const nextStreak = checkInStreak >= 7 ? 1 : checkInStreak + 1;
    const coinsWon = nextStreak === 7 ? 1000 : nextStreak * 150;

    setShopeeCoins(prev => prev + coinsWon);
    setCheckInStreak(nextStreak);
    setLastCheckInDate(today);
    localStorage.setItem('allkurma_last_checkin', today);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    showToast(`Berhasil check-in Hari ke-${nextStreak}! +${coinsWon} Koin AllKurma ditambahkan!`, 'success');
    return true;
  };

  const spinWheel = (): { prizeName: string; coins?: number; voucherCode?: string } => {
    const prizes = [
      { prizeName: '500 Koin AllKurma', coins: 500 },
      { prizeName: 'Voucher Diskon Rp 30.000', voucherCode: 'KURMA30K' },
      { prizeName: '1.000 Koin AllKurma', coins: 1000 },
      { prizeName: 'Gratis Ongkir XTRA', voucherCode: 'ONGKIR0' },
      { prizeName: '2.500 Koin AllKurma', coins: 2500 },
      { prizeName: 'Voucher Cashback 50%', voucherCode: 'CASHBACK50' }
    ];
    const picked = prizes[Math.floor(Math.random() * prizes.length)];
    if (picked.coins) {
      setShopeeCoins(prev => prev + picked.coins!);
    }
    if (picked.voucherCode && !claimedVoucherIds.includes(picked.voucherCode)) {
      setClaimedVoucherIds(prev => [...prev, picked.voucherCode!]);
    }
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {}
    showToast(`Hore! Anda mendapatkan: ${picked.prizeName}!`, 'success');
    return picked;
  };

  const waterCoinPlant = (): { success: boolean; harvested: boolean } => {
    let harvested = false;
    setPlantCoinLevel(prev => {
      const nextLevel = prev + 25;
      if (nextLevel >= 100) {
        harvested = true;
        setShopeeCoins(c => c + 500);
        showToast('Pohon Koin Panen! +500 Koin AllKurma masuk ke saldo Anda!', 'success');
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.5 }
          });
        } catch {}
        return 0;
      } else {
        showToast(`Pohon koin disiram (+25%). Pertumbuhan: ${nextLevel}%`, 'info');
        return nextLevel;
      }
    });
    return { success: true, harvested };
  };

  // KurmaPay / Dompet Top Up
  const topUpKurmaPay = (amount: number) => {
    setShopeePayBalance(prev => prev + amount);
    showToast(`Top Up Saldo KurmaPay sebesar Rp ${amount.toLocaleString('id-ID')} berhasil!`, 'success');
  };

  const topUpShopeePay = topUpKurmaPay;

  // Seller Store Actions
  const updateSellerStore = (updates: Partial<SellerStoreProfile>) => {
    setSellerStore(prev => {
      const updated = { ...prev, ...updates };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast('Pengaturan Toko berhasil diperbarui!', 'success');
  };

  const withdrawSellerBalance = (amount: number): boolean => {
    if (amount <= 0 || amount > sellerStore.payoutBalance) {
      showToast('Nominal penarikan tidak valid atau melebihi saldo!', 'error');
      return false;
    }
    setSellerStore(prev => {
      const updated = { ...prev, payoutBalance: prev.payoutBalance - amount };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast(`Penarikan dana Rp ${amount.toLocaleString('id-ID')} ke rekening ${sellerStore.bankAccount.bankName} berhasil diajukan!`, 'success');
    return true;
  };

  const toggleSellerCourier = (courierId: string) => {
    setSellerStore(prev => {
      const updated = {
        ...prev,
        couriers: prev.couriers.map(c => c.id === courierId ? { ...c, active: !c.active } : c)
      };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast('Pengaturan ekspedisi toko berhasil diperbarui', 'info');
  };

  const replySellerReview = (reviewId: string, replyText: string) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, sellerReply: replyText } : r)
    );
    showToast('Balasan ulasan toko berhasil dikirim ke pembeli!', 'success');
  };

  const addSellerStaff = (staffData: Omit<SellerStaffMember, 'id' | 'addedAt'>) => {
    const cleanEmail = staffData.email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Harap masukkan email staf yang valid!', 'error');
      return;
    }
    const currentStaff = sellerStore.authorizedStaff || [];
    if (currentStaff.some(s => s.email.trim().toLowerCase() === cleanEmail)) {
      showToast(`Email ${cleanEmail} sudah ada di daftar staf!`, 'error');
      return;
    }

    const newStaff: SellerStaffMember = {
      ...staffData,
      id: `staff-${Date.now().toString(36)}`,
      email: cleanEmail,
      addedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setSellerStore(prev => {
      const updated = {
        ...prev,
        authorizedStaff: [...(prev.authorizedStaff || []), newStaff]
      };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast(`Staf "${staffData.name}" (${cleanEmail}) berhasil ditambahkan ke daftar akses seller!`, 'success');
  };

  const removeSellerStaff = (id: string) => {
    setSellerStore(prev => {
      const updated = {
        ...prev,
        authorizedStaff: (prev.authorizedStaff || []).filter(s => s.id !== id)
      };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast('Akses staf berhasil dicabut dari sistem.', 'info');
  };

  const toggleSellerStaffStatus = (id: string) => {
    setSellerStore(prev => {
      const updated = {
        ...prev,
        authorizedStaff: (prev.authorizedStaff || []).map(s => 
          s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
        )
      };
      saveStoreSettingsToFirestore(updated);
      return updated;
    });
    showToast('Status izin akses staf berhasil diperbarui.', 'info');
  };

  const isEmailAuthorizedSeller = (emailToTest: string): boolean => {
    if (!emailToTest) return false;
    const clean = emailToTest.trim().toLowerCase();
    
    // 1. Primary Owner Account
    if (clean === 'atdigitalstudio2026@gmail.com') return true;

    // 2. Verified Active Staff List (Direct Whitelist)
    if (clean === 'havidh.saputra@gmail.com') return true;
    
    // 3. Default AllKurma internal domain accounts
    if (clean === 'admin@allkurma.id' || clean === 'seller@allkurma.id' || clean === 'operasional@allkurma.id' || clean === 'management@allkurma.id') return true;
    
    // 4. Registered staff whitelist inside sellerStore
    const staff = sellerStore?.authorizedStaff || [];
    if (staff.some(s => s.email.trim().toLowerCase() === clean && s.status === 'active')) return true;

    // 5. Initial store fallback
    const initStaff = INITIAL_SELLER_STORE.authorizedStaff || [];
    return initStaff.some(s => s.email.trim().toLowerCase() === clean && s.status === 'active');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistProductIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Produk dihapus dari Wishlist / Favorit', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Produk ditambahkan ke Favorit Saya ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  // Reviews
  const addReview = (newReview: Omit<CustomerReview, 'id' | 'createdAt' | 'helpfulCount'>) => {
    const id = `rev-${Date.now().toString(36)}`;
    const fullReview: CustomerReview = {
      ...newReview,
      id,
      createdAt: 'Baru saja',
      helpfulCount: 0
    };
    setReviews(prev => [fullReview, ...prev]);
    // Bonus 25 points for writing a review
    setShopeeCoins(prev => prev + 25);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
    showToast('Ulasan Anda berhasil dikirim! +25 Poin Kurma diterima.', 'success');
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
    );
    showToast('Terima kasih atas tanggapan Anda!', 'info');
  };

  // Live Chat
  const sendChatMessage = (text: string, productCard?: ChatMessage['productCard']) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      productCard
    };
    setChatMessages(prev => [...prev, userMsg]);

    // Simulated auto-reply from seller
    setTimeout(() => {
      let replyText = 'Halo Kak! Terima kasih sudah menghubungi Toko Official AllKurma. Pesanan siap diproses dan dikirim hari ini ya Kak! 😊';
      if (text.toLowerCase().includes('stok') || text.toLowerCase().includes('ready')) {
        replyText = 'Halo Kak! Stok produk kami selalu fresh import langsung dari Madinah dan Timur Tengah, siap kirim hari ini ya!';
      } else if (text.toLowerCase().includes('diskon') || text.toLowerCase().includes('voucher') || text.toLowerCase().includes('ongkir')) {
        replyText = 'Bisa klaim voucher Gratis Ongkir XTRA dan Diskon Toko di halaman promo atau langsung saat checkout ya Kak!';
      } else if (text.toLowerCase().includes('kadaluarsa') || text.toLowerCase().includes('exp')) {
        replyText = 'Semua kurma kami masa kadaluarsa (EXP Date) panjang hingga akhir 2027 dengan penyimpanan cold storage higienis kak.';
      }

      const botMsg: ChatMessage = {
        id: `msg-${Date.now().toString(36)}`,
        sender: 'seller',
        text: replyText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  // Notifications
  const addNotification = (notifData: Omit<AppNotification, 'id'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      time: notifData.time || 'Baru saja',
      isRead: notifData.isRead ?? false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotifAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Semua notifikasi ditandai sudah dibaca', 'info');
  };

  // Follow Store Actions
  const toggleFollowStore = () => {
    const nextState = !isFollowingStore;
    setIsFollowingStore(nextState);

    // Update store follower count
    setSellerStore(prev => ({
      ...prev,
      followerCount: Math.max(0, (prev.followerCount || 24850) + (nextState ? 1 : -1))
    }));

    if (nextState) {
      // Confetti & reward voucher
      try {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
      } catch {}

      // Auto claim follower voucher
      if (!claimedVoucherIds.includes('FOLLOWER15')) {
        setClaimedVoucherIds(prev => [...prev, 'FOLLOWER15']);
      }

      // Add push notification for follower
      addNotification({
        title: '🎉 Selamat! Voucher Diskon 15% Spesial Follower',
        message: 'Terima kasih telah mengikuti AllKurma Official Store! Anda berhak mendapatkan Diskon 15% (Kode: FOLLOWER15) & prioritas info flash sale panen kurma baru.',
        type: 'promo',
        time: 'Baru saja',
        isRead: false
      });

      showToast('🎉 Berhasil mengikuti AllKurma Official Store! Voucher diskon 15% & notifikasi promo aktif.', 'success');
    } else {
      showToast('Anda telah berhenti mengikuti toko ini.', 'info');
    }
  };

  // Broadcast to followers (from Seller or Admin)
  const broadcastToFollowers = (title: string, message: string, promoCode?: string) => {
    addNotification({
      title: `📢 ${title}`,
      message: message + (promoCode ? ` Gunakan kode voucher: ${promoCode}` : ''),
      type: 'promo',
      time: 'Baru saja',
      isRead: false
    });
    if (promoCode && !claimedVoucherIds.includes(promoCode)) {
      setClaimedVoucherIds(prev => [...prev, promoCode]);
    }
    showToast(`📢 Notifikasi promo berhasil disiarkan ke ${((sellerStore.followerCount || 24850)).toLocaleString('id-ID')} pengikut toko!`, 'success');
  };

  // Claim Vouchers
  const claimVoucher = (voucherCode: string) => {
    if (!claimedVoucherIds.includes(voucherCode)) {
      setClaimedVoucherIds(prev => [...prev, voucherCode]);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
      showToast(`Voucher ${voucherCode} berhasil diklaim ke dompet voucher!`, 'success');
    } else {
      showToast('Voucher sudah pernah diklaim', 'info');
    }
  };

  const claimAllVouchers = () => {
    const allCodes = promotions.map(p => p.code).concat(['ONGKIR0', 'CASHBACK50', 'KURMA30K', 'GROSIR100K']);
    setClaimedVoucherIds(Array.from(new Set([...claimedVoucherIds, ...allCodes])));
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {}
    showToast('Semua voucher promo & gratis ongkir berhasil diklaim!', 'success');
  };

  // Settings
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Pengaturan sistem berhasil disimpan');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        user,
        setUser,
        switchRole,
        tiers: WHOLESALE_TIERS,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        cart,
        addToCart,
        addToCartWithVariation,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        useCoinsInCheckout,
        setUseCoinsInCheckout,
        coinsDeduction,
        cartTotals,
        orders,
        createOrder,
        updateOrderStatus,
        selectedOrderId,
        setSelectedOrderId,
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        stockMovements,
        addStockMovement,
        promotions,
        createPromotion,
        togglePromotionStatus,
        rewards,
        pointTransactions,
        redeemReward,
        invoices,
        payInvoice,
        returns,
        createReturnRequest,
        updateReturnStatus,
        selectedReturnId,
        setSelectedReturnId,
        roles,
        updateRolePermissions,
        settings,
        updateSettings,
        // Auth & Role
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginCustomer,
        registerCustomer,
        loginSeller,
        logout,
        toasts,
        showToast,
        removeToast,
        isQuickOrderOpen,
        setIsQuickOrderOpen,
        // Kurma Customer Points & Features
        kurmaPoints: shopeeCoins,
        shopeeCoins,
        checkInStreak,
        lastCheckInDate,
        claimDailyCoin,
        spinWheel,
        plantCoinLevel,
        waterCoinPlant,
        kurmaPayBalance: shopeePayBalance,
        shopeePayBalance,
        topUpKurmaPay,
        topUpShopeePay,
        payLaterLimit: spayLaterLimit,
        spayLaterLimit,
        payLaterUsed: spayLaterUsed,
        spayLaterUsed,
        wishlistProductIds,
        toggleWishlist,
        reviews,
        addReview,
        markReviewHelpful,
        chatMessages,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,
        notifications,
        isNotifOpen,
        setIsNotifOpen,
        markNotifAsRead,
        markAllNotifsRead,
        unreadNotifCount: notifications.filter(n => !n.isRead).length,
        addNotification,
        // Follow Store
        isFollowingStore,
        toggleFollowStore,
        broadcastToFollowers,
        // Seller Store Management
        sellerStore,
        updateSellerStore,
        withdrawSellerBalance,
        toggleSellerCourier,
        replySellerReview,
        addSellerStaff,
        removeSellerStaff,
        toggleSellerStaffStatus,
        isEmailAuthorizedSeller,
        claimedVoucherIds,
        claimVoucher,
        claimAllVouchers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
