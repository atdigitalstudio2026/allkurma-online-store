import { 
  Product, 
  UserProfile, 
  WholesaleTier, 
  Address, 
  Order, 
  StockMovement, 
  PromotionVoucher, 
  RewardItem, 
  PointTransaction, 
  WholesaleInvoice, 
  ReturnRequest, 
  RolePermission, 
  SystemSettings,
  CustomerReview,
  ChatMessage,
  AppNotification,
  SellerStoreProfile
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'guest-allkurma',
  name: 'Tamu AllKurma',
  email: '',
  phone: '',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  tier: 'Bronze',
  rewardPoints: 0,
  totalOrders: 0,
  savedLists: 0,
  annualSpend: 0,
  defaultAddressId: undefined
};

export const WHOLESALE_TIERS: WholesaleTier[] = [
  {
    id: 'tier-bronze',
    name: 'Bronze',
    discountPercent: 5,
    minAnnualSpend: 5000000,
    minOrderValue: 500000,
    minVolumeKg: 50,
    perks: ['Diskon 5% Katalog Grosir', 'Standar Order Support', 'Standard Packing']
  },
  {
    id: 'tier-silver',
    name: 'Silver',
    discountPercent: 8,
    minAnnualSpend: 15000000,
    minOrderValue: 1500000,
    minVolumeKg: 200,
    perks: ['Diskon 8% Katalog Grosir', 'Prioritas Packing & QC', 'Dedicated Chat Support', 'Sample Panen Baru']
  },
  {
    id: 'tier-gold',
    name: 'Gold',
    discountPercent: 12,
    minAnnualSpend: 35000000,
    minOrderValue: 3000000,
    minVolumeKg: 500,
    perks: ['Diskon 12% Flat Grosir', 'Dedicated Account Manager', 'Early Access Panen Baru', 'Termin Pembayaran 14 Hari', 'Free Ongkir Jabodetabek'],
    isCurrent: true
  },
  {
    id: 'tier-platinum',
    name: 'Platinum',
    discountPercent: 20,
    minAnnualSpend: 100000000,
    minOrderValue: 10000000,
    minVolumeKg: 1000,
    perks: ['Diskon 20% Maksimal', 'Dedicated Key Account Exec', 'Custom Private Label Packaging', 'Termin Pembayaran Net 30 Hari', 'Free Logistik Antar Gudang']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Kurma Medjool Premium Harvest 500g',
    sku: 'AK-MDJ-500',
    category: 'Medjool',
    description: 'Kurma Medjool pilihan grade A kualitas ekspor langsung dari perkebunan pilihan. Memiliki daging buah tebal, lembut, manis karamel alami, kaya serat dan mineral tinggi.',
    images: [
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 175000,
    discountPrice: 150000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 140000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 135000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 125000 }
    ],
    stock: 245,
    minStockAlert: 20,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    dimensionsCm: '20 x 12 x 5',
    isFlashSale: true,
    flashSaleDiscountPercent: 14,
    rating: 4.9,
    reviewCount: 1240,
    soldCount: 5420,
    origin: 'Palestina / Jordan Valley',
    badge: 'PREMIUM GRADE',
    freeShippingExtra: true,
    cashbackExtra: true,
    isCodAvailable: true,
    spayLaterMonthly: 50000,
    variations: [
      { id: 'v-mdj-250', name: 'Kemasan 250g Pouch', weightGram: 250, regularPrice: 95000, discountPrice: 80000, stock: 120, sku: 'AK-MDJ-250' },
      { id: 'v-mdj-500', name: 'Kemasan 500g VIP Box', weightGram: 500, regularPrice: 175000, discountPrice: 150000, stock: 245, sku: 'AK-MDJ-500' },
      { id: 'v-mdj-1000', name: 'Kemasan 1kg Box Eksklusif', weightGram: 1000, regularPrice: 320000, discountPrice: 285000, stock: 95, sku: 'AK-MDJ-1000' },
      { id: 'v-mdj-5000', name: 'Karton Grosir 5kg Master', weightGram: 5000, regularPrice: 1450000, discountPrice: 1250000, stock: 35, sku: 'AK-MDJ-5KG' }
    ]
  },
  {
    id: 'prod-02',
    name: 'Kurma Ajwa Al-Madinah 500g Premium',
    sku: 'AK-AJW-001',
    category: 'Ajwa',
    description: 'Kurma Ajwa Asli Madinah Al-Munawwarah dengan sertifikasi keaslian. Tekstur kenyal, warna hitam pekat bergaris halus, kaya khasiat dan penuh berkah.',
    images: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 145000,
    discountPrice: 125000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 120000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 112000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 100000 }
    ],
    stock: 310,
    minStockAlert: 30,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    dimensionsCm: '18 x 12 x 5',
    isFlashSale: true,
    flashSaleDiscountPercent: 15,
    rating: 4.9,
    reviewCount: 980,
    soldCount: 4200,
    origin: 'Madinah, Saudi Arabia',
    badge: 'BEST SELLER',
    freeShippingExtra: true,
    cashbackExtra: true,
    isCodAvailable: true,
    spayLaterMonthly: 41666,
    variations: [
      { id: 'v-ajw-250', name: 'Kemasan 250g Jar', weightGram: 250, regularPrice: 80000, discountPrice: 69000, stock: 150, sku: 'AK-AJW-250' },
      { id: 'v-ajw-500', name: 'Kemasan 500g Madinah', weightGram: 500, regularPrice: 145000, discountPrice: 125000, stock: 310, sku: 'AK-AJW-001' },
      { id: 'v-ajw-1000', name: 'Kemasan 1kg Hardbox VIP', weightGram: 1000, regularPrice: 280000, discountPrice: 240000, stock: 80, sku: 'AK-AJW-1000' }
    ]
  },
  {
    id: 'prod-03',
    name: 'Kurma Medjool Jumbo Grade A 1kg',
    sku: 'MDJ-JMB-1KG',
    category: 'Medjool',
    description: 'Ukuran jumbo istimewa dengan tekstur legit juicy. Sangat cocok untuk hidangan keluarga terhormat dan parcel premium.',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 240000,
    discountPrice: 210000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 200000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 185000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 170000 }
    ],
    stock: 85,
    minStockAlert: 15,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 1000,
    dimensionsCm: '25 x 18 x 7',
    rating: 4.8,
    reviewCount: 450,
    soldCount: 1890,
    origin: 'Palestina',
    badge: 'JUMBO SIZE',
    freeShippingExtra: true,
    cashbackExtra: true,
    isCodAvailable: true,
    spayLaterMonthly: 70000,
    variations: [
      { id: 'v-jmb-1kg', name: 'Kotak 1kg Jumbo', weightGram: 1000, regularPrice: 240000, discountPrice: 210000, stock: 85, sku: 'MDJ-JMB-1KG' },
      { id: 'v-jmb-3kg', name: 'Ember 3kg Jumbo Family', weightGram: 3000, regularPrice: 690000, discountPrice: 599000, stock: 30, sku: 'MDJ-JMB-3KG' }
    ]
  },
  {
    id: 'prod-04',
    name: 'Kurma Sukari Al-Qassim Basah 850g',
    sku: 'AK-SUK-002',
    category: 'Sukari',
    description: 'Kurma Sukari Basah (Rutob) terkenal dengan rasa manis lumer seperti karamel susu. Disimpan di cold storage menjaga kesegaran maksimal.',
    images: [
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 95000,
    discountPrice: 85000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 80000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 74000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 68000 }
    ],
    stock: 420,
    minStockAlert: 50,
    warehouseLocation: 'Gudang Transit - Cold Storage',
    weightGram: 850,
    dimensionsCm: '16 x 16 x 8',
    isFlashSale: true,
    flashSaleDiscountPercent: 10,
    rating: 4.8,
    reviewCount: 760,
    soldCount: 3600,
    origin: 'Al-Qassim, Saudi Arabia',
    badge: 'SWEET CARAMEL',
    freeShippingExtra: true,
    cashbackExtra: true,
    isCodAvailable: true,
    spayLaterMonthly: 28333,
    variations: [
      { id: 'v-suk-500', name: 'Ember Kecil 500g', weightGram: 500, regularPrice: 65000, discountPrice: 55000, stock: 200, sku: 'AK-SUK-500' },
      { id: 'v-suk-850', name: 'Ember Standar 850g', weightGram: 850, regularPrice: 95000, discountPrice: 85000, stock: 420, sku: 'AK-SUK-002' },
      { id: 'v-suk-3000', name: 'Ember Jumbo 3kg', weightGram: 3000, regularPrice: 285000, discountPrice: 245000, stock: 65, sku: 'AK-SUK-3KG' }
    ]
  },
  {
    id: 'prod-05',
    name: 'Kurma Khalas Premium Roe 500g',
    sku: 'AK-KHL-500',
    category: 'Khalas',
    description: 'Kurma Khalas pilihan dengan rasa manis seimbang dan tekstur kenyal lembut. Sangat digemari untuk konsumsi harian dan sedekah.',
    images: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 65000,
    discountPrice: 55000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 52000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 47000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 42000 }
    ],
    stock: 550,
    minStockAlert: 60,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    dimensionsCm: '18 x 12 x 5',
    rating: 4.7,
    reviewCount: 320,
    soldCount: 2100,
    origin: 'Uni Emirat Arab',
    badge: 'DAILY ESSENTIAL'
  },
  {
    id: 'prod-06',
    name: 'Madu Murni Akasia Royal 500g',
    sku: 'MD-AKS-500',
    category: 'Madu',
    description: 'Madu murni nektar bunga Akasia hutan alam tanpa campuran pengental maupun pemanis buatan. Kaya enzim diastase alami.',
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 110000,
    discountPrice: 85000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 80000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 72000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 65000 }
    ],
    stock: 180,
    minStockAlert: 25,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    dimensionsCm: '10 x 10 x 18',
    rating: 4.9,
    reviewCount: 520,
    soldCount: 1650,
    origin: 'Riau, Indonesia',
    badge: '100% PURE'
  },
  {
    id: 'prod-07',
    name: 'Kurma Tunisia Tangkai Deglet Noor 500g',
    sku: 'DGL-TUN-500',
    category: 'Tunisia',
    description: 'Kurma Deglet Noor bertangkai segar dengan tekstur garing renyah manis sedang. Ratu kurma dari padang pasir Tunisia.',
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 75000,
    discountPrice: 65000,
    wholesalePrices: [
      { minQty: 1, maxQty: 10, pricePerUnit: 60000 },
      { minQty: 11, maxQty: 50, pricePerUnit: 54000 },
      { minQty: 51, maxQty: undefined, pricePerUnit: 48000 }
    ],
    stock: 290,
    minStockAlert: 35,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    dimensionsCm: '20 x 14 x 5',
    rating: 4.8,
    reviewCount: 390,
    soldCount: 1450,
    origin: 'Tunisia',
    badge: 'CRISPY SWEET'
  },
  {
    id: 'prod-08',
    name: 'Pasta Kurma Murni Natural 1kg (B2B Bulk)',
    sku: 'PST-KRM-1KG',
    category: 'Grosir',
    description: 'Bahan baku industri makanan, bakery, dan minuman sari kurma. 100% kurma tanpa biji dihaluskan higienis tanpa gula tambahan.',
    images: [
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 65000,
    discountPrice: 55000,
    wholesalePrices: [
      { minQty: 5, maxQty: 25, pricePerUnit: 50000 },
      { minQty: 26, maxQty: 100, pricePerUnit: 45000 },
      { minQty: 101, maxQty: undefined, pricePerUnit: 40000 }
    ],
    stock: 800,
    minStockAlert: 100,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 1000,
    dimensionsCm: '20 x 20 x 10',
    rating: 4.9,
    reviewCount: 110,
    soldCount: 5200,
    origin: 'Saudi Arabia',
    badge: 'B2B INDUSTRY'
  },
  {
    id: 'prod-09',
    name: 'Hampers Lebaran Eksklusif Royal Harvest',
    sku: 'HMP-RYL-001',
    category: 'Hampers',
    description: 'Set bingkisan mewah berisi Kurma Ajwa VIP 500g, Medjool Jumbo 500g, Madu Sidr 250g, dan Cangkir Keramik Eksklusif dalam kotak kayu berukir.',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ],
    regularPrice: 650000,
    discountPrice: 590000,
    wholesalePrices: [
      { minQty: 5, maxQty: 20, pricePerUnit: 550000 },
      { minQty: 21, maxQty: undefined, pricePerUnit: 500000 }
    ],
    stock: 45,
    minStockAlert: 10,
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 2500,
    dimensionsCm: '35 x 25 x 15',
    rating: 5.0,
    reviewCount: 88,
    soldCount: 340,
    origin: 'Exclusive Collection',
    badge: 'LUXURY GIFT'
  }
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-01',
    label: 'Home',
    recipientName: 'Ahmad Fauzi',
    phone: '+62 812-3456-7890',
    streetAddress: 'Jl. Boulevard Barat Raya Blok LC6 No. 18, Kelapa Gading',
    city: 'Jakarta Utara',
    province: 'DKI Jakarta',
    postalCode: '14240',
    country: 'Indonesia',
    isDefault: true
  },
  {
    id: 'addr-02',
    label: 'Office',
    recipientName: 'PT Berkah Pangan Mandiri (c/o Ahmad Fauzi)',
    phone: '+62 21-5790-8888',
    streetAddress: 'Menara Prima Lt. 15, Jl. Dr. Ide Anak Agung Gde Agung Kav 6.2, Mega Kuningan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12950',
    country: 'Indonesia',
    isDefault: false
  },
  {
    id: 'addr-03',
    label: 'Warehouse',
    recipientName: 'Gudang Distribusi Cakung (Ahmad F)',
    phone: '+62 811-9988-7711',
    streetAddress: 'Kawasan Industri Pulogadung Blok J No. 4',
    city: 'Jakarta Timur',
    province: 'DKI Jakarta',
    postalCode: '13930',
    country: 'Indonesia',
    isDefault: false
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-35214',
    orderNumber: 'INV/20231024/MPL/35214',
    createdAt: '2026-08-24 14:30',
    customerId: 'user-002',
    customerName: 'Dudi Santoso',
    customerEmail: 'dudi.s@example.com',
    customerPhone: '+62 813-9876-5432',
    customerType: 'Retail',
    items: [
      {
        productId: 'prod-02',
        productName: 'Kurma Ajwa Al-Madinah 500g Premium',
        sku: 'AK-AJW-001',
        image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80',
        unitPrice: 125000,
        quantity: 2,
        lineTotal: 250000
      },
      {
        productId: 'prod-06',
        productName: 'Madu Murni Akasia Royal 500g',
        sku: 'MD-AKS-500',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
        unitPrice: 85000,
        quantity: 1,
        lineTotal: 85000
      }
    ],
    subtotal: 335000,
    wholesaleDiscount: 0,
    voucherDiscount: 15000,
    voucherCode: 'WELCOME2026',
    shippingCost: 20000,
    tax: 0,
    total: 340000,
    status: 'Dikirim',
    paymentMethod: 'Virtual Account BCA',
    paymentStatus: 'Paid',
    shippingAddress: {
      id: 'addr-cust-01',
      label: 'Home',
      recipientName: 'Dudi Santoso',
      phone: '+62 813-9876-5432',
      streetAddress: 'Jl. Kebon Jeruk No. 12, Kebon Jeruk',
      city: 'Jakarta Barat',
      province: 'DKI Jakarta',
      postalCode: '11530',
      country: 'Indonesia',
      isDefault: true
    },
    courierName: 'JNE Regular',
    trackingNumber: 'JNE98123456789'
  },
  {
    id: 'ord-38210',
    orderNumber: 'INV/20231024/WS/38210',
    createdAt: '2026-08-24 10:15',
    customerId: 'user-003',
    customerName: 'Toko Berkah Utama (Citra Sari)',
    customerEmail: 'citra.s@example.com',
    customerPhone: '+62 818-0909-1212',
    customerType: 'Wholesale',
    items: [
      {
        productId: 'prod-04',
        productName: 'Kurma Sukari Al-Qassim Basah 850g',
        sku: 'AK-SUK-002',
        image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80',
        unitPrice: 68000,
        quantity: 50,
        lineTotal: 3400000
      },
      {
        productId: 'prod-01',
        productName: 'Kurma Medjool Premium Harvest 500g',
        sku: 'AK-MDJ-500',
        image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80',
        unitPrice: 125000,
        quantity: 10,
        lineTotal: 1250000
      }
    ],
    subtotal: 4650000,
    wholesaleDiscount: 558000,
    voucherDiscount: 0,
    shippingCost: 150000,
    tax: 0,
    total: 4242000,
    status: 'Diproses',
    paymentMethod: 'Net 30 Days (Wholesale Billing)',
    paymentStatus: 'Paid',
    appliedTier: 'Gold Partner (12% Off)',
    poNumber: 'PO-TBU-2026-88',
    shippingAddress: {
      id: 'addr-cust-02',
      label: 'Warehouse',
      recipientName: 'Gudang Toko Berkah Utama',
      phone: '+62 818-0909-1212',
      streetAddress: 'Jl. Raya Bogor KM 28 No. 45, Pasar Rebo',
      city: 'Jakarta Timur',
      province: 'DKI Jakarta',
      postalCode: '13710',
      country: 'Indonesia',
      isDefault: true
    },
    courierName: 'Kurir Internal AllKurma Cargo'
  },
  {
    id: 'ord-35102',
    orderNumber: 'INV/20231018/MPL/35102',
    createdAt: '2026-08-18 09:20',
    customerId: 'user-004',
    customerName: 'Siti Aminah',
    customerEmail: 'siti.aminah@example.com',
    customerPhone: '+62 856-1122-3344',
    customerType: 'Retail',
    items: [
      {
        productId: 'prod-06',
        productName: 'Madu Murni Akasia Royal 500g',
        sku: 'MD-AKS-500',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
        unitPrice: 85000,
        quantity: 1,
        lineTotal: 85000
      },
      {
        productId: 'prod-05',
        productName: 'Kurma Khalas Premium Roe 500g',
        sku: 'AK-KHL-500',
        image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80',
        unitPrice: 55000,
        quantity: 1,
        lineTotal: 55000
      }
    ],
    subtotal: 140000,
    wholesaleDiscount: 0,
    voucherDiscount: 20000,
    voucherCode: 'SEHATALAMI',
    shippingCost: 15000,
    tax: 0,
    total: 135000,
    status: 'Selesai',
    paymentMethod: 'GoPay / QRIS',
    paymentStatus: 'Paid',
    shippingAddress: {
      id: 'addr-cust-03',
      label: 'Home',
      recipientName: 'Siti Aminah',
      phone: '+62 856-1122-3344',
      streetAddress: 'Komplek Permata Hijau Blok C3 No. 8',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12210',
      country: 'Indonesia',
      isDefault: true
    },
    courierName: 'SiCepat BEST',
    trackingNumber: '003928172635'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-001',
    date: '26 Agu, 09:30',
    productName: 'Kurma Ajwa Al-Madinah 500g Premium',
    sku: 'AK-AJW-001',
    type: 'Inbound',
    quantityChange: 30,
    unit: 'Karton (150 kg)',
    sourceOrDestination: 'Supplier Impor Madinah Direct',
    warehouse: 'Gudang Utama',
    officer: 'Admin Warehouse (Hadi)',
    notes: 'Penerimaan kontainer panen musim 2026, QC lolos 100%'
  },
  {
    id: 'mov-002',
    date: '25 Agu, 16:15',
    productName: 'Kurma Sukari Al-Qassim Basah 850g',
    sku: 'AK-SUK-002',
    type: 'Outbound',
    quantityChange: -10,
    unit: 'Karton (50 kg)',
    sourceOrDestination: 'Pengiriman Toko Cabang Kelapa Gading',
    warehouse: 'Gudang Utama',
    officer: 'Staf Logistik 1 (Budi)',
    notes: 'Restock mingguan gerai retail'
  },
  {
    id: 'mov-003',
    date: '24 Agu, 17:00',
    productName: 'Kurma Medjool Jumbo Grade A 1kg',
    sku: 'MDJ-JMB-1KG',
    type: 'Opname',
    quantityChange: -2,
    unit: 'Box',
    sourceOrDestination: 'Penyesuaian Fisik Berkala',
    warehouse: 'Gudang Utama',
    officer: 'Supervisor M. Ridwan',
    notes: 'Kerusakan segel saat inspeksi humiditas'
  },
  {
    id: 'mov-004',
    date: '23 Agu, 11:20',
    productName: 'Madu Murni Akasia Royal 500g',
    sku: 'MD-AKS-500',
    type: 'Inbound',
    quantityChange: 50,
    unit: 'Karton (100 btl)',
    sourceOrDestination: 'Peternak Lebah Riau Mandiri',
    warehouse: 'Gudang Transit',
    officer: 'Admin Warehouse (Hadi)'
  }
];

