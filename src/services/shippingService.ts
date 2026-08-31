/**
 * Shipping Service Layer & Adapter Architecture
 * Supports multi-courier calculation (JNE, J&T, SiCepat, Ninja Xpress, AnterAja, Pos Indonesia, GoSend, GrabExpress)
 * Supports dynamic weights, origin warehouse, destination lookup, and milestone tracking.
 */

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  provinceId: string;
  name: string;
  type: 'Kota' | 'Kabupaten';
  postalCode: string;
}

export interface District {
  id: string;
  cityId: string;
  name: string;
}

export interface ShippingCourierInfo {
  code: string;
  name: string;
  logo: string;
  isActive: boolean;
  type: 'Reguler' | 'Express' | 'Kargo' | 'Instant';
}

export interface ShippingRateResult {
  courierCode: string;
  courierName: string;
  serviceCode: string;
  serviceName: string;
  cost: number;
  originalCost: number;
  discount: number;
  etd: string; // Estimated time of delivery, e.g. "1-2 Hari"
  description: string;
  isFreeShippingEligible?: boolean;
}

export interface TrackingMilestone {
  id: string;
  timestamp: string;
  status: 'ORDER_CREATED' | 'PAYMENT_CONFIRMED' | 'PROCESSING' | 'PACKED' | 'HANDED_OVER' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  title: string;
  description: string;
  location: string;
  isCompleted: boolean;
}

export interface TrackingResult {
  orderId: string;
  trackingNumber: string;
  courierCode: string;
  courierName: string;
  serviceName: string;
  sender: string;
  recipient: string;
  destinationAddress: string;
  currentStatus: string;
  estimatedDelivery: string;
  milestones: TrackingMilestone[];
  isSandbox: boolean;
}

export interface ShippingConfig {
  originWarehouseName: string;
  originCity: string;
  originProvince: string;
  originPostalCode: string;
  freeShippingThreshold: number; // e.g. 300000 -> free shipping bonus up to 20000
  freeShippingDiscountMax: number;
  activeCouriers: string[]; // ['jne', 'jnt', 'sicepat', 'ninja', 'anteraja', 'pos', 'gosend']
  isSandboxMode: boolean;
  fallbackRatePerKg: number;
}

// Master Indonesian Location Data
export const PROVINCES: Province[] = [
  { id: 'p-1', name: 'DKI Jakarta' },
  { id: 'p-2', name: 'Jawa Barat' },
  { id: 'p-3', name: 'Jawa Tengah' },
  { id: 'p-4', name: 'DI Yogyakarta' },
  { id: 'p-5', name: 'Jawa Timur' },
  { id: 'p-6', name: 'Banten' },
  { id: 'p-7', name: 'Bali' },
  { id: 'p-8', name: 'Sumatera Utara' },
  { id: 'p-9', name: 'Sumatera Barat' },
  { id: 'p-10', name: 'Riau' },
  { id: 'p-11', name: 'Kepulauan Riau' },
  { id: 'p-12', name: 'Sumatera Selatan' },
  { id: 'p-13', name: 'Lampung' },
  { id: 'p-14', name: 'Kalimantan Timur' },
  { id: 'p-15', name: 'Sulawesi Selatan' },
];

