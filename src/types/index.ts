export type UserRoleType = 'customer' | 'seller' | 'wholesale_partner' | 'super_admin' | 'warehouse_manager' | 'sales_rep' | 'marketing_admin';

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
  companyName?: string;
  defaultAddressId?: string;
}

export interface WholesaleTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  discountPercent: number;
  minAnnualSpend: number;
  minOrderValue: number;
  minVolumeKg: number;
  perks: string[];
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
  stock: number;
  sku: string;
  image?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  avatar?: string;
  rating: number; // 1 to 5
  date?: string;
  createdAt?: string;
  variationName?: string;
  comment: string;
  photos?: string[];
  isVerifiedBuyer?: boolean;
  helpfulCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'seller' | 'bot';
  text: string;
  time?: string;
  timestamp?: string;
  productCard?: Product;
  isRead?: boolean;
}

// Backward compatibility alias
export type ShopeeChatMessage = ChatMessage;

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date?: string;
  time?: string;
  type: 'order' | 'promo' | 'coin' | 'points' | 'general' | 'seller' | 'system';
  read?: boolean;
  isRead?: boolean;
  icon?: string;
  linkView?: string;
}

// Backward compatibility alias
export type ShopeeNotification = AppNotification;

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
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Ajwa' | 'Sukari' | 'Medjool' | 'Tunisia' | 'Khalas' | 'Madu' | 'Grosir' | 'Hampers' | 'Bundling';
  description: string;
  images: string[];
  regularPrice: number;
  discountPrice?: number;
  wholesalePrices: TierPriceRule[];
  stock: number;
  minStockAlert: number;
  warehouseLocation: string;
  weightGram: number;
  dimensionsCm?: string;
  isFlashSale?: boolean;
  flashSaleDiscountPercent?: number;
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

export type ReturnStatus = 'Pending Review' | 'Awaiting Shipment' | 'Under Inspection' | 'Completed' | 'Rejected';

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
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: ReturnItem[];
  reason: string;
  comments?: string;
  proofImages: string[];
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