export const INITIAL_PROMOTIONS: PromotionVoucher[] = [
  {
    id: 'promo-01',
    name: 'Ramadan Special Kurma Ajwa',
    code: 'RAMADAN-2026',
    status: 'Active',
    description: 'Diskon 15% untuk pembelian kurma Ajwa & Medjool menyambut bulan suci.',
    discountType: 'percentage',
    discountValue: 15,
    maxDiscountCap: 100000,
    minPurchase: 150000,
    totalUsageLimit: 1000,
    usedCount: 145,
    usagePerCustomer: 2,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    customerSegment: 'All Customers'
  },
  {
    id: 'promo-02',
    name: 'Wholesale Harvest Partner Bonus',
    code: 'HARVEST20',
    status: 'Active',
    description: 'Potongan langsung Rp 250.000 untuk pesanan grosir di atas Rp 2.000.000.',
    discountType: 'fixed',
    discountValue: 250000,
    minPurchase: 2000000,
    totalUsageLimit: 200,
    usedCount: 38,
    usagePerCustomer: 5,
    startDate: '2026-08-15',
    endDate: '2026-10-31',
    customerSegment: 'Wholesale Only'
  },
  {
    id: 'promo-03',
    name: 'Gold Member Exclusive Perk',
    code: 'GOLDVIP',
    status: 'Active',
    description: 'Diskon ekstra 5% tanpa batas untuk pemegang tier Gold & Platinum.',
    discountType: 'percentage',
    discountValue: 5,
    minPurchase: 100000,
    totalUsageLimit: 500,
    usedCount: 72,
    usagePerCustomer: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    customerSegment: 'Gold/Platinum'
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-01',
    title: 'Royal Medjool Gift Box (500g)',
    category: 'Products',
    pointsCost: 1200,
    image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80',
    description: 'Kurma Medjool pilihan terbaik dikemas dalam hardbox satin emas berdesain kaligrafi eksklusif.',
    stock: 45,
    badge: 'POPULAR'
  },
  {
    id: 'rew-02',
    title: 'Organic Sidr Honey (250g)',
    category: 'Products',
    pointsCost: 800,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
    description: 'Madu Sidr murni kualitas premium dengan aroma wangi nektar bunga liar yang menenangkan.',
    stock: 60,
    badge: 'ORGANIC'
  },
  {
    id: 'rew-03',
    title: 'Store Discount Rp 250.000 Off Voucher',
    category: 'Vouchers',
    pointsCost: 500,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
    description: 'Voucher belanja senilai Rp 250.000 dapat digunakan untuk semua produk tanpa syarat minimum.',
    stock: 999,
    badge: 'BEST VALUE'
  },
  {
    id: 'rew-04',
    title: 'Orchard & Packing Facility VIP Tasting Tour',
    category: 'Experiences',
    pointsCost: 3500,
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format&fit=crop&q=80',
    description: 'Tur eksklusif melihat fasilitas cold storage berteknologi tinggi, edukasi kurma, dan sesi icip 12 varietas kurma dunia.',
    stock: 12,
    badge: 'VIP EXPERIENCE'
  },
  {
    id: 'rew-05',
    title: 'Free Ajwa Dates Pack (250g)',
    category: 'Products',
    pointsCost: 650,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80',
    description: 'Kemasan saku praktis Kurma Ajwa Madinah Grade A untuk asupan stamina harian Anda.',
    stock: 100
  }
];