export const CITIES: City[] = [
  // DKI Jakarta
  { id: 'c-101', provinceId: 'p-1', name: 'Jakarta Selatan', type: 'Kota', postalCode: '12110' },
  { id: 'c-102', provinceId: 'p-1', name: 'Jakarta Timur', type: 'Kota', postalCode: '13310' },
  { id: 'c-103', provinceId: 'p-1', name: 'Jakarta Barat', type: 'Kota', postalCode: '11460' },
  { id: 'c-104', provinceId: 'p-1', name: 'Jakarta Utara', type: 'Kota', postalCode: '14240' },
  { id: 'c-105', provinceId: 'p-1', name: 'Jakarta Pusat', type: 'Kota', postalCode: '10110' },

  // Jawa Barat
  { id: 'c-201', provinceId: 'p-2', name: 'Kota Bandung', type: 'Kota', postalCode: '40115' },
  { id: 'c-202', provinceId: 'p-2', name: 'Kota Bekasi', type: 'Kota', postalCode: '17148' },
  { id: 'c-203', provinceId: 'p-2', name: 'Kota Depok', type: 'Kota', postalCode: '16411' },
  { id: 'c-204', provinceId: 'p-2', name: 'Kota Bogor', type: 'Kota', postalCode: '16122' },
  { id: 'c-205', provinceId: 'p-2', name: 'Kabupaten Tangerang', type: 'Kabupaten', postalCode: '15911' },

  // Jawa Tengah & DIY
  { id: 'c-301', provinceId: 'p-3', name: 'Kota Semarang', type: 'Kota', postalCode: '50134' },
  { id: 'c-302', provinceId: 'p-3', name: 'Kota Surakarta (Solo)', type: 'Kota', postalCode: '57111' },
  { id: 'c-401', provinceId: 'p-4', name: 'Kota Yogyakarta', type: 'Kota', postalCode: '55111' },
  { id: 'c-402', provinceId: 'p-4', name: 'Kabupaten Sleman', type: 'Kabupaten', postalCode: '55581' },

  // Jawa Timur
  { id: 'c-501', provinceId: 'p-5', name: 'Kota Surabaya', type: 'Kota', postalCode: '60111' },
  { id: 'c-502', provinceId: 'p-5', name: 'Kota Malang', type: 'Kota', postalCode: '65111' },
  { id: 'c-503', provinceId: 'p-5', name: 'Kabupaten Sidoarjo', type: 'Kabupaten', postalCode: '61211' },

  // Banten
  { id: 'c-601', provinceId: 'p-6', name: 'Kota Tangerang Selatan', type: 'Kota', postalCode: '15310' },
  { id: 'c-602', provinceId: 'p-6', name: 'Kota Tangerang', type: 'Kota', postalCode: '15111' },

  // Luar Jawa
  { id: 'c-701', provinceId: 'p-7', name: 'Kota Denpasar', type: 'Kota', postalCode: '80222' },
  { id: 'c-801', provinceId: 'p-8', name: 'Kota Medan', type: 'Kota', postalCode: '20111' },
  { id: 'c-901', provinceId: 'p-9', name: 'Kota Padang', type: 'Kota', postalCode: '25111' },
  { id: 'c-1001', provinceId: 'p-10', name: 'Kota Pekanbaru', type: 'Kota', postalCode: '28111' },
  { id: 'c-1101', provinceId: 'p-11', name: 'Kota Batam', type: 'Kota', postalCode: '29411' },
  { id: 'c-1201', provinceId: 'p-12', name: 'Kota Palembang', type: 'Kota', postalCode: '30111' },
  { id: 'c-1301', provinceId: 'p-13', name: 'Kota Bandar Lampung', type: 'Kota', postalCode: '35111' },
  { id: 'c-1401', provinceId: 'p-14', name: 'Kota Balikpapan', type: 'Kota', postalCode: '76111' },
  { id: 'c-1501', provinceId: 'p-15', name: 'Kota Makassar', type: 'Kota', postalCode: '90111' },
];

export const DISTRICTS: District[] = [
  { id: 'd-10101', cityId: 'c-101', name: 'Kebayoran Baru' },
  { id: 'd-10102', cityId: 'c-101', name: 'Cilandak' },
  { id: 'd-10103', cityId: 'c-101', name: 'Tebet' },
  { id: 'd-10104', cityId: 'c-101', name: 'Pasar Minggu' },
  { id: 'd-10105', cityId: 'c-101', name: 'Setiabudi' },

  { id: 'd-10501', cityId: 'c-105', name: 'Tanah Abang' },
  { id: 'd-10502', cityId: 'c-105', name: 'Menteng' },
  { id: 'd-10503', cityId: 'c-105', name: 'Gambir' },

  { id: 'd-20101', cityId: 'c-201', name: 'Coblong' },
  { id: 'd-20102', cityId: 'c-201', name: 'Sumur Bandung' },
  { id: 'd-20103', cityId: 'c-201', name: 'Buahbatu' },

  { id: 'd-50101', cityId: 'c-501', name: 'Wonokromo' },
  { id: 'd-50102', cityId: 'c-501', name: 'Gubeng' },
  { id: 'd-50103', cityId: 'c-501', name: 'Rungkut' },

  { id: 'd-60101', cityId: 'c-601', name: 'Serpong' },
  { id: 'd-60102', cityId: 'c-601', name: 'Pondok Aren' },
  { id: 'd-60103', cityId: 'c-601', name: 'Ciputat' },
];

