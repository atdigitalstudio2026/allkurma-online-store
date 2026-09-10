export type UserRoleType = 'customer' | 'retail_customer' | 'seller' | 'wholesale_partner' | 'super_admin' | 'warehouse_manager' | 'sales_rep' | 'marketing_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRoleType;
  avatar: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rewardPoints: number;
  totalOrders: number;
  savedLists: number;
  annualSpend: number;
  taxId?: string;
  companyName?: string;
  defaultAddressId?: string;
}

export interface WholesaleTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  discountPercent: number;
  minAnnualSpend: number;
  minSpendAnnual?: number;
  minOrderValue: number;
  minVolumeKg: number;
  perks: string[];
  benefits?: string[];
  paymentTermsDays?: number;
  isCurrent?: boolean;
}

export interface TierPriceRule {
  minQty: number;
  maxQty?: number;
  pricePerUnit: number;
}

export interface ProductVariation {
  id: string;
  name: string; // e.g. "Kemasan 500g VIP", "Kemasan 1kg Box Eksklusif", "Karton 5kg"
  weightGram: number;
  regularPrice: number;
  discountPrice?: number;
  costPrice?: number; // HPP Modal
  stock: number;
  minStockAlert?: number;
  sku: string;
  barcode?: string;
  image?: string;
  packagingType?: string;
  warehouseRack?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  orderId?: string;
  userName: string;
  userAvatar?: string;
  avatar?: string;
  rating: number; // 1 to 5
  date?: string;
  createdAt?: string;
  variationName?: string;
  variationPurchased?: string;
  comment: string;
  photos?: string[];
  isVerifiedBuyer?: boolean;
  isVerifiedPurchase?: boolean;
  helpfulCount: number;
  sellerResponse?: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'seller' | 'bot';
  senderName?: string;
  text: string;
  time?: string;
  timestamp?: string;
  productCard?: any;
  isRead?: boolean;
  source?: 'ai' | 'human_seller' | 'customer' | 'system';
  showHandoverAction?: boolean;
  customerId?: string;
  customerName?: string;
  chatMode?: 'ai_assistant' | 'live_seller';
}

export interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadBySeller: number;
  unreadByCustomer: number;
  chatMode: 'ai_assistant' | 'live_seller';
  updatedAt: string;
}

// Backward compatibility alias
export type ShopeeChatMessage = ChatMessage;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date?: string;
  time?: string;
  type: 'order' | 'promo' | 'coin' | 'points' | 'general' | 'seller' | 'system' | 'finance';
  read?: boolean;
  isRead?: boolean;
  icon?: string;
  linkView?: string;
}

// Backward compatibility alias
export type ShopeeNotification = AppNotification;

export interface SellerStaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin Toko' | 'Manajer Operasional' | 'Staff Gudang & Pesanan' | 'Customer Support CS';
  addedAt: string;
  status: 'active' | 'inactive';
  phone?: string;
}

export interface SellerStoreProfile {
  storeName: string;
  storeHandle: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  city: string;
  fullAddress: string;
  postalCode: string;
  phone: string;
  email: string;
  operationalHours: string;
  isVacationMode: boolean;
  isOfficialStore: boolean;
  enableAutoReply: boolean;
  autoReplyGreeting: string;
  autoReplyOffHours: string;
  authorizedStaff: SellerStaffMember[];
  couriers: {
    id: string;
    name: string;
    type: 'Reguler' | 'Kargo' | 'Instant / Sameday' | 'Hemat';
    active: boolean;
    freeShippingEnabled: boolean;
  }[];
  bankAccount: {
    bankName: string;
    accountNumber: string;
    holderName: string;
    verified: boolean;
  };
  payoutBalance: number;
  taxNumber: string;
  minFreeShippingOrder: number;
  followerCount?: number;
  rating?: number;
  responseRate?: number;
  joinedDate?: string;
}

export interface CategoryItem {
  id: string; // Unique identifier / slug, e.g. "Ajwa", "Sukari", "Kurma Muda"
  name: string; // Display name
  image?: string; // Thumbnail / avatar image URL
  description?: string; // Brief description
  createdAt?: string;
  isSystem?: boolean; // Default initial categories
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string; // Flexible category, matches CategoryItem.id or CategoryItem.name
  description: string;
  images: string[];
  image?: string; // Single image compatibility alias
  regularPrice: number;
  discountPrice?: number;
  costPrice?: number; // HPP (Harga Pokok Penjualan)
  wholesalePrices: TierPriceRule[];
  stock: number;
  minStockAlert: number;
  warehouseLocation: string;
  warehouseRack?: string; // e.g. "Rak A-02 / Cold Storage #1"
  weightGram: number;
  dimensionsCm?: string;
  harvestYear?: string; // e.g. "Musim 2025/2026 - Fresh Import"
  shelfLife?: string; // e.g. "18 - 24 Bulan"
  expiryDate?: string; // e.g. "2027-08-30"
  storageCondition?: string; // e.g. "Chiller 0°C - 5°C" | "Suhu Ruang Sejuk (< 22°C)"
  packagingType?: string; // e.g. "Sealed Vacuum Foil Box" | "Food Grade Jar"
  certification?: string; // e.g. "Halal MUI & Karantina Kementan RI"
  isFlashSale?: boolean;
  flashSaleDiscountPercent?: number;
  isNewArrival?: boolean;
  createdAt?: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  origin: string;
  badge?: string;
  isDraft?: boolean;
  freeShippingExtra?: boolean;
  cashbackExtra?: boolean;
  isCodAvailable?: boolean;
  payLaterMonthly?: number;
  spayLaterMonthly?: number; // legacy compatibility
  variations?: ProductVariation[];
}