export const INITIAL_POINT_TRANSACTIONS: PointTransaction[] = [
  {
    id: 'pt-01',
    date: '26 Agu 2026',
    title: 'Purchase - Order #INV/20231024/WS/38210',
    type: 'earned',
    points: 150,
    description: 'Points earned from wholesale order fulfillment',
    referenceId: 'ord-38210'
  },
  {
    id: 'pt-02',
    date: '20 Agu 2026',
    title: 'Product Review Verified',
    type: 'earned',
    points: 50,
    description: 'Ulasan foto terverifikasi untuk Kurma Medjool Harvest'
  },
  {
    id: 'pt-03',
    date: '15 Agu 2026',
    title: 'Redemption - Royal Medjool Gift Box',
    type: 'redeemed',
    points: 500,
    description: 'Penukaran poin hadiah eksklusif'
  },
  {
    id: 'pt-04',
    date: '10 Agu 2026',
    title: 'Birthday Member Celebration Bonus',
    type: 'earned',
    points: 200,
    description: 'Bonus loyalitas tahunan pemegang tier Gold'
  }
];

export const INITIAL_INVOICES: WholesaleInvoice[] = [
  {
    id: 'inv-891',
    invoiceNumber: 'INV-2026-0891',
    orderNumber: 'INV/20231024/WS/38210',
    dateIssued: '24 Agu 2026',
    dueDate: '24 Sep 2026',
    amount: 4242000,
    status: 'Unpaid',
    companyName: 'PT Berkah Pangan Mandiri',
    itemsSummary: 'Kurma Sukari 50 Karton, Medjool 10 Karton'
  },
  {
    id: 'inv-872',
    invoiceNumber: 'INV-2026-0872',
    orderNumber: 'INV/20230810/WS/31092',
    dateIssued: '10 Agu 2026',
    dueDate: '10 Sep 2026',
    amount: 14250000,
    status: 'Paid',
    companyName: 'PT Berkah Pangan Mandiri',
    itemsSummary: 'Kurma Ajwa 100 Karton, Pasta Kurma 20 Karton'
  },
  {
    id: 'inv-855',
    invoiceNumber: 'INV-2026-0855',
    orderNumber: 'INV/20230720/WS/29841',
    dateIssued: '20 Jul 2026',
    dueDate: '20 Agu 2026',
    amount: 18500000,
    status: 'Paid',
    companyName: 'PT Berkah Pangan Mandiri',
    itemsSummary: 'Kurma Medjool Jumbo 80 Karton, Madu Akasia 50 Karton'
  }
];

