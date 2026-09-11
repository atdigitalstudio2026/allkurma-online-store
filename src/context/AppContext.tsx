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
  ShopeeNotification,
  AppHeroBanner,
  CategoryItem,
  BundleDeal
} from '../types';
import {
  INITIAL_USER,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
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
  INITIAL_SELLER_STORE,
  INITIAL_HERO_BANNERS,
  INITIAL_BUNDLE_DEALS
} from '../data/mockData';
import { normalizeImageUrl } from '../utils/imageUrlHelper';
import { listenToAuthState, logoutFirebase } from '../firebase/auth';
import { 
  getUserProfile, 
  getStoreSettingsFromFirestore, 
  saveStoreSettingsToFirestore,
  listenToStoreSettingsFromFirestore,
  listenToProductsFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  listenToCategoriesFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  listenToAllOrdersFromFirestore,
  listenToReturnsFromFirestore,
  saveReturnToFirestore,
  updateReturnStatusInFirestore,
  listenToAllChatMessagesFromFirestore,
  saveChatMessageToFirestore,
  listenToBundleDealsFromFirestore,
  saveBundleDealToFirestore,
  deleteBundleDealFromFirestore
} from '../firebase/db';
import { generateAiChatResponse } from '../services/aiChatService';
import { OFFICIAL_SRA_LOGO_URL } from '../components/common/SRALogo';

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
  | 'shopee-coins'
  | 'shopee-wallet'
  | 'kurma-points'
  | 'loyalty-rewards'
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
  isProductsLoading: boolean;
  isFirebaseConnected: boolean;
  getProductShareUrl: (productId: string) => string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearAllProducts: () => void;

  // Flexible Categories Management
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'> & { id?: string }) => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
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
  updateOrderStatus: (orderId: string, status: Order['status'], extraData?: Partial<Order>) => void;
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
  spinWheel: () => { prize: string; prizeName?: string; coins?: number; voucher?: string; voucherCode?: string };
  plantCoinLevel: number;
  waterCoinPlant: () => { gainedCoins: number; isHarvest: boolean; success?: boolean; harvested?: boolean };
  
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
  sendSellerChatMessage: (text: string, customerId?: string) => void;
  chatMode: 'ai_assistant' | 'live_seller';
  setChatMode: (mode: 'ai_assistant' | 'live_seller') => void;
  handoverToSeller: () => void;
  handoverToAi: () => void;
  isAiTyping: boolean;
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

  // Banner Management (Hero Carousels & Promos)
  heroBanners: AppHeroBanner[];
  addHeroBanner: (banner: Omit<AppHeroBanner, 'id'>) => void;
  updateHeroBanner: (id: string | number, updates: Partial<AppHeroBanner>) => void;
  deleteHeroBanner: (id: string | number) => void;
  resetHeroBanners: () => void;

  // Bundling Promo Deals Management
  bundlingDeals: BundleDeal[];
  addBundleDeal: (deal: Omit<BundleDeal, 'id'>) => void;
  updateBundleDeal: (id: string, updates: Partial<BundleDeal>) => void;
  deleteBundleDeal: (id: string) => void;
  toggleBundleDealActive: (id: string) => void;
  resetBundleDeals: () => void;
  
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

