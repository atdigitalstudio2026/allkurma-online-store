/**
 * Payment Service Layer & Provider Abstraction
 * Supports Midtrans, Xendit, Manual Transfer, COD, and KurmaPay Wallet
 * Implements Idempotency Keys, Signature generation, Development/Sandbox Mode, and Transaction Records
 */

export type PaymentMethodCategory = 'qris' | 'virtual_account' | 'bank_transfer' | 'ewallet' | 'cod' | 'kurmapay' | 'paylater';

export type PaymentProviderType = 'midtrans' | 'xendit' | 'manual' | 'cod' | 'internal_wallet';

export type DetailedPaymentStatus = 'UNPAID' | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED';

export interface PaymentMethodOption {
  id: string;
  category: PaymentMethodCategory;
  provider: PaymentProviderType;
  name: string;
  subname: string;
  icon: string;
  fee: number;
  isAvailable: boolean;
  instructions: string[];
}

export interface PaymentTransactionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  fee: number;
  totalAmount: number;
  methodId: string;
  methodName: string;
  category: PaymentMethodCategory;
  provider: PaymentProviderType;
  status: DetailedPaymentStatus;
  idempotencyKey: string;
  paymentCode?: string; // QRIS payload string or VA number or Bank Account
  qrImageUrl?: string;
  vaNumber?: string;
  bankName?: string;
  accountHolder?: string;
  deeplinkUrl?: string;
  expiredAt: string;
  paidAt?: string;
  createdAt: string;
  isSandbox: boolean;
  signature?: string;
}

export interface PaymentConfig {
  activeProvider: PaymentProviderType;
  isSandboxMode: boolean;
  enableQRIS: boolean;
  enableVA: boolean;
  enableBankTransfer: boolean;
  enableEWallet: boolean;
  enableCOD: boolean;
  enableKurmaPay: boolean;
  midtransClientKey?: string;
  xenditPublicKey?: string;
  manualAccounts: {
    bank: string;
    accountNumber: string;
    holder: string;
  }[];
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  activeProvider: 'midtrans',
  isSandboxMode: true,
  enableQRIS: true,
  enableVA: true,
  enableBankTransfer: true,
  enableEWallet: true,
  enableCOD: true,
  enableKurmaPay: true,
  manualAccounts: [
    { bank: 'BCA (Bank Central Asia)', accountNumber: '8820-1928-3001', holder: 'PT ALL KURMA INDONESIA' },
    { bank: 'Bank Mandiri', accountNumber: '137-00-9827319-0', holder: 'PT ALL KURMA INDONESIA' },
    { bank: 'Bank Syariah Indonesia (BSI)', accountNumber: '711-2098-100', holder: 'PT ALL KURMA INDONESIA' }
  ]
};