export const INITIAL_RETURNS: ReturnRequest[] = [
  {
    id: 'rma-8842',
    returnCode: 'RET-8842',
    orderNumber: 'INV/20231024/MPL/35214',
    createdAt: '24 Agu 2026',
    customerId: 'user-005',
    customerName: 'Emma Thompson',
    customerEmail: 'emma.t@example.com',
    items: [
      {
        productId: 'prod-01',
        productName: 'Premium Medjool Dates - Royal Grade 500g',
        sku: 'AK-MDJ-500',
        image: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80',
        unitPrice: 150000,
        quantityReturned: 2,
        reason: 'Kemasan rusak saat pengiriman, segel terbuka pada 1 unit'
      }
    ],
    reason: 'Damaged in Transit',
    comments: 'Kotak kardus basah dan ada penyok parah di bagian samping saat diterima dari kurir.',
    proofImages: [
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80'
    ],
    estimatedCredit: 300000,
    status: 'Under Inspection',
    inspectionNotes: 'Outer box crushed, store seals broken on 1 unit. Buah dalam 1 box masih higienis.',
    creditAdjusted: 270000,
    restockingFee: 0,
    resolutionStatus: 'Pending',
    inspectorName: 'Quality Lead (Khalid I.)'
  },
  {
    id: 'rma-0891',
    returnCode: 'RET-2023-0891',
    orderNumber: 'INV/20231018/MPL/35102',
    createdAt: '19 Agu 2026',
    customerId: 'user-004',
    customerName: 'Siti Aminah',
    customerEmail: 'siti.aminah@example.com',
    items: [
      {
        productId: 'prod-05',
        productName: 'Kurma Khalas Premium Roe 500g',
        sku: 'AK-KHL-500',
        image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80',
        unitPrice: 55000,
        quantityReturned: 1,
        reason: 'Salah varian varietas terkirim'
      }
    ],
    reason: 'Wrong Item',
    proofImages: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80'
    ],
    estimatedCredit: 55000,
    status: 'Completed',
    creditAdjusted: 55000,
    resolutionStatus: 'Approved Full',
    inspectorName: 'Supervisor M. Ridwan'
  }
];