const getInitialNavState = (): { view: AppView; productId: string | null } => {
  if (typeof window === 'undefined') return { view: 'home', productId: null };
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const prodId = searchParams.get('productId') || searchParams.get('product') || searchParams.get('id');
    const viewParam = searchParams.get('view') as AppView;

    // Check hash fallback (e.g. #product=prod-123 or #/product/prod-123)
    let hashProdId: string | null = null;
    if (window.location.hash) {
      const match = window.location.hash.match(/(?:product|prod)[=/]([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        hashProdId = match[1];
      }
    }

    const effectiveProdId = prodId || hashProdId;
    if (effectiveProdId) {
      return { view: 'product-detail', productId: effectiveProdId };
    }
    if (viewParam) {
      return { view: viewParam, productId: null };
    }
  } catch (e) {
    console.warn('Failed reading initial URL params:', e);
  }
  return { view: 'home', productId: null };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Deep Linking State from URL
  const initialNav = getInitialNavState();
  const [currentView, setCurrentView] = useState<AppView>(initialNav.view);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialNav.productId);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('allkurma_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return false;
      }
    } catch {}
    return true;
  });
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
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

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('allkurma_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure any legacy simulation/placeholder links are updated to authentic kurma photos
          return parsed.map((cat: CategoryItem) => {
            if (cat.image && (
              cat.image.includes('photo-1586528116311-ad8dd3c8310d') || 
              cat.image.includes('photo-1549465220-1a8b9238cd48') || 
              cat.image.includes('photo-1587049352846-4a222e784d38') || 
              cat.image.includes('photo-1546548970-71785318a17b') ||
              cat.image.includes('photo-1543362906-acfc16c67564')
            )) {
              return {
                ...cat,
                image: cat.id === 'Grosir'
                  ? 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=160&auto=format&fit=crop&q=80'
                  : cat.id === 'Madu'
                  ? 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=160&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=160&auto=format&fit=crop&q=80'
              };
            }
            return cat;
          });
        }
      } catch (e) {
        console.error('Failed to parse allkurma_categories:', e);
      }
    }
    return INITIAL_CATEGORIES;
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
  const [chatMode, setChatMode] = useState<'ai_assistant' | 'live_seller'>(() => {
    const saved = localStorage.getItem('allkurma_chat_mode');
    return (saved as 'ai_assistant' | 'live_seller') || 'ai_assistant';
  });
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Seller Store State
  const [sellerStore, setSellerStore] = useState<SellerStoreProfile>(() => {
    const saved = localStorage.getItem('allkurma_seller_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If banner was the old pitch-black unsplash photo, update to bright golden harvest banner
        if (parsed.banner && parsed.banner.includes('photo-1509358271058-acd22cc93898')) {
          parsed.banner = 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=1200&h=600&fit=crop&q=80';
        }
        return parsed;
      } catch (e) {
        return INITIAL_SELLER_STORE;
      }
    }
    return INITIAL_SELLER_STORE;
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

  // Hero Promo Banners (Carousel Beranda & Promosi Toko)
  const [heroBanners, setHeroBanners] = useState<AppHeroBanner[]>(() => {
    const saved = localStorage.getItem('allkurma_hero_banners_v1');
    return saved ? JSON.parse(saved) : INITIAL_HERO_BANNERS;
  });

  // Bundling Deals State (Promo Bundling Paket Hemat)
  const [bundlingDeals, setBundlingDeals] = useState<BundleDeal[]>(() => {
    const saved = localStorage.getItem('allkurma_bundle_deals_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse allkurma_bundle_deals_v1:', e);
      }
    }
    return INITIAL_BUNDLE_DEALS;
  });

  useEffect(() => {
    localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(bundlingDeals));
  }, [bundlingDeals]);

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

  useEffect(() => {
    localStorage.setItem('allkurma_hero_banners_v1', JSON.stringify(heroBanners));
  }, [heroBanners]);

  // Deep Linking: Synchronize URL query parameters when viewing a product or changing view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const currentUrl = new URL(window.location.href);
      const urlProdId = currentUrl.searchParams.get('productId') || currentUrl.searchParams.get('product');

      if (currentView === 'product-detail' && selectedProductId) {
        if (urlProdId !== selectedProductId) {
          currentUrl.searchParams.set('productId', selectedProductId);
          currentUrl.searchParams.delete('product');
          currentUrl.searchParams.delete('id');
          window.history.pushState({ view: 'product-detail', productId: selectedProductId }, '', currentUrl.toString());
        }
      } else {
        if (urlProdId) {
          currentUrl.searchParams.delete('productId');
          currentUrl.searchParams.delete('product');
          currentUrl.searchParams.delete('id');
          window.history.pushState({ view: currentView }, '', currentUrl.toString());
        }
      }
    } catch (e) {
      console.warn('URL sync error:', e);
    }
  }, [currentView, selectedProductId]);

  // Browser Navigation: Listen to popstate (Back / Forward)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const prodId = searchParams.get('productId') || searchParams.get('product') || searchParams.get('id');
        if (prodId) {
          setSelectedProductId(prodId);
          setCurrentView('product-detail');
        } else {
          const viewParam = searchParams.get('view') as AppView;
          if (viewParam) {
            setCurrentView(viewParam);
          } else {
            setCurrentView(prev => (prev === 'product-detail' ? 'catalog' : prev));
          }
          setSelectedProductId(null);
        }
      } catch (e) {
        console.warn('PopState error:', e);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to generate full shareable product link
  const getProductShareUrl = (productId: string): string => {
    if (typeof window === 'undefined') return '';
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('productId', productId);
      return url.toString();
    } catch {
      return `${window.location.origin}/?productId=${productId}`;
    }
  };

  // Real-time synchronization of products across all devices using Firestore
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToProductsFromFirestore(
      async (cloudProducts) => {
        if (!isSubscribed) return;
        setIsFirebaseConnected(true);
        setIsProductsLoading(false);

        // Check if there are local products created on this machine that were not synced yet
        const saved = localStorage.getItem('allkurma_products');
        const deletedIdsStr = localStorage.getItem('allkurma_deleted_ids');
        const deletedIds = new Set<string>(deletedIdsStr ? JSON.parse(deletedIdsStr) : []);

        let localProducts: Product[] = [];
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              localProducts = parsed.filter(
                (p: Product) => p?.id && !deletedIds.has(p.id) && !/^prod-0[1-9]$/.test(p.id)
              );
            }
          } catch (e) {
            console.warn('Failed parsing local products for sync check:', e);
          }
        }

        const cloudIdSet = new Set((cloudProducts || []).map(p => p.id));
        const unsyncedLocals = localProducts.filter(p => !cloudIdSet.has(p.id));

        if (unsyncedLocals.length > 0) {
          console.log('[Firestore] Synchronizing local products to cloud server...', unsyncedLocals.length);
          for (const item of unsyncedLocals) {
            try {
              await saveProductToFirestore(item);
            } catch (err) {
              console.warn('Auto sync of local product failed:', item.id, err);
            }
          }
          // Merge local and cloud products so user sees their product immediately
          const combined = [...unsyncedLocals, ...(cloudProducts || [])];
          setProducts(combined);
          localStorage.setItem('allkurma_products', JSON.stringify(combined));
        } else {
          setProducts(cloudProducts || []);
          localStorage.setItem('allkurma_products', JSON.stringify(cloudProducts || []));
        }
      },
      (err) => {
        console.warn('Firestore products listener warning:', err);
        setIsProductsLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization of store settings & staff whitelist across devices
  useEffect(() => {
    const unsubscribe = listenToStoreSettingsFromFirestore((cloudSettings) => {
      if (cloudSettings) {
        setSellerStore(prev => {
          const currentStaff = prev.authorizedStaff || [];
          const cloudStaff = cloudSettings.authorizedStaff || [];
          const mergedMap = new Map();
          [...currentStaff, ...cloudStaff].forEach(s => {
            if (s?.email) mergedMap.set(s.email.toLowerCase().trim(), s);
          });

          return {
            ...prev,
            ...cloudSettings,
            logo: cloudSettings.logo || prev.logo || OFFICIAL_SRA_LOGO_URL,
            authorizedStaff: Array.from(mergedMap.values())
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization of product categories across all devices using Firestore
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToCategoriesFromFirestore(
      async (cloudCategories) => {
        if (!isSubscribed) return;
        if (!cloudCategories || cloudCategories.length === 0) {
          // If Firestore categories collection is empty, seed with INITIAL_CATEGORIES
          try {
            for (const cat of INITIAL_CATEGORIES) {
              await saveCategoryToFirestore(cat);
            }
          } catch (e) {
            console.warn('Initial categories seed error:', e);
          }
        } else {
          const sanitizedCategories = cloudCategories.map((cat: CategoryItem) => {
            if (cat.image && (
              cat.image.includes('photo-1586528116311-ad8dd3c8310d') || 
              cat.image.includes('photo-1549465220-1a8b9238cd48') || 
              cat.image.includes('photo-1587049352846-4a222e784d38') || 
              cat.image.includes('photo-1546548970-71785318a17b') ||
              cat.image.includes('photo-1543362906-acfc16c67564')
            )) {
              return {
                ...cat,
                image: cat.id === 'Grosir'
                  ? 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=160&auto=format&fit=crop&q=80'
                  : cat.id === 'Madu'
                  ? 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=160&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=160&auto=format&fit=crop&q=80'
              };
            }
            return cat;
          });
          setCategories(sanitizedCategories);
          localStorage.setItem('allkurma_categories', JSON.stringify(sanitizedCategories));
        }
      },
      (error) => {
        console.warn('Firestore categories listener warning:', error);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization of orders across all devices using Firestore
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToAllOrdersFromFirestore(
      (cloudOrders) => {
        if (!isSubscribed) return;
        if (cloudOrders && cloudOrders.length > 0) {
          setOrders(cloudOrders);
          try {
            localStorage.setItem('allkurma_orders', JSON.stringify(cloudOrders));
          } catch (e) {
            console.warn('Failed to cache orders to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore orders listener warning:', err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization of returns and complaints across all devices
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToReturnsFromFirestore(
      (cloudReturns) => {
        if (!isSubscribed) return;
        if (cloudReturns && cloudReturns.length > 0) {
          setReturns(cloudReturns);
          try {
            localStorage.setItem('allkurma_returns', JSON.stringify(cloudReturns));
          } catch (e) {
            console.warn('Failed to cache returns to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore returns listener warning:', err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization of chat messages across all devices using Firestore
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToAllChatMessagesFromFirestore(
      (cloudMessages) => {
        if (!isSubscribed) return;
        if (cloudMessages && cloudMessages.length > 0) {
          setChatMessages(cloudMessages);
          try {
            localStorage.setItem('allkurma_chat', JSON.stringify(cloudMessages));
          } catch (e) {
            console.warn('Failed to cache chat to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore chats listener warning:', err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  // Real-time synchronization of bundle deals across all devices using Firestore
  useEffect(() => {
    let isSubscribed = true;

    const unsubscribe = listenToBundleDealsFromFirestore(
      (cloudBundles) => {
        if (!isSubscribed) return;
        if (cloudBundles && cloudBundles.length > 0) {
          setBundlingDeals(cloudBundles);
          try {
            localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(cloudBundles));
          } catch (e) {
            console.warn('Failed to cache bundle deals to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore bundle deals listener warning:', err);
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
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

  // Products CRUD with Instant Local + Cloud Firestore Synchronization
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now().toString(36)}`;
    const normalizedImages = newProd.images?.map(img => normalizeImageUrl(img)).filter(Boolean) || [];
    const finalImages = normalizedImages;
    const productWithId: Product = {
      ...newProd,
      images: finalImages,
      id,
      createdAt: newProd.createdAt || new Date().toISOString(),
      isNewArrival: newProd.isNewArrival !== undefined ? newProd.isNewArrival : true
    };

    // Remove from deleted tracking if re-added
    try {
      const deletedIdsStr = localStorage.getItem('allkurma_deleted_ids');
      if (deletedIdsStr) {
        const deletedSet = new Set(JSON.parse(deletedIdsStr));
        deletedSet.delete(id);
        localStorage.setItem('allkurma_deleted_ids', JSON.stringify(Array.from(deletedSet)));
      }
    } catch {}

    // Update local state and cache immediately
    setProducts(prev => {
      const updated = [productWithId, ...prev];
      localStorage.setItem('allkurma_products', JSON.stringify(updated));
      return updated;
    });

    // Write to Firebase Firestore cloud so all computers get it in real-time
    try {
      await saveProductToFirestore(productWithId);
      console.log('[Product] Saved and broadcasted via Firestore cloud:', productWithId.id);
    } catch (err) {
      console.error('Could not save product to Firestore cloud:', err);
      showToast('Peringatan: Gagal menyimpan ke server cloud Firestore. Periksa koneksi internet.', 'error');
    }
    
    // Notify followers of new product arrival!
    addNotification({
      title: `✨ Produk Baru: ${productWithId.name}`,
      message: `Toko Official AllKurma baru saja merilis produk kurma segar pilihan: ${productWithId.name}. Cek stoknya sekarang!`,
      type: 'promo',
      time: 'Baru saja',
      isRead: false
    });

    showToast(`Produk "${productWithId.name}" berhasil ditambahkan & tersimpan ke cloud!`, 'success');
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    const sanitizedUpdated = { ...updated };
    if (updated.images) {
      sanitizedUpdated.images = updated.images.map(img => normalizeImageUrl(img));
    }

    let updatedProductObj: Product | null = null;
    setProducts(prev => {
      const next = prev.map(p => {
        if (p.id === id) {
          updatedProductObj = { ...p, ...sanitizedUpdated };
          return updatedProductObj;
        }
        return p;
      });
      localStorage.setItem('allkurma_products', JSON.stringify(next));
      return next;
    });

    if (updatedProductObj) {
      try {
        await saveProductToFirestore(updatedProductObj);
      } catch (err) {
        console.warn('Could not update product in Firestore cloud:', err);
      }
    }
    showToast('Data produk berhasil diperbarui di cloud');
  };

  const deleteProduct = async (id: string) => {
    // Record as deleted to prevent resurrection from local cache
    try {
      const deletedIdsStr = localStorage.getItem('allkurma_deleted_ids');
      const deletedSet = new Set(deletedIdsStr ? JSON.parse(deletedIdsStr) : []);
      deletedSet.add(id);
      localStorage.setItem('allkurma_deleted_ids', JSON.stringify(Array.from(deletedSet)));
    } catch {}

    setProducts(prev => {
      const filtered = prev.filter(p => p.id !== id);
      localStorage.setItem('allkurma_products', JSON.stringify(filtered));
      return filtered;
    });
    setCart(prev => prev.filter(item => item.product?.id !== id));
    setWishlistProductIds(prev => prev.filter(pId => pId !== id));
    setSelectedProductId(prev => (prev === id ? null : prev));

    try {
      await deleteProductFromFirestore(id);
    } catch (err) {
      console.warn('Could not delete product from Firestore cloud:', err);
    }
    showToast('Produk berhasil dihapus dari etalase toko & cloud', 'success');
  };

  const clearAllProducts = async () => {
    const currentList = [...products];
    try {
      const deletedIdsStr = localStorage.getItem('allkurma_deleted_ids');
      const deletedSet = new Set(deletedIdsStr ? JSON.parse(deletedIdsStr) : []);
      currentList.forEach(p => deletedSet.add(p.id));
      localStorage.setItem('allkurma_deleted_ids', JSON.stringify(Array.from(deletedSet)));
    } catch {}

    setProducts([]);
    setCart([]);
    setWishlistProductIds([]);
    setSelectedProductId(null);
    localStorage.removeItem('allkurma_products');
    localStorage.removeItem('allkurma_cart');

    for (const p of currentList) {
      try {
        await deleteProductFromFirestore(p.id);
      } catch (err) {
        console.warn('Failed deleting product during clearAll:', p.id, err);
      }
    }
    showToast('Semua produk katalog telah berhasil dikosongkan dari cloud', 'success');
  };

  // Flexible Categories Management with Instant Local + Cloud Firestore Synchronization
  const addCategory = async (categoryData: Omit<CategoryItem, 'id'> & { id?: string }) => {
    const trimmedName = categoryData.name.trim();
    if (!trimmedName) {
      showToast('Nama kategori tidak boleh kosong', 'error');
      return;
    }

    const id = (categoryData.id || trimmedName).trim();
    // Check if category already exists
    const exists = categories.some(
      c => c.id.toLowerCase() === id.toLowerCase() || c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      showToast(`Kategori "${trimmedName}" sudah ada dalam daftar`, 'error');
      return;
    }

    const newCategory: CategoryItem = {
      id,
      name: trimmedName,
      image: categoryData.image || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=160&auto=format&fit=crop&q=80',
      description: categoryData.description?.trim() || '',
      createdAt: new Date().toISOString(),
      isSystem: false
    };

    setCategories(prev => {
      const updated = [...prev, newCategory];
      localStorage.setItem('allkurma_categories', JSON.stringify(updated));
      return updated;
    });

    try {
      await saveCategoryToFirestore(newCategory);
      showToast(`Kategori "${newCategory.name}" berhasil ditambahkan & disinkronkan ke server`, 'success');
    } catch (e) {
      console.warn('Gagal menyimpan kategori ke Firestore:', e);
      showToast(`Kategori "${newCategory.name}" tersimpan di perangkat lokal`, 'info');
    }
  };

  const updateCategory = async (id: string, updates: Partial<CategoryItem>) => {
    const existing = categories.find(c => c.id === id);
    if (!existing) return;

    const updatedCategory: CategoryItem = { ...existing, ...updates };
    setCategories(prev => {
      const updated = prev.map(c => c.id === id ? updatedCategory : c);
      localStorage.setItem('allkurma_categories', JSON.stringify(updated));
      return updated;
    });

    try {
      await saveCategoryToFirestore(updatedCategory);
      showToast(`Kategori "${updatedCategory.name}" berhasil diperbarui`, 'success');
    } catch (e) {
      console.warn('Gagal memperbarui kategori di Firestore:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    const target = categories.find(c => c.id === id);
    const catName = target ? target.name : id;

    // Hitung produk yang menggunakan kategori ini
    const affectedCount = products.filter(p => p.category === id || p.category === catName).length;

    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('allkurma_categories', JSON.stringify(updated));
      return updated;
    });

    if (selectedCategory === id || selectedCategory === catName) {
      setSelectedCategory(null);
    }

    try {
      await deleteCategoryFromFirestore(id);
      if (affectedCount > 0) {
        showToast(`Kategori "${catName}" dihapus (${affectedCount} produk terkait)`, 'info');
      } else {
        showToast(`Kategori "${catName}" berhasil dihapus dari cloud`, 'success');
      }
    } catch (e) {
      console.warn('Gagal menghapus kategori dari Firestore:', e);
      showToast(`Kategori "${catName}" dihapus dari lokal`, 'info');
    }
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
        image: item.product.images?.[0] || '',
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

    // Sync order to Firestore for real-time update across all devices
    saveOrderToFirestore(newOrder).catch((err) => {
      console.warn('Sync order to firestore warning:', err);
    });

    // Also sync deducted product stocks to Firestore so all devices see live inventory
    newOrder.items.forEach((item) => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        const updatedProd: Product = {
          ...prod,
          stock: Math.max(0, prod.stock - item.quantity),
          soldCount: (prod.soldCount || 0) + item.quantity
        };
        saveProductToFirestore(updatedProd).catch(() => {});
      }
    });

    showToast(`Pesanan #${newOrder.orderNumber} berhasil dibuat!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], extraData?: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...(extraData || {}) } : o));
    
    // Sync status change to Firestore for instant real-time reflection across devices
    updateOrderStatusInFirestore(orderId, { status, ...(extraData || {}) }).catch((err) => {
      console.warn('Sync order status update to firestore warning:', err);
    });

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

  // RMA Returns & Complaints Sync
  const createReturnRequest = (req: Omit<ReturnRequest, 'id' | 'returnCode' | 'createdAt' | 'status'>) => {
    const code = `RET-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReturn: ReturnRequest = {
      ...req,
      id: `rma-${Date.now().toString(36)}`,
      returnCode: code,
      createdAt: new Date().toISOString(),
      status: 'Pending Review'
    };
    setReturns(prev => [newReturn, ...prev]);

    // Sync to Firestore in real time
    saveReturnToFirestore(newReturn).catch((err) => {
      console.warn('Sync return to firestore warning:', err);
    });

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

    // Sync status change to Firestore in real time
    const updates: Partial<ReturnRequest> = {
      status,
      ...(notes !== undefined ? { inspectionNotes: notes } : {}),
      ...(adjustedCredit !== undefined ? { creditAdjusted: adjustedCredit } : {}),
      ...(resolution !== undefined ? { resolutionStatus: resolution } : {})
    };
    updateReturnStatusInFirestore(id, updates).catch((err) => {
      console.warn('Sync return update to firestore warning:', err);
    });

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

  const spinWheel = (): { prize: string; prizeName: string; coins?: number; voucher?: string; voucherCode?: string } => {
    const prizes = [
      { prize: '500 Koin AllKurma', prizeName: '500 Koin AllKurma', coins: 500 },
      { prize: 'Voucher Diskon Rp 30.000', prizeName: 'Voucher Diskon Rp 30.000', voucher: 'KURMA30K', voucherCode: 'KURMA30K' },
      { prize: '1.000 Koin AllKurma', prizeName: '1.000 Koin AllKurma', coins: 1000 },
      { prize: 'Gratis Ongkir XTRA', prizeName: 'Gratis Ongkir XTRA', voucher: 'ONGKIR0', voucherCode: 'ONGKIR0' },
      { prize: '2.500 Koin AllKurma', prizeName: '2.500 Koin AllKurma', coins: 2500 },
      { prize: 'Voucher Cashback 50%', prizeName: 'Voucher Cashback 50%', voucher: 'CASHBACK50', voucherCode: 'CASHBACK50' }
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

  const waterCoinPlant = (): { success: boolean; harvested: boolean; gainedCoins: number; isHarvest: boolean } => {
    let harvested = false;
    let gainedCoins = 0;
    setPlantCoinLevel(prev => {
      const nextLevel = prev + 25;
      if (nextLevel >= 100) {
        harvested = true;
        gainedCoins = 500;
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
    return { success: true, harvested, gainedCoins, isHarvest: harvested };
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
      const updated: SellerStoreProfile = {
        ...prev,
        authorizedStaff: (prev.authorizedStaff || []).map(s => 
          s.id === id ? { ...s, status: (s.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' } : s
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

  // Hero Banner Management Methods
  const addHeroBanner = (bannerData: Omit<AppHeroBanner, 'id'>) => {
    const newBanner: AppHeroBanner = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      active: bannerData.active !== undefined ? bannerData.active : true
    };
    setHeroBanners(prev => [newBanner, ...prev]);
    showToast('Banner promosi baru berhasil ditambahkan!', 'success');
  };

  const updateHeroBanner = (id: string | number, updates: Partial<AppHeroBanner>) => {
    setHeroBanners(prev =>
      prev.map(b => (String(b.id) === String(id) ? { ...b, ...updates } : b))
    );
    showToast('Banner promosi berhasil diperbarui!', 'success');
  };

  const deleteHeroBanner = (id: string | number) => {
    setHeroBanners(prev => prev.filter(b => String(b.id) !== String(id)));
    showToast('Banner promosi berhasil dihapus.', 'info');
  };

  const resetHeroBanners = () => {
    setHeroBanners(INITIAL_HERO_BANNERS);
    showToast('Banner promosi dikembalikan ke template awal.', 'info');
  };

  // Bundling Promo Deals Management
  const addBundleDeal = (deal: Omit<BundleDeal, 'id'>) => {
    const newDeal: BundleDeal = {
      ...deal,
      id: `bundle-${Date.now().toString(36)}`,
      active: deal.active !== undefined ? deal.active : true
    };
    setBundlingDeals(prev => {
      const updated = [newDeal, ...prev];
      localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(updated));
      return updated;
    });
    saveBundleDealToFirestore(newDeal).catch(e => console.warn('Cloud sync error for bundle:', e));
    showToast(`Paket "${newDeal.name}" berhasil dibuat dan langsung aktif!`, 'success');
  };

  const updateBundleDeal = (id: string, updates: Partial<BundleDeal>) => {
    setBundlingDeals(prev => {
      const updated = prev.map(b => (b.id === id ? { ...b, ...updates } : b));
      localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(updated));
      const target = updated.find(b => b.id === id);
      if (target) {
        saveBundleDealToFirestore(target).catch(e => console.warn('Cloud update error for bundle:', e));
      }
      return updated;
    });
    showToast('Paket Promo Bundling berhasil diperbarui!', 'success');
  };

  const deleteBundleDeal = (id: string) => {
    setBundlingDeals(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(updated));
      return updated;
    });
    deleteBundleDealFromFirestore(id).catch(e => console.warn('Cloud delete error for bundle:', e));
    showToast('Paket Promo Bundling berhasil dihapus.', 'info');
  };

  const toggleBundleDealActive = (id: string) => {
    setBundlingDeals(prev => {
      const updated = prev.map(b => {
        if (b.id === id) {
          const next = !(b.active !== false);
          showToast(`Paket "${b.name}" ${next ? 'diaktifkan' : 'dinonaktifkan'}`, 'info');
          const mod = { ...b, active: next };
          saveBundleDealToFirestore(mod).catch(e => console.warn('Cloud status sync error for bundle:', e));
          return mod;
        }
        return b;
      });
      localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(updated));
      return updated;
    });
  };

  const resetBundleDeals = () => {
    setBundlingDeals(INITIAL_BUNDLE_DEALS);
    localStorage.setItem('allkurma_bundle_deals_v1', JSON.stringify(INITIAL_BUNDLE_DEALS));
    INITIAL_BUNDLE_DEALS.forEach(deal => {
      saveBundleDealToFirestore(deal).catch(e => console.warn('Reset seed bundle error:', e));
    });
    showToast('Paket Promo Bundling dikembalikan ke template awal.', 'info');
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

  // Live Chat Handover to Seller
  const handoverToSeller = () => {
    setChatMode('live_seller');
    try {
      localStorage.setItem('allkurma_chat_mode', 'live_seller');
    } catch {}

    const sysMsg: ChatMessage = {
      id: `msg-sys-${Date.now().toString(36)}`,
      sender: 'seller',
      senderName: 'Sistem Shopee Chat',
      text: 'Permintaan terhubung dengan Penjual diterima. Tim CS & Penjual Toko AllKurma telah menerima notifikasi dan akan segera melayani Kakak secara langsung. Silakan sampaikan pertanyaan atau kendala Kakak 🙏',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      isRead: true,
      source: 'system',
      chatMode: 'live_seller',
      customerId: user.id || 'cust-me',
      customerName: user.name || 'Pelanggan'
    };

    setChatMessages(prev => [...prev, sysMsg]);
    saveChatMessageToFirestore(sysMsg).catch(() => {});
    showToast('Chat dialihkan langsung ke Penjual Toko', 'info');
  };

  // Switch back to AI Assistant
  const handoverToAi = () => {
    setChatMode('ai_assistant');
    try {
      localStorage.setItem('allkurma_chat_mode', 'ai_assistant');
    } catch {}

    const sysMsg: ChatMessage = {
      id: `msg-sys-${Date.now().toString(36)}`,
      sender: 'bot',
      senderName: 'Asisten AI Shopee',
      text: 'Asisten AI Toko kembali aktif! Saya siap menjawab pertanyaan seputar jenis kurma, stok, promo, dan pesanan secara otomatis 24 jam.',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      isRead: true,
      source: 'ai',
      chatMode: 'ai_assistant',
      customerId: user.id || 'cust-me',
      customerName: user.name || 'Pelanggan'
    };

    setChatMessages(prev => [...prev, sysMsg]);
    saveChatMessageToFirestore(sysMsg).catch(() => {});
    showToast('Asisten AI Shopee kembali aktif', 'success');
  };

  // Live Chat send by customer
  const sendChatMessage = (text: string, productCard?: ChatMessage['productCard']) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'user',
      senderName: user.name || 'Pelanggan',
      customerId: user.id || 'cust-me',
      customerName: user.name || 'Pelanggan',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      productCard,
      isRead: false,
      source: 'customer',
      chatMode
    };

    setChatMessages(prev => [...prev, userMsg]);
    saveChatMessageToFirestore(userMsg).catch((err) => {
      console.warn('Sync user chat to firestore warning:', err);
    });

    // Check if customer query manually triggers handover
    const queryLower = text.toLowerCase();
    const isRequestingSeller = queryLower.includes('bicara dengan penjual') || 
      queryLower.includes('hubungi penjual') || 
      queryLower.includes('cs penjual') || 
      queryLower.includes('mau chat penjual') ||
      queryLower.includes('orang asli');

    if (isRequestingSeller) {
      handoverToSeller();
      return;
    }

    // If currently in AI mode, trigger AI auto-response
    if (chatMode === 'ai_assistant') {
      setIsAiTyping(true);

      setTimeout(() => {
        const activeProduct = products.find(p => p.id === selectedProductId);
        const aiResult = generateAiChatResponse(text, {
          products,
          orders,
          customerName: user.name,
          activeProduct: activeProduct || null
        });

        const botMsg: ChatMessage = {
          id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          sender: 'bot',
          senderName: 'Asisten AI Shopee',
          customerId: user.id || 'cust-me',
          customerName: user.name || 'Pelanggan',
          text: aiResult.replyText,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date().toISOString(),
          productCard: aiResult.recommendedProduct ? {
            id: aiResult.recommendedProduct.id,
            name: aiResult.recommendedProduct.name,
            price: aiResult.recommendedProduct.discountPrice || aiResult.recommendedProduct.regularPrice,
            image: aiResult.recommendedProduct.images?.[0]
          } : undefined,
          isRead: true,
          source: 'ai',
          showHandoverAction: true,
          chatMode: aiResult.shouldHandoverToSeller ? 'live_seller' : 'ai_assistant'
        };

        if (aiResult.shouldHandoverToSeller) {
          setChatMode('live_seller');
          try {
            localStorage.setItem('allkurma_chat_mode', 'live_seller');
          } catch {}
        }

        setChatMessages(prev => [...prev, botMsg]);
        saveChatMessageToFirestore(botMsg).catch(() => {});
        setIsAiTyping(false);
      }, 900);
    } else {
      // In Live Seller mode, alert that seller has been notified
      showToast('Pesan terkirim ke Penjual. Menunggu balasan CS...', 'info');
    }
  };

  // Seller directly replies from Seller Center
  const sendSellerChatMessage = (text: string, targetCustomerId?: string) => {
    const sellerMsg: ChatMessage = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      sender: 'seller',
      senderName: 'Penjual (AllKurma Official)',
      customerId: targetCustomerId || user.id || 'cust-me',
      customerName: 'Pelanggan',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      isRead: false,
      source: 'human_seller',
      chatMode: 'live_seller'
    };

    setChatMessages(prev => [...prev, sellerMsg]);
    saveChatMessageToFirestore(sellerMsg).catch((err) => {
      console.warn('Sync seller chat to firestore warning:', err);
    });
    showToast('Pesan balasan toko berhasil dikirim', 'success');
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
        isProductsLoading,
        isFirebaseConnected,
        getProductShareUrl,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
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
        sendSellerChatMessage,
        chatMode,
        setChatMode,
        handoverToSeller,
        handoverToAi,
        isAiTyping,
        isChatOpen,
        setIsChatOpen,
        unreadChatCount: chatMessages.filter(m => (m.sender === 'seller' || m.sender === 'bot') && !m.isRead).length,
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
        // Banner Management
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        resetHeroBanners,
        // Bundling Promo Deals Management
        bundlingDeals,
        addBundleDeal,
        updateBundleDeal,
        deleteBundleDeal,
        toggleBundleDealActive,
        resetBundleDeals,
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