export const AVAILABLE_COURIERS: ShippingCourierInfo[] = [
  { code: 'store_delivery', name: 'Pengiriman Toko AllKurma', logo: '🚛', isActive: true, type: 'Reguler' },
  { code: 'pickup', name: 'Pickup by Customer (Ambil di Toko)', logo: '🏪', isActive: true, type: 'Reguler' },
  { code: 'jne', name: 'JNE Express', logo: '📦', isActive: true, type: 'Reguler' },
  { code: 'jnt', name: 'J&T Express', logo: '🚚', isActive: true, type: 'Reguler' },
  { code: 'sicepat', name: 'SiCepat Ekspres', logo: '⚡', isActive: true, type: 'Reguler' },
  { code: 'ninja', name: 'Ninja Xpress', logo: '🥷', isActive: true, type: 'Reguler' },
  { code: 'anteraja', name: 'AnterAja', logo: '🛵', isActive: true, type: 'Reguler' },
  { code: 'pos', name: 'Pos Indonesia', logo: '📮', isActive: true, type: 'Reguler' },
  { code: 'gosend', name: 'GoSend Instant', logo: '🟢', isActive: true, type: 'Instant' },
  { code: 'grab', name: 'GrabExpress', logo: '🟢', isActive: true, type: 'Instant' }
];

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  originWarehouseName: 'Pusat Distribusi AllKurma Jakarta',
  originCity: 'Jakarta Selatan',
  originProvince: 'DKI Jakarta',
  originPostalCode: '12110',
  freeShippingThreshold: 250000,
  freeShippingDiscountMax: 20000,
  activeCouriers: ['store_delivery', 'pickup', 'jne', 'jnt', 'sicepat', 'ninja', 'anteraja', 'pos', 'gosend'],
  isSandboxMode: true,
  fallbackRatePerKg: 15000
};

// Base Rate matrices according to zone
const BASE_ZONE_RATES: Record<string, { base1Kg: number; addPerKg: number; leadDays: string }> = {
  'Jabodetabek': { base1Kg: 10000, addPerKg: 8000, leadDays: '1-2 Hari' },
  'Pulau Jawa': { base1Kg: 18000, addPerKg: 12000, leadDays: '2-3 Hari' },
  'Bali & NTB': { base1Kg: 28000, addPerKg: 20000, leadDays: '3-4 Hari' },
  'Sumatera': { base1Kg: 32000, addPerKg: 24000, leadDays: '3-5 Hari' },
  'Kalimantan': { base1Kg: 38000, addPerKg: 28000, leadDays: '3-5 Hari' },
  'Sulawesi': { base1Kg: 42000, addPerKg: 32000, leadDays: '4-6 Hari' },
  'Indonesia Timur': { base1Kg: 65000, addPerKg: 48000, leadDays: '5-8 Hari' },
};

export class ShippingService {
  private config: ShippingConfig;

  constructor(config?: Partial<ShippingConfig>) {
    this.config = { ...DEFAULT_SHIPPING_CONFIG, ...config };
  }

  public updateConfig(newConfig: Partial<ShippingConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): ShippingConfig {
    return { ...this.config };
  }

  public getProvinces(): Province[] {
    return PROVINCES;
  }

  public getCities(provinceId?: string): City[] {
    if (!provinceId) return CITIES;
    return CITIES.filter(c => c.provinceId === provinceId);
  }

  public getDistricts(cityId?: string): District[] {
    if (!cityId) return DISTRICTS;
    return DISTRICTS.filter(d => d.cityId === cityId);
  }