export const INITIAL_ROLES: RolePermission[] = [
  {
    id: 'role-superadmin',
    roleName: 'Super Admin',
    description: 'Full access to all system modules, financial settings, and comprehensive user management.',
    userCount: 3,
    isSystemDefault: true,
    permissions: {
      inventory: { viewProducts: true, addEditProducts: true, manageStockLevels: true },
      orders: { viewOrders: true, processFulfillOrders: true, processRefunds: true },
      systemSettings: { manageUsers: true, manageRoles: true, systemSettings: true }
    }
  },
  {
    id: 'role-warehouse',
    roleName: 'Warehouse Manager',
    description: 'Access to inventory counts, stock movement logging, orders processing, and basic logistics reports.',
    userCount: 6,
    isSystemDefault: false,
    permissions: {
      inventory: { viewProducts: true, addEditProducts: true, manageStockLevels: true },
      orders: { viewOrders: true, processFulfillOrders: true, processRefunds: false },
      systemSettings: { manageUsers: false, manageRoles: false, systemSettings: false }
    }
  },
  {
    id: 'role-sales',
    roleName: 'Sales Representative',
    description: 'Access to customer CRM, catalog views, quotation generation, and wholesale quick order placement.',
    userCount: 14,
    isSystemDefault: false,
    permissions: {
      inventory: { viewProducts: true, addEditProducts: false, manageStockLevels: false },
      orders: { viewOrders: true, processFulfillOrders: false, processRefunds: false },
      systemSettings: { manageUsers: false, manageRoles: false, systemSettings: false }
    }
  },
  {
    id: 'role-marketing',
    roleName: 'Marketing Admin',
    description: 'Access to promotions management, voucher campaigns, customer analytics, and loyalty tier rewards.',
    userCount: 4,
    isSystemDefault: false,
    permissions: {
      inventory: { viewProducts: true, addEditProducts: false, manageStockLevels: false },
      orders: { viewOrders: true, processFulfillOrders: false, processRefunds: false },
      systemSettings: { manageUsers: false, manageRoles: false, systemSettings: false }
    }
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  siteName: 'AllKurma',
  contactEmail: 'admin@allkurma.enterprise',
  brandSlogan: 'Premium Quality Dates & Organics',
  defaultCurrency: 'IDR - Indonesian Rupiah (Rp)',
  timezone: '(UTC+07:00) WIB - Jakarta',
  autoApproveWholesale: true,
  twoFactorAuthRequired: false
};

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    userName: 'Siti Rahmawati',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-24 14:15',
    variationName: 'Kemasan 500g VIP',
    comment: 'Alhamdulillah kurma medjoolnya masya Allah enak banget! Dagingnya tebal, legit, manisnya pas alami tanpa pemanis buatan. Kemasan kardus tebal + bubble wrap aman tidak ada yang penyok. Pengiriman kilat!',
    photos: [
      'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format&fit=crop&q=80'
    ],
    isVerifiedBuyer: true,
    helpfulCount: 42
  },
  {
    id: 'rev-02',
    productId: 'prod-01',
    userName: 'Budi Santoso',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-22 09:30',
    variationName: 'Kemasan 1kg Box Eksklusif',
    comment: 'Langganan beli di AllKurma Official Store. Kualitas selalu terjamin grade VIP. Diskon vouchernya lumayan banget potong 35rb + gratis ongkir XTRA. Terima kasih seller.',
    photos: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80'
    ],
    isVerifiedBuyer: true,
    helpfulCount: 28
  },
  {
    id: 'rev-03',
    productId: 'prod-02',
    userName: 'Nurul Hidayah',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    date: '2026-08-20 18:40',
    variationName: 'Kemasan 500g Madinah',
    comment: 'Kurma Ajwa asli Madinah, ada sertifikat keasliannya di dalam box. Teksturnya lembut tidak kering, cocok untuk sunnah 7 butir tiap pagi. Recommended seller!',
    photos: [
      'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400&auto=format&fit=crop&q=80'
    ],
    isVerifiedBuyer: true,
    helpfulCount: 19
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    title: 'Pesanan Sedang Dikirim! 🚚',
    message: 'Pesanan #AK-ORD-2026-0891 sedang dibawa kurir Kurma Express Menuju Alamat Anda. Estimasi tiba hari ini.',
    date: '10 menit lalu',
    type: 'order',
    read: false
  },
  {
    id: 'notif-02',
    title: 'Flash Sale Kilat Dimulai! ⚡️',
    message: 'Kurma Sukari Al-Qassim diskon 40% + Gratis Ongkir Rp0. Buruan checkout sebelum stok habis!',
    date: '1 jam lalu',
    type: 'promo',
    read: false
  },
  {
    id: 'notif-03',
    title: 'Poin Kurma Berhasil Diklaim 🎉',
    message: 'Selamat! Kamu mendapatkan +200 Poin Kurma dari Daily Check-in Hari ke-3.',
    date: 'Hari ini 07:00',
    type: 'points',
    read: true
  },
  {
    id: 'notif-04',
    title: 'Voucher Spesial Baru Tersedia! 🎟️',
    message: 'Klaim voucher cashback 15% & potongan grosir s/d Rp 100.000 sekarang di halaman promo.',
    date: 'Kemarin',
    type: 'promo',
    read: true
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'bot',
    text: 'Halo Kak! Selamat datang di AllKurma Official Store. Kami menjamin 100% kurma panen terbaru grade A, garansi original, & packing bubble wrap super aman. Ada yang bisa kami bantu? 😊',
    timestamp: '09:00',
    isRead: true
  },
  {
    id: 'msg-02',
    sender: 'user',
    text: 'Halo kak, apakah Kurma Medjool 500g ready stock dan bisa dikirim hari ini?',
    timestamp: '09:02',
    isRead: true
  },
  {
    id: 'msg-03',
    sender: 'seller',
    text: 'Ready banget kak! Semua pesanan masuk sebelum jam 16.00 WIB langsung kami kirim di hari yang sama ya kak. Jangan lupa pakai Voucher Toko Gratis Ongkir XTRA & Tukar Poin Kurma ya Kak 🙏✨',
    timestamp: '09:03',
    isRead: true
  }
];