export interface CartItem {
  id?: string;
  userId?: string;
  product: Product;
  quantity: number;
  selectedTierPrice?: number;
  selectedVariation?: ProductVariation;
  isSelected?: boolean;
  weightGram?: number;
}

export interface Address {
  id: string;
  userId?: string;
  label: 'Home' | 'Office' | 'Warehouse' | string;
  recipientName: string;
  phone: string;
  streetAddress?: string;
  fullAddress?: string;
  city: string;
  district?: string;
  province?: string;
  postalCode: string;
  country?: string;
  notes?: string;
  isDefault: boolean;
}

export type DetailedOrderStatus = 
  | 'PENDING_PAYMENT'
  | 'PAYMENT_CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type OrderStatus = 
  | 'Belum Bayar' 
  | 'Belum Dibayar' 
  | 'Diproses' 
  | 'Dikemas' 
  | 'Dikirim' 
  | 'Selesai' 
  | 'Dibatalkan' 
  | 'Retur' 
  | 'Komplain/Retur'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | DetailedOrderStatus;

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  weightGram?: number;
  product?: Product;
  selectedVariation?: ProductVariation;
}

export interface OrderActivityLog {
  id: string;
  timestamp: string;
  status: OrderStatus;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  invoiceCode?: string;
  createdAt: string;
  updatedAt?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerType: 'Retail' | 'Wholesale';
  items: OrderItem[];
  subtotal: number;
  wholesaleDiscount: number;
  voucherDiscount: number;
  voucherCode?: string;
  coinsDiscount?: number;
  shippingCost: number;
  shippingDiscount?: number;
  tax: number;
  total: number;
  totalAmount?: number;
  totalWeightGram?: number;
  status: OrderStatus;
  detailedStatus?: DetailedOrderStatus;
  paymentMethod: string;
  paymentMethodCategory?: string;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded' | 'Lunas' | 'Belum Lunas' | 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';
  shippingAddress: Address;
  courierName?: string;
  courier?: string;
  courierCode?: string;
  shippingService?: string;
  serviceCode?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  poNumber?: string;
  appliedTier?: string;
  idempotencyKey?: string;
  paymentTransactionId?: string;
  activityLogs?: OrderActivityLog[];
}

export interface StockMovement {
  id: string;
  date: string;
  productName: string;
  sku: string;
  type: 'Inbound' | 'Outbound' | 'Opname';
  quantityChange: number; // positive for in, negative for out
  unit: string;
  sourceOrDestination: string;
  warehouse: 'Gudang Utama' | 'Gudang Transit';
  officer: string;
  notes?: string;
}

export interface PromotionVoucher {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Scheduled' | 'Expired';
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscountCap?: number;
  minPurchase: number;
  totalUsageLimit: number;
  usedCount: number;
  usagePerCustomer: number;
  startDate: string;
  endDate: string;
  customerSegment: 'All Customers' | 'Wholesale Only' | 'Gold/Platinum';
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'Products' | 'Vouchers' | 'Experiences';
  pointsCost: number;
  image: string;
  description: string;
  stock: number;
  badge?: string;
}

export interface PointTransaction {
  id: string;
  date: string;
  title: string;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  referenceId?: string;
}

export interface WholesaleInvoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  dateIssued: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  companyName: string;
  itemsSummary: string;
}

export type ReturnStatus = 'Pending Review' | 'Awaiting Shipment' | 'Under Inspection' | 'Completed' | 'Rejected' | 'Approved';

export interface ReturnItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  unitPrice: number;
  quantityReturned: number;
  reason: string;
  conditionNotes?: string;
}

export interface ReturnRequest {
  id: string;
  returnCode: string;
  orderNumber: string;
  orderId?: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: ReturnItem[];
  reason: string;
  comments?: string;
  description?: string;
  requestedSolution?: string;
  refundAmount?: number;
  proofImages: string[];
  evidenceImages?: string[];
  estimatedCredit: number;
  status: ReturnStatus;
  inspectionNotes?: string;
  creditAdjusted?: number;
  restockingFee?: number;
  resolutionStatus?: 'Approved Full' | 'Approved Partial' | 'Rejected' | 'Pending';
  inspectorName?: string;
}

export interface RolePermission {
  id: string;
  roleName: string;
  description: string;
  userCount: number;
  isSystemDefault?: boolean;
  permissions: {
    inventory: {
      viewProducts: boolean;
      addEditProducts: boolean;
      manageStockLevels: boolean;
    };
    orders: {
      viewOrders: boolean;
      processFulfillOrders: boolean;
      processRefunds: boolean;
    };
    systemSettings: {
      manageUsers: boolean;
      manageRoles: boolean;
      systemSettings: boolean;
    };
  };
}

export interface SystemSettings {
  siteName: string;
  contactEmail: string;
  brandSlogan: string;
  defaultCurrency: string;
  timezone: string;
  autoApproveWholesale: boolean;
  twoFactorAuthRequired: boolean;
}

export interface AppHeroBanner {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  targetCategory?: string;
  targetView?: string;
  isBundlingTrigger?: boolean;
  bgGradient?: string;
  image: string;
  tagColor?: string;
  active?: boolean;
  displayMode?: 'standard' | 'full-image';
  showTextOverlay?: boolean;
  objectFit?: 'cover' | 'contain';
}

export interface BundleDealItem {
  productId?: string;
  title: string;
  qty: string;
  description: string;
  price?: number;
  image?: string;
  variationId?: string;
}

export interface BundleDeal {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  tag: string;
  originalPrice: number;
  bundlePrice: number;
  discountPct: number;
  savings: number;
  rating: number;
  soldCount: number;
  image: string;
  items: BundleDealItem[];
  benefits: string[];
  active?: boolean;
}