  public getCouriers(): ShippingCourierInfo[] {
    return AVAILABLE_COURIERS.map(c => ({
      ...c,
      isActive: this.config.activeCouriers.includes(c.code)
    }));
  }

  /**
   * Determine Shipping Destination Zone
   */
  private determineZone(provinceName: string, cityName: string): string {
    const p = (provinceName || '').toLowerCase();
    const c = (cityName || '').toLowerCase();

    if (p.includes('jakarta') || c.includes('tangerang') || c.includes('bekasi') || c.includes('depok') || c.includes('bogor')) {
      return 'Jabodetabek';
    }
    if (p.includes('jawa') || p.includes('banten') || p.includes('yogyakarta')) {
      return 'Pulau Jawa';
    }
    if (p.includes('bali') || p.includes('nusa tenggara')) {
      return 'Bali & NTB';
    }
    if (p.includes('sumatera') || p.includes('riau') || p.includes('lampung')) {
      return 'Sumatera';
    }
    if (p.includes('kalimantan')) {
      return 'Kalimantan';
    }
    if (p.includes('sulawesi')) {
      return 'Sulawesi';
    }
    return 'Indonesia Timur';
  }

  /**
   * Calculate Shipping Cost dynamically based on Weight, Origin, Destination, and Subtotal
   */
  public calculateShippingCost(params: {
    destinationProvince: string;
    destinationCity: string;
    destinationDistrict?: string;
    totalWeightGrams: number;
    subtotal: number;
    preferredCourier?: string;
  }): ShippingRateResult[] {
    const { destinationProvince, destinationCity, totalWeightGrams, subtotal } = params;
    
    // Weight calculation: Round up to nearest kg with min 1kg
    const weightKg = Math.max(1, Math.ceil(totalWeightGrams / 1000));
    const zoneKey = this.determineZone(destinationProvince, destinationCity);
    const zoneRate = BASE_ZONE_RATES[zoneKey] || BASE_ZONE_RATES['Pulau Jawa'];

    const isJabodetabek = zoneKey === 'Jabodetabek';
    const isFreeShipping = subtotal >= this.config.freeShippingThreshold;

    const availableResults: ShippingRateResult[] = [];

    // 0. Pengiriman Toko / Armada Kurir AllKurma
    if (this.config.activeCouriers.includes('store_delivery')) {
      const storeBaseCost = isJabodetabek ? 12000 : 25000;
      const storeTotalCost = storeBaseCost + (weightKg > 2 ? (weightKg - 2) * 5000 : 0);
      const storeDiscount = isFreeShipping ? Math.min(storeTotalCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'store_delivery',
        courierName: 'Kurir Toko AllKurma',
        serviceCode: 'STORE_DELIVERY',
        serviceName: 'Armada Toko / Direct Delivery',
        cost: Math.max(0, storeTotalCost - storeDiscount),
        originalCost: storeTotalCost,
        discount: storeDiscount,
        etd: isJabodetabek ? 'Hari Ini / Esok Hari' : '1-2 Hari Kerja',
        description: 'Dikirim langsung oleh armada berpendingin PT Exindokarsa Agung untuk menjaga mutu & higienitas kurma.',
        isFreeShippingEligible: isFreeShipping
      });
    }

    // 0B. Pickup by Customer (Ambil Sendiri di Toko / Gudang)
    if (this.config.activeCouriers.includes('pickup')) {
      availableResults.push({
        courierCode: 'pickup',
        courierName: 'Ambil di Toko / Warehouse',
        serviceCode: 'PICKUP_STORE',
        serviceName: 'Pickup by Customer (Ambil Sendiri)',
        cost: 0,
        originalCost: 0,
        discount: 0,
        etd: 'Siap Diambil (08:00 - 20:00 WIB)',
        description: 'Gratis ongkir Rp 0. Ambil pesanan langsung di Gudang Pusat AllKurma Jakarta / Hub Cabang terdekat.',
        isFreeShippingEligible: true
      });
    }