export const INITIAL_SELLER_STORE: SellerStoreProfile = {
  storeName: 'AllKurma Official Store',
  storeHandle: '@allkurma.official',
  tagline: 'Pusat Kurma Impor Timur Tengah & Grosir Berkah Se-Indonesia',
  description: 'Supplier dan distributor resmi langsung dari perkebunan kurma Madinah, Al Qassim, California, dan Tunisia. Menyediakan kurma retail kemasan higienis ber-BPOM dan partai besar kartonan grosir.',
  logo: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=200&auto=format&fit=crop&q=80',
  banner: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1200&auto=format&fit=crop&q=80',
  city: 'Jakarta Pusat',
  fullAddress: 'Jl. Tanah Abang Bukit No. 88, Petojo Selatan, Gambir, Jakarta Pusat 10160',
  postalCode: '10160',
  phone: '+62 812-8899-7711',
  email: 'seller@allkurma.com',
  operationalHours: 'Senin - Sabtu: 08:00 - 18:00 WIB',
  isVacationMode: false,
  isOfficialStore: true,
  enableAutoReply: true,
  autoReplyGreeting: 'Halo Kak! Terima kasih sudah menghubungi AllKurma Official. Tim CS kami akan membalas pertanyaan Anda dalam beberapa saat. Pesanan sebelum 16:00 dikirim hari ini!',
  autoReplyOffHours: 'Terima kasih atas pesanan Anda. Saat ini toko sedang di luar jam operasional (Tutup 18:00 WIB). Pesanan Anda akan diproses esok pagi jam 08:00 WIB.',
  authorizedStaff: [
    {
      id: 'staff-001',
      name: 'Admin Utama (Owner)',
      email: 'atdigitalstudio2026@gmail.com',
      role: 'Super Admin Toko',
      addedAt: '2026-01-01',
      status: 'active',
      phone: '+62 812-8899-7711'
    },
    {
      id: 'staff-002',
      name: 'Operasional Toko AllKurma',
      email: 'seller@allkurma.id',
      role: 'Manajer Operasional',
      addedAt: '2026-01-15',
      status: 'active',
      phone: '+62 811-2233-4455'
    },
    {
      id: 'staff-003',
      name: 'Administrator Pusat',
      email: 'admin@allkurma.id',
      role: 'Super Admin Toko',
      addedAt: '2026-02-01',
      status: 'active',
      phone: '+62 813-4455-6677'
    }
  ],
  couriers: [
    { id: 'c-01', name: 'Kurma Express Reguler (J&T / SiCepat)', type: 'Reguler', active: true, freeShippingEnabled: true },
    { id: 'c-02', name: 'Grosir Kargo (JNE Trucking / Indah Cargo)', type: 'Kargo', active: true, freeShippingEnabled: true },
    { id: 'c-03', name: 'Instant / Same Day (GoSend & GrabExpress)', type: 'Instant / Sameday', active: true, freeShippingEnabled: false },
    { id: 'c-04', name: 'Kurma Hemat (AnterAja Eco)', type: 'Hemat', active: true, freeShippingEnabled: true }
  ],
  bankAccount: {
    bankName: 'BCA (Bank Central Asia)',
    accountNumber: '8820-9182-3341',
    holderName: 'PT ALLKURMA BERKAH NUSANTARA',
    verified: true
  },
  payoutBalance: 18450000,
  taxNumber: '09.876.543.2-012.000',
  minFreeShippingOrder: 150000
};

