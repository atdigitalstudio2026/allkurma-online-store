import React, { useState } from 'react';
import {
  Store,
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  Truck,
  Building2,
  Clock,
  ShieldCheck,
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Printer,
  Eye,
  Percent,
  Image as ImageIcon,
  Send,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowDownLeft,
  ArrowRight,
  RotateCcw,
  X,
  FileText,
  Lock,
  LogIn,
  ArrowLeft,
  FileSpreadsheet,
  Users,
  UserPlus,
  Mail,
  KeyRound,
  UserCheck,
  Tag,
  Barcode,
  Boxes,
  RefreshCw,
  Box,
  Warehouse,
  CalendarDays,
  Flame,
  Zap,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Order, PromotionVoucher, ProductVariation, AppHeroBanner } from '../../types';
import { exportSalesReportToExcel, exportInventoryReportToExcel } from '../../utils/exportReport';
import { normalizeImageUrl, isDropboxUrl } from '../../utils/imageUrlHelper';
import { SkuBarcodePrintModal } from './SkuBarcodePrintModal';
import { SkuStockAdjustmentModal } from './SkuStockAdjustmentModal';

const BANNER_GRADIENT_PRESETS = [
  { name: 'Royal Blue & Emerald (Resmi)', value: 'from-[#1E3A8A] via-blue-700 to-[#009A44]', tag: 'bg-white/20 text-emerald-100 border-white/30' },
  { name: 'Sunset Amber & Red (Flash Sale)', value: 'from-orange-600 via-amber-600 to-red-600', tag: 'bg-white/25 text-white border-white/40' },
  { name: 'Fresh Emerald & Teal (Panen 2026)', value: 'from-[#009A44] via-emerald-600 to-teal-700', tag: 'bg-white/20 text-white border-white/30' },
  { name: 'Navy & B2B Indigo (Grosir Pabrik)', value: 'from-blue-700 via-[#1E3A8A] to-indigo-800', tag: 'bg-white/20 text-white border-white/30' },
  { name: 'Luxury Purple & Violet (Hampers)', value: 'from-purple-700 via-indigo-600 to-[#1E3A8A]', tag: 'bg-white/20 text-white border-white/30' },
  { name: 'Desert Gold & Stone (Klasik)', value: 'from-amber-700 via-amber-800 to-stone-900', tag: 'bg-white/20 text-amber-100 border-amber-200/30' }
];