export const AVAILABLE_PAYMENT_METHODS: PaymentMethodOption[] = [
  // 1. QRIS
  {
    id: 'qris_all',
    category: 'qris',
    provider: 'midtrans',
    name: 'QRIS (Semua Bank & E-Wallet)',
    subname: 'BCA, Mandiri, BSI, GoPay, OVO, Dana, LinkAja',
    icon: '📱',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Buka aplikasi m-Banking atau e-wallet pilihan Anda.',
      'Pindai (Scan) QR Code QRIS yang tampil di layar.',
      'Periksa nominal pembayaran pastikan sesuai total tagihan.',
      'Masukkan PIN m-Banking/e-wallet Anda untuk menyelesaikan.',
      'Sistem otomatis memverifikasi dalam 1-3 detik.'
    ]
  },

  // 2. Virtual Accounts
  {
    id: 'va_bca',
    category: 'virtual_account',
    provider: 'midtrans',
    name: 'BCA Virtual Account',
    subname: 'Verifikasi Otomatis 24 Jam',
    icon: '🏦',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Pilih m-BCA > m-Transfer > BCA Virtual Account.',
      'Masukkan nomor Virtual Account BCA yang tertera.',
      'Konfirmasi rincian tagihan pesanan AllKurma.',
      'Masukkan PIN m-BCA Anda. Transaksi selesai.'
    ]
  },
  {
    id: 'va_mandiri',
    category: 'virtual_account',
    provider: 'midtrans',
    name: 'Mandiri Virtual Account (Livin\')',
    subname: 'Verifikasi Otomatis 24 Jam',
    icon: '💳',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Buka aplikasi Livin\' by Mandiri > Bayar > Cari "AllKurma E-Commerce".',
      'Masukkan nomor Virtual Account Mandiri.',
      'Periksa total tagihan lalu klik Lanjut Bayar.',
      'Masukkan PIN Livin\' Mandiri Anda.'
    ]
  },
  {
    id: 'va_bsi',
    category: 'virtual_account',
    provider: 'midtrans',
    name: 'BSI Virtual Account (Syariah)',
    subname: 'Khusus Nasabah Bank Syariah Indonesia',
    icon: '🕌',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Buka BSI Mobile > Bayar > E-Commerce.',
      'Pilih merchant AllKurma dan masukkan nomor VA BSI.',
      'Verifikasi detail pembayaran & masukkan PIN BSI.'
    ]
  },
  {
    id: 'va_bni',
    category: 'virtual_account',
    provider: 'midtrans',
    name: 'BNI Virtual Account',
    subname: 'Mobile Banking & ATM BNI',
    icon: '🏛️',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Pilih Transfer > Virtual Account Billing.',
      'Input nomor VA BNI dan klik Lanjut.',
      'Validasi nama dan nominal lalu selesaikan transaksi.'
    ]
  },

  // 3. E-Wallets
  {
    id: 'ewallet_gopay',
    category: 'ewallet',
    provider: 'midtrans',
    name: 'GoPay / GoPay Later',
    subname: 'Bayar instan via aplikasi Gojek',
    icon: '🟢',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Klik tombol "Bayar dengan GoPay".',
      'Aplikasi Gojek akan terbuka secara otomatis.',
      'Konfirmasi pembayaran dan masukkan PIN GoPay.'
    ]
  },
  {
    id: 'ewallet_dana',
    category: 'ewallet',
    provider: 'midtrans',
    name: 'DANA E-Wallet',
    subname: 'Dompet digital praktis & aman',
    icon: '🔵',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Buka aplikasi DANA pada smartphone Anda.',
      'Konfirmasi pembayaran tagihan AllKurma.',
      'Masukkan PIN DANA Anda.'
    ]
  },

  // 4. Saldo KurmaPay
  {
    id: 'wallet_kurmapay',
    category: 'kurmapay',
    provider: 'internal_wallet',
    name: 'Saldo KurmaPay',
    subname: 'Saldo Dompet Digital Resmi AllKurma (Instan Bebas Biaya)',
    icon: '🪙',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Saldo KurmaPay Anda akan dipotong langsung saat konfirmasi.',
      'Tidak perlu berpindah aplikasi, proses 100% instan.'
    ]
  },

  // 5. Transfer Manual Bank
  {
    id: 'manual_transfer',
    category: 'bank_transfer',
    provider: 'manual',
    name: 'Transfer Bank Manual',
    subname: 'BCA / Mandiri / BSI Rekening Resmi PT',
    icon: '📋',
    fee: 0,
    isAvailable: true,
    instructions: [
      'Transfer sesuai total tagihan hingga 3 digit terakhir.',
      'Unggah bukti transfer atau konfirmasi otomatis via WhatsApp CS.',
      'Pesanan diproses setelah dana masuk ke rekening resmi.'
    ]
  },

  // 6. COD (Cash On Delivery)
  {
    id: 'cod_cash',
    category: 'cod',
    provider: 'cod',
    name: 'COD (Bayar di Tempat)',
    subname: 'Bayar tunai ke kurir saat barang tiba',
    icon: '💵',
    fee: 2500, // standard handling fee
    isAvailable: true,
    instructions: [
      'Siapkan uang pas saat kurir mengantarkan kurma.',
      'Periksa kondisi segel paket sebelum membayar ke kurir.',
      'Buka paket di depan kurir jika memilih layanan cek barang.'
    ]
  }
];

export class PaymentService {
  private config: PaymentConfig;
  private idempotencyStore: Map<string, PaymentTransactionRecord> = new Map();

  constructor(config?: Partial<PaymentConfig>) {
    this.config = { ...DEFAULT_PAYMENT_CONFIG, ...config };
  }

  public updateConfig(newConfig: Partial<PaymentConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): PaymentConfig {
    return { ...this.config };
  }

  public getAvailablePaymentMethods(userBalance: number = 0): PaymentMethodOption[] {
    return AVAILABLE_PAYMENT_METHODS.filter(method => {
      if (method.category === 'qris' && !this.config.enableQRIS) return false;
      if (method.category === 'virtual_account' && !this.config.enableVA) return false;
      if (method.category === 'bank_transfer' && !this.config.enableBankTransfer) return false;
      if (method.category === 'ewallet' && !this.config.enableEWallet) return false;
      if (method.category === 'cod' && !this.config.enableCOD) return false;
      if (method.category === 'kurmapay' && !this.config.enableKurmaPay) return false;
      return true;
    });
  }

