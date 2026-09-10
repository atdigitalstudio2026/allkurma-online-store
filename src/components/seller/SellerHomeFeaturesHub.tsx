import React, { useState } from 'react';
import {
  Package,
  Percent,
  Boxes,
  Sparkles,
  Building2,
  Truck,
  Gift,
  Heart,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Tag,
  Star,
  MapPin,
  Send,
  Zap,
  Check,
  X,
  RotateCcw,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, BundleDeal, BundleDealItem } from '../../types';

interface SellerHomeFeaturesHubProps {
  onNavigateTab: (tab: any) => void;
  initialSubTab?: 'overview' | 'bundling' | 'new-product' | 'wholesale' | 'shipping' | 'hampers' | 'wishlist';
}

export const SellerHomeFeaturesHub: React.FC<SellerHomeFeaturesHubProps> = ({
  onNavigateTab,
  initialSubTab = 'overview'
}) => {
  const {
    products,
    updateProduct,
    promotions,
    createPromotion,
    togglePromotionStatus,
    bundlingDeals,
    addBundleDeal,
    updateBundleDeal,
    deleteBundleDeal,
    toggleBundleDealActive,
    resetBundleDeals,
    sellerStore,
    updateSellerStore,
    toggleSellerCourier,
    wishlistProductIds,
    broadcastToFollowers,
    showToast,
    setCurrentView
  } = useApp();

  const [subTab, setSubTab] = useState<'overview' | 'bundling' | 'new-product' | 'wholesale' | 'shipping' | 'hampers' | 'wishlist'>(initialSubTab);

  // --- 1. Promo Bundling State ---
  const [isAddBundleModalOpen, setIsAddBundleModalOpen] = useState(false);
  const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
  const [bundleModalStep, setBundleModalStep] = useState<'products' | 'pricing' | 'details' | 'preview'>('products');
  const [bundleProductSearch, setBundleProductSearch] = useState('');
  const [bundleCategoryFilter, setBundleCategoryFilter] = useState('all');
  const [bundleVariationSelections, setBundleVariationSelections] = useState<Record<string, string>>({});
  const [bundleQtySelections, setBundleQtySelections] = useState<Record<string, number>>({});
  const [bundleForm, setBundleForm] = useState<{
    name: string;
    subtitle: string;
    badge: string;
    tag: string;
    originalPrice: number;
    bundlePrice: number;
    image: string;
    items: BundleDealItem[];
    benefits: string[];
  }>({
    name: '',
    subtitle: '',
    badge: 'HEMAT 30%',
    tag: 'Paket Hemat',
    originalPrice: 300000,
    bundlePrice: 210000,
    image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80',
    items: [
      { title: 'Kurma Ajwa Madinah Grade VIP', qty: '1 Box (500 gram)', description: 'Kurma nabi kaya khasiat' },
      { title: 'Madu Murni Yaman Habbatussauda', qty: '1 Toples (250 gram)', description: 'Madu herbal kaya enzim' }
    ],
    benefits: [
      'Harga paket bundling jauh lebih hemat dibanding beli terpisah',
      'Bonus kartu ucapan Ramadhan & tas ramah lingkungan SRA'
    ]
  });

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newBenefitText, setNewBenefitText] = useState('');

  // --- 2. New Product 2026 Filter & Search ---
  const [productSearch, setProductSearch] = useState('');
  const [newProductFilter, setNewProductFilter] = useState<'all' | 'new-only' | 'standard'>('all');

  // --- 3. Wholesale B2B Edit State ---
  const [selectedB2BProductId, setSelectedB2BProductId] = useState<string | null>(null);
  const [b2bTierMinQty, setB2bTierMinQty] = useState<number>(10);
  const [b2bTierPrice, setB2bTierPrice] = useState<number>(0);

  // --- 4. Shipping Simulation State ---
  const [testCity, setTestCity] = useState('Surabaya');
  const [testWeightKg, setTestWeightKg] = useState(2);

  // --- 5. Wishlist Promo Broadcast State ---
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTargetProduct, setBroadcastTargetProduct] = useState<Product | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastDiscountPct, setBroadcastDiscountPct] = useState(15);

  // Calculated Metrics
  const activeProductsCount = products.filter(p => !p.isDraft).length;
  const newProductsCount = products.filter(p => p.isNewArrival && !p.isDraft).length;
  const activeVouchersCount = promotions.filter(p => p.status === 'Active').length;
  const activeBundlesCount = bundlingDeals.filter(b => b.active !== false).length;
  const wholesaleProductsCount = products.filter(p => p.wholesalePrices && p.wholesalePrices.length > 0).length;
  const activeCouriersCount = (sellerStore.couriers || []).filter(c => c.active).length;
  const hampersProductsCount = products.filter(p => p.category === 'Hampers' || p.category.toLowerCase().includes('hamper')).length;
  const favoritedCount = wishlistProductIds.length;

  // Handlers for Bundling
  const handleOpenCreateBundle = () => {
    setEditingBundleId(null);
    setBundleModalStep('products');
    setBundleProductSearch('');
    setBundleCategoryFilter('all');
    setBundleForm({
      name: '',
      subtitle: '',
      badge: 'HEMAT 30%',
      tag: 'Paket Hemat',
      originalPrice: 0,
      bundlePrice: 0,
      image: '',
      items: [],
      benefits: [
        'Harga paket bundling jauh lebih hemat dibanding beli eceran satuan',
        'Garansi 100% kurma asli segar berkualitas & bersertifikat resmi SRA',
        'Kompilasi produk premium higienis dengan proteksi kemasan ganda'
      ]
    });
    setIsAddBundleModalOpen(true);
  };

  const handleEditBundle = (bundle: BundleDeal) => {
    setEditingBundleId(bundle.id);
    setBundleModalStep('products');
    setBundleProductSearch('');
    setBundleCategoryFilter('all');
    setBundleForm({
      name: bundle.name,
      subtitle: bundle.subtitle,
      badge: bundle.badge,
      tag: bundle.tag,
      originalPrice: bundle.originalPrice,
      bundlePrice: bundle.bundlePrice,
      image: bundle.image,
      items: [...bundle.items],
      benefits: [...bundle.benefits]
    });
    setIsAddBundleModalOpen(true);
  };

  // Toggle Etalase Product into Bundle
  const handleToggleEtalaseProduct = (product: Product) => {
    const selectedVarId = bundleVariationSelections[product.id];
    const selectedVar = product.variations?.find(v => v.id === selectedVarId) || product.variations?.[0];
    const qty = bundleQtySelections[product.id] || 1;

    const existingIndex = bundleForm.items.findIndex(
      it => it.productId === product.id && (!selectedVarId || it.variationId === selectedVarId)
    );

    if (existingIndex >= 0) {
      // Remove product from bundle
      const updatedItems = bundleForm.items.filter((_, i) => i !== existingIndex);
      const totalOriginal = updatedItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
      setBundleForm(prev => ({
        ...prev,
        items: updatedItems,
        originalPrice: totalOriginal > 0 ? totalOriginal : (updatedItems.length === 0 ? 0 : prev.originalPrice),
        bundlePrice: totalOriginal > 0 ? Math.round((totalOriginal * 0.7) / 1000) * 1000 : (updatedItems.length === 0 ? 0 : prev.bundlePrice)
      }));
      showToast(`Produk "${product.name}" dihapus dari paket`, 'info');
    } else {
      // Add product to bundle
      const unitPrice = selectedVar ? (selectedVar.discountPrice || selectedVar.regularPrice) : (product.discountPrice || product.regularPrice);
      const itemTitle = selectedVar ? `${product.name} (${selectedVar.name})` : product.name;
      const itemQty = `${qty} ${selectedVar ? selectedVar.name : 'Pcs'}`;
      const itemPrice = unitPrice * qty;

      const newItem: BundleDealItem = {
        productId: product.id,
        variationId: selectedVar?.id,
        title: itemTitle,
        qty: itemQty,
        description: product.description?.slice(0, 70) || (product.origin ? `Asal: ${product.origin}` : 'Produk Pilihan SRA'),
        price: itemPrice,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=300'
      };

      const updatedItems = [...bundleForm.items, newItem];
      const totalOriginal = updatedItems.reduce((acc, curr) => acc + (curr.price || 0), 0);
      const suggestedBundlePrice = Math.round((totalOriginal * 0.7) / 1000) * 1000;

      // Smart suggestions for name & cover image if empty
      const suggestedName = bundleForm.name.trim() !== '' 
        ? bundleForm.name 
        : `Paket Kombo: ${updatedItems.map(i => i.title.replace(/^Kurma\s+/i, '').split(' ')[0]).slice(0, 3).join(' + ')}`;
      const suggestedCover = bundleForm.image.trim() !== ''
        ? bundleForm.image
        : (product.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800');

      setBundleForm(prev => ({
        ...prev,
        items: updatedItems,
        originalPrice: totalOriginal,
        bundlePrice: prev.bundlePrice === 0 || prev.originalPrice === 0 ? suggestedBundlePrice : prev.bundlePrice,
        name: prev.name.trim() === '' ? suggestedName : prev.name,
        image: prev.image.trim() === '' ? suggestedCover : prev.image,
        subtitle: prev.subtitle.trim() === '' ? `Kombinasi hemat ${updatedItems.length} produk pilihan dari etalase toko` : prev.subtitle
      }));
      showToast(`Produk "${product.name}" berhasil ditambahkan ke bundling!`, 'success');
    }
  };

  const handleSetProductQty = (productId: string, delta: number) => {
    setBundleQtySelections(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(20, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const handleSetProductVariation = (productId: string, varId: string) => {
    setBundleVariationSelections(prev => ({ ...prev, [productId]: varId }));
  };

  const handleApplyDiscountPreset = (pct: number) => {
    if (bundleForm.originalPrice <= 0) {
      showToast('Tentukan harga normal terlebih dahulu!', 'error');
      return;
    }
    const discounted = Math.round((bundleForm.originalPrice * (1 - pct / 100)) / 1000) * 1000;
    setBundleForm(prev => ({
      ...prev,
      bundlePrice: Math.max(1000, discounted),
      badge: `HEMAT ${pct}%`
    }));
  };

  const handleApplyNominalSavings = (nominal: number) => {
    if (bundleForm.originalPrice <= nominal) {
      showToast(`Harga normal harus lebih dari Rp ${nominal.toLocaleString('id-ID')}`, 'error');
      return;
    }
    const discounted = bundleForm.originalPrice - nominal;
    const pct = Math.round((nominal / bundleForm.originalPrice) * 100);
    setBundleForm(prev => ({
      ...prev,
      bundlePrice: discounted,
      badge: `HEMAT Rp ${Math.round(nominal / 1000)}RB`
    }));
  };

  const handleAutoGenerateBundleName = () => {
    if (bundleForm.items.length === 0) {
      showToast('Pilih minimal 1 produk dari etalase terlebih dahulu!', 'error');
      return;
    }
    const parts = bundleForm.items.map(i => i.title.replace(/^Kurma\s+/i, '').split(' ')[0]).filter(Boolean);
    const autoTitle = `Paket Berkah: ${parts.slice(0, 3).join(' + ')}`;
    setBundleForm(prev => ({
      ...prev,
      name: autoTitle,
      subtitle: `Kombinasi istimewa ${bundleForm.items.length} produk etalase dengan harga jauh lebih hemat`
    }));
    showToast('Nama paket otomatis berhasil diperbarui!', 'success');
  };

  const handleRecalculateOriginalPrice = () => {
    const totalOriginal = bundleForm.items.reduce((acc, curr) => acc + (curr.price || 0), 0);
    if (totalOriginal > 0) {
      setBundleForm(prev => ({
        ...prev,
        originalPrice: totalOriginal,
        bundlePrice: Math.round((totalOriginal * 0.7) / 1000) * 1000,
        badge: 'HEMAT 30%'
      }));
      showToast('Harga normal berhasil disinkronkan dengan total harga produk etalase!', 'success');
    } else {
      showToast('Tidak ada produk yang memiliki estimasi harga!', 'error');
    }
  };

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.name.trim()) {
      showToast('Nama paket bundling wajib diisi!', 'error');
      setBundleModalStep('details');
      return;
    }
    if (bundleForm.items.length === 0) {
      showToast('Minimal harus memilih 1 produk dari etalase!', 'error');
      setBundleModalStep('products');
      return;
    }
    if (bundleForm.originalPrice <= 0 || bundleForm.bundlePrice <= 0) {
      showToast('Harga normal dan harga bundling harus lebih dari Rp 0!', 'error');
      setBundleModalStep('pricing');
      return;
    }
    if (bundleForm.bundlePrice >= bundleForm.originalPrice) {
      showToast('Harga spesial bundling harus lebih murah dari harga normal agar pembeli hemat!', 'error');
      setBundleModalStep('pricing');
      return;
    }

    const savings = Math.max(0, bundleForm.originalPrice - bundleForm.bundlePrice);
    const discountPct = bundleForm.originalPrice > 0 
      ? Math.round((savings / bundleForm.originalPrice) * 100) 
      : 0;
    const finalBadge = bundleForm.badge?.trim() || `HEMAT ${discountPct}%`;
    const finalImage = bundleForm.image?.trim() || bundleForm.items[0]?.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=800&auto=format&fit=crop&q=80';

    if (editingBundleId) {
      updateBundleDeal(editingBundleId, {
        name: bundleForm.name,
        subtitle: bundleForm.subtitle || `Kombinasi hemat ${bundleForm.items.length} produk etalase`,
        badge: finalBadge,
        tag: bundleForm.tag || 'Paket Hemat',
        originalPrice: Number(bundleForm.originalPrice),
        bundlePrice: Number(bundleForm.bundlePrice),
        discountPct,
        savings,
        image: finalImage,
        items: bundleForm.items,
        benefits: bundleForm.benefits
      });
      showToast('Paket bundling berhasil diperbarui dan tersinkronisasi ke Beranda!', 'success');
    } else {
      addBundleDeal({
        name: bundleForm.name,
        subtitle: bundleForm.subtitle || `Kombinasi hemat ${bundleForm.items.length} produk etalase`,
        badge: finalBadge,
        tag: bundleForm.tag || 'Paket Hemat',
        originalPrice: Number(bundleForm.originalPrice),
        bundlePrice: Number(bundleForm.bundlePrice),
        discountPct,
        savings,
        rating: 5.0,
        soldCount: 0,
        image: finalImage,
        items: bundleForm.items,
        benefits: bundleForm.benefits,
        active: true
      });
      showToast('Paket bundling baru berhasil dipublikasikan dari etalase toko!', 'success');
    }
    setIsAddBundleModalOpen(false);
  };

  const handleAddItemToBundle = () => {
    if (!newItemTitle.trim()) return;
    const price = newItemPrice > 0 ? newItemPrice : 0;
    const newItem: BundleDealItem = {
      title: newItemTitle.trim(),
      qty: newItemQty.trim() || '1 Pcs',
      description: newItemDesc.trim() || 'Item bonus & pelengkap paket',
      price: price > 0 ? price : undefined,
      image: 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=200'
    };

    setBundleForm(prev => {
      const updated = [...prev.items, newItem];
      const newTotal = updated.reduce((acc, c) => acc + (c.price || 0), 0);
      return {
        ...prev,
        items: updated,
        originalPrice: newTotal > prev.originalPrice ? newTotal : prev.originalPrice
      };
    });
    setNewItemTitle('');
    setNewItemQty('');
    setNewItemDesc('');
    setNewItemPrice(0);
    showToast(`Bonus/Item manual "${newItem.title}" ditambahkan ke paket`, 'success');
  };

  const handleRemoveItemFromBundle = (index: number) => {
    setBundleForm(prev => {
      const updated = prev.items.filter((_, i) => i !== index);
      const newTotal = updated.reduce((acc, c) => acc + (c.price || 0), 0);
      return {
        ...prev,
        items: updated,
        originalPrice: newTotal > 0 ? newTotal : prev.originalPrice
      };
    });
  };

  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    setBundleForm(prev => ({
      ...prev,
      benefits: [...prev.benefits, newBenefitText.trim()]
    }));
    setNewBenefitText('');
  };

  const handleRemoveBenefit = (index: number) => {
    setBundleForm(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  // Toggle New Product Arrival
  const handleToggleNewArrival = (productId: string, currentStatus: boolean | undefined) => {
    const nextStatus = !currentStatus;
    updateProduct(productId, { isNewArrival: nextStatus });
    showToast(
      nextStatus 
        ? 'Produk berhasil ditandai sebagai New Product 2026 dan tampil di highlight Beranda!' 
        : 'Status New Product 2026 dinonaktifkan.',
      'info'
    );
  };

  // Toggle Hampers Category
  const handleToggleHampers = (productId: string, currentCategory: string) => {
    const nextCategory = currentCategory === 'Hampers' ? 'Kurma' : 'Hampers';
    updateProduct(productId, { category: nextCategory });
    showToast(
      nextCategory === 'Hampers'
        ? 'Produk dimasukkan ke Kategori Hampers & Parcel Gift Box!'
        : 'Produk dikembalikan ke Kategori Reguler.',
      'info'
    );
  };

  // Quick 50% Voucher Generator
  const handleCreate50PercentVoucher = () => {
    createPromotion({
      code: `DISKON50-${Math.floor(100 + Math.random() * 900)}`,
      name: 'Voucher Spesial Diskon 50% AllKurma',
      discountType: 'percentage',
      discountValue: 50,
      minPurchase: 100000,
      maxDiscountCap: 50000,
      totalUsageLimit: 500,
      usagePerCustomer: 1,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      customerSegment: 'All Customers',
      description: 'Potongan 50% s/d Rp 50.000 khusus pembelian kurma & madu pilihan.',
      status: 'Active'
    });
    showToast('Voucher Diskon 50% berhasil dibuat dan langsung bisa diklaim pembeli di Beranda!', 'success');
  };

  // Send Promo to Wishlist Users
  const handleSendWishlistBroadcast = () => {
    if (!broadcastTargetProduct) return;
    const code = `FAV${broadcastDiscountPct}-${Math.floor(100 + Math.random() * 900)}`;
    createPromotion({
      code,
      name: `Promo Khusus Favorit: ${broadcastTargetProduct.name.slice(0, 25)}`,
      discountType: 'percentage',
      discountValue: broadcastDiscountPct,
      minPurchase: 50000,
      maxDiscountCap: 30000,
      totalUsageLimit: 200,
      usagePerCustomer: 1,
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      customerSegment: 'All Customers',
      description: `Diskon spesial ${broadcastDiscountPct}% untuk produk favorit Anda: ${broadcastTargetProduct.name}`,
      status: 'Active'
    });

    broadcastToFollowers(
      `Diskon ${broadcastDiscountPct}% Produk Favoritmu!`,
      broadcastMsg || `Produk "${broadcastTargetProduct.name}" yang Anda simpan di Favorit sekarang sedang promo spesial! Gunakan kode ${code} saat checkout.`,
      code
    );
    showToast(`Broadcast voucher diskon ${broadcastDiscountPct}% berhasil dikirim ke calon pembeli!`, 'success');
    setIsBroadcastModalOpen(false);
  };

  // Filtered Products for New Product Manager
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.sku.toLowerCase().includes(productSearch.toLowerCase());
    if (!matchSearch) return false;

    if (newProductFilter === 'new-only') return !!p.isNewArrival;
    if (newProductFilter === 'standard') return !p.isNewArrival;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. MASTER HEADER & SHORTCUT NAVIGATION */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-stone-700/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pusat Kendali 8 Fitur Unggulan Beranda (Live Sync)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Hub 8 Fitur Toko Terhubung
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Semua 8 tombol shortcut di Beranda aplikasi pembeli kini aktif dan terhubung langsung ke dashboard seller. 
              Kelola stok katalog, voucher 50%, paket bundling hemat, produk baru 2026, harga grosir B2B, ekspedisi ongkir, hampers, hingga analisa wishlist.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentView('home')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              Lihat di Beranda Pembeli
            </button>
            <button
              onClick={() => handleCreate50PercentVoucher()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              + Buat Voucher Diskon 50%
            </button>
          </div>
        </div>

        {/* 8 SHORTCUT TILES (1-to-1 Match with Customer Home Shortcuts) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-6 mt-6 border-t border-stone-700/80">
          {/* 1. Katalog */}
          <button
            onClick={() => setSubTab('overview')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'overview'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5 border border-blue-400/30">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">1. Katalog</span>
            <span className="text-[10px] text-stone-400 mt-0.5">{activeProductsCount} Produk</span>
          </button>

          {/* 2. Voucher */}
          <button
            onClick={() => onNavigateTab('vouchers')}
            className="p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5 border border-amber-400/30">
              <Percent className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">2. Voucher</span>
            <span className="text-[10px] text-amber-300 mt-0.5">{activeVouchersCount} Aktif</span>
          </button>

          {/* 3. Promo Bundling */}
          <button
            onClick={() => setSubTab('bundling')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'bundling'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-1.5 border border-red-400/30">
              <Boxes className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">3. Bundling</span>
            <span className="text-[10px] text-red-300 mt-0.5">{activeBundlesCount} Paket</span>
          </button>

          {/* 4. New Product */}
          <button
            onClick={() => setSubTab('new-product')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'new-product'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5 border border-emerald-400/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">4. New Prod</span>
            <span className="text-[10px] text-emerald-300 mt-0.5">{newProductsCount} Baru</span>
          </button>

          {/* 5. Grosir B2B */}
          <button
            onClick={() => setSubTab('wholesale')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'wholesale'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5 border border-indigo-400/30">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">5. Grosir B2B</span>
            <span className="text-[10px] text-indigo-300 mt-0.5">{wholesaleProductsCount} Produk</span>
          </button>

          {/* 6. Cek Ongkir */}
          <button
            onClick={() => setSubTab('shipping')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'shipping'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5 border border-amber-400/30">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">6. Ongkir</span>
            <span className="text-[10px] text-amber-300 mt-0.5">{activeCouriersCount} Kurir</span>
          </button>

          {/* 7. Hampers */}
          <button
            onClick={() => setSubTab('hampers')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'hampers'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1.5 border border-purple-400/30">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">7. Hampers</span>
            <span className="text-[10px] text-purple-300 mt-0.5">{hampersProductsCount} Paket</span>
          </button>

          {/* 8. Favorit */}
          <button
            onClick={() => setSubTab('wishlist')}
            className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border ${
              subTab === 'wishlist'
                ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                : 'bg-stone-800/60 border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5 border border-rose-400/30">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold leading-tight">8. Favorit</span>
            <span className="text-[10px] text-rose-300 mt-0.5">{favoritedCount} Disukai</span>
          </button>
        </div>
      </div>

      {/* 2. SUB-TAB BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            subTab === 'overview'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Ringkasan 8 Fitur
        </button>

        <button
          onClick={() => setSubTab('bundling')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'bundling'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Promo Bundling ({activeBundlesCount})</span>
        </button>

        <button
          onClick={() => setSubTab('new-product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'new-product'
              ? 'bg-[#009A44] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Product 2026 ({newProductsCount})</span>
        </button>

        <button
          onClick={() => setSubTab('wholesale')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'wholesale'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Grosir B2B ({wholesaleProductsCount})</span>
        </button>

        <button
          onClick={() => setSubTab('shipping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'shipping'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Cek Ongkir & Ekspedisi ({activeCouriersCount})</span>
        </button>

        <button
          onClick={() => setSubTab('hampers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'hampers'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Hampers & Gift Box ({hampersProductsCount})</span>
        </button>

        <button
          onClick={() => setSubTab('wishlist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
            subTab === 'wishlist'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Favorit & Minat Pembeli ({favoritedCount})</span>
        </button>
      </div>

      {/* =========================================================
          3. CONTENT PANELS ACCORDING TO SUB-TAB
         ========================================================= */}

      {/* --- SUBTAB: OVERVIEW SUMMARY --- */}
      {subTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Katalog */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">1. Katalog Semua Produk</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Sinkronisasi live katalog produk, variasi kemasan, stok SKU, dan lokasi gudang.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  {activeProductsCount} Produk Aktif • {products.filter(p => p.stock <= 5).length} Stok Rendah
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="w-full py-2 bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Kelola Katalog & Stok</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Voucher */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">2. Voucher & Diskon 50%</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Kupon toko yang dapat diklaim pembeli langsung dari banner dan Beranda.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                  {activeVouchersCount} Kupon Aktif • Diskon s/d 50%
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('vouchers')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Kelola Voucher Toko</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Promo Bundling */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Boxes className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">3. Promo Bundling Hemat</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Paket kombo kurma & madu dengan potongan harga s/d 40% langsung masuk keranjang.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-red-50/50 p-2 rounded-lg border border-red-100">
                  {activeBundlesCount} Paket Bundling Live
                </div>
              </div>
              <button
                onClick={() => setSubTab('bundling')}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Kelola Paket Bundling</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: New Product 2026 */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#009A44] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">4. New Product (Panen 2026)</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Produk unggulan musim panen terbaru yang disorot otomatis di Beranda.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  {newProductsCount} Produk Ditandai Baru
                </div>
              </div>
              <button
                onClick={() => setSubTab('new-product')}
                className="w-full py-2 bg-[#009A44] hover:bg-[#047857] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Atur Produk Baru</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: Grosir B2B */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">5. Grosir B2B (Partai Besar)</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Tier harga volume kartonan pabrik untuk reseller, agen, & instansi.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                  {wholesaleProductsCount} Produk Berharga Grosir
                </div>
              </div>
              <button
                onClick={() => setSubTab('wholesale')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Atur Tier Grosir B2B</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: Cek Ongkir */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">6. Cek Ongkir (Gratis XTRA)</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Ekspedisi pengiriman kurir aktif, kalkulator tarif, dan subsidi ongkir.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                  {activeCouriersCount} Ekspedisi • Min Rp {(sellerStore.minFreeShippingOrder || 50000).toLocaleString('id-ID')}
                </div>
              </div>
              <button
                onClick={() => setSubTab('shipping')}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Konfigurasi Ongkir</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 7: Hampers */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">7. Hampers (Gift Box)</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Koleksi bingkisan eksklusif Idul Fitri & Ramadhan dengan kustom kartu ucapan.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-purple-50/50 p-2 rounded-lg border border-purple-100">
                  {hampersProductsCount} Produk di Kategori Hampers
                </div>
              </div>
              <button
                onClick={() => setSubTab('hampers')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Kelola Koleksi Hampers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 8: Favorit */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-stone-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm mt-3">8. Favorit (Wishlist Demand)</h4>
                <p className="text-xs text-stone-500 mt-1">
                  Pantau minat pembeli terhadap produk yang disimpan di wishlist & kirim broadcast promo.
                </p>
                <div className="mt-3 text-xs font-bold text-stone-800 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                  {favoritedCount} Item di Wishlist Pembeli
                </div>
              </div>
              <button
                onClick={() => setSubTab('wishlist')}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Lihat Analisis Favorit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: 3. PROMO BUNDLING (PAKET HEMAT) --- */}
      {subTab === 'bundling' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-black">
                  <Boxes className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Manajemen Promo Bundling (Paket Hemat)</h3>
                  <p className="text-xs text-stone-500">
                    Paket kombo kurma & produk herbal dengan diskon khusus yang tampil di Beranda & Modal Promo Bundling.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetBundleDeals}
                className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Kembalikan ke paket bundling standar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
              <button
                type="button"
                onClick={handleOpenCreateBundle}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Paket Bundling Baru</span>
              </button>
            </div>
          </div>

          {/* Bundling Deals List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundlingDeals.map((bundle) => {
              const isActive = bundle.active !== false;
              return (
                <div
                  key={bundle.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs flex flex-col justify-between space-y-4 ${
                    isActive ? 'border-stone-200' : 'border-stone-200 opacity-60 bg-stone-50/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={bundle.image}
                          alt={bundle.name}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                              {bundle.badge}
                            </span>
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                              {bundle.tag}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-sm mt-1">{bundle.name}</h4>
                          <p className="text-xs text-stone-500 line-clamp-1">{bundle.subtitle}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleBundleDealActive(bundle.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-stone-200 text-stone-600 border-stone-300'
                        }`}
                      >
                        {isActive ? 'Aktif' : 'Non-Aktif'}
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-500 block">Harga Spesial Bundling:</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-[#1E3A8A]">
                            Rp {bundle.bundlePrice.toLocaleString('id-ID')}
                          </span>
                          <span className="text-xs text-stone-400 line-through">
                            Rp {bundle.originalPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 font-bold block">Hemat Pembeli:</span>
                        <span className="text-xs font-extrabold text-emerald-700">
                          Rp {bundle.savings.toLocaleString('id-ID')} ({bundle.discountPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Items inside bundle */}
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Isi Dalam Paket ({bundle.items.length} Item):
                      </span>
                      <div className="space-y-1">
                        {bundle.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-stone-700 flex items-center justify-between py-0.5 border-b border-stone-100 last:border-none">
                            <span className="font-medium">• {item.title}</span>
                            <span className="text-stone-500 text-[11px] font-semibold">{item.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-400">
                      Terjual {bundle.soldCount}x • Rating {bundle.rating}★
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditBundle(bundle)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBundleDeal(bundle.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
                        title="Hapus paket bundling"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SUBTAB: 4. NEW PRODUCT 2026 (PRODUK BARU) --- */}
      {subTab === 'new-product' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-[#009A44] flex items-center justify-center font-black">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Manajemen "New Product 2026" (Highlight Beranda)</h3>
                  <p className="text-xs text-stone-500">
                    Produk yang ditandai aktif sebagai "Produk Baru" otomatis tampil di section New Product 2026 pada Beranda pembeli.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-600">
                  {newProductsCount} dari {activeProductsCount} produk ditandai baru
                </span>
              </div>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-stone-100">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari produk kurma, SKU, atau kategori..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#009A44]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewProductFilter('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    newProductFilter === 'all'
                      ? 'bg-[#009A44] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Semua ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setNewProductFilter('new-only')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    newProductFilter === 'new-only'
                      ? 'bg-[#009A44] text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Hanya Produk Baru ({newProductsCount})
                </button>
              </div>
            </div>
          </div>

          {/* Table / List of Products */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4">Kategori & SKU</th>
                    <th className="py-3 px-4">Harga Reguler</th>
                    <th className="py-3 px-4">Status Stok</th>
                    <th className="py-3 px-4 text-center">Status "New Product 2026"</th>
                    <th className="py-3 px-4 text-right">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {filteredProducts.map((p) => {
                    const isNew = !!p.isNewArrival;
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-xs">{p.name}</div>
                              <span className="text-[10px] text-stone-400">{p.origin || 'Madinah'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-800 block">{p.category}</span>
                          <span className="text-[10px] font-mono text-stone-400">{p.sku}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          Rp {p.regularPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          {p.stock > 0 ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                              Ready {p.stock} pcs
                            </span>
                          ) : (
                            <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                              Habis
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleNewArrival(p.id, p.isNewArrival)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                              isNew
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{isNew ? 'Aktif (New 2026)' : 'Standar'}</span>
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => onNavigateTab('products')}
                            className="text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                          >
                            Edit Lengkap
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: 5. GROSIR B2B (PARTAI BESAR) --- */}
      {subTab === 'wholesale' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black">
                <Building2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Portal Grosir B2B & Harga Kartonan</h3>
                <p className="text-xs text-stone-500">
                  Konfigurasikan diskon volume tier kartonan untuk agen distributor, reseller, dan pesanan masjid.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span>Lihat Pesanan & Permintaan B2B</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const hasWholesale = p.wholesalePrices && p.wholesalePrices.length > 0;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs leading-tight line-clamp-1">{p.name}</h4>
                        <span className="text-[10px] text-stone-500 block">Harga Eceran: Rp {p.regularPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Wholesale Tiers */}
                    <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Tier Harga Grosir:
                      </span>
                      {hasWholesale ? (
                        p.wholesalePrices!.map((t, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs py-0.5 border-b border-stone-200/50 last:border-none">
                            <span className="text-stone-700">Min. {t.minQty} pcs:</span>
                            <span className="font-black text-indigo-700">Rp {t.pricePerUnit.toLocaleString('id-ID')} / pcs</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-stone-400 italic py-1">
                          Belum ada tier harga grosir kartonan.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Quick add standard wholesale tier
                        const defaultTier = [
                          { minQty: 10, pricePerUnit: Math.round(p.regularPrice * 0.85) },
                          { minQty: 50, pricePerUnit: Math.round(p.regularPrice * 0.75) }
                        ];
                        updateProduct(p.id, { wholesalePrices: defaultTier });
                        showToast(`Tier grosir otomatis diterapkan ke "${p.name}"!`, 'success');
                      }}
                      className="w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      {hasWholesale ? 'Perbarui Tier Grosir' : '+ Pasang Tier Grosir (10 & 50 pcs)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SUBTAB: 6. CEK ONGKIR & EKSPEDISI --- */}
      {subTab === 'shipping' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black">
                <Truck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Manajemen Jasa Ekspedisi & Subsidi Cek Ongkir</h3>
                <p className="text-xs text-stone-500">
                  Atur ekspedisi aktif, syarat minimal belanja Gratis Ongkir XTRA, dan lokasi gudang pengiriman.
                </p>
              </div>
            </div>

            {/* Warehouse Origin & Free Shipping Rule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="text-[10px] font-bold text-stone-400 uppercase">Lokasi Gudang Asal Pengiriman</span>
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#1E3A8A]" />
                  <span>Jakarta Pusat (Gudang Utama Cold Storage PT Exindokarsa Agung)</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Semua pengiriman pesanan kurma dipacking dengan ice gel pack dari cold storage Jakarta.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Syarat Gratis Ongkir XTRA (Subsidi Toko)</span>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-emerald-900">Min. Belanja:</span>
                  <span className="text-sm font-black text-emerald-700">
                    Rp {(sellerStore.minFreeShippingOrder || 50000).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Pembeli mendapatkan subsidi ongkir gratis otomatis saat checkout mencapai batas minimal belanja ini.
                </p>
              </div>
            </div>
          </div>

          {/* Active Couriers Table */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Daftar Ekspedisi Pengiriman ({activeCouriersCount} dari {sellerStore.couriers?.length || 0} Aktif)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(sellerStore.couriers || []).map((courier) => {
                return (
                  <div
                    key={courier.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      courier.active
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-stone-50 border-stone-200 text-stone-500'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-stone-900">{courier.name}</div>
                      <span className="text-[10px] text-stone-500">Tipe: {courier.type}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSellerCourier(courier.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                        courier.active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-stone-200 text-stone-600 border-stone-300'
                      }`}
                    >
                      {courier.active ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Simulator Tester */}
          <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Simulasi Tester Hitung Ongkir Beranda (Preview Pembeli)
              </h4>
            </div>
            <p className="text-xs text-stone-300">
              Hasil kalkulator tarif ini persis sama dengan yang dilihat pembeli saat mengklik tombol "Cek Ongkir" di Beranda.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <label className="text-[10px] text-stone-400 uppercase block mb-1">Kota Tujuan Tes:</label>
                <select
                  value={testCity}
                  onChange={(e) => setTestCity(e.target.value)}
                  className="w-full p-2 bg-stone-800 border border-stone-700 rounded-xl text-white font-medium focus:outline-none"
                >
                  <option value="Jakarta Pusat">Jakarta Pusat (Dalam Kota)</option>
                  <option value="Bandung">Bandung (Jawa Barat)</option>
                  <option value="Surabaya">Surabaya (Jawa Timur)</option>
                  <option value="Medan">Medan (Sumatera Utara)</option>
                  <option value="Makassar">Makassar (Sulawesi Selatan)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-stone-400 uppercase block mb-1">Estimasi Berat:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={testWeightKg}
                    onChange={(e) => setTestWeightKg(Number(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <span className="font-bold text-amber-400">{testWeightKg} kg</span>
                </div>
              </div>

              <div className="bg-stone-800 p-2.5 rounded-xl border border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block">J&T / SiCepat Reguler:</span>
                  <span className="font-bold text-emerald-400">GRATIS (Disubsidi SRA)</span>
                </div>
                <span className="text-xs font-bold text-stone-300">Estimasi 1-2 Hari</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB: 7. HAMPERS (GIFT BOX) --- */}
      {subTab === 'hampers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black">
                <Gift className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Manajemen Hampers & Gift Box Ramadhan</h3>
                <p className="text-xs text-stone-500">
                  Kelola produk paket bingkisan Idul Fitri, kustom kartu ucapan, dan packaging box mewah.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('products')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Produk Hampers Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const isHampers = p.category === 'Hampers' || p.category.toLowerCase().includes('hamper');
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border transition-all p-4 shadow-2xs space-y-3 flex flex-col justify-between ${
                    isHampers ? 'border-purple-300 ring-1 ring-purple-100' : 'border-stone-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100'}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          {isHampers && (
                            <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-2 py-0.2 rounded-md">
                              HAMPERS RESMI
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">{p.sku}</span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-xs leading-tight mt-1">{p.name}</h4>
                        <span className="text-xs font-black text-purple-700 block mt-0.5">
                          Rp {p.regularPrice.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleHampers(p.id, p.category)}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isHampers
                          ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-purple-50 text-stone-700 hover:text-purple-700 border border-stone-200'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{isHampers ? '✓ Masuk Koleksi Hampers' : '+ Jadikan Hampers'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SUBTAB: 8. FAVORIT (WISHLIST DEMAND) --- */}
      {subTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
                <Heart className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Analisa Minat Pembeli (Favorit & Wishlist)</h3>
                <p className="text-xs text-stone-500">
                  Pantau produk yang paling banyak disimpan pembeli ke Favorit mereka dan kirim promo khusus untuk meningkatkan konversi checkout.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                ❤️ {wishlistProductIds.length} Total Favorit Aktif
              </span>
            </div>
          </div>

          {/* Ranking of products in Wishlist */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ranking Minat</th>
                    <th className="py-3 px-4">Produk Kurma</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Harga</th>
                    <th className="py-3 px-4">Disimpan di Wishlist</th>
                    <th className="py-3 px-4 text-right">Aksi Konversi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                  {products.slice(0, 10).map((p, idx) => {
                    const isFavoritedByUser = wishlistProductIds.includes(p.id);
                    const estimatedLikes = (p.soldCount || 10) * 3 + (isFavoritedByUser ? 1 : 0);
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 font-black text-stone-400">
                          #{idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-xs">{p.name}</div>
                              <span className="text-[10px] text-stone-400">Rating {p.rating}★ ({p.reviewCount} ulasan)</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600 font-medium">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 font-bold text-stone-900">
                          Rp {p.regularPrice.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 font-extrabold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs">
                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                            <span>{estimatedLikes} Pembeli</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setBroadcastTargetProduct(p);
                              setBroadcastMsg(`Spesial untuk kamu yang memfavoritkan ${p.name}! Dapatkan diskon 15% hari ini.`);
                              setIsBroadcastModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                          >
                            <Send className="w-3 h-3" />
                            <span>Kirim Promo Wishlist</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD / EDIT PROMO BUNDLING DEAL (ETALASE SINKRON)
         ========================================================= */}
      {isAddBundleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[94vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-base text-stone-900">
                      {editingBundleId ? 'Edit Paket Promo Bundling' : 'Buat Paket Promo Bundling Baru'}
                    </h3>
                    <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Terdeteksi {products.filter(p => !p.isDraft).length} Produk di Etalase
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Pilih langsung produk-produk yang sudah ada di etalase toko untuk digabungkan menjadi paket kombo hemat
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddBundleModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Navigation Pills */}
            <div className="py-2.5 px-1 flex items-center gap-2 border-b border-stone-100 overflow-x-auto scrollbar-none shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setBundleModalStep('products')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  bundleModalStep === 'products'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>1. Pilih Produk Etalase</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  bundleModalStep === 'products' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-800'
                }`}>
                  {bundleForm.items.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBundleModalStep('pricing')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  bundleModalStep === 'pricing'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>2. Atur Harga & Diskon</span>
                {bundleForm.originalPrice > 0 && bundleForm.bundlePrice > 0 && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                    {Math.round(((bundleForm.originalPrice - bundleForm.bundlePrice) / bundleForm.originalPrice) * 100)}% OFF
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setBundleModalStep('details')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  bundleModalStep === 'details'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Detail & Foto Sampul</span>
              </button>

              <button
                type="button"
                onClick={() => setBundleModalStep('preview')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  bundleModalStep === 'preview'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>4. Preview Pembeli</span>
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto py-3 space-y-4 text-xs pr-1">

              {/* ==============================================================
                  STEP 1: DETECT & SELECT ETALASE PRODUCTS
                 ============================================================== */}
              {bundleModalStep === 'products' && (
                <div className="space-y-4">
                  
                  {/* Etalase Search & Filter Toolbar */}
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari nama produk etalase atau SKU..."
                        value={bundleProductSearch}
                        onChange={(e) => setBundleProductSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      {bundleProductSearch && (
                        <button
                          type="button"
                          onClick={() => setBundleProductSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
                      {['all', ...Array.from(new Set(products.filter(p => !p.isDraft).map(p => p.category).filter(Boolean)))].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setBundleCategoryFilter(cat)}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-colors cursor-pointer capitalize ${
                            bundleCategoryFilter === cat
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {cat === 'all' ? 'Semua Produk' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Items Quick Strip */}
                  {bundleForm.items.length > 0 && (
                    <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-900 text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-red-600" />
                          <span>Produk Terpilih untuk Bundling ({bundleForm.items.length} item):</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleRecalculateOriginalPrice}
                          className="text-[10px] font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Sinkronkan Total Harga (Rp {bundleForm.items.reduce((acc, c) => acc + (c.price || 0), 0).toLocaleString('id-ID')})</span>
                        </button>
                      </div>

                      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                        {bundleForm.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2 bg-white rounded-xl border border-red-200 flex items-center gap-2 shrink-0 shadow-2xs"
                          >
                            <img
                              src={item.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                              alt={item.title}
                              className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                            />
                            <div className="max-w-[140px]">
                              <div className="font-bold text-stone-900 text-[11px] truncate">{item.title}</div>
                              <div className="text-[10px] text-stone-500">{item.qty} • {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : 'Bonus'}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItemFromBundle(idx)}
                              className="w-5 h-5 rounded-full bg-stone-100 hover:bg-red-100 hover:text-red-600 text-stone-400 flex items-center justify-center cursor-pointer ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Etalase Products Grid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-stone-500 text-[11px]">
                      <span>Katalog Produk Etalase Toko SRA:</span>
                      <span>Klik produk untuk memasukkan ke paket bundling</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {products
                        .filter(p => !p.isDraft)
                        .filter(p => {
                          const matchesSearch = !bundleProductSearch.trim() || 
                            p.name.toLowerCase().includes(bundleProductSearch.toLowerCase()) || 
                            p.sku.toLowerCase().includes(bundleProductSearch.toLowerCase());
                          const matchesCategory = bundleCategoryFilter === 'all' || p.category === bundleCategoryFilter;
                          return matchesSearch && matchesCategory;
                        })
                        .map((product) => {
                          const isSelected = bundleForm.items.some(it => it.productId === product.id);
                          const currentQty = bundleQtySelections[product.id] || 1;
                          const selectedVarId = bundleVariationSelections[product.id];
                          const selectedVar = product.variations?.find(v => v.id === selectedVarId) || product.variations?.[0];
                          const effectivePrice = selectedVar ? (selectedVar.discountPrice || selectedVar.regularPrice) : (product.discountPrice || product.regularPrice);

                          return (
                            <div
                              key={product.id}
                              className={`p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 ${
                                isSelected
                                  ? 'bg-red-50/50 border-red-400 shadow-xs ring-1 ring-red-400'
                                  : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'
                              }`}
                            >
                              <div>
                                <div className="flex gap-2.5 items-start">
                                  <img
                                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=150'}
                                    alt={product.name}
                                    className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1 flex-wrap mb-1">
                                      <span className="text-[9px] font-bold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded-md">
                                        {product.category}
                                      </span>
                                      <span className="text-[9px] font-medium text-stone-400">
                                        SKU: {product.sku}
                                      </span>
                                    </div>
                                    <h5 className="font-bold text-stone-900 text-xs line-clamp-2 leading-tight">
                                      {product.name}
                                    </h5>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                      <span className="font-black text-red-600 text-xs">
                                        Rp {effectivePrice.toLocaleString('id-ID')}
                                      </span>
                                      {product.discountPrice && product.discountPrice < product.regularPrice && (
                                        <span className="text-[10px] text-stone-400 line-through">
                                          Rp {product.regularPrice.toLocaleString('id-ID')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Variation selector if product has variations */}
                                {product.variations && product.variations.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-stone-100">
                                    <label className="text-[10px] text-stone-500 font-semibold block mb-0.5">
                                      Pilih Varian Kemasan:
                                    </label>
                                    <select
                                      value={selectedVarId || product.variations[0]?.id}
                                      onChange={(e) => handleSetProductVariation(product.id, e.target.value)}
                                      className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] font-medium"
                                    >
                                      {product.variations.map((v) => (
                                        <option key={v.id} value={v.id}>
                                          {v.name} (Rp {(v.discountPrice || v.regularPrice).toLocaleString('id-ID')})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}
                              </div>

                              {/* Footer Controls for Product: Qty Stepper & Toggle Button */}
                              <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => handleSetProductQty(product.id, -1)}
                                    className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                                  >
                                    -
                                  </button>
                                  <span className="px-2 font-bold text-[11px] text-stone-800">
                                    {currentQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleSetProductQty(product.id, 1)}
                                    className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleEtalaseProduct(product)}
                                  className={`flex-1 py-1.5 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                    isSelected
                                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Terpilih di Paket</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>+ Tambah ke Bundling</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Optional Manual Custom/Bonus Item Section */}
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5">
                    <span className="text-[11px] font-bold text-stone-700 uppercase flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tambah Item Bonus / Tambahan Khusus (Non-Etalase):</span>
                    </span>
                    <p className="text-[10px] text-stone-500">
                      Gunakan formulir ini jika ingin menyertakan bonus khusus (contoh: Gratis Tas Spunbond Ramadhan, Greeting Card, dll).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Nama bonus (e.g. Tas Spunbond SRA)"
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="p-2 bg-white border border-stone-200 rounded-xl text-xs sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Jumlah (e.g. 1 Pcs Free)"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(e.target.value)}
                        className="p-2 bg-white border border-stone-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddItemToBundle}
                        className="py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Bonus</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ==============================================================
                  STEP 2: PRICING & AUTO DISCOUNT CALCULATION
                 ============================================================== */}
              {bundleModalStep === 'pricing' && (
                <div className="space-y-4">
                  
                  {/* Selected Products Calculation Helper */}
                  <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl border border-red-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">
                        Total Nilai Asli Produk Terpilih:
                      </span>
                      <span className="text-sm font-black text-stone-900">
                        Rp {bundleForm.items.reduce((acc, curr) => acc + (curr.price || 0), 0).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600">
                      Klik tombol cepat di bawah untuk langsung menetapkan diskon menarik bagi pembeli:
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {[10, 15, 20, 25, 30, 35, 40].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleApplyDiscountPreset(pct)}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-600 hover:text-white border border-red-200 text-red-700 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                        >
                          Diskon {pct}% OFF
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleApplyNominalSavings(50000)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                      >
                        Hemat Rp 50.000
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyNominalSavings(100000)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 font-bold text-[11px] transition-all cursor-pointer shadow-2xs"
                      >
                        Hemat Rp 100.000
                      </button>
                    </div>
                  </div>

                  {/* Pricing Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase block">
                        Harga Normal Eceran Asli (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={bundleForm.originalPrice}
                        onChange={(e) => setBundleForm({ ...bundleForm, originalPrice: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-[10px] text-stone-400">Total nilai jika produk dibeli eceran terpisah</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase block">
                        Harga Spesial Paket Bundling (Rp) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1000}
                        value={bundleForm.bundlePrice}
                        onChange={(e) => setBundleForm({ ...bundleForm, bundlePrice: Number(e.target.value) })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-black text-red-600 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-[10px] text-stone-400">Harga promo yang dibayar oleh customer</span>
                    </div>
                  </div>

                  {/* Savings Preview Box */}
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                        Penghematan Pembeli:
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-base font-black text-emerald-800">
                          Rp {Math.max(0, bundleForm.originalPrice - bundleForm.bundlePrice).toLocaleString('id-ID')}
                        </span>
                        {bundleForm.originalPrice > 0 && (
                          <span className="text-xs font-bold text-emerald-600">
                            ({Math.round(((bundleForm.originalPrice - bundleForm.bundlePrice) / bundleForm.originalPrice) * 100)}% Lebih Hemat)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-500 font-bold block mb-1">
                        Teks Badge Promo:
                      </span>
                      <input
                        type="text"
                        value={bundleForm.badge}
                        onChange={(e) => setBundleForm({ ...bundleForm, badge: e.target.value })}
                        className="p-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-extrabold text-red-600 text-center w-28"
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* ==============================================================
                  STEP 3: BUNDLE DETAILS, COVER PHOTO & BENEFITS
                 ============================================================== */}
              {bundleModalStep === 'details' && (
                <div className="space-y-4">
                  
                  {/* Name Generator & Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-stone-600 uppercase">
                        Nama Paket Bundling *
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateBundleName}
                        className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>✨ Buat Nama Otomatis dari Produk</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Paket Berkah Ramadhan 3-in-1"
                      value={bundleForm.name}
                      onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase block">
                        Sub-judul / Keterangan Singkat
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Kombinasi kurma nabi + madu murni lebih untung"
                        value={bundleForm.subtitle}
                        onChange={(e) => setBundleForm({ ...bundleForm, subtitle: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 uppercase block">
                        Tag Promosi (e.g. Paket Spesial, Best Seller)
                      </label>
                      <input
                        type="text"
                        value={bundleForm.tag}
                        onChange={(e) => setBundleForm({ ...bundleForm, tag: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Photo Cover Selector from Chosen Products */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-600 uppercase block">
                      Foto Sampul Paket Bundling:
                    </label>

                    {bundleForm.items.length > 0 && (
                      <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                        <span className="text-[10px] text-stone-500 font-semibold block">
                          Pilih foto sampul dari salah satu produk terpilih:
                        </span>
                        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                          {bundleForm.items.filter(i => i.image).map((it, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setBundleForm({ ...bundleForm, image: it.image! })}
                              className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                                bundleForm.image === it.image ? 'border-red-600 ring-2 ring-red-200 scale-102' : 'border-stone-200 hover:border-stone-400'
                              }`}
                            >
                              <img
                                src={it.image}
                                alt={it.title}
                                className="w-16 h-16 object-cover"
                              />
                              {bundleForm.image === it.image && (
                                <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[8px] font-black text-center py-0.2">
                                  SAMPUL
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      type="text"
                      placeholder="Atau masukkan URL foto khusus (https://...)"
                      value={bundleForm.image}
                      onChange={(e) => setBundleForm({ ...bundleForm, image: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-none"
                    />
                  </div>

                  {/* Benefits Checklist */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-600 uppercase block">
                      Keunggulan & Benefit Paket:
                    </label>

                    <div className="space-y-1.5">
                      {bundleForm.benefits.map((b, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-stone-700">{b}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(idx)}
                            className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Tambah keunggulan (e.g. Bonus kartu ucapan & tas ramah lingkungan)"
                        value={newBenefitText}
                        onChange={(e) => setNewBenefitText(e.target.value)}
                        className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-xs cursor-pointer shrink-0"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ==============================================================
                  STEP 4: LIVE SHOPPING PREVIEW (SHOPEE-LIKE)
                 ============================================================== */}
              {bundleModalStep === 'preview' && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                    💡 Ini adalah tampilan live bagaimana paket bundling Anda akan tampil di mata calon pembeli di Beranda dan Modal Promo:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Preview 1: Home Carousel Card */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">
                        Preview di Beranda Toko:
                      </span>
                      <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm max-w-[270px] mx-auto">
                        <div className="relative aspect-16/10 bg-stone-100">
                          <img
                            src={bundleForm.image || bundleForm.items[0]?.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=400'}
                            alt={bundleForm.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 text-[9px] bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                            {bundleForm.badge}
                          </span>
                        </div>
                        <div className="p-3 space-y-2">
                          <h5 className="font-bold text-stone-900 text-xs leading-snug">
                            {bundleForm.name || 'Nama Paket Bundling'}
                          </h5>
                          <p className="text-[10px] text-stone-500 line-clamp-1">
                            {bundleForm.subtitle || bundleForm.items.map(i => i.title).join(' + ')}
                          </p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-[#1E3A8A]">
                              Rp {bundleForm.bundlePrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-stone-400 line-through">
                              Rp {bundleForm.originalPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="w-full py-1.5 bg-[#009A44] text-white text-[10px] font-bold rounded-lg"
                          >
                            Beli Paket Bundling
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preview 2: Item List Breakdown */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">
                        Daftar Isi Paket ({bundleForm.items.length} Produk):
                      </span>
                      <div className="space-y-2 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                        {bundleForm.items.map((it, idx) => (
                          <div key={idx} className="p-2 bg-white rounded-xl border border-stone-200 flex items-center gap-2.5">
                            <img
                              src={it.image || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                              alt={it.title}
                              className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-stone-900 text-xs truncate">{it.title}</div>
                              <div className="text-[10px] text-stone-500">{it.qty} • Nilai: Rp {(it.price || 0).toLocaleString('id-ID')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBundleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                {bundleModalStep !== 'products' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (bundleModalStep === 'pricing') setBundleModalStep('products');
                      else if (bundleModalStep === 'details') setBundleModalStep('pricing');
                      else if (bundleModalStep === 'preview') setBundleModalStep('details');
                    }}
                    className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
                  >
                    &lt; Kembali
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {bundleModalStep === 'products' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (bundleForm.items.length === 0) {
                        showToast('Pilih minimal 1 produk dari etalase untuk bundling!', 'error');
                        return;
                      }
                      setBundleModalStep('pricing');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Lanjut: Atur Harga</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {bundleModalStep === 'pricing' && (
                  <button
                    type="button"
                    onClick={() => setBundleModalStep('details')}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Lanjut: Detail Paket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {bundleModalStep === 'details' && (
                  <button
                    type="button"
                    onClick={() => setBundleModalStep('preview')}
                    className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>Lanjut: Preview Pembeli</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveBundle}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBundleId ? 'Simpan Perubahan' : 'Publikasikan Paket'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: BROADCAST PROMO TO WISHLIST CUSTOMERS
         ========================================================= */}
      {isBroadcastModalOpen && broadcastTargetProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600">
                <Heart className="w-5 h-5 fill-rose-600" />
                <h3 className="font-bold text-sm text-stone-900">
                  Kirim Promo ke Pembeli Favorit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <img
                  src={broadcastTargetProduct.images?.[0] || 'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?w=100'}
                  alt={broadcastTargetProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <div className="font-bold text-stone-900 text-xs">{broadcastTargetProduct.name}</div>
                  <span className="text-stone-500">Harga: Rp {broadcastTargetProduct.regularPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Persentase Diskon Voucher:
                </label>
                <div className="flex gap-2">
                  {[10, 15, 20, 25].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBroadcastDiscountPct(pct)}
                      className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        broadcastDiscountPct === pct
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                  Pesan Notifikasi Broadcast:
                </label>
                <textarea
                  rows={3}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSendWishlistBroadcast}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Broadcast Promo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