const BANNER_IMAGE_PRESETS = [
  { label: 'Poster Kurma Ajwa VIP', url: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Banner Penuh Widescreen', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Paket Kombo Bundling', url: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Panen Perdana 2026', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Gudang Grosir B2B', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80' }
];

export const SellerDashboardScreen: React.FC = () => {
  const {
    user,
    sellerStore,
    updateSellerStore,
    withdrawSellerBalance,
    toggleSellerCourier,
    replySellerReview,
    addSellerStaff,
    removeSellerStaff,
    toggleSellerStaffStatus,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    orders,
    updateOrderStatus,
    promotions,
    createPromotion,
    togglePromotionStatus,
    reviews,
    setCurrentView,
    setSelectedProductId,
    showToast,
    loginSeller,
    setIsAuthModalOpen,
    setAuthModalMode,
    broadcastToFollowers,
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    resetHeroBanners
  } = useApp();

  // Active Tab in Seller Center
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'orders' | 'products' | 'flashsale' | 'vouchers' | 'reviews' | 'followers' | 'banners'>('overview');

  // Hero Banner Management State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AppHeroBanner | null>(null);
  const [bannerPreviewIndex, setBannerPreviewIndex] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [bannerForm, setBannerForm] = useState({
    badge: 'Panen Raya 2026',
    title: 'Kurma Ajwa Madinah Grade VIP',
    subtitle: 'Dipetik langsung dari perkebunan pilihan Madinah. 100% Alami & Berkhasiat.',
    cta: 'Beli Sekarang',
    targetCategory: 'Semua',
    targetView: '',
    isBundlingTrigger: false,
    bgGradient: 'from-[#1E3A8A] via-blue-700 to-[#009A44]',
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
    tagColor: 'bg-white/20 text-emerald-100 border-white/30',
    active: true,
    displayMode: 'standard' as 'standard' | 'full-image',
    showTextOverlay: false,
    objectFit: 'cover' as 'cover' | 'contain'
  });

  // Flash Sale Management State
  const [isFlashSaleModalOpen, setIsFlashSaleModalOpen] = useState(false);
  const [flashSaleTargetProduct, setFlashSaleTargetProduct] = useState<Product | null>(null);
  const [flashSaleDiscountInput, setFlashSaleDiscountInput] = useState<number>(25);
  const [flashSalePriceInput, setFlashSalePriceInput] = useState<number>(0);
  const [flashSaleSessionActive, setFlashSaleSessionActive] = useState<boolean>(true);

  // Broadcast to Followers Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPromoCode, setBroadcastPromoCode] = useState('');
  const [broadcastType, setBroadcastType] = useState<'promo' | 'new_product' | 'flash_sale'>('promo');

  // General Settings State
  const [storeForm, setStoreForm] = useState({
    storeName: sellerStore.storeName,
    storeHandle: sellerStore.storeHandle,
    tagline: sellerStore.tagline,
    description: sellerStore.description,
    logo: sellerStore.logo,
    banner: sellerStore.banner,
    city: sellerStore.city,
    fullAddress: sellerStore.fullAddress,
    postalCode: sellerStore.postalCode,
    phone: sellerStore.phone,
    email: sellerStore.email,
    operationalHours: sellerStore.operationalHours,
    isVacationMode: sellerStore.isVacationMode,
    isOfficialStore: sellerStore.isOfficialStore,
    enableAutoReply: sellerStore.enableAutoReply,
    autoReplyGreeting: sellerStore.autoReplyGreeting,
    autoReplyOffHours: sellerStore.autoReplyOffHours,
    taxNumber: sellerStore.taxNumber,
    minFreeShippingOrder: sellerStore.minFreeShippingOrder
  });

  // Payout / Withdrawal modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Shipping Label (Resi) Modal
  const [selectedOrderForLabel, setSelectedOrderForLabel] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // New Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormTab, setProductFormTab] = useState<'general' | 'pricing' | 'inventory' | 'variations' | 'wholesale'>('general');
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState<Product | null>(null);
  const [selectedProductForStockAdjust, setSelectedProductForStockAdjust] = useState<Product | null>(null);
  
  // SKU Search & Filter States
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('Semua');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'safe' | 'low' | 'empty'>('all');
  const [productSortBy, setProductSortBy] = useState<'default' | 'stock-desc' | 'stock-asc' | 'price-desc' | 'margin-desc'>('default');
  const [expandedProductVariations, setExpandedProductVariations] = useState<Record<string, boolean>>({});

  // Product Deletion & Bulk Management States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);
  const [selectedProductIdsForBulk, setSelectedProductIdsForBulk] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    sku: '',
    barcode: '',
    category: 'Medjool',
    costPrice: 90000,
    regularPrice: 150000,
    discountPrice: 135000,
    stock: 50,
    minStockAlert: 10,
    origin: 'Madinah, Saudi Arabia',
    harvestYear: 'Panen 2025/2026',
    shelfLife: '18 Bulan',
    expiryDate: '2027-12-31',
    storageCondition: 'Suhu Sejuk (Simpan Kulkas)',
    packagingType: 'Pouch Kedap Udara Food-Grade',
    certification: 'Halal MUI & Kementan RI',
    description: '',
    warehouseRack: 'Rak A1-01',
    warehouseLocation: 'Gudang Utama - Jakarta Pusat',
    weightGram: 500,
    images: [],
    freeShippingExtra: true,
    cashbackExtra: true,
    isFlashSale: false,
    flashSaleDiscountPercent: 20,
    isNewArrival: true,
    variations: []
  });

  // New Voucher Modal
  const [isAddVoucherOpen, setIsAddVoucherOpen] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    name: '',
    code: '',
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 20000,
    minPurchase: 100000,
    totalUsageLimit: 100,
    description: ''
  });

  // Review Reply State
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Staff Access Management State
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'Super Admin Toko' | 'Manajer Operasional' | 'Staff Gudang & Pesanan' | 'Customer Support CS'>('Manajer Operasional');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      showToast('Harap masukkan nama staf pengelola!', 'error');
      return;
    }
    if (!newStaffEmail.trim() || !newStaffEmail.includes('@')) {
      showToast('Harap masukkan format email yang valid!', 'error');
      return;
    }
    addSellerStaff({
      name: newStaffName.trim(),
      email: newStaffEmail.trim().toLowerCase(),
      role: newStaffRole,
      phone: newStaffPhone.trim() || undefined,
      status: 'active'
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setIsAddingStaff(false);
  };

  // Order filter in Seller Center
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | 'Perlu Diproses' | 'Dikirim' | 'Selesai' | 'Retur'>('All');

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    if (orderStatusFilter === 'Perlu Diproses') return o.status === 'Belum Bayar' || o.status === 'Diproses';
    if (orderStatusFilter === 'Dikirim') return o.status === 'Dikirim';
    if (orderStatusFilter === 'Selesai') return o.status === 'Selesai';
    if (orderStatusFilter === 'Retur') return o.status === 'Retur';
    return true;
  });

  // Handle store profile update
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerStore(storeForm);
  };

  // Banner Handlers
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      badge: 'Promo Spesial',
      title: 'Kurma Premium Segar Pilihan',
      subtitle: 'Dipetik langsung dari perkebunan pilihan dengan jaminan kualitas terbaik.',
      cta: 'Beli Sekarang',
      targetCategory: 'Semua',
      targetView: '',
      isBundlingTrigger: false,
      bgGradient: 'from-[#1E3A8A] via-blue-700 to-[#009A44]',
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
      tagColor: 'bg-white/20 text-emerald-100 border-white/30',
      active: true,
      displayMode: 'standard',
      showTextOverlay: false,
      objectFit: 'cover'
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (banner: AppHeroBanner) => {
    setEditingBanner(banner);
    setBannerForm({
      badge: banner.badge || '',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      cta: banner.cta || 'Beli Sekarang',
      targetCategory: banner.targetCategory || 'Semua',
      targetView: banner.targetView || '',
      isBundlingTrigger: !!banner.isBundlingTrigger,
      bgGradient: banner.bgGradient || 'from-[#1E3A8A] via-blue-700 to-[#009A44]',
      image: banner.image || '',
      tagColor: banner.tagColor || 'bg-white/20 text-emerald-100 border-white/30',
      active: banner.active !== false,
      displayMode: banner.displayMode || 'standard',
      showTextOverlay: !!banner.showTextOverlay,
      objectFit: banner.objectFit || 'cover'
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) {
      showToast('Judul banner dan URL gambar wajib diisi!', 'error');
      return;
    }

    const normalizedImg = normalizeImageUrl(bannerForm.image);

    if (editingBanner) {
      updateHeroBanner(editingBanner.id, {
        badge: bannerForm.badge,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        cta: bannerForm.cta,
        targetCategory: bannerForm.targetCategory,
        targetView: bannerForm.targetView,
        isBundlingTrigger: bannerForm.isBundlingTrigger,
        bgGradient: bannerForm.bgGradient,
        image: normalizedImg,
        tagColor: bannerForm.tagColor,
        active: bannerForm.active,
        displayMode: bannerForm.displayMode,
        showTextOverlay: bannerForm.showTextOverlay,
        objectFit: bannerForm.objectFit
      });
      showToast(`Banner "${bannerForm.title}" berhasil diperbarui!`, 'success');
    } else {
      addHeroBanner({
        badge: bannerForm.badge,
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        cta: bannerForm.cta,
        targetCategory: bannerForm.targetCategory,
        targetView: bannerForm.targetView,
        isBundlingTrigger: bannerForm.isBundlingTrigger,
        bgGradient: bannerForm.bgGradient,
        image: normalizedImg,
        tagColor: bannerForm.tagColor,
        active: bannerForm.active,
        displayMode: bannerForm.displayMode,
        showTextOverlay: bannerForm.showTextOverlay,
        objectFit: bannerForm.objectFit
      });
      showToast(`Banner baru "${bannerForm.title}" berhasil ditambahkan!`, 'success');
    }
    setIsBannerModalOpen(false);
  };

  const handleToggleBannerActive = (banner: AppHeroBanner) => {
    const nextState = banner.active === false ? true : false;
    updateHeroBanner(banner.id, { active: nextState });
    showToast(`Banner "${banner.title}" kini ${nextState ? 'Aktif (Tampil)' : 'Dinonaktifkan'}`, 'info');
  };

  const handleDeleteBannerConfirm = (banner: AppHeroBanner) => {
    if (heroBanners.length <= 1) {
      showToast('Minimal harus ada 1 banner di sistem!', 'warning');
      return;
    }
    deleteHeroBanner(banner.id);
    showToast(`Banner "${banner.title}" berhasil dihapus`, 'success');
  };

  // Handle Withdrawal submit
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount.replace(/[^0-9]/g, ''), 10);
    if (!amt || isNaN(amt)) {
      showToast('Masukkan jumlah penarikan yang valid!', 'error');
      return;
    }
    const success = withdrawSellerBalance(amt);
    if (success) {
      setIsWithdrawOpen(false);
      setWithdrawAmount('');
    }
  };

  // Handle Send Order / Update Tracking
  const handleProcessOrder = (order: Order) => {
    if (order.status === 'Belum Bayar' || order.status === 'Diproses') {
      const generatedResi = `AK-EXP-${Date.now().toString().slice(-6)}`;
      updateOrderStatus(order.id, 'Dikirim');
      showToast(`Pesanan #${order.orderNumber} berhasil diproses! Resi kurir: ${generatedResi}`, 'success');
    }
  };

  // Handle Export Sales Report to Excel
  const handleExportSellerOrders = () => {
    try {
      const dataToExport = filteredOrders.length > 0 ? filteredOrders : orders;
      exportSalesReportToExcel(dataToExport, `Laporan_Penjualan_${sellerStore.storeName.replace(/\s+/g, '_')}`);
      showToast(`Berhasil mengekspor ${dataToExport.length} pesanan ke Excel (.csv)!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengekspor laporan', 'error');
    }
  };

  // Handle Export Inventory / SKU Report to Excel
  const handleExportInventoryExcel = () => {
    try {
      exportInventoryReportToExcel(products, `Laporan_Stok_Inventori_${sellerStore.storeName.replace(/\s+/g, '_')}`);
      showToast(`Berhasil mengekspor data ${products.length} master SKU ke Excel (.csv)!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Gagal mengekspor inventori', 'error');
    }
  };

  // Handle SKU Stock Adjustment Confirmation
  const handleConfirmSkuStockAdjustment = (
    productId: string,
    variationId: string | null,
    newStock: number,
    logDetails: {
      type: string;
      qtyChange: number;
      refDoc: string;
      notes: string;
      officer: string;
    }
  ) => {
    const targetProd = products.find(p => p.id === productId);
    if (!targetProd) return;

    if (variationId && targetProd.variations && targetProd.variations.length > 0) {
      const updatedVariations = targetProd.variations.map(v => {
        if (v.id === variationId) {
          return { ...v, stock: newStock };
        }
        return v;
      });
      const calculatedTotalStock = updatedVariations.reduce((sum, v) => sum + v.stock, 0);
      updateProduct(productId, {
        variations: updatedVariations,
        stock: calculatedTotalStock
      });
      showToast(`Stok SKU ${logDetails.refDoc} berhasil disesuaikan menjadi ${newStock} unit (${logDetails.type})`, 'success');
    } else {
      updateProduct(productId, { stock: newStock });
      showToast(`Stok ${targetProd.name} berhasil disesuaikan menjadi ${newStock} unit (${logDetails.type})`, 'success');
    }

    setSelectedProductForStockAdjust(null);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setNewProd({
      name: prod.name,
      sku: prod.sku,
      barcode: prod.barcode || '',
      category: prod.category,
      costPrice: prod.costPrice || Math.round((prod.discountPrice || prod.regularPrice) * 0.6),
      regularPrice: prod.regularPrice,
      discountPrice: prod.discountPrice,
      stock: prod.stock,
      minStockAlert: prod.minStockAlert || 10,
      origin: prod.origin,
      harvestYear: prod.harvestYear || 'Panen 2025/2026',
      shelfLife: prod.shelfLife || '18 Bulan',
      expiryDate: prod.expiryDate || '2027-12-31',
      storageCondition: prod.storageCondition || 'Suhu Sejuk (Simpan Kulkas)',
      packagingType: prod.packagingType || 'Pouch Kedap Udara Food-Grade',
      certification: prod.certification || 'Halal MUI & Kementan RI',
      description: prod.description,
      warehouseRack: prod.warehouseRack || 'Rak A1-01',
      warehouseLocation: prod.warehouseLocation,
      weightGram: prod.weightGram,
      images: prod.images,
      freeShippingExtra: prod.freeShippingExtra,
      cashbackExtra: prod.cashbackExtra,
      isFlashSale: prod.isFlashSale || false,
      flashSaleDiscountPercent: prod.flashSaleDiscountPercent || 20,
      isNewArrival: prod.isNewArrival !== undefined ? prod.isNewArrival : true,
      createdAt: prod.createdAt,
      variations: prod.variations ? JSON.parse(JSON.stringify(prod.variations)) : [],
      wholesalePrices: prod.wholesalePrices ? JSON.parse(JSON.stringify(prod.wholesalePrices)) : []
    });
    setProductFormTab('general');
    setIsAddProductOpen(true);
  };

  const handleOpenFlashSaleForProduct = (prod: Product) => {
    setFlashSaleTargetProduct(prod);
    const initialDiscount = prod.flashSaleDiscountPercent || 25;
    setFlashSaleDiscountInput(initialDiscount);
    const calcPrice = prod.discountPrice || Math.round(prod.regularPrice * (1 - initialDiscount / 100));
    setFlashSalePriceInput(calcPrice);
    setIsFlashSaleModalOpen(true);
  };

  const handleSaveFlashSaleProduct = () => {
    if (!flashSaleTargetProduct) return;
    const discount = Math.max(5, Math.min(90, Number(flashSaleDiscountInput) || 20));
    const finalPrice = flashSalePriceInput > 0 
      ? flashSalePriceInput 
      : Math.round(flashSaleTargetProduct.regularPrice * (1 - discount / 100));

    updateProduct(flashSaleTargetProduct.id, {
      isFlashSale: true,
      flashSaleDiscountPercent: discount,
      discountPrice: finalPrice
    });
    showToast(`Produk "${flashSaleTargetProduct.name}" berhasil didaftarkan ke Flash Sale (Diskon ${discount}%)!`, 'success');
    setIsFlashSaleModalOpen(false);
    setFlashSaleTargetProduct(null);
  };

  const handleRemoveFromFlashSale = (productId: string, productName: string) => {
    updateProduct(productId, {
      isFlashSale: false,
      flashSaleDiscountPercent: undefined
    });
    showToast(`Produk "${productName}" telah dikeluarkan dari Flash Sale.`, 'info');
    if (flashSaleTargetProduct?.id === productId) {
      setIsFlashSaleModalOpen(false);
      setFlashSaleTargetProduct(null);
    }
  };

  const handleToggleExpandVariation = (prodId: string) => {
    setExpandedProductVariations(prev => ({
      ...prev,
      [prodId]: !prev[prodId]
    }));
  };

  // Inventory & SKU Metrics
  let totalMasterSkus = products.length;
  let totalActiveSkus = 0;
  let totalPhysicalStockUnits = 0;
  let totalInventoryHpp = 0;
  let totalInventoryRevenue = 0;
  let lowStockSkuCount = 0;
  let outOfStockSkuCount = 0;

  products.forEach(p => {
    if (p.variations && p.variations.length > 0) {
      totalActiveSkus += p.variations.length;
      p.variations.forEach(v => {
        const cost = v.costPrice || p.costPrice || Math.round((v.discountPrice || v.regularPrice) * 0.6);
        const sellPrice = v.discountPrice || v.regularPrice;
        totalPhysicalStockUnits += v.stock;
        totalInventoryHpp += cost * v.stock;
        totalInventoryRevenue += sellPrice * v.stock;
        if (v.stock === 0) outOfStockSkuCount++;
        else if (v.stock <= (v.minStockAlert || p.minStockAlert || 10)) lowStockSkuCount++;
      });
    } else {
      totalActiveSkus += 1;
      const cost = p.costPrice || Math.round((p.discountPrice || p.regularPrice) * 0.6);
      const sellPrice = p.discountPrice || p.regularPrice;
      totalPhysicalStockUnits += p.stock;
      totalInventoryHpp += cost * p.stock;
      totalInventoryRevenue += sellPrice * p.stock;
      if (p.stock === 0) outOfStockSkuCount++;
      else if (p.stock <= (p.minStockAlert || 10)) lowStockSkuCount++;
    }
  });

  const averageGrossMarginPct = totalInventoryRevenue > 0
    ? Math.round(((totalInventoryRevenue - totalInventoryHpp) / totalInventoryRevenue) * 100)
    : 0;

  // Filtered Products for Table
  const filteredProductsForTable = products.filter(p => {
    // Search filter
    if (productSearchQuery.trim() !== '') {
      const q = productSearchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBarcode = (p.barcode || '').toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchRack = (p.warehouseRack || '').toLowerCase().includes(q);
      const matchVar = p.variations?.some(v => 
        v.name.toLowerCase().includes(q) || 
        v.sku.toLowerCase().includes(q) || 
        (v.barcode || '').toLowerCase().includes(q)
      );
      if (!matchName && !matchSku && !matchBarcode && !matchCat && !matchRack && !matchVar) {
        return false;
      }
    }

    // Category filter
    if (productCategoryFilter !== 'Semua' && p.category !== productCategoryFilter) {
      return false;
    }

    // Stock status filter
    if (productStockFilter === 'safe') {
      if (p.stock <= (p.minStockAlert || 10)) return false;
    } else if (productStockFilter === 'low') {
      if (p.stock === 0 || p.stock > (p.minStockAlert || 10)) return false;
    } else if (productStockFilter === 'empty') {
      if (p.stock > 0) return false;
    }

    return true;
  }).sort((a, b) => {
    if (productSortBy === 'stock-desc') return b.stock - a.stock;
    if (productSortBy === 'stock-asc') return a.stock - b.stock;
    if (productSortBy === 'price-desc') {
      const priceA = a.discountPrice || a.regularPrice;
      const priceB = b.discountPrice || b.regularPrice;
      return priceB - priceA;
    }
    if (productSortBy === 'margin-desc') {
      const costA = a.costPrice || (a.discountPrice || a.regularPrice) * 0.6;
      const priceA = a.discountPrice || a.regularPrice;
      const marginA = priceA - costA;
      const costB = b.costPrice || (b.discountPrice || b.regularPrice) * 0.6;
      const priceB = b.discountPrice || b.regularPrice;
      const marginB = priceB - costB;
      return marginB - marginA;
    }
    return 0;
  });

  // Quick stats calculation
  const totalRevenue = orders
    .filter(o => o.status === 'Selesai' || o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Belum Bayar' || o.status === 'Diproses').length;
  const readyToShipCount = orders.filter(o => o.status === 'Diproses').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  // ACCESS CONTROL GATE: If current user is not a seller/super_admin
  if (user.role !== 'seller' && user.role !== 'super_admin') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-stone-100 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 text-[#1E3A8A] rounded-3xl mx-auto flex items-center justify-center shadow-inner">
            <Store className="w-8 h-8 text-[#1E3A8A]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
              Akses Khusus Toko Seller
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Anda saat ini sedang login dengan akun <strong className="text-[#1E3A8A]">{user.email}</strong> ({user.name}) sebagai <strong>Pelanggan (Customer)</strong>.
            </p>
            <p className="text-xs text-stone-600 bg-amber-50 p-3.5 rounded-2xl border border-amber-200/60 leading-relaxed text-left">
              🔒 <strong>Pemisahan Akses Pelanggan & Seller:</strong> Dashboard Pengaturan Toko Seller dan manajemen produk/pesanan hanya dapat diakses oleh akun Seller resmi AllKurma.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => setCurrentView('seller-login')}
              className="w-full py-3 bg-[#1E3A8A] hover:bg-[#172554] active:scale-95 text-white font-bold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk dengan Kredensial Toko Seller</span>
            </button>

            <button
              onClick={() => setCurrentView('seller-register')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pendaftaran Mitra Penjual / Buka Toko Baru</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda Belanja</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Seller Center */}
      <div className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-inner">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-white tracking-tight">
                    {sellerStore.storeName}
                  </h1>
                  {sellerStore.isOfficialStore && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
                      Official Store
                    </span>
                  )}
                  {sellerStore.isVacationMode && (
                    <span className="bg-amber-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Mode Libur Aktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 font-normal">
                  AllKurma Seller Center • {sellerStore.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('home')}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 px-3 py-2 rounded-xl transition-all border border-stone-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Lihat Toko Sebagai Pembeli
              </button>

              <div className="flex items-center gap-2 bg-stone-800/90 border border-stone-700 rounded-xl px-3 py-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium leading-none">Saldo Penarikan</div>
                  <div className="text-xs font-black text-emerald-400 leading-tight">
                    Rp {sellerStore.payoutBalance.toLocaleString('id-ID')}
                  </div>
                </div>
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  className="ml-2 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg transition-colors"
                >
                  Tarik Dana
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2 border-t border-stone-800 text-xs scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Ringkasan & Metrik
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Pengaturan Toko General
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap relative ${
                activeTab === 'banners'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Kelola Banner Beranda ({heroBanners.length})</span>
              <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded-full">
                SLIDER
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap relative ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Pesanan Toko
              {pendingOrdersCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Katalog & Stok SKU ({products.length})
            </button>

            <button
              onClick={() => setActiveTab('flashsale')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap relative ${
                activeTab === 'flashsale'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Flash Sale ({products.filter(p => p.isFlashSale).length})</span>
              {products.filter(p => p.isFlashSale).length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'vouchers'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Percent className="w-4 h-4" />
              Voucher & Promo
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400" />
              Ulasan ({reviews.length})
            </button>

            <button
              onClick={() => setActiveTab('followers')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'followers'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Pengikut & Broadcast ({(sellerStore.followerCount || 24850).toLocaleString('id-ID')})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* 1. TAB: OVERVIEW & RINGKASAN */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Total Pendapatan</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +18.4% bulan ini
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Pesanan Perlu Diproses</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {pendingOrdersCount} <span className="text-xs font-normal text-stone-500">pesanan</span>
                </div>
                <div className="text-[11px] font-medium text-amber-700 mt-1">
                  {readyToShipCount} siap dikirim hari ini
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Rating & Performa Toko</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2 flex items-baseline gap-1">
                  4.9 <span className="text-xs font-normal text-stone-500">/ 5.0</span>
                </div>
                <div className="text-[11px] font-medium text-emerald-700 mt-1">
                  Respon Chat 99% • 100% Kepuasan
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Stok Kritis SKU</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 mt-2">
                  {lowStockProducts.length} <span className="text-xs font-normal text-stone-500">produk</span>
                </div>
                <div className="text-[11px] font-medium text-rose-600 mt-1">
                  Perlu restock segera
                </div>
              </div>
            </div>

            {/* Quick Action Cockpit */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-block bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                    Aksi Cepat Penjual
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Pusat Operasional Toko {sellerStore.storeName}
                  </h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Kelola pesanan baru, cetak resi thermal, update harga grosir, dan kelola promosi toko.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportSellerOrders}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                    title="Download Rekap Laporan Penjualan Toko ke Excel (.csv)"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Tarik Laporan Excel</span>
                  </button>
                  <button
                    onClick={() => setIsAddProductOpen(true)}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Produk Baru
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Proses Pesanan Masuk
                  </button>
                  <button
                    onClick={() => setActiveTab('banners')}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Kelola Banner Promosi
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-stone-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan General
                  </button>
                </div>
              </div>
            </div>

            {/* Low Stock Warning & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Need Action */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Pesanan Masuk Terbaru</h4>
                    <p className="text-xs text-stone-500">Pesanan yang memerlukan konfirmasi dan pengiriman</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {orders.slice(0, 4).map(order => (
                    <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-stone-900">#{order.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.status === 'Dikirim'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 font-medium mt-0.5">
                          {order.customerName} • {order.items.length} item • <span className="font-bold text-stone-900">Rp {order.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Kurir: {order.courierName} • {order.createdAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'Diproses' || order.status === 'Belum Bayar' ? (
                          <button
                            onClick={() => handleProcessOrder(order)}
                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
                          >
                            Kirim Pesanan
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedOrderForLabel(order);
                              setTrackingInput(order.trackingNumber || `AK-EXP-${Date.now().toString().slice(-6)}`);
                            }}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Cetak Resi
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kurir & Gudang Summary */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">Status Ekspedisi & Gudang</h4>
                  <p className="text-xs text-stone-500 mb-4">Integrasi kurir aktif dan lokasi pickup</p>

                  <div className="space-y-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-bold text-stone-800 flex items-center gap-1.5 mb-1">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        Gudang Pengiriman Utama:
                      </div>
                      <div className="text-stone-600 leading-relaxed text-[11px]">
                        {sellerStore.fullAddress}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-bold text-stone-800">Jasa Kirim Terpasang:</div>
                      {sellerStore.couriers.map(courier => (
                        <div key={courier.id} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${courier.active ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                            <span className="font-medium text-stone-800">{courier.name}</span>
                          </div>
                          <button
                            onClick={() => toggleSellerCourier(courier.id)}
                            className="text-[11px] font-bold text-stone-500 hover:text-stone-900"
                          >
                            {courier.active ? 'Aktif' : 'Non-Aktif'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="w-full text-center text-xs font-bold text-amber-700 hover:text-amber-800 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/70 transition-colors"
                  >
                    Buka Pengaturan Ekspedisi Lengkap
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TAB: PENGATURAN TOKO GENERAL (KOMPLIT) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    Profil & Informasi Toko
                  </h3>
                  <p className="text-xs text-stone-500">
                    Pengaturan identitas publik toko yang dilihat oleh pembeli retail dan grosir
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  Simpan Semua Perubahan
                </button>
              </div>

              {/* Promo Banner Fast Link */}
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-emerald-500/15 border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-900">
                      Kelola Banner Slider & Promosi Beranda Aplikasi
                    </h4>
                    <p className="text-[11px] text-stone-600">
                      Ubah slide promo carousel yang dilihat pembeli di beranda: foto produk, diskon panen, kombo bundling, dan event Ramadan.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('banners')}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-bold bg-[#1E3A8A] hover:bg-[#172554] text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Buka Kelola Banner Beranda ({heroBanners.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Visual Identitas Toko: Banner Header & Logo Profil */}
              <div className="mb-6 p-4.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-stone-900 flex items-center gap-2">
                      <Store className="w-4 h-4 text-amber-600" />
                      Visual Header & Foto Profil Toko Seller
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Tampilan banner sampul dan foto profil toko resmi yang dilihat pembeli.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Live Preview Toko
                  </span>
                </div>

                {/* Live Store Header Preview */}
                <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-900 h-36 sm:h-44">
                  <img
                    src={normalizeImageUrl(storeForm.banner) || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=1200&auto=format&fit=crop&q=80'}
                    alt="Banner Sampul Toko"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Store Profile Floating Badge inside Header */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 text-white">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                        <img
                          src={normalizeImageUrl(storeForm.logo) || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=300&auto=format&fit=crop&q=80'}
                          alt={storeForm.storeName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm sm:text-base drop-shadow-xs">
                            {storeForm.storeName || 'Nama Toko AllKurma'}
                          </h4>
                          {sellerStore.isOfficialStore && (
                            <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded uppercase">
                              Official Store
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-200 line-clamp-1">
                          {storeForm.tagline || 'Pusat Kurma & Herbal Premium Terpercaya'}
                        </p>
                        <p className="text-[10px] text-stone-300 mt-0.5">
                          📍 {storeForm.city} • ⭐ {sellerStore.rating} ({(sellerStore.followerCount || 24850).toLocaleString('id-ID')} Pengikut)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Inputs for Banner Header and Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      URL Banner Sampul Toko (Header Banner)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={storeForm.banner}
                        onChange={e => setStoreForm({ ...storeForm, banner: e.target.value })}
                        placeholder="https://... atau link foto Dropbox"
                        className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-16"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] text-stone-400 font-mono">
                        Rasio 3:1
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-400">Pilihan Cepat Banner:</span>
                      <button
                        type="button"
                        onClick={() => setStoreForm({ ...storeForm, banner: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=1200&auto=format&fit=crop&q=80' })}
                        className="text-[10px] bg-stone-200 hover:bg-amber-100 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Kurma Madinah
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreForm({ ...storeForm, banner: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=1200&auto=format&fit=crop&q=80' })}
                        className="text-[10px] bg-stone-200 hover:bg-amber-100 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Panen Sukari
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreForm({ ...storeForm, banner: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80' })}
                        className="text-[10px] bg-stone-200 hover:bg-amber-100 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Gudang Grosir
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      URL Foto Profil / Logo Toko (Avatar)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={storeForm.logo}
                        onChange={e => setStoreForm({ ...storeForm, logo: e.target.value })}
                        placeholder="https://... atau link foto Dropbox"
                        className="w-full text-xs font-mono px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-16"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] text-stone-400 font-mono">
                        Rasio 1:1
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      <span className="text-[10px] text-stone-400">Pilihan Cepat Logo:</span>
                      <button
                        type="button"
                        onClick={() => setStoreForm({ ...storeForm, logo: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=300&auto=format&fit=crop&q=80' })}
                        className="text-[10px] bg-stone-200 hover:bg-amber-100 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Kurma Emas
                      </button>
                      <button
                        type="button"
                        onClick={() => setStoreForm({ ...storeForm, logo: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=300&auto=format&fit=crop&q=80' })}
                        className="text-[10px] bg-stone-200 hover:bg-amber-100 text-stone-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        Logo Sunnah
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nama Toko Resmi</label>
                  <input
                    type="text"
                    value={storeForm.storeName}
                    onChange={e => setStoreForm({ ...storeForm, storeName: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Username / Handle Toko</label>
                  <input
                    type="text"
                    value={storeForm.storeHandle}
                    onChange={e => setStoreForm({ ...storeForm, storeHandle: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Slogan / Bio Toko Singkat</label>
                  <input
                    type="text"
                    value={storeForm.tagline}
                    onChange={e => setStoreForm({ ...storeForm, tagline: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Toko Lengkap</label>
                  <textarea
                    rows={3}
                    value={storeForm.description}
                    onChange={e => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Jam Operasional Toko</label>
                  <input
                    type="text"
                    value={storeForm.operationalHours}
                    onChange={e => setStoreForm({ ...storeForm, operationalHours: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Senin - Sabtu: 08:00 - 18:00 WIB"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor WhatsApp / CS Toko</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={e => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Toko / Penjual</label>
                  <input
                    type="email"
                    value={storeForm.email}
                    onChange={e => setStoreForm({ ...storeForm, email: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Nomor NPWP / Pajak Toko</label>
                  <input
                    type="text"
                    value={storeForm.taxNumber}
                    onChange={e => setStoreForm({ ...storeForm, taxNumber: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="00.000.000.0-000.000"
                  />
                </div>
              </div>

              {/* Status Mode Libur & Official Store Toggle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-stone-100">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Mode Libur (Vacation Mode)</div>
                    <div className="text-[11px] text-stone-500">Tutup sementara checkout pembeli saat toko berlibur</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoreForm({ ...storeForm, isVacationMode: !storeForm.isVacationMode })}
                    className={`p-1 rounded-lg transition-colors ${storeForm.isVacationMode ? 'text-amber-600' : 'text-stone-400'}`}
                  >
                    {storeForm.isVacationMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900">Badge Official Store Terverifikasi</div>
                    <div className="text-[11px] text-stone-500">Jaminan produk 100% original bergaransi resmi</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoreForm({ ...storeForm, isOfficialStore: !storeForm.isOfficialStore })}
                    className={`p-1 rounded-lg transition-colors ${storeForm.isOfficialStore ? 'text-emerald-600' : 'text-stone-400'}`}
                  >
                    {storeForm.isOfficialStore ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Alamat Gudang & Pengiriman */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-amber-600" />
                Alamat Gudang & Titik Penjemputan Kurir
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kota / Kabupaten Gudang</label>
                  <input
                    type="text"
                    value={storeForm.city}
                    onChange={e => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={storeForm.postalCode}
                    onChange={e => setStoreForm({ ...storeForm, postalCode: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Min. Belanja Gratis Ongkir Toko (Rp)</label>
                  <input
                    type="number"
                    value={storeForm.minFreeShippingOrder}
                    onChange={e => setStoreForm({ ...storeForm, minFreeShippingOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Alamat Gudang Lengkap (Patokan & Nomor)</label>
                  <textarea
                    rows={2}
                    value={storeForm.fullAddress}
                    onChange={e => setStoreForm({ ...storeForm, fullAddress: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Template Balasan Chat Otomatis */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    Template Balasan Otomatis Chat (Auto-Reply)
                  </h3>
                  <p className="text-xs text-stone-500">Tingkatkan respon chat toko dengan balasan instan 24/7</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStoreForm({ ...storeForm, enableAutoReply: !storeForm.enableAutoReply })}
                  className={`p-1 rounded-lg transition-colors ${storeForm.enableAutoReply ? 'text-emerald-600' : 'text-stone-400'}`}
                >
                  {storeForm.enableAutoReply ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pesan Sambutan Pertama Chat</label>
                  <textarea
                    rows={2}
                    value={storeForm.autoReplyGreeting}
                    onChange={e => setStoreForm({ ...storeForm, autoReplyGreeting: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pesan Di Luar Jam Operasional</label>
                  <textarea
                    rows={2}
                    value={storeForm.autoReplyOffHours}
                    onChange={e => setStoreForm({ ...storeForm, autoReplyOffHours: e.target.value })}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Rekening Bank & Jasa Kirim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rekening Bank Penarikan */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Rekening Bank Penarikan Dana (Payout)
                </h3>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5 text-xs">
                  <div className="text-stone-500 text-[11px]">Bank Rekening Utama:</div>
                  <div className="font-black text-stone-900 text-sm">{sellerStore.bankAccount.bankName}</div>
                  <div className="font-mono font-bold text-stone-800">{sellerStore.bankAccount.accountNumber}</div>
                  <div className="text-stone-600 text-[11px]">a/n {sellerStore.bankAccount.holderName}</div>
                  <span className="inline-block mt-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Terverifikasi Otomatis
                  </span>
                </div>
              </div>

              {/* Ekspedisi Toko */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-amber-600" />
                  Pengaturan Jasa Ekspedisi Pengiriman
                </h3>
                <div className="space-y-2.5">
                  {sellerStore.couriers.map(courier => (
                    <div key={courier.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-900">{courier.name}</div>
                        <div className="text-[10px] text-stone-500">Tipe: {courier.type}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSellerCourier(courier.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                          courier.active
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-stone-200 text-stone-600 border-stone-300'
                        }`}
                      >
                        {courier.active ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SELLER STAFF ACCESS CONTROL & WHITELIST (PENGATURAN AKSES LOGIN SELLER) */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#009A44] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      Manajemen Staf & Otorisasi Login Seller (Whitelist)
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 max-w-2xl leading-relaxed">
                      Sistem Toko Tunggal Resmi AllKurma (PT Exindokarsa Agung). Hanya alamat email yang terdaftar aktif di bawah ini yang diizinkan masuk ke Seller Center (baik via Email/Password maupun via Akun Google).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingStaff(!isAddingStaff)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  {isAddingStaff ? (
                    <>
                      <X className="w-3.5 h-3.5" />
                      <span>Tutup Form</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Daftarkan Staf Baru</span>
                    </>
                  )}
                </button>
              </div>

              {/* Form Tambah Staf Baru */}
              {isAddingStaff && (
                <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-blue-200 shadow-2xs animate-in fade-in space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1E3A8A]">
                    <UserPlus className="w-4 h-4" />
                    <span>Form Pendaftaran Email Staf Pengelola Toko Baru</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Nama Lengkap Staf <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Email Login / Google Akun <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="staf.nama@gmail.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Peran / Tanggung Jawab
                      </label>
                      <select
                        value={newStaffRole}
                        onChange={(e) => setNewStaffRole(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] font-medium"
                      >
                        <option value="Manajer Operasional">Manajer Operasional</option>
                        <option value="Staff Gudang & Pesanan">Staff Gudang & Pesanan</option>
                        <option value="Customer Support CS">Customer Support CS</option>
                        <option value="Super Admin Toko">Super Admin Toko</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        No. HP / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={newStaffPhone}
                        onChange={(e) => setNewStaffPhone(e.target.value)}
                        placeholder="0812-xxxx-xxxx"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingStaff(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewStaff}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#009A44] hover:bg-[#047857] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Simpan & Beri Hak Akses</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Daftar Staf Terdaftar */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/80 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4 rounded-l-xl">Nama & Email Staf</th>
                      <th className="py-3 px-3">Peran / Jabatan</th>
                      <th className="py-3 px-3">Kontak WA</th>
                      <th className="py-3 px-3">Terdaftar</th>
                      <th className="py-3 px-3">Status Izin</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-normal">
                    {(sellerStore.authorizedStaff || []).map((staff) => {
                      const isOwner = staff.email.toLowerCase() === 'atdigitalstudio2026@gmail.com' || staff.email.toLowerCase() === 'admin@allkurma.id';
                      const isActive = staff.status === 'active';

                      return (
                        <tr key={staff.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                                {staff.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                  <span>{staff.name}</span>
                                  {isOwner && (
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-extrabold text-[9px]">
                                      Owner Utama
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3 text-stone-400" />
                                  <span>{staff.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              staff.role === 'Super Admin Toko'
                                ? 'bg-purple-100 text-purple-800'
                                : staff.role === 'Manajer Operasional'
                                ? 'bg-amber-100 text-amber-800'
                                : staff.role === 'Staff Gudang & Pesanan'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {staff.role}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-stone-600 font-mono text-[11px]">
                            {staff.phone || '-'}
                          </td>

                          <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                            {staff.addedAt || '2026-01-01'}
                          </td>

                          <td className="py-3.5 px-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                              <span>{isActive ? 'Aktif (Diizinkan)' : 'Non-Aktif (Diblokir)'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {!isOwner && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => toggleSellerStaffStatus(staff.id)}
                                    title={isActive ? "Non-aktifkan izin login staf ini" : "Aktifkan kembali izin login staf"}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                                      isActive 
                                        ? 'border-rose-200 text-rose-700 hover:bg-rose-50' 
                                        : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                  >
                                    {isActive ? 'Blokir' : 'Aktifkan'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (window.confirm(`Yakin ingin mencabut izin akses staf "${staff.name}" (${staff.email})?`)) {
                                        removeSellerStaff(staff.id);
                                      }
                                    }}
                                    title="Hapus dari daftar staf resmi"
                                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              {isOwner && (
                                <span className="text-[10px] font-bold text-stone-400 italic">
                                  Akun Permanen
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Sticky Save */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-md transition-colors"
              >
                Simpan Seluruh Pengaturan Toko
              </button>
            </div>
          </form>
        )}

        {/* 3. TAB: PESANAN TOKO (ORDERS) */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter Tabs & Export Button */}
            <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(['All', 'Perlu Diproses', 'Dikirim', 'Selesai', 'Retur'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                      orderStatusFilter === status
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {status} ({orders.filter(o => status === 'All' ? true : status === 'Perlu Diproses' ? (o.status === 'Belum Bayar' || o.status === 'Diproses') : o.status === status).length})
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportSellerOrders}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                title="Download Laporan Pesanan Ini ke Excel (.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh Excel ({filteredOrders.length})</span>
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-stone-900 text-sm">#{order.orderNumber}</span>
                      <span className="text-stone-400">•</span>
                      <span className="font-semibold text-stone-700">{order.customerName}</span>
                      <span className="text-stone-400">({order.customerType})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'Dikirim'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : order.status === 'Retur'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-stone-400 text-[11px]">{order.createdAt}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img src={item.image} alt={item.productName} className="w-12 h-12 rounded-lg object-cover border border-stone-200" />
                        <div className="flex-1">
                          <div className="font-bold text-stone-900">{item.productName}</div>
                          <div className="text-[11px] text-stone-500">SKU: {item.sku} • Qty: {item.quantity} pcs</div>
                        </div>
                        <div className="font-black text-stone-900">
                          Rp {item.lineTotal.toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
                    <div>
                      <span className="text-stone-500">Tujuan Pengiriman: </span>
                      <span className="font-semibold text-stone-800">
                        {order.shippingAddress.city}, {order.shippingAddress.province} ({order.courierName})
                      </span>
                      {order.trackingNumber && (
                        <div className="text-[11px] font-mono text-blue-700 font-bold mt-0.5">
                          No. Resi: {order.trackingNumber}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-3">
                        <div className="text-[10px] text-stone-400">Total Tagihan</div>
                        <div className="text-sm font-black text-amber-700">Rp {order.total.toLocaleString('id-ID')}</div>
                      </div>

                      {order.status === 'Belum Bayar' || order.status === 'Diproses' ? (
                        <button
                          onClick={() => handleProcessOrder(order)}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Kirim / Pickup Kurir
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedOrderForLabel(order);
                            setTrackingInput(order.trackingNumber || `AK-EXP-${Date.now().toString().slice(-6)}`);
                          }}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Cetak Resi Thermal
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. TAB: PRODUK & STOK TOKO */}
        {activeTab === 'products' && (
          <div className="space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
            
            {/* Header Title & Top Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">
                      Manajemen Katalog Master Produk & SKU Gudang
                    </h3>
                    <p className="text-xs text-stone-500">
                      Kontrol real-time stok varian SKU, lokasi rak fisik, barcode EAN-13, dan analisis HPP modal
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {products.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsClearAllModalOpen(true)}
                    className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-rose-200 hover:border-transparent shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Kosongkan seluruh data produk dan SKU dari etalase"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Kosongkan Semua ({products.length})</span>
                  </button>
                )}
                {selectedProductIdsForBulk.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBulkDeleteModalOpen(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Hapus produk yang dicentang"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus ({selectedProductIdsForBulk.length}) Produk Terpilih</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExportInventoryExcel}
                  className="bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Ekspor seluruh data SKU & Valuasi ke spreadsheet Excel"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Unduh Rekap Stok (Excel)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setNewProd({
                      name: '',
                      sku: `AK-${Date.now().toString(36).toUpperCase().slice(-5)}`,
                      barcode: `899723456${Math.floor(1000 + Math.random() * 9000)}`,
                      category: 'Medjool',
                      costPrice: 90000,
                      regularPrice: 150000,
                      discountPrice: 135000,
                      stock: 50,
                      minStockAlert: 10,
                      origin: 'Madinah, Saudi Arabia',
                      harvestYear: 'Panen 2025/2026',
                      shelfLife: '18 Bulan',
                      expiryDate: '2027-12-31',
                      storageCondition: 'Suhu Sejuk (Simpan Kulkas)',
                      packagingType: 'Pouch Kedap Udara Food-Grade',
                      certification: 'Halal MUI & Kementan RI',
                      description: '',
                      warehouseRack: 'Rak A1-01',
                      warehouseLocation: 'Gudang Utama - Jakarta Pusat',
                      weightGram: 500,
                      images: [],
                      freeShippingExtra: true,
                      cashbackExtra: true,
                      isFlashSale: false,
                      isNewArrival: true,
                      variations: [],
                      wholesalePrices: [
                        { minQty: 11, maxQty: 50, pricePerUnit: 125000 },
                        { minQty: 51, maxQty: undefined, pricePerUnit: 115000 }
                      ]
                    });
                    setProductFormTab('general');
                    setIsAddProductOpen(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Produk & SKU Baru</span>
                </button>
              </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Total SKU Terdaftar
                </span>
                <div className="text-xl font-black text-stone-900 mt-1 font-mono">
                  {totalMasterSkus} <span className="text-xs font-semibold text-stone-500">Master</span> • {totalActiveSkus} <span className="text-xs font-semibold text-stone-500">SKU</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                  ✓ 100% Barcode EAN-13 Aktif
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Valuasi Modal Stok (HPP)
                </span>
                <div className="text-xl font-black text-stone-900 mt-1 font-mono">
                  Rp {totalInventoryHpp.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-stone-500 font-semibold block mt-1">
                  {totalPhysicalStockUnits.toLocaleString('id-ID')} unit fisik di gudang
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Estimasi Nilai Jual & Margin
                </span>
                <div className="text-xl font-black text-emerald-700 mt-1 font-mono">
                  Rp {totalInventoryRevenue.toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                  Margin Gross: ~{averageGrossMarginPct}%
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Kesehatan Inventori
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setProductStockFilter(productStockFilter === 'low' ? 'all' : 'low')}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                      lowStockSkuCount > 0
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {lowStockSkuCount} Menipis
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductStockFilter(productStockFilter === 'empty' ? 'all' : 'empty')}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                      outOfStockSkuCount > 0
                        ? 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {outOfStockSkuCount} Habis
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 block mt-1">
                  Klik untuk filter stok kritis
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    placeholder="Cari Master SKU (AK-AJW), Barcode EAN, Nama Kurma, atau Rak Gudang..."
                    className="w-full pl-9 pr-8 py-2.5 bg-stone-50 focus:bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                  {productSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setProductSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold text-stone-800 text-xs focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Ajwa">Kurma Ajwa</option>
                    <option value="Sukari">Kurma Sukari</option>
                    <option value="Medjool">Kurma Medjool</option>
                    <option value="Tunisia">Kurma Tunisia</option>
                    <option value="Khalas">Kurma Khalas</option>
                    <option value="Grosir">Paket Grosir Kartonan</option>
                    <option value="Hampers">Hampers & Souvenir</option>
                    <option value="Madu">Madu & Herbal</option>
                  </select>

                  {/* Sort Filter */}
                  <select
                    value={productSortBy}
                    onChange={(e: any) => setProductSortBy(e.target.value)}
                    className="px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-300 font-semibold text-stone-800 text-xs focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="default">Urutan Standar</option>
                    <option value="stock-desc">Stok Terbanyak (Tinggi ke Rendah)</option>
                    <option value="stock-asc">Stok Tersedikit (Perlu Restock)</option>
                    <option value="price-desc">Harga Jual Tertinggi</option>
                    <option value="margin-desc">Estimasi Margin Tertinggi</option>
                  </select>
                </div>

              </div>

              {/* Status Quick Pills */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-bold text-stone-400 mr-1 shrink-0">Filter Status:</span>
                {[
                  { id: 'all', label: `Semua (${products.length})` },
                  { id: 'safe', label: 'Stok Aman' },
                  { id: 'low', label: `⚠️ Menipis (${lowStockSkuCount})` },
                  { id: 'empty', label: `🚫 Habis (${outOfStockSkuCount})` }
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setProductStockFilter(st.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                      productStockFilter === st.id
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products & SKU Detailed Table */}
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-12 text-center shadow-2xs">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200/60 text-amber-600">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Etalase Produk Masih Kosong</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                  Semua produk simulasi dummy telah dikosongkan. Anda sekarang siap menginput produk baru asli lengkap dengan gambar, foto, SKU, stok gudang, dan harga jual.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProd({
                        name: '',
                        sku: `AK-${Date.now().toString(36).toUpperCase().slice(-5)}`,
                        barcode: `899723456${Math.floor(1000 + Math.random() * 9000)}`,
                        category: 'Medjool',
                        costPrice: 90000,
                        regularPrice: 150000,
                        discountPrice: 135000,
                        stock: 50,
                        minStockAlert: 10,
                        origin: 'Madinah, Saudi Arabia',
                        harvestYear: 'Panen 2025/2026',
                        shelfLife: '18 Bulan',
                        expiryDate: '2027-12-31',
                        storageCondition: 'Suhu Sejuk (Simpan Kulkas)',
                        packagingType: 'Pouch Kedap Udara Food-Grade',
                        certification: 'Halal MUI & Kementan RI',
                        description: '',
                        warehouseRack: 'Rak A1-01',
                        warehouseLocation: 'Gudang Utama - Jakarta Pusat',
                        weightGram: 500,
                        images: ['https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'],
                        freeShippingExtra: true,
                        cashbackExtra: true,
                        variations: [],
                        wholesalePrices: [
                          { minQty: 11, maxQty: 50, pricePerUnit: 125000 },
                          { minQty: 51, maxQty: undefined, pricePerUnit: 115000 }
                        ]
                      });
                      setProductFormTab('general');
                      setIsAddProductOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Input Produk Baru Sekarang</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900 text-stone-200 font-bold border-b border-stone-800">
                      <tr>
                        <th className="p-3.5 w-14 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="checkbox"
                              checked={
                                filteredProductsForTable.length > 0 &&
                                filteredProductsForTable.every(p => selectedProductIdsForBulk.includes(p.id))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const allIds = Array.from(new Set([...selectedProductIdsForBulk, ...filteredProductsForTable.map(p => p.id)]));
                                  setSelectedProductIdsForBulk(allIds);
                                } else {
                                  const remaining = selectedProductIdsForBulk.filter(
                                    id => !filteredProductsForTable.some(p => p.id === id)
                                  );
                                  setSelectedProductIdsForBulk(remaining);
                                }
                              }}
                              className="rounded border-stone-500 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                              title="Pilih Semua Produk di Halaman Ini"
                            />
                          </div>
                        </th>
                        <th className="p-3.5 min-w-[280px]">Produk, Master SKU & Barcode</th>
                        <th className="p-3.5 min-w-[150px]">Lokasi Rak & Penyimpanan</th>
                        <th className="p-3.5 min-w-[150px]">HPP & Harga Jual</th>
                        <th className="p-3.5 min-w-[130px]">Status Stok Fisik</th>
                        <th className="p-3.5 min-w-[90px]">Terjual</th>
                        <th className="p-3.5 text-right min-w-[170px]">Aksi Manajemen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {filteredProductsForTable.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-stone-400">
                            <Boxes className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                            <div className="font-bold text-sm text-stone-700">Tidak ada SKU yang cocok dengan filter</div>
                            <p className="text-xs text-stone-400 mt-0.5">Coba ubah kata kunci pencarian atau reset filter.</p>
                          </td>
                        </tr>
                      ) : (
                        filteredProductsForTable.map((prod, idx) => {
                          const hasVariations = prod.variations && prod.variations.length > 0;
                          const isExpanded = expandedProductVariations[prod.id] ?? true;
                          const hpp = prod.costPrice || Math.round((prod.discountPrice || prod.regularPrice) * 0.6);
                          const sellPrice = prod.discountPrice || prod.regularPrice;
                          const profitMargin = sellPrice - hpp;
                          const marginPercent = sellPrice > 0 ? Math.round((profitMargin / sellPrice) * 100) : 0;
                          const isStockLow = prod.stock <= (prod.minStockAlert || 10);
                          const isOutOfStock = prod.stock === 0;
                          const isChecked = selectedProductIdsForBulk.includes(prod.id);

                          return (
                            <React.Fragment key={prod.id}>
                              {/* Master Product Row */}
                              <tr className={`hover:bg-amber-50/40 transition-colors ${isChecked ? 'bg-amber-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}`}>
                                
                                {/* Checkbox & Expand Toggle */}
                                <td className="p-3 text-center align-top">
                                  <div className="flex items-center justify-center gap-1 pt-1">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedProductIdsForBulk(prev => [...prev, prod.id]);
                                        } else {
                                          setSelectedProductIdsForBulk(prev => prev.filter(id => id !== prod.id));
                                        }
                                      }}
                                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    {hasVariations ? (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleExpandVariation(prod.id)}
                                        className="p-1 rounded-md text-stone-500 hover:text-amber-800 hover:bg-amber-100 transition-colors"
                                        title={isExpanded ? 'Sembunyikan Varian SKU' : 'Tampilkan Varian SKU'}
                                      >
                                        {isExpanded ? (
                                          <ChevronUp className="w-3.5 h-3.5" />
                                        ) : (
                                          <ChevronDown className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-[10px] text-stone-400 font-mono w-4">{idx + 1}</span>
                                    )}
                                  </div>
                                </td>

                                {/* Product Info, SKU & Barcode */}
                                <td className="p-3 align-top">
                                  <div className="flex items-start gap-3">
                                    {prod.images?.[0] ? (
                                      <img
                                        src={prod.images[0]}
                                        alt={prod.name}
                                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 mt-0.5 shadow-2xs"
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                                          const fallback = (e.currentTarget.parentElement?.querySelector('.row-img-fallback') as HTMLElement);
                                          if (fallback) fallback.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div className={`row-img-fallback w-12 h-12 rounded-xl border border-stone-200 shrink-0 mt-0.5 shadow-2xs bg-stone-100 flex flex-col items-center justify-center text-stone-400 ${prod.images?.[0] ? 'hidden' : 'flex'}`}>
                                      <Package className="w-5 h-5 text-amber-800/60" />
                                    </div>
                                  <div className="min-w-0">
                                    <div className="font-extrabold text-stone-900 text-xs line-clamp-1">
                                      {prod.name}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[10px]">
                                      <span className="bg-stone-900 text-white font-bold px-1.5 py-0.5 rounded-sm">
                                        SKU: {prod.sku}
                                      </span>
                                      <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-sm border border-stone-200">
                                        EAN: {prod.barcode || '-'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 flex-wrap">
                                      <span>Origin: <b>{prod.origin}</b></span>
                                      <span>•</span>
                                      <span className="text-amber-700 font-semibold">{prod.harvestYear || 'Panen 2026'}</span>
                                      {prod.isNewArrival && (
                                        <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full text-[9px] flex items-center gap-0.5">
                                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                          New Product
                                        </span>
                                      )}
                                      {hasVariations && (
                                        <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full text-[9px]">
                                          {prod.variations!.length} Varian Kemasan
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Storage & Warehouse Rack */}
                              <td className="p-3 align-top">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-stone-800 font-bold">
                                    <Warehouse className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                    <span>{prod.warehouseRack || prod.warehouseLocation}</span>
                                  </div>
                                  <div className="text-[10px] text-stone-500 font-medium">
                                    {prod.storageCondition || 'Suhu Sejuk (Simpan Kulkas)'}
                                  </div>
                                  <div className="text-[9px] text-stone-400 font-mono">
                                    Exp: {prod.expiryDate || '2027'} ({prod.shelfLife || '18 Bulan'})
                                  </div>
                                </div>
                              </td>

                              {/* Financials: HPP vs Selling Price vs Margin */}
                              <td className="p-3 align-top">
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-stone-400 text-[10px]">HPP Modal:</span>
                                    <span className="font-mono font-bold text-stone-700">
                                      Rp {hpp.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-stone-400 text-[10px]">Harga Jual:</span>
                                    <span className="font-mono font-black text-stone-900">
                                      Rp {sellPrice.toLocaleString('id-ID')}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between pt-0.5 border-t border-stone-200/80">
                                    <span className="text-[9px] text-emerald-700 font-bold">Margin Laba:</span>
                                    <span className="text-[10px] font-mono font-bold text-emerald-700">
                                      Rp {profitMargin.toLocaleString('id-ID')} ({marginPercent}%)
                                    </span>
                                  </div>
                                  {prod.isFlashSale && (
                                    <div className="mt-1 flex items-center justify-between bg-red-50 px-1.5 py-0.5 rounded border border-red-200 text-[10px]">
                                      <span className="flex items-center gap-1 font-extrabold text-red-600">
                                        <Flame className="w-3 h-3 fill-red-600" />
                                        Flash Sale
                                      </span>
                                      <span className="font-mono font-bold text-red-700">
                                        -{prod.flashSaleDiscountPercent || 20}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Physical Stock Status */}
                              <td className="p-3 align-top">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className={`font-mono text-sm font-black ${
                                      isOutOfStock ? 'text-rose-600' : isStockLow ? 'text-amber-700' : 'text-stone-900'
                                    }`}>
                                      {prod.stock} unit
                                    </span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      isOutOfStock 
                                        ? 'bg-rose-100 text-rose-900'
                                        : isStockLow 
                                        ? 'bg-amber-100 text-amber-900 animate-pulse'
                                        : 'bg-emerald-100 text-emerald-900'
                                    }`}>
                                      {isOutOfStock ? 'HABIS' : isStockLow ? 'KRITIS' : 'AMAN'}
                                    </span>
                                  </div>
                                  
                                  {/* Progress bar */}
                                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        isOutOfStock ? 'bg-rose-500 w-0' : isStockLow ? 'bg-amber-500 w-1/4' : 'bg-emerald-500 w-full'
                                      }`}
                                    />
                                  </div>
                                  <span className="text-[9px] text-stone-400 block font-mono">
                                    Min. Alert: {prod.minStockAlert || 10} unit
                                  </span>
                                </div>
                              </td>

                              {/* Sold Count */}
                              <td className="p-3 align-top font-semibold text-stone-700 font-mono">
                                {prod.soldCount} terjual
                              </td>

                              {/* Action Buttons */}
                              <td className="p-3 align-top text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Quick Stock Opname / Adjust */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProductForStockAdjust(prod)}
                                    className="p-1.5 text-stone-700 hover:text-white bg-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                                    title="Stock Opname & Penyesuaian Stok Gudang"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Print SKU Barcode */}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedProductForBarcode(prod)}
                                    className="p-1.5 text-stone-700 hover:text-white bg-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                                    title="Cetak Label Barcode & Price Tag Thermal"
                                  >
                                    <Barcode className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Flash Sale Quick Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenFlashSaleForProduct(prod)}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      prod.isFlashSale
                                        ? 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white ring-1 ring-red-200'
                                        : 'text-stone-400 bg-stone-100 hover:text-red-600 hover:bg-red-50'
                                    }`}
                                    title={prod.isFlashSale ? `Kelola Flash Sale (${prod.flashSaleDiscountPercent || 20}% OFF)` : 'Daftarkan Produk ke Flash Sale'}
                                  >
                                    <Flame className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Quick Toggle New Product */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextStatus = !prod.isNewArrival;
                                      updateProduct(prod.id, { isNewArrival: nextStatus });
                                      showToast(
                                        nextStatus 
                                          ? `Produk "${prod.name}" sekarang aktif sebagai New Product!`
                                          : `Produk "${prod.name}" dinonaktifkan dari New Product.`,
                                        'info'
                                      );
                                    }}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      prod.isNewArrival
                                        ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-600 hover:text-white'
                                        : 'text-stone-400 bg-stone-100 hover:text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                    title={prod.isNewArrival ? 'Aktif sebagai New Product (Klik untuk nonaktifkan)' : 'Klik untuk jadikan New Product 2026'}
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit Product */}
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className="p-1.5 text-amber-800 hover:text-white bg-amber-100 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Detail Lengkap Produk & SKU"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>

                                  {/* View in Shop */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedProductId(prod.id);
                                      setCurrentView('product-detail');
                                    }}
                                    className="p-1.5 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                                    title="Lihat Tampilan Pembeli"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete */}
                                  <button
                                    type="button"
                                    onClick={() => setProductToDelete(prod)}
                                    className="p-1.5 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Produk dari Etalase"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* Nested Multi-SKU Variations Sub-Table */}
                            {hasVariations && isExpanded && (
                              <tr className="bg-amber-50/20 border-b border-amber-200/60">
                                <td colSpan={7} className="p-0 pl-10 pr-3 py-2.5">
                                  <div className="bg-white rounded-xl border border-amber-200/80 p-3 shadow-2xs">
                                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-[11px] font-bold text-amber-950">
                                      <div className="flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Rincian SKU Varian Kemasan ({prod.variations!.length} Varian Terdaftar):</span>
                                      </div>
                                      <span className="text-[10px] text-stone-500 font-mono">
                                        Total Stok Varian: {prod.variations!.reduce((s, v) => s + v.stock, 0)} unit
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      {prod.variations!.map((v, vIdx) => {
                                        const vCost = v.costPrice || prod.costPrice || Math.round((v.discountPrice || v.regularPrice) * 0.6);
                                        const vPrice = v.discountPrice || v.regularPrice;
                                        const vMargin = vPrice - vCost;
                                        const vMarginPct = vPrice > 0 ? Math.round((vMargin / vPrice) * 100) : 0;
                                        const isVLow = v.stock <= (v.minStockAlert || prod.minStockAlert || 10);

                                        return (
                                          <div
                                            key={v.id || vIdx}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-stone-50 hover:bg-amber-50/40 rounded-xl border border-stone-200 text-xs transition-colors"
                                          >
                                            {/* Variation Info & SKU */}
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-2">
                                                <span className="font-bold text-stone-900">{v.name}</span>
                                                <span className="font-mono text-[10px] bg-stone-900 text-white px-1.5 py-0.2 rounded">
                                                  SKU: {v.sku}
                                                </span>
                                                <span className="font-mono text-[10px] text-stone-600 bg-stone-200/70 px-1.5 py-0.2 rounded">
                                                  EAN: {v.barcode || '-'}
                                                </span>
                                              </div>
                                              <div className="text-[10px] text-stone-500 flex items-center gap-3 mt-1">
                                                <span>Netto: <b>{v.weightGram}g</b></span>
                                                <span>•</span>
                                                <span>Kemasan: <b>{v.packagingType || 'Pouch'}</b></span>
                                                <span>•</span>
                                                <span>Rak: <b>{v.warehouseRack || prod.warehouseRack || prod.warehouseLocation}</b></span>
                                              </div>
                                            </div>

                                            {/* Financials */}
                                            <div className="text-right sm:text-left min-w-[150px]">
                                              <div className="font-mono font-bold text-stone-900">
                                                Rp {vPrice.toLocaleString('id-ID')}
                                                {v.discountPrice && (
                                                  <span className="text-[10px] text-stone-400 line-through ml-1 font-normal">
                                                    Rp {v.regularPrice.toLocaleString('id-ID')}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="text-[10px] text-emerald-700 font-mono">
                                                HPP: Rp {vCost.toLocaleString('id-ID')} (Laba {vMarginPct}%)
                                              </div>
                                            </div>

                                            {/* Stock */}
                                            <div className="flex items-center justify-between sm:justify-start gap-3 min-w-[130px]">
                                              <div>
                                                <span className={`font-mono font-black text-sm ${isVLow ? 'text-amber-700' : 'text-stone-900'}`}>
                                                  {v.stock} unit
                                                </span>
                                                <span className="text-[9px] text-stone-400 block font-mono">
                                                  Min: {v.minStockAlert || 10}
                                                </span>
                                              </div>
                                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                v.stock === 0 ? 'bg-rose-100 text-rose-900' : isVLow ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                                              }`}>
                                                {v.stock === 0 ? 'HABIS' : isVLow ? 'KRITIS' : 'AMAN'}
                                              </span>
                                            </div>

                                            {/* Actions for Sub-SKU */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                              <button
                                                type="button"
                                                onClick={() => setSelectedProductForStockAdjust(prod)}
                                                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-stone-800 hover:text-white text-stone-700 rounded-lg border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
                                                title="Opname Stok Varian Ini"
                                              >
                                                <RefreshCw className="w-3 h-3" />
                                                <span>Opname</span>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => setSelectedProductForBarcode(prod)}
                                                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-stone-800 hover:text-white text-stone-700 rounded-lg border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer"
                                                title="Cetak Label Barcode Varian Ini"
                                              >
                                                <Barcode className="w-3 h-3" />
                                                <span>Barcode</span>
                                              </button>
                                            </div>

                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* FLASH SALE TOKO MANAGEMENT TAB */}
        {activeTab === 'flashsale' && (
          <div className="space-y-4 animate-in fade-in-50">
            {/* Top Campaign Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 p-6 text-white shadow-md">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase">
                      <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-bounce" />
                      Flash Sale Toko Berjalan
                    </span>
                    <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                      TAYANG DI BERANDA
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">
                    Pusat Pengaturan Produk Promo Kilat (Flash Sale)
                  </h2>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Daftarkan produk kurma unggulan Anda ke dalam Flash Sale untuk mendapatkan posisi teratas beranda dengan countdown timer kilat, mendorong lonjakan transaksi toko hingga 3x lipat.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="bg-stone-950/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
                    <div className="text-[10px] font-bold text-amber-300 flex items-center justify-center gap-1">
                      <Timer className="w-3 h-3" /> Sesi Kilat Toko
                    </div>
                    <div className="text-sm font-black font-mono mt-0.5">
                      12:00 - 18:00 WIB
                    </div>
                    <span className="text-[9px] text-white/75 block mt-0.5">
                      Berakhir dlm: <b className="text-amber-300">03:42:15</b>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFlashSaleTargetProduct(null);
                      setFlashSaleDiscountInput(25);
                      setFlashSalePriceInput(0);
                      setIsFlashSaleModalOpen(true);
                    }}
                    className="bg-white hover:bg-amber-50 text-red-700 font-extrabold text-xs px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 text-red-600" />
                    <span>+ Daftarkan Produk Flash Sale</span>
                  </button>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute right-20 -top-10 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Quick Metrics */}
            {(() => {
              const fsProds = products.filter(p => p.isFlashSale);
              const avgDisc = fsProds.length > 0 
                ? Math.round(fsProds.reduce((acc, p) => acc + (p.flashSaleDiscountPercent || 20), 0) / fsProds.length)
                : 0;
              const totalFsStock = fsProds.reduce((acc, p) => acc + p.stock, 0);

              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-xs font-bold">Produk Flash Sale Aktif</span>
                      <Flame className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-black text-stone-900 font-mono">
                      {fsProds.length} <span className="text-xs font-normal text-stone-400">SKU</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                      ● Tayang live di beranda pembeli
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-xs font-bold">Rata-rata Diskon</span>
                      <Percent className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600 font-mono">
                      {avgDisc}%
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium block mt-0.5">
                      Rekomendasi min. 15% - 50%
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-xs font-bold">Total Stok Cadangan</span>
                      <Boxes className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-2xl font-black text-stone-900 font-mono">
                      {totalFsStock} <span className="text-xs font-normal text-stone-400">unit</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium block mt-0.5">
                      Dari seluruh SKU Flash Sale
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center justify-between text-stone-500 mb-1">
                      <span className="text-xs font-bold">Estimasi Traffic Boost</span>
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600 font-mono">
                      +320%
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Konversi tinggi di Beranda
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* List of Flash Sale Products */}
            {(() => {
              const fsProds = products.filter(p => p.isFlashSale);

              if (fsProds.length === 0) {
                return (
                  <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-10 text-center space-y-4 shadow-2xs">
                    <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
                      <Flame className="w-8 h-8 fill-red-500 text-red-500 animate-pulse" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h3 className="text-base font-extrabold text-stone-900">
                        Belum Ada Produk yang Didaftarkan ke Flash Sale
                      </h3>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        Pilih kurma dari etalase Anda untuk diikutkan dalam program Flash Sale Toko. Produk akan otomatis tampil di banner promo kilat beranda dengan harga spesial.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFlashSaleTargetProduct(null);
                          setFlashSaleDiscountInput(25);
                          setFlashSalePriceInput(0);
                          setIsFlashSaleModalOpen(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Daftarkan Produk Pertama ke Flash Sale
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                        <span>Daftar Produk Flash Sale Terdaftar ({fsProds.length})</span>
                        <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                          SEDANG AKTIF
                        </span>
                      </h3>
                      <p className="text-xs text-stone-500">
                        Produk ini sedang tayang di bagian Flash Sale Beranda pembeli secara real-time.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFlashSaleTargetProduct(null);
                        setFlashSaleDiscountInput(25);
                        setFlashSalePriceInput(0);
                        setIsFlashSaleModalOpen(true);
                      }}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      Tambah Produk Lain
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {fsProds.map((prod) => {
                      const discountPct = prod.flashSaleDiscountPercent || 20;
                      const normalPrice = prod.regularPrice;
                      const flashPrice = prod.discountPrice || Math.round(normalPrice * (1 - discountPct / 100));
                      const hpp = prod.costPrice || Math.round(normalPrice * 0.6);
                      const profit = flashPrice - hpp;

                      return (
                        <div
                          key={prod.id}
                          className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                <img
                                  src={prod.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-xs">
                                  -{discountPct}%
                                </div>
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-bold">
                                  <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{prod.category}</span>
                                </div>
                                <h4 className="font-extrabold text-stone-900 text-xs line-clamp-1 mt-0.5">
                                  {prod.name}
                                </h4>
                                <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                                  SKU: <span className="text-stone-700 font-semibold">{prod.sku}</span>
                                </div>
                              </div>
                            </div>

                            {/* Pricing Details */}
                            <div className="bg-red-50/70 rounded-xl p-2.5 border border-red-100 space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-stone-500 text-[10px]">Harga Normal:</span>
                                <span className="font-mono line-through text-stone-400">
                                  Rp {normalPrice.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-red-700 text-[11px] font-extrabold flex items-center gap-1">
                                  <Flame className="w-3 h-3 fill-red-600 text-red-600" />
                                  Harga Flash Sale:
                                </span>
                                <span className="font-mono font-black text-sm text-red-600">
                                  Rp {flashPrice.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t border-red-200/60 text-[10px]">
                                <span className="text-stone-500">Margin Profit Toko:</span>
                                <span className="font-mono font-bold text-emerald-700">
                                  Rp {profit.toLocaleString('id-ID')} / unit
                                </span>
                              </div>
                            </div>

                            {/* Stock & Quota Status */}
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-stone-500 font-medium">Sisa Stok Fisik:</span>
                              <span className={`font-mono font-bold ${prod.stock <= 10 ? 'text-amber-700' : 'text-stone-800'}`}>
                                {prod.stock} unit
                              </span>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="p-3 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenFlashSaleForProduct(prod)}
                              className="flex-1 text-center py-1.5 px-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Edit className="w-3 h-3 text-stone-500" />
                              <span>Ubah Diskon</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setCurrentView('product-detail');
                              }}
                              className="p-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 transition-colors cursor-pointer"
                              title="Lihat Tampilan Pembeli"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveFromFlashSale(prod.id, prod.name)}
                              className="p-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                              title="Keluarkan dari Flash Sale"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Seller Strategy & Tips for Flash Sale */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Tips & Panduan Sukses Kampanye Flash Sale AllKurma
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center">1</span>
                    Pilih Produk Terlaris
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Prioritaskan jenis kurma favorit seperti Ajwa, Sukari, atau Medjool karena memiliki rasio konversi kilat tertinggi.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center">2</span>
                    Diskon Menarik (15% - 50%)
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Pembeli terdorong checkout seketika jika diskon berada di atas 15%. Pastikan margin laba HPP tetap terjaga.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1">
                  <div className="font-bold text-stone-800 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center">3</span>
                    Kesiapan Stok Fisik
                  </div>
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    Pastikan stok di rak gudang mencukupi agar pesanan yang masuk selama periode flash sale dapat langsung diproses dan dikirim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB: VOUCHER & PROMO TOKO */}
        {activeTab === 'vouchers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Manajemen Kupon & Promo Toko</h3>
                <p className="text-xs text-stone-500">Buat voucher diskon untuk menarik pelanggan dan meningkatkan transaksi</p>
              </div>
              <button
                onClick={() => setIsAddVoucherOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Buat Voucher Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotions.map(promo => (
                <div key={promo.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {promo.code}
                      </span>
                      <button
                        onClick={() => togglePromotionStatus(promo.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          promo.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {promo.status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>

                    <h4 className="font-bold text-stone-900 text-sm mt-2">{promo.name}</h4>
                    <p className="text-xs text-stone-500 mt-1">{promo.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                    <div>
                      <span>Min. Belanja: </span>
                      <span className="font-bold text-stone-900">Rp {promo.minPurchase.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                      <span>Terpakai: </span>
                      <span className="font-bold text-stone-900">{promo.usedCount} / {promo.totalUsageLimit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TAB: ULASAN & KEPUASAN PEMBELI */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
              <h3 className="text-sm font-bold text-stone-900">Ulasan & Reputasi Toko</h3>
              <p className="text-xs text-stone-500">Tanggapi ulasan pembeli untuk menjaga rating dan kepuasan pelanggan</p>
            </div>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900">{rev.userName}</div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                            />
                          ))}
                          <span className="text-[10px] text-stone-400 ml-1">
                            {rev.date || rev.createdAt || 'Baru saja'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {rev.variationName && (
                      <span className="bg-stone-100 text-stone-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        Variasi: {rev.variationName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                  {/* Seller Reply Box */}
                  <div className="pt-2 border-t border-stone-100">
                    {replyingReviewId === rev.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Tulis balasan resmi toko..."
                          className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => {
                            if (replyText.trim()) {
                              replySellerReview(rev.id, replyText);
                              setReplyingReviewId(null);
                              setReplyText('');
                            }
                          }}
                          className="bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                        >
                          Kirim
                        </button>
                        <button
                          onClick={() => setReplyingReviewId(null)}
                          className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingReviewId(rev.id)}
                        className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Balas Ulasan Ini Sebagai Seller
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. TAB: PENGIKUT & BROADCAST PROMO (FOLLOWERS) */}
        {activeTab === 'followers' && (
          <div className="space-y-6">
            
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Total Pengikut Toko</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">
                  {(sellerStore.followerCount || 24850).toLocaleString('id-ID')}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +340 pengikut baru minggu ini
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Voucher Follower Diklaim</span>
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">
                  1.420 <span className="text-xs font-normal text-stone-500">voucher</span>
                </div>
                <div className="text-[11px] font-medium text-stone-500 mt-1">
                  Kode Aktif: <b className="text-red-700 font-mono">FOLLOWER15</b>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Open Rate Notifikasi</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">
                  78.2%
                </div>
                <div className="text-[11px] font-medium text-emerald-600 mt-1">
                  Sangat Tinggi (Audience Loyal)
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Konversi Penjualan Follower</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-stone-900 mt-2">
                  34.6%
                </div>
                <div className="text-[11px] font-medium text-stone-500 mt-1">
                  Rata-rata 2.4x repeat order
                </div>
              </div>
            </div>

            {/* Broadcast Creation Cockpit */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-amber-100 text-amber-900">
                      <Send className="w-4 h-4" />
                    </span>
                    <h3 className="text-base font-bold text-stone-900 font-['Playfair_Display',serif]">
                      Siaran Notifikasi Promo ke Pengikut (Broadcast Feed)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Kirim pemberitahuan push langsung ke seluruh <b>{(sellerStore.followerCount || 24850).toLocaleString('id-ID')} pengikut setia</b> toko AllKurma saat ada promo, flash sale, atau kedatangan kurma panen baru.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastTitle('🔥 Flash Sale Panen Raya Ajwa VIP');
                      setBroadcastMessage('Stok terbatas Kurma Ajwa Jumbo Al-Aliya baru mendarat di gudang Jakarta! Nikmati diskon kilat 20% hari ini saja.');
                      setBroadcastPromoCode('AJWAPREMIUM20');
                    }}
                    className="text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
                  >
                    Template Flash Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastTitle('🌾 Produk Baru Tiba: Sukari Al-Qassim Fresh Chilled');
                      setBroadcastMessage('Kurma Sukari basah kemasan chilled box 1kg sudah ready kirim dengan box styrofoam & ice pack!');
                      setBroadcastPromoCode('FRESHSUKARI');
                    }}
                    className="text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                  >
                    Template Produk Baru
                  </button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
                    showToast('Harap isi judul dan pesan broadcast!', 'error');
                    return;
                  }
                  broadcastToFollowers(broadcastTitle, broadcastMessage, broadcastPromoCode);
                  setBroadcastTitle('');
                  setBroadcastMessage('');
                  setBroadcastPromoCode('');
                }}
                className="space-y-4 pt-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Judul Notifikasi Siaran
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Contoh: 🔥 Diskon Akhir Pekan 25% Semua Kurma Madinah!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Isi Pesan Notifikasi (Maks. 250 karakter)
                  </label>
                  <textarea
                    rows={3}
                    required
                    maxLength={250}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Tuliskan pesan menarik yang akan muncul di bilah notifikasi pengguna..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  />
                  <div className="text-[10px] text-stone-400 text-right mt-0.5">
                    {broadcastMessage.length}/250 karakter
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      Sertakan Kode Voucher Promo (Opsional)
                    </label>
                    <input
                      type="text"
                      value={broadcastPromoCode}
                      onChange={(e) => setBroadcastPromoCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: PANENRAYA20"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-bold"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Voucher ini akan otomatis masuk ke dompet voucher pengikut saat notifikasi diklik.
                    </span>
                  </div>

                  {/* Notification Live Card Preview */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                      Preview Tampilan Notifikasi Pengikut:
                    </span>
                    <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-start gap-2.5">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-900 shrink-0">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-stone-900 text-xs truncate">
                          {broadcastTitle || 'Judul Notifikasi Broadcast'}
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {broadcastMessage || 'Pesan siaran promosi dan update panen kurma akan muncul di sini...'}
                        </p>
                        {broadcastPromoCode && (
                          <div className="mt-1 text-[10px] font-bold text-amber-800 font-mono">
                            Kupon: {broadcastPromoCode}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Siarkan Notifikasi ke {(sellerStore.followerCount || 24850).toLocaleString('id-ID')} Pengikut</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Riwayat Broadcast Terkirim */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
              <h4 className="text-sm font-bold text-stone-900 mb-3">
                Riwayat Siaran Notifikasi Sebelumnya
              </h4>
              <div className="divide-y divide-stone-100 text-xs">
                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">🎉 Selamat! Voucher Diskon 15% Spesial Follower</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        Auto-Welcome
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Voucher otomatis untuk setiap pengguna baru yang mengklik tombol Follow Toko.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-stone-800">100% Terkirim</span>
                    <span className="text-[10px] text-stone-400 block">Selalu Aktif</span>
                  </div>
                </div>

                <div className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">✨ Kedatangan Kontainer Baru: Kurma Ajwa Al-Madinah VIP</span>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                        Panen Baru
                      </span>
                    </div>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Disiarkan ke 24.850 followers • 19.420 dibaca • 6.210 klik produk
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-emerald-600">78.1% Buka</span>
                    <span className="text-[10px] text-stone-400 block">2 Hari Lalu</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 9. TAB: KELOLA BANNER PROMOSI BERANDA (CAROUSEL) */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Header & Quick Action Buttons */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center shrink-0 shadow-sm">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black text-stone-900">
                        Manajemen Banner Promosi Beranda (Carousel)
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                        Sinkronisasi Beranda Realtime
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 max-w-2xl">
                      Kelola banner slider utama di beranda aplikasi. Ganti foto produk, sesuaikan teks diskon, ubah target klik (kategori, bundling promo, grosir B2B), dan aktifkan/nonaktifkan banner kapan saja.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Apakah Anda yakin ingin mereset banner kembali ke 5 template resmi awal?')) {
                        resetHeroBanners();
                        showToast('Banner berhasil direset ke template resmi!', 'success');
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3.5 py-2.5 rounded-xl border border-stone-300 transition-colors cursor-pointer"
                    title="Kembalikan semua slide ke default pabrik"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-300 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Lihat di Beranda</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddBanner}
                    className="flex items-center gap-2 text-xs font-black bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Banner Baru</span>
                  </button>
                </div>
              </div>

              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-100">
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                  <div className="text-[11px] font-semibold text-stone-500">Total Banner Terdaftar</div>
                  <div className="text-xl font-black text-stone-900 mt-0.5">{heroBanners.length} Slide</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-700">Aktif Tampil di Slider</div>
                  <div className="text-xl font-black text-emerald-900 mt-0.5">
                    {heroBanners.filter(b => b.active !== false).length} Slide
                  </div>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                  <div className="text-[11px] font-semibold text-stone-500">Draf / Nonaktif</div>
                  <div className="text-xl font-black text-stone-600 mt-0.5">
                    {heroBanners.filter(b => b.active === false).length} Slide
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <div className="text-[11px] font-semibold text-blue-700">Kecepatan Rotasi</div>
                  <div className="text-xl font-black text-blue-900 mt-0.5">4.5 Detik</div>
                </div>
              </div>
            </div>

            {/* Live Interactive Simulator Section */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Simulator Tampilan Slider Beranda
                  </h4>
                  <p className="text-xs text-stone-400">
                    Pratinjau langsung bagaimana pembeli melihat banner promosi di perangkat mereka.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-800 p-1 rounded-xl border border-stone-700">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      previewDevice === 'mobile' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    📱 Mode Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      previewDevice === 'desktop' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    💻 Layar Lebar
                  </button>
                </div>
              </div>

              {/* Slider Box Frame */}
              {(() => {
                const activeList = heroBanners.length > 0 ? heroBanners : [];
                const safeIndex = Math.min(bannerPreviewIndex, Math.max(0, activeList.length - 1));
                const currentSlide = activeList[safeIndex];

                if (!currentSlide) {
                  return (
                    <div className="py-12 text-center text-stone-400">
                      Belum ada banner yang terdaftar. Klik "Tambah Banner Baru" untuk mulai.
                    </div>
                  );
                }

                const isFullImg = currentSlide.displayMode === 'full-image';

                return (
                  <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-md' : 'max-w-4xl'}`}>
                    <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl ${
                      isFullImg
                        ? 'bg-stone-950 border border-stone-700/80 min-h-[180px] sm:min-h-[230px]'
                        : `bg-gradient-to-r ${currentSlide.bgGradient || 'from-[#1E3A8A] via-blue-700 to-[#009A44]'} border border-white/20 min-h-[170px] sm:min-h-[220px]`
                    } p-5 sm:p-7 flex flex-col justify-between`}>
                      {isFullImg ? (
                        <>
                          {/* 100% Pure Full Image without gradient color overlay */}
                          <img
                            src={normalizeImageUrl(currentSlide.image)}
                            alt={currentSlide.title}
                            className={`absolute inset-0 w-full h-full ${currentSlide.objectFit === 'contain' ? 'object-contain bg-stone-950' : 'object-cover'} block`}
                          />

                          {/* Top Badges & Status in Simulator */}
                          <div className="relative z-10 flex items-center justify-between gap-2">
                            <span className="inline-block text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-black/65 text-amber-300 backdrop-blur-md border border-amber-400/40 shadow-xs">
                              🖼️ Full Image (Tanpa Gradien)
                            </span>

                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/20">
                              <span className={`w-2 h-2 rounded-full ${currentSlide.active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
                              <span>{currentSlide.active !== false ? 'Aktif' : 'Draf Nonaktif'}</span>
                            </div>
                          </div>

                          {/* Optional text overlay if enabled */}
                          {currentSlide.showTextOverlay ? (
                            <div className="relative z-10 mt-auto pt-8 pb-1 px-3 -mx-3 -mb-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent rounded-b-2xl">
                              <h4 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-xs">
                                {currentSlide.title}
                              </h4>
                              {currentSlide.subtitle && (
                                <p className="text-[11px] sm:text-xs text-stone-100/90 line-clamp-1 mt-0.5">
                                  {currentSlide.subtitle}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="flex-1" />
                          )}

                          {/* CTA button & Navigation Dots */}
                          <div className="relative z-10 flex items-center justify-between pt-2">
                            <span className="text-[10px] sm:text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20">
                              {currentSlide.showTextOverlay ? `Tombol: ${currentSlide.cta || 'Beli Sekarang'}` : 'Poster Grafis Penuh (Bersih)'}
                            </span>

                            {/* Slider Controls */}
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl border border-white/20">
                              <button
                                type="button"
                                onClick={() => setBannerPreviewIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1))}
                                className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                title="Slide Sebelumnya"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              <span className="text-[10px] font-mono text-stone-200 px-1">
                                {safeIndex + 1}/{activeList.length}
                              </span>

                              <button
                                type="button"
                                onClick={() => setBannerPreviewIndex((prev) => (prev < activeList.length - 1 ? prev + 1 : 0))}
                                className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                title="Slide Berikutnya"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Standard Gradient Background Overlay Image */}
                          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-5/12 overflow-hidden pointer-events-none opacity-35 sm:opacity-50">
                            <img
                              src={normalizeImageUrl(currentSlide.image)}
                              alt={currentSlide.title}
                              className="w-full h-full object-cover object-center mix-blend-overlay scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 via-transparent to-transparent" />
                          </div>

                          {/* Top Badges & Status in Simulator */}
                          <div className="relative z-10 flex items-center justify-between gap-2">
                            <span className={`inline-block text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border ${currentSlide.tagColor || 'bg-white/20 text-emerald-100 border-white/30'}`}>
                              {currentSlide.badge || 'PROMO'}
                            </span>

                            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10">
                              <span className={`w-2 h-2 rounded-full ${currentSlide.active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-stone-400'}`} />
                              <span>{currentSlide.active !== false ? 'Aktif' : 'Draf Nonaktif'}</span>
                            </div>
                          </div>

                          {/* Main Copy */}
                          <div className="relative z-10 max-w-[70%] sm:max-w-[65%] my-2">
                            <h4 className="text-base sm:text-2xl font-black text-white leading-tight drop-shadow-xs">
                              {currentSlide.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-stone-100/90 line-clamp-2 mt-1 drop-shadow-xs">
                              {currentSlide.subtitle}
                            </p>
                          </div>

                          {/* CTA button & Navigation Dots */}
                          <div className="relative z-10 flex items-center justify-between pt-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black bg-amber-400 text-stone-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-md">
                              <span>{currentSlide.cta || 'Beli Sekarang'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>

                            {/* Slider Controls */}
                            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2 py-1 rounded-xl border border-white/10">
                              <button
                                type="button"
                                onClick={() => setBannerPreviewIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1))}
                                className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                title="Slide Sebelumnya"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              <span className="text-[10px] font-mono text-stone-300 px-1">
                                {safeIndex + 1}/{activeList.length}
                              </span>

                              <button
                                type="button"
                                onClick={() => setBannerPreviewIndex((prev) => (prev < activeList.length - 1 ? prev + 1 : 0))}
                                className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                                title="Slide Berikutnya"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Active Slide Info Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1 text-xs text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">Aksi Tombol:</span>
                        {currentSlide.isBundlingTrigger ? (
                          <span className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700 text-[11px]">
                            🛍️ Membuka Modal Promo Bundling
                          </span>
                        ) : currentSlide.targetView === 'b2b-portal' ? (
                          <span className="bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700 text-[11px]">
                            🌐 Membuka Portal Grosir B2B
                          </span>
                        ) : currentSlide.targetCategory ? (
                          <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700 text-[11px]">
                            🏷️ Filter Kategori: {currentSlide.targetCategory}
                          </span>
                        ) : (
                          <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700 text-[11px]">
                            📦 Menampilkan Semua Katalog
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditBanner(currentSlide)}
                          className="text-amber-400 hover:text-amber-300 font-bold hover:underline cursor-pointer"
                        >
                          ✏️ Edit Slide Ini
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => handleToggleBannerActive(currentSlide)}
                          className="text-stone-300 hover:text-white font-bold hover:underline cursor-pointer"
                        >
                          {currentSlide.active !== false ? 'Sembunyikan' : 'Aktifkan'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* List of All Registered Banners */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div>
                  <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    Daftar Urutan Slide Banner ({heroBanners.length})
                  </h4>
                  <p className="text-xs text-stone-500">
                    Klik tombol "Ubah Banner" untuk mengganti gambar foto, teks promo, warna latar, atau target kategori.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddBanner}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Slide</span>
                </button>
              </div>

              <div className="space-y-4">
                {heroBanners.map((banner, index) => {
                  const isActive = banner.active !== false;
                  return (
                    <div
                      key={banner.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-stone-50/70 border-stone-200 hover:border-amber-400'
                          : 'bg-stone-100/80 border-stone-300/80 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        {/* Slide Rank Badge & Thumbnail */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-700 font-mono font-black text-xs flex items-center justify-center shrink-0">
                            #{index + 1}
                          </div>

                          {/* Mini Visual Banner Preview */}
                          {banner.displayMode === 'full-image' ? (
                            <div className="relative w-28 sm:w-36 h-18 sm:h-20 rounded-xl overflow-hidden bg-stone-950 p-1 flex flex-col justify-between shrink-0 shadow-xs border border-stone-300">
                              <img
                                src={normalizeImageUrl(banner.image)}
                                alt={banner.title}
                                className={`w-full h-full ${banner.objectFit === 'contain' ? 'object-contain' : 'object-cover'} rounded-lg`}
                              />
                              <span className="absolute top-1 left-1 z-10 text-[8px] font-black uppercase text-amber-300 bg-black/70 backdrop-blur-xs px-1 py-0.2 rounded border border-amber-400/30">
                                Full Image
                              </span>
                            </div>
                          ) : (
                            <div className={`relative w-28 sm:w-36 h-18 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-r ${banner.bgGradient || 'from-[#1E3A8A] to-[#009A44]'} p-2 flex flex-col justify-between shrink-0 shadow-xs border border-stone-200`}>
                              <img
                                src={normalizeImageUrl(banner.image)}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                              />
                              <span className="relative z-10 text-[8px] font-black uppercase text-white bg-black/30 px-1 py-0.2 rounded self-start truncate max-w-full">
                                {banner.badge || 'PROMO'}
                              </span>
                              <span className="relative z-10 text-[9px] font-bold text-white line-clamp-1">
                                {banner.title}
                              </span>
                            </div>
                          )}

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-extrabold text-sm text-stone-900 truncate">
                                {banner.title}
                              </h5>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isActive
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-stone-200 text-stone-600 border border-stone-300'
                                }`}
                              >
                                {isActive ? '● Aktif' : '○ Nonaktif'}
                              </span>
                              {banner.displayMode === 'full-image' ? (
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                  🖼️ Full Image
                                </span>
                              ) : (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                                  🎨 Gradien
                                </span>
                              )}
                              {banner.badge && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  🏷️ {banner.badge}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                              {banner.subtitle}
                            </p>

                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-600 flex-wrap">
                              <span className="flex items-center gap-1 font-semibold text-stone-800">
                                <span className="text-stone-400">Tombol:</span> {banner.cta || 'Beli Sekarang'}
                              </span>
                              <span>•</span>
                              <span>
                                <span className="text-stone-400">Tujuan:</span>{' '}
                                {banner.isBundlingTrigger
                                  ? '🛍️ Modal Promo Bundling'
                                  : banner.targetView === 'b2b-portal'
                                  ? '🌐 Portal B2B'
                                  : banner.targetCategory
                                  ? `🏷️ Kategori: ${banner.targetCategory}`
                                  : '📦 Semua Katalog'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                          {/* Toggle Active Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleBannerActive(banner)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                            title={isActive ? 'Sembunyikan dari slider' : 'Tampilkan di slider'}
                          >
                            {isActive ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-emerald-600" />
                                <span>Matikan</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4" />
                                <span>Aktifkan</span>
                              </>
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditBanner(banner)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Ubah Banner</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteBannerConfirm(banner)}
                            className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Hapus banner"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: TARIK DANA PENJUAL (WITHDRAWAL) */}
      {isWithdrawOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Penarikan Saldo Penjualan
              </h3>
              <button onClick={() => setIsWithdrawOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-xs text-stone-600">Saldo Penjualan Siap Ditarik:</div>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  Rp {sellerStore.payoutBalance.toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Rekening Tujuan (BCA)</label>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="font-bold text-stone-800">{sellerStore.bankAccount.bankName}</div>
                  <div className="font-mono text-stone-600">{sellerStore.bankAccount.accountNumber} - a/n {sellerStore.bankAccount.holderName}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nominal Penarikan (Rp)</label>
                <input
                  type="number"
                  max={sellerStore.payoutBalance}
                  min={50000}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                  placeholder="Contoh: 1000000"
                  className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <div className="text-[11px] text-stone-400 mt-1">Min. Penarikan Rp 50.000 (Bebas Biaya Admin)</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsWithdrawOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK RESI THERMAL / SHIPPING LABEL */}
      {selectedOrderForLabel && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-600" />
                Thermal Shipping Label
              </h3>
              <button onClick={() => setSelectedOrderForLabel(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Thermal Label */}
            <div className="border-2 border-dashed border-stone-400 p-5 rounded-2xl bg-stone-50 font-mono text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <div>
                  <div className="font-black text-sm">ALLKURMA LOGISTICS</div>
                  <div className="text-[10px] text-stone-600">{selectedOrderForLabel.courierName} (REGULER)</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[10px]">NO. RESI:</div>
                  <div className="font-black text-xs text-blue-800">{trackingInput}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-stone-300 pb-2">
                <div>
                  <div className="font-bold text-stone-500">PENGIRIM:</div>
                  <div className="font-bold text-stone-900">{sellerStore.storeName}</div>
                  <div className="text-stone-600">{sellerStore.city} ({sellerStore.phone})</div>
                </div>
                <div>
                  <div className="font-bold text-stone-500">PENERIMA:</div>
                  <div className="font-bold text-stone-900">{selectedOrderForLabel.customerName}</div>
                  <div className="text-stone-600">{selectedOrderForLabel.shippingAddress.streetAddress}, {selectedOrderForLabel.shippingAddress.city}</div>
                </div>
              </div>

              <div className="text-[11px]">
                <div className="font-bold text-stone-500 mb-1">DAFTAR ISI BARANG:</div>
                {selectedOrderForLabel.items.map((it, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>Rp {it.lineTotal.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-300 pt-2 flex justify-between font-black text-xs">
                <span>TOTAL:</span>
                <span>Rp {selectedOrderForLabel.total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100 mt-4">
              <button
                onClick={() => setSelectedOrderForLabel(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Label Fisik
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT PRODUK & SKU LENGKAP */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-stone-200 my-8 max-h-[90vh] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">
                    {editingProduct ? 'Edit Spesifikasi Produk & SKU' : 'Tambah Produk & Master SKU Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Konfigurasi katalog, harga modal HPP, lokasi gudang, dan varian kemasan
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setIsAddProductOpen(false);
                  setEditingProduct(null);
                }} 
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex items-center gap-1.5 border-b border-stone-200 pb-2 mb-4 overflow-x-auto shrink-0 text-xs">
              {[
                { id: 'general', label: '1. Info & Panen' },
                { id: 'pricing', label: '2. Finansial & HPP' },
                { id: 'inventory', label: '3. SKU & Gudang' },
                { id: 'variations', label: `4. Varian SKU (${newProd.variations?.length || 0})` },
                { id: 'wholesale', label: '5. Grosir B2B' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setProductFormTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                    productFormTab === tab.id
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body / Tab Content */}
            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newProd.name || !newProd.regularPrice) {
                  showToast('Mohon lengkapi nama dan harga produk!', 'error');
                  return;
                }

                const payloadData: Partial<Product> = {
                  name: newProd.name,
                  sku: newProd.sku || `AK-${Date.now().toString(36).toUpperCase().slice(-5)}`,
                  barcode: newProd.barcode || `899723456${Math.floor(1000 + Math.random() * 9000)}`,
                  category: newProd.category as any,
                  costPrice: Number(newProd.costPrice) || Math.round(Number(newProd.regularPrice) * 0.6),
                  regularPrice: Number(newProd.regularPrice),
                  discountPrice: newProd.discountPrice ? Number(newProd.discountPrice) : undefined,
                  isFlashSale: !!newProd.isFlashSale,
                  flashSaleDiscountPercent: newProd.isFlashSale ? (Number(newProd.flashSaleDiscountPercent) || 20) : undefined,
                  stock: newProd.variations && newProd.variations.length > 0 
                    ? newProd.variations.reduce((sum, v) => sum + v.stock, 0) 
                    : (Number(newProd.stock) || 50),
                  minStockAlert: Number(newProd.minStockAlert) || 10,
                  origin: newProd.origin || 'Madinah, Saudi Arabia',
                  harvestYear: newProd.harvestYear || 'Panen 2025/2026',
                  shelfLife: newProd.shelfLife || '18 Bulan',
                  expiryDate: newProd.expiryDate || '2027-12-31',
                  storageCondition: newProd.storageCondition || 'Suhu Sejuk (Simpan Kulkas)',
                  packagingType: newProd.packagingType || 'Pouch Kedap Udara Food-Grade',
                  certification: newProd.certification || 'Halal MUI & Kementan RI',
                  description: newProd.description || 'Kurma pilihan kualitas ekspor kemasan higienis.',
                  warehouseRack: newProd.warehouseRack || 'Rak A1-01',
                  warehouseLocation: newProd.warehouseLocation || sellerStore.city,
                  weightGram: Number(newProd.weightGram) || 500,
                  images: (newProd.images && newProd.images.length > 0 && newProd.images[0]) ? newProd.images : [],
                  isNewArrival: newProd.isNewArrival !== undefined ? !!newProd.isNewArrival : true,
                  createdAt: newProd.createdAt || new Date().toISOString(),
                  freeShippingExtra: true,
                  cashbackExtra: true,
                  variations: newProd.variations || [],
                  wholesalePrices: newProd.wholesalePrices || [
                    { minQty: 11, maxQty: 50, pricePerUnit: Math.round(Number(newProd.regularPrice) * 0.9) },
                    { minQty: 51, maxQty: undefined, pricePerUnit: Math.round(Number(newProd.regularPrice) * 0.8) }
                  ]
                };

                if (editingProduct) {
                  updateProduct(editingProduct.id, payloadData);
                  showToast(`Produk & SKU ${newProd.name} berhasil diperbarui!`, 'success');
                } else {
                  addProduct({
                    ...payloadData,
                    rating: 5.0,
                    reviewCount: 0,
                    soldCount: 0
                  } as Product);
                  showToast(`Produk & SKU baru ${newProd.name} berhasil diterbitkan!`, 'success');
                }

                setIsAddProductOpen(false);
                setEditingProduct(null);
              }}
              className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs"
            >
              {/* TAB 1: INFO & PANEN */}
              {productFormTab === 'general' && (
                <div className="space-y-3.5 animate-in fade-in-50">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nama Lengkap Produk Kurma *</label>
                    <input
                      type="text"
                      value={newProd.name}
                      onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                      placeholder="Contoh: Kurma Ajwa Al-Madinah Grade VIP Premium"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-semibold text-stone-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Kategori Kurma</label>
                      <select
                        value={newProd.category}
                        onChange={e => setNewProd({ ...newProd, category: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium"
                      >
                        <option value="Ajwa">Kurma Ajwa (Nabi)</option>
                        <option value="Sukari">Kurma Sukari (Raja)</option>
                        <option value="Medjool">Kurma Medjool</option>
                        <option value="Tunisia">Kurma Tunisia Tangkai</option>
                        <option value="Khalas">Kurma Khalas</option>
                        <option value="Grosir">Paket Grosir Kartonan</option>
                        <option value="Hampers">Hampers & Souvenir</option>
                        <option value="Madu">Madu & Herbal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Negara Asal / Asal Kebun</label>
                      <input
                        type="text"
                        value={newProd.origin}
                        onChange={e => setNewProd({ ...newProd, origin: e.target.value })}
                        placeholder="Madinah, Saudi Arabia"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Musim / Tahun Panen</label>
                      <input
                        type="text"
                        value={newProd.harvestYear}
                        onChange={e => setNewProd({ ...newProd, harvestYear: e.target.value })}
                        placeholder="Panen Baru 2025/2026"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Sertifikasi & Kualitas</label>
                      <input
                        type="text"
                        value={newProd.certification}
                        onChange={e => setNewProd({ ...newProd, certification: e.target.value })}
                        placeholder="Halal MUI & Kementan RI"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-stone-700">URL Foto Produk Utama</label>
                      <span className="text-[10px] text-stone-400">Mendukung Unsplash, Dropbox, Google Drive, & Direct Link</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={newProd.images?.[0] || ''}
                        onChange={e => {
                          const inputVal = e.target.value;
                          const normalized = normalizeImageUrl(inputVal);
                          setNewProd({ ...newProd, images: [normalized] });
                        }}
                        placeholder="https://images.unsplash.com/... atau https://www.dropbox.com/scl/fi/..."
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                      />
                    </div>

                    {/* Dropbox / Cloud Link Notification */}
                    {newProd.images?.[0] && isDropboxUrl(newProd.images[0]) && (
                      <div className="mt-1.5 p-2 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-1.5">
                        <span className="font-bold text-blue-700">✓ Link Dropbox Aktif:</span>
                        <span>
                          Parameter telah otomatis disesuaikan ke format gambar langsung (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[10px]">raw=1</code>).
                        </span>
                      </div>
                    )}

                    {/* Live Image Preview */}
                    {newProd.images?.[0] && (
                      <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                        <img
                          src={normalizeImageUrl(newProd.images[0])}
                          alt="Preview Produk"
                          className="w-14 h-14 rounded-lg object-cover border border-stone-300 shadow-2xs shrink-0 bg-white"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Live Preview Gambar</span>
                          <p className="text-[11px] text-stone-700 font-medium truncate font-mono">
                            {newProd.images[0]}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                            ✓ Gambar aktif siap ditampilkan di etalase produk
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Deskripsi & Catatan Mutu</label>
                    <textarea
                      rows={3}
                      value={newProd.description}
                      onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                      placeholder="Jelaskan karakteristik tekstur daging buah, kadar manis, serta jaminan higienis..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Toggle New Product 2026 / Panen Perdana */}
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs text-emerald-950">
                          Tandai sebagai New Product (Panen Perdana 2026)
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-tight">
                        Produk ini akan otomatis terdeteksi dan diunggulkan di bagian &ldquo;New Product 2026 / Panen Perdana&rdquo; pada Beranda pembeli.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={newProd.isNewArrival !== undefined ? newProd.isNewArrival : true}
                        onChange={(e) => setNewProd({ ...newProd, isNewArrival: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#009A44]"></div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: FINANSIAL & HPP */}
              {productFormTab === 'pricing' && (
                <div className="space-y-4 animate-in fade-in-50">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-stone-800">
                    <h4 className="font-bold text-xs text-amber-950 mb-1">Kalkulator Margin & Profitabilitas</h4>
                    <p className="text-[11px] text-amber-900">
                      Sistem menghitung estimasi keuntungan bersih secara otomatis berdasarkan harga modal dan harga jual.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Harga Modal Satuan (HPP) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rp</span>
                        <input
                          type="number"
                          value={newProd.costPrice}
                          onChange={e => setNewProd({ ...newProd, costPrice: Number(e.target.value) })}
                          placeholder="90000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Harga Jual Normal (Eceran) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rp</span>
                        <input
                          type="number"
                          value={newProd.regularPrice}
                          onChange={e => setNewProd({ ...newProd, regularPrice: Number(e.target.value) })}
                          placeholder="150000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Harga Diskon Promo (Opsional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rp</span>
                        <input
                          type="number"
                          value={newProd.discountPrice || ''}
                          onChange={e => setNewProd({ ...newProd, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="135000"
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-mono text-emerald-700 font-bold"
                        />
                      </div>
                    </div>

                    {/* Live Margin Calculation Card */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex flex-col justify-center">
                      {(() => {
                        const cost = Number(newProd.costPrice) || 0;
                        const sell = Number(newProd.discountPrice || newProd.regularPrice) || 0;
                        const marginRp = sell - cost;
                        const marginPct = sell > 0 ? Math.round((marginRp / sell) * 100) : 0;
                        return (
                          <div>
                            <span className="text-[10px] text-stone-500 font-bold uppercase block">Estimasi Keuntungan Satuan</span>
                            <div className="text-sm font-black text-emerald-700 font-mono">
                              Rp {marginRp.toLocaleString('id-ID')} ({marginPct}%)
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Flash Sale Setting Inside Add/Edit Product */}
                  <div className="p-3.5 rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/80 via-orange-50/40 to-amber-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-xl bg-red-100 text-red-600">
                          <Flame className="w-4 h-4 fill-red-600" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-extrabold text-xs text-stone-900">Program Flash Sale Toko</h5>
                            <span className="bg-red-600 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full">PROMO KILAT</span>
                          </div>
                          <p className="text-[10px] text-stone-500">Tampilkan produk di baris Flash Sale Beranda dengan countdown kilat</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!newProd.isFlashSale}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const defaultDiscount = newProd.flashSaleDiscountPercent || 20;
                            const calculatedPrice = Math.round(Number(newProd.regularPrice || 0) * (1 - defaultDiscount / 100));
                            setNewProd({
                              ...newProd,
                              isFlashSale: checked,
                              flashSaleDiscountPercent: checked ? defaultDiscount : undefined,
                              discountPrice: checked ? calculatedPrice : newProd.discountPrice
                            });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    {newProd.isFlashSale && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-red-200/60 animate-in fade-in">
                        <div>
                          <label className="block font-bold text-stone-700 text-[11px] mb-1">Pilih / Masukkan Diskon Flash Sale (%)</label>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {[15, 20, 30, 40, 50].map((pct) => (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => {
                                  const calculatedPrice = Math.round(Number(newProd.regularPrice || 0) * (1 - pct / 100));
                                  setNewProd({
                                    ...newProd,
                                    flashSaleDiscountPercent: pct,
                                    discountPrice: calculatedPrice
                                  });
                                }}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                                  newProd.flashSaleDiscountPercent === pct
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                                }`}
                              >
                                {pct}%
                              </button>
                            ))}
                            <div className="relative inline-flex items-center">
                              <input
                                type="number"
                                min={5}
                                max={90}
                                value={newProd.flashSaleDiscountPercent || 20}
                                onChange={(e) => {
                                  const pct = Math.max(1, Math.min(99, Number(e.target.value) || 0));
                                  const calculatedPrice = Math.round(Number(newProd.regularPrice || 0) * (1 - pct / 100));
                                  setNewProd({
                                    ...newProd,
                                    flashSaleDiscountPercent: pct,
                                    discountPrice: calculatedPrice
                                  });
                                }}
                                className="w-14 px-1.5 py-1 text-center font-mono font-bold text-xs rounded-lg border border-stone-300 bg-white"
                              />
                              <span className="text-[10px] text-stone-400 ml-1 font-bold">%</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/80 p-2.5 rounded-xl border border-red-100 flex flex-col justify-center">
                          <span className="text-[10px] text-stone-500 font-bold uppercase block">Harga Promo Flash Sale</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black font-mono text-red-600">
                              Rp {(newProd.discountPrice || Math.round(Number(newProd.regularPrice || 0) * 0.8)).toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-stone-400 font-normal line-through">
                              Rp {(Number(newProd.regularPrice) || 0).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-700 font-medium mt-0.5">
                            Hemat Rp {Math.max(0, (Number(newProd.regularPrice) || 0) - (newProd.discountPrice || Math.round(Number(newProd.regularPrice || 0) * 0.8))).toLocaleString('id-ID')} untuk pembeli
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SKU & GUDANG */}
              {productFormTab === 'inventory' && (
                <div className="space-y-3.5 animate-in fade-in-50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Master SKU Code *</label>
                      <input
                        type="text"
                        value={newProd.sku}
                        onChange={e => setNewProd({ ...newProd, sku: e.target.value.toUpperCase() })}
                        placeholder="AK-AJW-VIP"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Barcode EAN-13 (Thermal Tag)</label>
                      <input
                        type="text"
                        value={newProd.barcode || ''}
                        onChange={e => setNewProd({ ...newProd, barcode: e.target.value })}
                        placeholder="8997234560014"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Lokasi Rak Gudang Fisik</label>
                      <input
                        type="text"
                        value={newProd.warehouseRack}
                        onChange={e => setNewProd({ ...newProd, warehouseRack: e.target.value })}
                        placeholder="Rak A1-01 (Lantai 1)"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Kondisi Suhu Penyimpanan</label>
                      <input
                        type="text"
                        value={newProd.storageCondition}
                        onChange={e => setNewProd({ ...newProd, storageCondition: e.target.value })}
                        placeholder="Suhu Sejuk (Simpan Kulkas 4-8°C)"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Stok Fisik Awal</label>
                      <input
                        type="number"
                        value={newProd.stock}
                        onChange={e => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Batas Alert Kritis</label>
                      <input
                        type="number"
                        value={newProd.minStockAlert}
                        onChange={e => setNewProd({ ...newProd, minStockAlert: Number(e.target.value) })}
                        placeholder="10"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Berat Netto (Gram)</label>
                      <input
                        type="number"
                        value={newProd.weightGram}
                        onChange={e => setNewProd({ ...newProd, weightGram: Number(e.target.value) })}
                        placeholder="500"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Jenis Kemasan</label>
                      <input
                        type="text"
                        value={newProd.packagingType}
                        onChange={e => setNewProd({ ...newProd, packagingType: e.target.value })}
                        placeholder="Pouch Kedap Udara Food-Grade"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Umur Simpan (Shelf Life)</label>
                      <input
                        type="text"
                        value={newProd.shelfLife}
                        onChange={e => setNewProd({ ...newProd, shelfLife: e.target.value })}
                        placeholder="18 Bulan"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VARIAN SKU MULTI-KEMASAN */}
              {productFormTab === 'variations' && (
                <div className="space-y-3.5 animate-in fade-in-50">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200">
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">Multi-SKU Varian Kemasan</h4>
                      <p className="text-[11px] text-amber-800">
                        Atur harga, HPP, barcode, dan stok untuk masing-masing ukuran kemasan (250g, 500g, 1kg, 5kg).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVars = newProd.variations || [];
                        const nextIndex = currentVars.length + 1;
                        const newVarItem: ProductVariation = {
                          id: `var-${Date.now()}`,
                          name: `Kemasan Varian ${nextIndex}`,
                          sku: `${newProd.sku || 'AK'}-V${nextIndex}`,
                          barcode: `899723456${Math.floor(1000 + Math.random() * 9000)}`,
                          costPrice: Math.round(Number(newProd.costPrice || 90000) * (nextIndex === 1 ? 0.5 : nextIndex === 2 ? 1 : 2)),
                          regularPrice: Math.round(Number(newProd.regularPrice || 150000) * (nextIndex === 1 ? 0.55 : nextIndex === 2 ? 1 : 1.9)),
                          discountPrice: undefined,
                          stock: 25,
                          minStockAlert: 5,
                          weightGram: nextIndex === 1 ? 250 : nextIndex === 2 ? 500 : 1000,
                          packagingType: 'Pouch Ziplock Premium',
                          warehouseRack: newProd.warehouseRack || 'Rak A1-01'
                        };
                        setNewProd({
                          ...newProd,
                          variations: [...currentVars, newVarItem]
                        });
                      }}
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Tambah Varian</span>
                    </button>
                  </div>

                  {(!newProd.variations || newProd.variations.length === 0) ? (
                    <div className="p-6 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-500">
                      <p className="font-semibold text-xs">Belum ada sub-varian SKU kemasan.</p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Produk ini menggunakan stok master tunggal. Klik tombol di atas untuk menambah varian berat/kemasan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newProd.variations.map((v, vIdx) => (
                        <div key={v.id || vIdx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-stone-900 text-xs">Varian #{vIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = newProd.variations!.filter((_, i) => i !== vIdx);
                                setNewProd({ ...newProd, variations: filtered });
                              }}
                              className="text-rose-600 hover:text-rose-800 text-[11px] font-bold"
                            >
                              Hapus Varian
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Nama Varian Kemasan</label>
                              <input
                                type="text"
                                value={v.name}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].name = e.target.value;
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                placeholder="Kemasan 500g Exclusive"
                                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-300 font-semibold text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">SKU Varian</label>
                              <input
                                type="text"
                                value={v.sku}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].sku = e.target.value.toUpperCase();
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                placeholder="AK-AJW-500G"
                                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-stone-300 font-mono font-bold text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">HPP Modal (Rp)</label>
                              <input
                                type="number"
                                value={v.costPrice || ''}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].costPrice = Number(e.target.value);
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                className="w-full px-2 py-1.5 bg-white rounded-lg border border-stone-300 font-mono text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Harga Jual (Rp)</label>
                              <input
                                type="number"
                                value={v.regularPrice}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].regularPrice = Number(e.target.value);
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                className="w-full px-2 py-1.5 bg-white rounded-lg border border-stone-300 font-mono font-bold text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Stok Fisik</label>
                              <input
                                type="number"
                                value={v.stock}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].stock = Number(e.target.value);
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                className="w-full px-2 py-1.5 bg-white rounded-lg border border-stone-300 font-mono font-bold text-xs"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-stone-600 block mb-0.5">Netto (Gram)</label>
                              <input
                                type="number"
                                value={v.weightGram}
                                onChange={e => {
                                  const updated = [...newProd.variations!];
                                  updated[vIdx].weightGram = Number(e.target.value);
                                  setNewProd({ ...newProd, variations: updated });
                                }}
                                className="w-full px-2 py-1.5 bg-white rounded-lg border border-stone-300 font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GROSIR B2B */}
              {productFormTab === 'wholesale' && (
                <div className="space-y-3.5 animate-in fade-in-50">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-stone-800">
                    <h4 className="font-bold text-xs text-amber-950 mb-0.5">Harga Grosir Bertingkat (Volume Tier)</h4>
                    <p className="text-[11px] text-amber-900">
                      Diskon otomatis diterapkan ketika pembeli memasukkan kuantiti pesanan dalam jumlah besar (reseller & kartonan).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold block">Tier 1 (Eceran Standar)</span>
                        <span className="font-bold text-stone-800 text-xs">1 s/d 10 unit</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-stone-500 font-bold block">Harga per Unit</span>
                        <span className="font-bold text-stone-900 text-xs font-mono">
                          Rp {(newProd.discountPrice || newProd.regularPrice || 0).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold block">Tier 2 (Grosir Menengah)</span>
                        <span className="font-bold text-stone-800 text-xs">11 s/d 50 unit</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-stone-500 font-bold block">Harga per Unit</span>
                        <span className="font-bold text-emerald-700 text-xs font-mono">
                          Rp {Math.round((newProd.discountPrice || newProd.regularPrice || 0) * 0.9).toLocaleString('id-ID')} (-10%)
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold block">Tier 3 (Distributor / Dus)</span>
                        <span className="font-bold text-stone-800 text-xs">&gt; 50 unit</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-stone-500 font-bold block">Harga per Unit</span>
                        <span className="font-bold text-emerald-700 text-xs font-mono">
                          Rp {Math.round((newProd.discountPrice || newProd.regularPrice || 0) * 0.8).toLocaleString('id-ID')} (-20%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Footer Action */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 mt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Box className="w-4 h-4" />
                  <span>{editingProduct ? 'Simpan Perubahan SKU' : 'Terbitkan Master SKU'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: CETAK BARCODE & THERMAL TAG */}
      {selectedProductForBarcode && (
        <SkuBarcodePrintModal
          product={selectedProductForBarcode}
          storeName={sellerStore.storeName}
          onClose={() => setSelectedProductForBarcode(null)}
        />
      )}

      {/* MODAL: PENYESUAIAN STOK / STOCK OPNAME */}
      {selectedProductForStockAdjust && (
        <SkuStockAdjustmentModal
          product={selectedProductForStockAdjust}
          onClose={() => setSelectedProductForStockAdjust(null)}
          onConfirm={(productId, variationId, newStock, logDetails) => {
            handleConfirmSkuStockAdjustment(productId, variationId, newStock, logDetails);
          }}
        />
      )}

      {/* MODAL: TAMBAH VOUCHER BARU */}
      {isAddVoucherOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-600" />
                Buat Kupon Diskon Toko
              </h3>
              <button onClick={() => setIsAddVoucherOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newVoucher.code || !newVoucher.discountValue) {
                  showToast('Mohon lengkapi kode dan nilai diskon!', 'error');
                  return;
                }
                createPromotion({
                  name: newVoucher.name || `Diskon Toko ${newVoucher.code}`,
                  code: newVoucher.code.toUpperCase(),
                  status: 'Active',
                  description: newVoucher.description || `Potongan Rp ${newVoucher.discountValue.toLocaleString('id-ID')} untuk produk AllKurma.`,
                  discountType: newVoucher.discountType,
                  discountValue: Number(newVoucher.discountValue),
                  minPurchase: Number(newVoucher.minPurchase) || 50000,
                  totalUsageLimit: Number(newVoucher.totalUsageLimit) || 100,
                  usagePerCustomer: 1,
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: '2026-12-31',
                  customerSegment: 'All Customers'
                });
                setIsAddVoucherOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-stone-700 mb-1">Nama Voucher Promo</label>
                <input
                  type="text"
                  value={newVoucher.name}
                  onChange={e => setNewVoucher({ ...newVoucher, name: e.target.value })}
                  placeholder="Contoh: Diskon Spesial Ramadhan"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Kode Voucher (Kupon)</label>
                <input
                  type="text"
                  value={newVoucher.code}
                  onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                  placeholder="RAMADHAN25K"
                  className="w-full font-mono font-bold px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Potongan Nilai (Rp)</label>
                  <input
                    type="number"
                    value={newVoucher.discountValue}
                    onChange={e => setNewVoucher({ ...newVoucher, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min. Belanja (Rp)</label>
                  <input
                    type="number"
                    value={newVoucher.minPurchase}
                    onChange={e => setNewVoucher({ ...newVoucher, minPurchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Batas Kuota Pemakaian</label>
                <input
                  type="number"
                  value={newVoucher.totalUsageLimit}
                  onChange={e => setNewVoucher({ ...newVoucher, totalUsageLimit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddVoucherOpen(false)}
                  className="px-4 py-2 font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
                >
                  Rilis Kupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Modal Konfirmasi Hapus Single Produk */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">
              Hapus Produk Ini?
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Anda akan menghapus produk <span className="font-bold text-stone-900">"{productToDelete.name}"</span> (SKU: {productToDelete.sku}) dari etalase toko. Semua data stok varian dan barcode terkait akan dihapus.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setSelectedProductIdsForBulk(prev => prev.filter(id => id !== productToDelete.id));
                  setProductToDelete(null);
                }}
                className="px-4 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Konfirmasi Kosongkan Semua Produk Dummy/Simulasi */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">
              Kosongkan Semua Produk ({products.length})?
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Tindakan ini akan menghapus seluruh data produk dari etalase toko dan penyimpanan lokal browser. Etalase akan menjadi kosong bersih sehingga Anda dapat menginput produk baru Anda sendiri.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsClearAllModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllProducts();
                  setSelectedProductIdsForBulk([]);
                  setIsClearAllModalOpen(false);
                }}
                className="px-4 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Kosongkan Semua
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Konfirmasi Hapus Massal Produk Terpilih */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">
              Hapus {selectedProductIdsForBulk.length} Produk Terpilih?
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              Semua {selectedProductIdsForBulk.length} produk yang Anda centang akan dihapus dari etalase toko. Data stok gudang dan SKU terkait akan dibersihkan.
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedProductIdsForBulk.forEach(id => {
                    deleteProduct(id);
                  });
                  setSelectedProductIdsForBulk([]);
                  setIsBulkDeleteModalOpen(false);
                }}
                className="px-4 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Ya, Hapus Terpilih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Pengaturan & Pendaftaran Produk Flash Sale */}
      {isFlashSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-2xs">
                  <Flame className="w-5 h-5 fill-red-600" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 leading-tight">
                    {flashSaleTargetProduct?.isFlashSale ? 'Kelola Diskon Flash Sale' : 'Daftarkan Produk ke Flash Sale'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Produk akan langsung tayang pada section Flash Sale Beranda
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFlashSaleModalOpen(false);
                  setFlashSaleTargetProduct(null);
                }}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 py-4 space-y-4 text-xs flex-1">
              {/* Product Selector if not yet chosen */}
              {!flashSaleTargetProduct ? (
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    Pilih Produk Kurma dari Etalase Toko:
                  </label>
                  {products.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center text-stone-500">
                      Belum ada produk di etalase toko. Silakan tambahkan produk terlebih dahulu di tab &quot;Katalog &amp; Stok SKU&quot;.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {products.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setFlashSaleTargetProduct(p);
                            const discount = p.flashSaleDiscountPercent || 25;
                            setFlashSaleDiscountInput(discount);
                            setFlashSalePriceInput(p.discountPrice || Math.round(p.regularPrice * (1 - discount / 100)));
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            flashSaleTargetProduct?.id === p.id
                              ? 'border-red-500 bg-red-50/70 ring-2 ring-red-200'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-stone-900 text-xs truncate">
                                {p.name}
                              </h5>
                              <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5">
                                <span className="font-mono">SKU: {p.sku}</span>
                                <span>•</span>
                                <span>Stok: {p.stock} unit</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-xs text-stone-900">
                              Rp {p.regularPrice.toLocaleString('id-ID')}
                            </div>
                            {p.isFlashSale && (
                              <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.2 rounded-sm inline-block mt-0.5">
                                Flash Sale Aktif
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Selected Product Summary Card */
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={flashSaleTargetProduct.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                      alt={flashSaleTargetProduct.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded text-[9px]">
                          {flashSaleTargetProduct.category}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          SKU: {flashSaleTargetProduct.sku}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-stone-900 text-xs truncate mt-0.5">
                        {flashSaleTargetProduct.name}
                      </h4>
                      <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                        Harga Normal: <b className="text-stone-800">Rp {flashSaleTargetProduct.regularPrice.toLocaleString('id-ID')}</b>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlashSaleTargetProduct(null)}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-xl shrink-0 cursor-pointer"
                  >
                    Ganti Produk
                  </button>
                </div>
              )}

              {/* Discount & Price Inputs */}
              {flashSaleTargetProduct && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5">
                      Pilihan Diskon Promo Flash Sale:
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {[15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => {
                            setFlashSaleDiscountInput(pct);
                            const calcPrice = Math.round(flashSaleTargetProduct.regularPrice * (1 - pct / 100));
                            setFlashSalePriceInput(calcPrice);
                          }}
                          className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            flashSaleDiscountInput === pct
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Persentase Custom (%)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min={5}
                            max={90}
                            value={flashSaleDiscountInput}
                            onChange={(e) => {
                              const pct = Math.max(1, Math.min(95, Number(e.target.value) || 0));
                              setFlashSaleDiscountInput(pct);
                              const calcPrice = Math.round(flashSaleTargetProduct.regularPrice * (1 - pct / 100));
                              setFlashSalePriceInput(calcPrice);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-stone-900 text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">%</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">
                          Harga Flash Sale (Rp)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">Rp</span>
                          <input
                            type="number"
                            value={flashSalePriceInput}
                            onChange={(e) => {
                              const price = Number(e.target.value) || 0;
                              setFlashSalePriceInput(price);
                              if (flashSaleTargetProduct.regularPrice > 0 && price > 0) {
                                const calculatedDiscount = Math.round(((flashSaleTargetProduct.regularPrice - price) / flashSaleTargetProduct.regularPrice) * 100);
                                setFlashSaleDiscountInput(Math.max(1, Math.min(95, calculatedDiscount)));
                              }
                            }}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-mono font-black text-red-600 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Profit Simulator */}
                  {(() => {
                    const hpp = flashSaleTargetProduct.costPrice || Math.round(flashSaleTargetProduct.regularPrice * 0.6);
                    const flashPrice = flashSalePriceInput > 0 
                      ? flashSalePriceInput 
                      : Math.round(flashSaleTargetProduct.regularPrice * (1 - (flashSaleDiscountInput || 20) / 100));
                    const profitPerUnit = flashPrice - hpp;
                    const profitPct = flashPrice > 0 ? Math.round((profitPerUnit / flashPrice) * 100) : 0;
                    const buyerSaving = Math.max(0, flashSaleTargetProduct.regularPrice - flashPrice);

                    return (
                      <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-600">HPP Modal Toko:</span>
                          <span className="font-mono font-bold text-stone-700">Rp {hpp.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-600">Hemat untuk Pembeli:</span>
                          <span className="font-mono font-bold text-emerald-700">Rp {buyerSaving.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-red-200 text-xs">
                          <span className="font-bold text-stone-900">Estimasi Margin Laba Bersih:</span>
                          <span className="font-mono font-black text-emerald-700 text-sm">
                            Rp {profitPerUnit.toLocaleString('id-ID')} ({profitPct}%)
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Buyer View Live Preview */}
                  <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                      Preview Tampilan Kartu di Beranda Pembeli
                    </span>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src={flashSaleTargetProduct.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'}
                          alt={flashSaleTargetProduct.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0.5 left-0.5 bg-red-600 text-white text-[8px] font-black px-1 py-0.2 rounded">
                          -{flashSaleDiscountInput}%
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-extrabold text-stone-900 truncate">
                          {flashSaleTargetProduct.name}
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-mono font-black text-xs text-red-600">
                            Rp {(flashSalePriceInput || Math.round(flashSaleTargetProduct.regularPrice * (1 - (flashSaleDiscountInput || 20) / 100))).toLocaleString('id-ID')}
                          </span>
                          <span className="font-mono text-[10px] text-stone-400 line-through">
                            Rp {flashSaleTargetProduct.regularPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-amber-600 font-bold mt-0.5">
                          <Flame className="w-2.5 h-2.5 fill-amber-500" />
                          <span>Promo Kilat Terbatas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-100 shrink-0 mt-2">
              {flashSaleTargetProduct?.isFlashSale ? (
                <button
                  type="button"
                  onClick={() => {
                    if (flashSaleTargetProduct) {
                      handleRemoveFromFlashSale(flashSaleTargetProduct.id, flashSaleTargetProduct.name);
                    }
                  }}
                  className="text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Hapus dari Flash Sale
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsFlashSaleModalOpen(false);
                    setFlashSaleTargetProduct(null);
                  }}
                  className="text-stone-500 hover:bg-stone-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
              )}

              <button
                type="button"
                disabled={!flashSaleTargetProduct}
                onClick={handleSaveFlashSaleProduct}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ${
                  flashSaleTargetProduct
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Simpan &amp; Tayangkan di Flash Sale</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / UBAH BANNER PROMOSI BERANDA */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900">
                    {editingBanner ? 'Ubah Banner Promosi Beranda' : 'Tambah Banner Promosi Baru'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Atur teks, foto, tombol aksi, dan tema visual warna banner.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveBanner} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Dynamic Live Banner Preview Card */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pratinjau Langsung Banner (Live Preview)</span>
                  </label>
                  <span className="text-[10px] font-mono text-stone-400">
                    {bannerForm.displayMode === 'full-image' ? 'Mode: Full Image (Bebas Gradien)' : 'Mode: Standar Gradien'}
                  </span>
                </div>

                {bannerForm.displayMode === 'full-image' ? (
                  <div className="relative rounded-2xl overflow-hidden shadow-lg bg-stone-950 min-h-[170px] flex flex-col justify-between border border-stone-700">
                    {/* Full Image without gradient color tint */}
                    <img
                      src={normalizeImageUrl(bannerForm.image)}
                      alt="Pratinjau Banner"
                      className={`absolute inset-0 w-full h-full ${bannerForm.objectFit === 'contain' ? 'object-contain bg-stone-950' : 'object-cover'} block`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Top Status */}
                    <div className="relative z-10 flex items-center justify-between p-3">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-black/70 text-amber-300 backdrop-blur-md border border-amber-400/40">
                        🖼️ Full Image (Tanpa Gradien)
                      </span>
                      <span className="text-[9px] font-bold text-white/90 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                        {bannerForm.active ? '● Aktif Tampil' : '○ Draf Nonaktif'}
                      </span>
                    </div>

                    {/* Optional Copy */}
                    {bannerForm.showTextOverlay ? (
                      <div className="relative z-10 p-4 pt-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <h4 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow-xs">
                          {bannerForm.title || 'Judul Banner Promosi'}
                        </h4>
                        {bannerForm.subtitle && (
                          <p className="text-[11px] text-stone-100/90 line-clamp-1 mt-0.5">
                            {bannerForm.subtitle}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* Bottom Status bar in Preview */}
                    <div className="relative z-10 px-3 pb-2 flex items-center justify-between text-[10px]">
                      <span className="text-stone-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                        {bannerForm.showTextOverlay ? `Tombol: ${bannerForm.cta || 'Beli Sekarang'}` : 'Poster Bersih (Tanpa Teks Overlay)'}
                      </span>
                      <span className="text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
                        Fit: {bannerForm.objectFit}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={`relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r ${bannerForm.bgGradient} p-5 min-h-[160px] flex flex-col justify-between border border-white/20`}>
                    {/* Background Overlay Image */}
                    <div className="absolute right-0 top-0 bottom-0 w-5/12 overflow-hidden pointer-events-none opacity-40">
                      <img
                        src={normalizeImageUrl(bannerForm.image)}
                        alt="Pratinjau Banner"
                        className="w-full h-full object-cover object-center mix-blend-overlay scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-stone-900/50 via-transparent to-transparent" />
                    </div>

                    {/* Top Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-xs border ${bannerForm.tagColor}`}>
                        {bannerForm.badge || 'PROMO'}
                      </span>
                      <span className="text-[9px] font-bold text-white/80 bg-black/30 px-2 py-0.5 rounded-full">
                        {bannerForm.active ? '● Aktif Tampil' : '○ Draf Nonaktif'}
                      </span>
                    </div>

                    {/* Copy */}
                    <div className="relative z-10 max-w-[70%] my-2">
                      <h4 className="text-base font-black text-white leading-tight drop-shadow-xs">
                        {bannerForm.title || 'Judul Banner Promosi'}
                      </h4>
                      <p className="text-[11px] text-stone-100/90 line-clamp-2 mt-0.5">
                        {bannerForm.subtitle || 'Tuliskan deskripsi ringkas penawaran promosi atau keunggulan kurma di sini.'}
                      </p>
                    </div>

                    {/* CTA button */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-400 text-stone-950 px-3 py-1 rounded-xl shadow-xs">
                        <span>{bannerForm.cta || 'Beli Sekarang'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>

                      <span className="text-[10px] text-white/80 font-medium">
                        {bannerForm.isBundlingTrigger
                          ? '🛍️ Buka Modal Bundling'
                          : bannerForm.targetView === 'b2b-portal'
                          ? '🌐 Buka Portal B2B'
                          : bannerForm.targetCategory
                          ? `🏷️ Kategori: ${bannerForm.targetCategory}`
                          : '📦 Semua Katalog'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pilihan Mode Tampilan Banner (Full Image vs Gradien) */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/90 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Format / Gaya Tampilan Banner di Beranda</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                    Pilihan Tampilan
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Full Image */}
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, displayMode: 'full-image' })}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      bannerForm.displayMode === 'full-image'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                        : 'bg-white/60 border-stone-200 hover:bg-white text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🖼️</span>
                        <span className="text-xs font-black text-stone-900">Full Image (Gambar Penuh 100%)</span>
                      </div>
                      {bannerForm.displayMode === 'full-image' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Gambar/poster promo tampil penuh &amp; jernih <strong>tanpa terganggu gradien warna</strong> atau efek pencampuran.
                    </p>
                  </button>

                  {/* Option 2: Standard Gradient */}
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, displayMode: 'standard' })}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      bannerForm.displayMode !== 'full-image'
                        ? 'bg-white border-amber-500 ring-2 ring-amber-400/50 shadow-sm'
                        : 'bg-white/60 border-stone-200 hover:bg-white text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎨</span>
                        <span className="text-xs font-black text-stone-900">Standar (Gradien Warna)</span>
                      </div>
                      {bannerForm.displayMode !== 'full-image' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      Kombinasi warna gradien elegan, teks judul &amp; subjudul tebal, serta foto produk di samping kanan.
                    </p>
                  </button>
                </div>

                {/* Sub-options for Full Image Mode */}
                {bannerForm.displayMode === 'full-image' && (
                  <div className="pt-2.5 border-t border-amber-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Penskalaan Foto (Object Fit):
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, objectFit: 'cover' })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            bannerForm.objectFit !== 'contain'
                              ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          Cover (Penuh Area)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, objectFit: 'contain' })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            bannerForm.objectFit === 'contain'
                              ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          Contain (Utuh Proporsional)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Teks di Atas Gambar Poster:
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, showTextOverlay: false })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            !bannerForm.showTextOverlay
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          🚫 Poster Bersih (Murni)
                        </button>
                        <button
                          type="button"
                          onClick={() => setBannerForm({ ...bannerForm, showTextOverlay: true })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            bannerForm.showTextOverlay
                              ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          📝 Tampilkan Teks
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        {!bannerForm.showTextOverlay
                          ? 'Cocok jika gambar sudah memuat desain tulisan promo mandiri.'
                          : 'Menambahkan tulisan judul banner di bagian bawah dengan bayangan lembut.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 1. URL Foto Gambar Banner */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  URL Foto Produk / Banner (Mendukung Tautan Dropbox Otomatis) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... atau tautan foto Dropbox"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
                  />
                  {isDropboxUrl(bannerForm.image) && (
                    <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Dropbox Terdeteksi
                    </span>
                  )}
                </div>

                {/* Preset Image Options */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-stone-500 block mb-1">
                    Gunakan Foto Rekomendasi Cepat:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {BANNER_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, image: preset.url })}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                          bannerForm.image === preset.url
                            ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Badge & Tombol CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Label Tag / Badge Promo (Atas)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="Contoh: Panen Raya 2026, Diskon 50%, Promo Bundling"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  />
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {['Panen Raya 2026', 'Promo Bundling', 'Flash Sale', 'Grosir Kontainer', 'Spesial Ramadhan'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, badge: tag })}
                        className="text-[10px] bg-stone-100 hover:bg-amber-100 text-stone-600 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Teks Tombol Aksi (CTA)
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.cta}
                    onChange={(e) => setBannerForm({ ...bannerForm, cta: e.target.value })}
                    placeholder="Contoh: Beli Sekarang, Cek Promo, Buka Grosir"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
                  />
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {['Beli Sekarang', 'Cek Promo Hemat', 'Pesan Grosir', 'Lihat Koleksi'].map((ctaText) => (
                      <button
                        key={ctaText}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, cta: ctaText })}
                        className="text-[10px] bg-stone-100 hover:bg-amber-100 text-stone-600 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        {ctaText}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Judul & Subjudul */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Judul Utama Banner <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="Contoh: Kurma Ajwa Madinah Grade VIP Al-Madinah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Subjudul / Keterangan Penawaran
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    placeholder="Contoh: Dipetik langsung dari perkebunan pilihan Madinah. 100% Alami & Berkhasiat."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* 4. Target Aksi Saat Banner Diklik */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <label className="block text-xs font-bold text-stone-800">
                  Tujuan / Aksi Saat Banner Diklik Pembeli:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    !bannerForm.isBundlingTrigger && bannerForm.targetView !== 'b2b-portal'
                      ? 'bg-amber-50 border-amber-500 text-stone-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="bannerTargetType"
                        checked={!bannerForm.isBundlingTrigger && bannerForm.targetView !== 'b2b-portal'}
                        onChange={() => setBannerForm({ ...bannerForm, isBundlingTrigger: false, targetView: '' })}
                        className="accent-amber-600"
                      />
                      <span className="text-xs font-bold">Kategori Produk</span>
                    </div>
                    <span className="text-[10px] text-stone-500">Filter katalog ke kategori tertentu</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    bannerForm.isBundlingTrigger
                      ? 'bg-purple-50 border-purple-500 text-stone-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="bannerTargetType"
                        checked={bannerForm.isBundlingTrigger}
                        onChange={() => setBannerForm({ ...bannerForm, isBundlingTrigger: true, targetView: '', targetCategory: '' })}
                        className="accent-purple-600"
                      />
                      <span className="text-xs font-bold">Modal Bundling</span>
                    </div>
                    <span className="text-[10px] text-stone-500">Buka popup paket kombo hemat</span>
                  </label>

                  <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    bannerForm.targetView === 'b2b-portal'
                      ? 'bg-blue-50 border-blue-500 text-stone-900 shadow-2xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="bannerTargetType"
                        checked={bannerForm.targetView === 'b2b-portal'}
                        onChange={() => setBannerForm({ ...bannerForm, isBundlingTrigger: false, targetView: 'b2b-portal', targetCategory: '' })}
                        className="accent-blue-600"
                      />
                      <span className="text-xs font-bold">Portal B2B Grosir</span>
                    </div>
                    <span className="text-[10px] text-stone-500">Buka halaman pengadaan kontainer</span>
                  </label>
                </div>

                {!bannerForm.isBundlingTrigger && bannerForm.targetView !== 'b2b-portal' && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Pilih Kategori Produk yang Ditampilkan:
                    </label>
                    <select
                      value={bannerForm.targetCategory}
                      onChange={(e) => setBannerForm({ ...bannerForm, targetCategory: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Semua">Semua Kategori (Katalog Lengkap)</option>
                      <option value="Ajwa">Kurma Ajwa</option>
                      <option value="Sukari">Kurma Sukari</option>
                      <option value="Medjool">Kurma Medjool</option>
                      <option value="Tunisia">Kurma Tunisia</option>
                      <option value="Khalas">Kurma Khalas</option>
                      <option value="Ruthob">Kurma Ruthob (Segar/Basah)</option>
                      <option value="Hampers">Hampers & Parcel Mewah</option>
                      <option value="Olahan">Produk Olahan & Sari Kurma</option>
                    </select>
                  </div>
                )}
              </div>

              {/* 5. Tema Warna Gradien Background */}
              {bannerForm.displayMode === 'full-image' ? (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="text-base">ℹ️</span>
                    <span>
                      Tema gradien warna <strong>dinonaktifkan</strong> karena Anda memilih <strong>Mode Full Image</strong> (foto/poster tampil 100% utuh &amp; alami tanpa efek gradien).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, displayMode: 'standard' })}
                    className="text-amber-600 font-bold hover:underline shrink-0 text-xs cursor-pointer text-left"
                  >
                    Beralih ke Standar Gradien →
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    Pilih Tema Warna Latar Belakang (Gradien):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {BANNER_GRADIENT_PRESETS.map((grad) => (
                      <button
                        key={grad.name}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, bgGradient: grad.value, tagColor: grad.tag })}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          bannerForm.bgGradient === grad.value
                            ? 'border-amber-500 ring-2 ring-amber-400/40 bg-stone-50'
                            : 'border-stone-200 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${grad.value} shrink-0 shadow-xs border border-white/40`} />
                        <div className="min-w-0">
                          <div className="text-[11px] font-bold text-stone-900 truncate">
                            {grad.name}
                          </div>
                          <div className="text-[9px] text-stone-400 truncate">
                            {bannerForm.bgGradient === grad.value ? '✓ Terpilih' : 'Klik pilih'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Status Banner */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-900">
                    Status Tayang di Beranda
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Jika dimatikan, banner akan disimpan sebagai draf dan tidak berputar di slider pembeli.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerForm.active}
                    onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Footer Submit Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-black text-xs bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingBanner ? 'Simpan Perubahan Banner' : 'Terbitkan Banner Baru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