  /**
   * Generates a signature for transaction safety
   */
  private generateSignature(orderId: string, amount: number): string {
    return `sig_${orderId}_${amount}_${Date.now().toString(36)}`;
  }

  /**
   * Create Payment Transaction with Idempotency Protection
   */
  public async createPayment(params: {
    orderId: string;
    orderNumber: string;
    amount: number;
    methodId: string;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    idempotencyKey?: string;
  }): Promise<PaymentTransactionRecord> {
    const { orderId, orderNumber, amount, methodId } = params;
    const idempotencyKey = params.idempotencyKey || `idemp_${orderId}_${methodId}`;

    // Prevent duplicate payment creation
    if (this.idempotencyStore.has(idempotencyKey)) {
      return this.idempotencyStore.get(idempotencyKey)!;
    }

    const method = AVAILABLE_PAYMENT_METHODS.find(m => m.id === methodId) || AVAILABLE_PAYMENT_METHODS[0];
    const fee = method.fee;
    const totalAmount = amount + fee;
    const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours expiry

    let paymentCode = '';
    let qrImageUrl: string | undefined = undefined;
    let vaNumber: string | undefined = undefined;
    let bankName: string | undefined = undefined;
    let accountHolder: string | undefined = undefined;
    let initialStatus: DetailedPaymentStatus = 'PENDING';

    // Provider mock logic for realistic simulation in Sandbox Mode
    if (method.category === 'qris') {
      // Dynamic simulated QRIS payload
      paymentCode = `00020101021226590014ID.ALLKURMA.WWW0118936009180000000000520458125303360540${amount}5802ID5919PT ALL KURMA STORE6007JAKARTA62170713${orderNumber}6304`;
      qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(paymentCode)}`;
    } else if (method.category === 'virtual_account') {
      const bankPrefix = method.id.includes('bca') ? '8800' : method.id.includes('mandiri') ? '8900' : method.id.includes('bsi') ? '7700' : '8810';
      const randomSuffix = Math.floor(10000000 + Math.random() * 90000000);
      vaNumber = `${bankPrefix}${randomSuffix}`;
      paymentCode = vaNumber;
      bankName = method.name;
    } else if (method.category === 'bank_transfer') {
      const primaryBank = this.config.manualAccounts?.[0] || {
        bank: 'BCA (Bank Central Asia)',
        accountNumber: '873-091-8899',
        holder: 'PT ALL KURMA INDONESIA'
      };
      bankName = primaryBank.bank;
      paymentCode = primaryBank.accountNumber;
      accountHolder = primaryBank.holder;
    } else if (method.category === 'kurmapay') {
      initialStatus = 'PAID'; // KurmaPay deducts instantly
      paymentCode = `KP-TX-${Date.now().toString(36).toUpperCase()}`;
    } else if (method.category === 'cod') {
      initialStatus = 'PENDING';
      paymentCode = `COD-${orderNumber}`;
    }

    const txRecord: PaymentTransactionRecord = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      orderId,
      orderNumber,
      amount,
      fee,
      totalAmount,
      methodId,
      methodName: method.name,
      category: method.category,
      provider: method.provider,
      status: initialStatus,
      idempotencyKey,
      paymentCode,
      qrImageUrl,
      vaNumber,
      bankName,
      accountHolder,
      expiredAt,
      paidAt: initialStatus === 'PAID' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      isSandbox: this.config.isSandboxMode,
      signature: this.generateSignature(orderId, totalAmount)
    };

    this.idempotencyStore.set(idempotencyKey, txRecord);
    return txRecord;
  }

  /**
   * Verify Payment Status
   */
  public async getPaymentStatus(orderId: string): Promise<DetailedPaymentStatus> {
    for (const tx of this.idempotencyStore.values()) {
      if (tx.orderId === orderId) {
        return tx.status;
      }
    }
    return 'PENDING';
  }

  /**
   * Simulate Server-Side Webhook callback execution
   */
  public handlePaymentCallback(orderId: string, targetStatus: DetailedPaymentStatus): PaymentTransactionRecord | null {
    for (const [key, tx] of this.idempotencyStore.entries()) {
      if (tx.orderId === orderId) {
        const updated = {
          ...tx,
          status: targetStatus,
          paidAt: targetStatus === 'PAID' ? new Date().toISOString() : tx.paidAt
        };
        this.idempotencyStore.set(key, updated);
        return updated;
      }
    }
    return null;
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