    // 1. JNE Options
    if (this.config.activeCouriers.includes('jne')) {
      const regCost = zoneRate.base1Kg + (weightKg - 1) * zoneRate.addPerKg;
      const jneDiscount = isFreeShipping ? Math.min(regCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'jne',
        courierName: 'JNE Express',
        serviceCode: 'JNE_REG',
        serviceName: 'Reguler (REG)',
        cost: Math.max(0, regCost - jneDiscount),
        originalCost: regCost,
        discount: jneDiscount,
        etd: zoneRate.leadDays,
        description: 'Layanan reguler terpercaya menjangkau seluruh kecamatan.',
        isFreeShippingEligible: isFreeShipping
      });

      // JNE YES for fast delivery
      const yesCost = Math.round(regCost * 1.55);
      availableResults.push({
        courierCode: 'jne',
        courierName: 'JNE Express',
        serviceCode: 'JNE_YES',
        serviceName: 'Yakin Esok Sampai (YES)',
        cost: yesCost,
        originalCost: yesCost,
        discount: 0,
        etd: '1 Hari Kerja',
        description: 'Garansi 1 hari sampai tujuan untuk menjaga kesegaran kurma basah.',
        isFreeShippingEligible: false
      });
    }

    // 2. J&T Options
    if (this.config.activeCouriers.includes('jnt')) {
      const jntBase = zoneRate.base1Kg - 1000;
      const jntCost = jntBase + (weightKg - 1) * zoneRate.addPerKg;
      const jntDiscount = isFreeShipping ? Math.min(jntCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'jnt',
        courierName: 'J&T Express',
        serviceCode: 'JNT_EZ',
        serviceName: 'EZ Regular',
        cost: Math.max(0, jntCost - jntDiscount),
        originalCost: jntCost,
        discount: jntDiscount,
        etd: zoneRate.leadDays,
        description: 'Pengiriman 365 hari tanpa libur dengan update tracking real-time.',
        isFreeShippingEligible: isFreeShipping
      });
    }

    // 3. SiCepat Options
    if (this.config.activeCouriers.includes('sicepat')) {
      const sicepatBase = zoneRate.base1Kg - 500;
      const sicepatCost = sicepatBase + (weightKg - 1) * (zoneRate.addPerKg - 500);
      const scDiscount = isFreeShipping ? Math.min(sicepatCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'sicepat',
        courierName: 'SiCepat Ekspres',
        serviceCode: 'SICEPAT_REG',
        serviceName: 'SIUNTUNG Reguler',
        cost: Math.max(0, sicepatCost - scDiscount),
        originalCost: sicepatCost,
        discount: scDiscount,
        etd: zoneRate.leadDays,
        description: 'Ongkir hemat cepat sampai dan ramah di kantong.',
        isFreeShippingEligible: isFreeShipping
      });

      if (weightKg >= 5) {
        // Cargo option for heavy items
        const gokilCost = 35000 + (weightKg - 5) * 4500;
        availableResults.push({
          courierCode: 'sicepat',
          courierName: 'SiCepat Ekspres',
          serviceCode: 'SICEPAT_GOKIL',
          serviceName: 'GOKIL (Cargo 5kg+)',
          cost: gokilCost,
          originalCost: gokilCost,
          discount: 0,
          etd: '3-6 Hari',
          description: 'Spesial pesanan grosir kurma kartonan/hampers di atas 5 kg.',
          isFreeShippingEligible: false
        });
      }
    }

    // 4. Ninja Xpress
    if (this.config.activeCouriers.includes('ninja')) {
      const ninjaCost = zoneRate.base1Kg - 1500 + (weightKg - 1) * zoneRate.addPerKg;
      const ninjaDiscount = isFreeShipping ? Math.min(ninjaCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'ninja',
        courierName: 'Ninja Xpress',
        serviceCode: 'NINJA_STD',
        serviceName: 'Standard Service',
        cost: Math.max(0, ninjaCost - ninjaDiscount),
        originalCost: ninjaCost,
        discount: ninjaDiscount,
        etd: zoneRate.leadDays,
        description: 'Dukungan COD dan pengantaran handal ke perumahan.',
        isFreeShippingEligible: isFreeShipping
      });
    }

    // 5. AnterAja
    if (this.config.activeCouriers.includes('anteraja')) {
      const anterajaCost = zoneRate.base1Kg + (weightKg - 1) * zoneRate.addPerKg;
      const anterajaDiscount = isFreeShipping ? Math.min(anterajaCost, this.config.freeShippingDiscountMax) : 0;
      availableResults.push({
        courierCode: 'anteraja',
        courierName: 'AnterAja',
        serviceCode: 'ANTERAJA_REG',
        serviceName: 'Regular Delivery',
        cost: Math.max(0, anterajaCost - anterajaDiscount),
        originalCost: anterajaCost,
        discount: anterajaDiscount,
        etd: zoneRate.leadDays,
        description: 'Dikelola oleh kurir Satria berpengalaman.',
        isFreeShippingEligible: isFreeShipping
      });
    }

    // 6. Pos Indonesia
    if (this.config.activeCouriers.includes('pos')) {
      const posCost = zoneRate.base1Kg - 2000 + (weightKg - 1) * (zoneRate.addPerKg - 1000);
      availableResults.push({
        courierCode: 'pos',
        courierName: 'Pos Indonesia',
        serviceCode: 'POS_KILAT',
        serviceName: 'Pos Kilat Khusus',
        cost: posCost,
        originalCost: posCost,
        discount: 0,
        etd: zoneRate.leadDays,
        description: 'Jangkauan terjauh hingga pelosok dan kepulauan nusantara.',
        isFreeShippingEligible: false
      });
    }

    // 7. Instant / Same Day Options (Jabodetabek only)
    if (isJabodetabek) {
      if (this.config.activeCouriers.includes('gosend')) {
        availableResults.push({
          courierCode: 'gosend',
          courierName: 'GoSend Instant',
          serviceCode: 'GOSEND_INSTANT',
          serviceName: 'Instant Delivery (1-3 Jam)',
          cost: 25000 + (weightKg > 5 ? (weightKg - 5) * 3000 : 0),
          originalCost: 25000,
          discount: 0,
          etd: '1-3 Jam Langsung Tiba',
          description: 'Dikirim langsung dari Gudang AllKurma Jakarta Selatan via driver Gojek.',
          isFreeShippingEligible: false
        });
      }

      if (this.config.activeCouriers.includes('grab')) {
        availableResults.push({
          courierCode: 'grab',
          courierName: 'GrabExpress',
          serviceCode: 'GRAB_INSTANT',
          serviceName: 'Instant Courier (2-4 Jam)',
          cost: 24000 + (weightKg > 5 ? (weightKg - 5) * 3000 : 0),
          originalCost: 24000,
          discount: 0,
          etd: '2-4 Jam Hari Ini',
          description: 'Pengantaran kilat langsung sampai di depan pintu rumah.',
          isFreeShippingEligible: false
        });
      }
    }

    return availableResults;
  }

  /**
   * Get Tracking Details for an Order
   */
  public getTracking(courierCode: string, trackingNumber: string, orderData?: any): TrackingResult {
    const courier = AVAILABLE_COURIERS.find(c => c.code === courierCode) || {
      code: courierCode,
      name: courierCode.toUpperCase(),
      logo: '🚚',
      isActive: true,
      type: 'Reguler' as const
    };

    const orderDate = orderData?.createdAt ? new Date(orderData.createdAt) : new Date();
    const status = orderData?.status || 'Dikirim';

    const fmt = (d: Date) => d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const t0 = new Date(orderDate.getTime());
    const t1 = new Date(orderDate.getTime() + 15 * 60000);
    const t2 = new Date(orderDate.getTime() + 60 * 60000);
    const t3 = new Date(orderDate.getTime() + 3 * 3600000);
    const t4 = new Date(orderDate.getTime() + 12 * 3600000);
    const t5 = new Date(orderDate.getTime() + 24 * 3600000);
    const t6 = new Date(orderDate.getTime() + 36 * 3600000);

    const isDelivered = status === 'Selesai' || status === 'DELIVERED' || status === 'COMPLETED';
    const isShipped = isDelivered || status === 'Dikirim' || status === 'SHIPPED';

    const milestones: TrackingMilestone[] = [
      {
        id: 'm-1',
        timestamp: fmt(t0),
        status: 'ORDER_CREATED',
        title: 'Pesanan Dibuat',
        description: 'Pesanan berhasil diverifikasi dan masuk antrean fulfillment sistem.',
        location: 'AllKurma Official System',
        isCompleted: true
      },
      {
        id: 'm-2',
        timestamp: fmt(t1),
        status: 'PAYMENT_CONFIRMED',
        title: 'Pembayaran Dikonfirmasi',
        description: 'Dana transaksi telah diamankan oleh sistem Payment Gateway.',
        location: 'Billing & Settlement Center',
        isCompleted: true
      },
      {
        id: 'm-3',
        timestamp: fmt(t2),
        status: 'PROCESSING',
        title: 'Pesanan Diproses Gudang',
        description: 'Stok kurma diambil dari ruang pendingin (Cold Storage) & quality check.',
        location: 'Gudang Utama Jakarta Selatan',
        isCompleted: true
      },
      {
        id: 'm-4',
        timestamp: fmt(t3),
        status: 'PACKED',
        title: 'Packing Selesai',
        description: 'Kemasan dilapisi bubble wrap tebal 3 lapis, kardus food-grade, & stiker fragile.',
        location: 'Fulfillment Hub AllKurma',
        isCompleted: true
      },
      {
        id: 'm-5',
        timestamp: fmt(t4),
        status: 'HANDED_OVER',
        title: `Diserahkan ke Kurir ${courier.name}`,
        description: `Paket diterima oleh kurir dengan no resi ${trackingNumber}.`,
        location: 'Drop Point Hub Jakarta Selatan',
        isCompleted: isShipped
      },
      {
        id: 'm-6',
        timestamp: fmt(t5),
        status: 'IN_TRANSIT',
        title: 'Dalam Perjalanan Menuju Kota Tujuan',
        description: 'Paket telah diberangkatkan dari Sorting Center Gateway Jakarta.',
        location: 'Central Gateway Sortation',
        isCompleted: isShipped
      },
      {
        id: 'm-7',
        timestamp: fmt(t6),
        status: 'OUT_FOR_DELIVERY',
        title: 'Kurir Mengantar ke Alamat',
        description: 'Paket dibawa oleh kurir pengantar menuju alamat penerima.',
        location: orderData?.shippingAddress?.city || 'Kota Tujuan',
        isCompleted: isDelivered
      },
      {
        id: 'm-8',
        timestamp: isDelivered ? fmt(new Date(t6.getTime() + 2 * 3600000)) : '-',
        status: 'DELIVERED',
        title: 'Paket Telah Diterima',
        description: `Diterima dengan baik oleh ${orderData?.shippingAddress?.recipientName || 'Penerima'}. Terima kasih telah berbelanja di AllKurma!`,
        location: orderData?.shippingAddress?.streetAddress || 'Alamat Penerima',
        isCompleted: isDelivered
      }
    ];

    return {
      orderId: orderData?.id || 'ORD-UNKNOWN',
      trackingNumber,
      courierCode: courier.code,
      courierName: courier.name,
      serviceName: orderData?.shippingService || 'Reguler Delivery',
      sender: 'AllKurma Official Store (0812-8888-KURMA)',
      recipient: `${orderData?.shippingAddress?.recipientName || 'Pelanggan'} (${orderData?.shippingAddress?.phone || '-'})`,
      destinationAddress: `${orderData?.shippingAddress?.fullAddress || orderData?.shippingAddress?.streetAddress || ''}, ${orderData?.shippingAddress?.city || ''}`,
      currentStatus: isDelivered ? 'Terkirim / Selesai' : isShipped ? 'Dalam Pengiriman' : 'Sedang Dikemas',
      estimatedDelivery: '1-3 Hari Kerja',
      milestones,
      isSandbox: this.config.isSandboxMode
    };
  }
}

// Export singleton instance
export const shippingService = new ShippingService();
