import { Product, Order, ChatMessage } from '../types';

export interface AiChatContext {
  products: Product[];
  orders: Order[];
  customerName?: string;
  activeProduct?: Product | null;
}

export interface AiReplyResult {
  replyText: string;
  suggestedQuickReplies?: string[];
  recommendedProduct?: Product | null;
  shouldHandoverToSeller?: boolean;
}

/**
 * Intelligent AI Chat Assistant Engine (Shopee Mall Standard)
 * Generates instant, context-aware, highly courteous customer service responses
 * with automatic intent detection and product recommendations.
 */
export function generateAiChatResponse(
  userQuery: string,
  context: AiChatContext
): AiReplyResult {
  const query = userQuery.toLowerCase().trim();
  const name = context.customerName ? `Kak ${context.customerName.split(' ')[0]}` : 'Kak';

  // 1. Check if user explicitly requests human seller or CS
  const sellerTriggers = [
    'bicara dengan penjual',
    'hubungi penjual',
    'bicara penjual',
    'mau bicara dengan seller',
    'mau chat penjual',
    'hubungi cs',
    'cs penjual',
    'orang asli',
    'manusia',
    'customer service',
    'komplain',
    'retur',
    'rusak',
    'pecah',
    'salah kirim',
    'operator'
  ];

  if (sellerTriggers.some(trigger => query.includes(trigger))) {
    return {
      replyText: `Baik ${name}, percakapan ini sekarang telah kami alihkan langsung ke Tim Customer Service & Seller AllKurma Official. 🧑‍💼\n\nTim penjual kami sudah menerima notifikasi chat Kakak dan akan segera membalas secara langsung (estimasi respon < 3 menit). Silakan tinggalkan rincian pertanyaan atau kendala Kakak di sini ya!`,
      shouldHandoverToSeller: true,
      suggestedQuickReplies: [
        'Tanya status pesanan terbaru',
        'Ingin ajukan retur / komplain',
        'Kembali ke Asisten AI'
      ]
    };
  }

  // 2. Questions about ready stock & expiration date
  if (query.includes('stok') || query.includes('ready') || query.includes('ada gak') || query.includes('tersedia')) {
    let specificProduct = context.activeProduct;
    if (!specificProduct) {
      specificProduct = context.products.find(p => query.includes(p.name.toLowerCase())) || context.products[0];
    }

    return {
      replyText: `Halo ${name}! 🌿 Semua produk AllKurma Official dijamin **100% READY STOCK** dan siap dikirim hari ini.\n\n✨ Kurma kami merupakan hasil panen fresh grade VIP import resmi dari Madinah & Timur Tengah dengan masa kedaluwarsa (EXP Date) panjang hingga **2027/2028** dan disimpan higienis di ruang cold storage bersertifikat BPOM.\n\nPesanan sebelum pukul 16:00 WIB langsung dipacking aman bubble wrap tebal hari ini juga ya Kak!`,
      recommendedProduct: specificProduct,
      suggestedQuickReplies: [
        'Berapa lama estimasi pengiriman?',
        'Apakah ada voucher diskon?',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 3. Shipping, Logistics & Delivery Time
  if (query.includes('kirim') || query.includes('ongkir') || query.includes('ekspedisi') || query.includes('kapan sampai') || query.includes('estimasi')) {
    return {
      replyText: `Halo ${name}! 🚚 Untuk pengiriman kami melayani ke seluruh Indonesia:\n\n• **Instant & Sameday (Grab/Gojek)**: Tiba dalam 2-6 jam untuk area Jabodetabek.\n• **Reguler (J&T, SiCepat, SPX, JNE)**: Estimasi 1-3 hari kerja (Pulau Jawa) atau 2-4 hari (Luar Pulau Jawa).\n• **Kargo / Grosir (JNE Trucking/SiCepat Gokil)**: Estimasi 3-5 hari untuk pesanan kartonan/partai besar.\n\n📦 Packing kami menggunakan kardus tebal food-grade + bubble wrap berlapis gratis tanpa biaya tambahan agar kurma tiba dalam kondisi sempurna!`,
      suggestedQuickReplies: [
        'Klaim Voucher Gratis Ongkir',
        'Kurma apa yang paling recommended?',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 4. Specific Kurma Varieties Inquiries
  if (query.includes('ajwa') || query.includes('kurma nabi')) {
    const ajwa = context.products.find(p => p.name.toLowerCase().includes('ajwa')) || context.products[0];
    return {
      replyText: `Halo ${name}! Kurma Ajwa Al-Aliyah Madinah adalah "Kurma Nabi" yang penuh berkah. Ciri khasnya:\n\n🖤 Berwarna hitam pekat dengan guratan serat halus khas.\n🍯 Rasa manis legit yang pas (tidak bikin eneg) dan tekstur daging lembut.\n🛡️ Kaya antioksidan polifenol tinggi yang sangat baik untuk daya tahan tubuh dan kesehatan jantung.\n\nProduk kami 100% bergaransi asli dari perkebunan Madinah Munawwarah ya Kak!`,
      recommendedProduct: ajwa,
      suggestedQuickReplies: [
        'Berapa harga Kurma Ajwa?',
        'Cara pesan Kurma Ajwa',
        'Bicara dengan Penjual'
      ]
    };
  }

  if (query.includes('sukari') || query.includes('sukkari')) {
    const sukari = context.products.find(p => p.name.toLowerCase().includes('sukari')) || context.products[1];
    return {
      replyText: `Halo ${name}! Kurma Sukari (Sukkari Al-Qassim) dijuluki sebagai "Ratu Kurma". Keunggulannya:\n\n✨ Berwarna cokelat keemasan dengan daging buah yang sangat lembut dan lumer di mulut (*melt in mouth*).\n🍯 Rasa manis karamel alami yang sangat disukai anak-anak dan orang tua.\n❄️ Disarankan disimpan di lemari pendingin (kulkas/freezer) agar kelembutan dan kesegarannya tetap terjaga optimal!`,
      recommendedProduct: sukari,
      suggestedQuickReplies: [
        'Berapa harga Kurma Sukari?',
        'Bandingkan Ajwa vs Sukari',
        'Bicara dengan Penjual'
      ]
    };
  }

  if (query.includes('medjool') || query.includes('medjul') || query.includes('raja kurma')) {
    const medjool = context.products.find(p => p.name.toLowerCase().includes('medjool')) || context.products[2];
    return {
      replyText: `Halo ${name}! Kurma Medjool adalah "King of Dates" (Raja Kurma) ukuran Jumbo:\n\n👑 Ukuran buah 2-3x lebih besar dari kurma biasa dengan daging buah yang sangat tebal.\n🍯 Tekstur kenyal moist dan rasa manis legit seperti toffee madu.\n🎁 Sangat cocok untuk sajian tamu istimewa, hampers Idul Fitri, atau cemilan berenergi tinggi.`,
      recommendedProduct: medjool,
      suggestedQuickReplies: [
        'Beli Kurma Medjool Jumbo',
        'Apakah ada promo bundling?',
        'Bicara dengan Penjual'
      ]
    };
  }

  if (query.includes('ruthob') || query.includes('promil') || query.includes('kurma muda')) {
    const ruthob = context.products.find(p => p.name.toLowerCase().includes('ruthob')) || context.products[3];
    return {
      replyText: `Halo ${name}! Kurma Ruthob adalah kurma muda segar yang dipetik saat fase setengah matang:\n\n🌱 Teksturnya renyah *crispy* dengan rasa manis segar yang tidak pekat.\n❤️ Mengandung hormon oksitosin alami, asam folat, dan zat besi tinggi yang sangat populer untuk ikhtiar promil (program hamil) dan ibu menyusui.\n❄️ Wajib disimpan di freezer (beku) agar kesegarannya terjaga fresh seperti baru dipetik dari pohon.`,
      recommendedProduct: ruthob,
      suggestedQuickReplies: [
        'Cara konsumsi kurma muda',
        'Estimasi kirim kurma ruthob',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 5. Recommendations for Parents / Diabetes / Healthy diet
  if (query.includes('rekomendasi') || query.includes('saran') || query.includes('diabetes') || query.includes('orang tua') || query.includes('tidak terlalu manis')) {
    return {
      replyText: `Halo ${name}! Berdasarkan kebutuhan Kakak, berikut rekomendasi terbaik dari AllKurma:\n\n1. **Kurma Ajwa Madinah**: Indeks glikemik rendah-sedang, manis sedang, kaya serat pangan untuk mengontrol gula darah & kesehatan jantung.\n2. **Kurma Khalas**: Tekstur lembut dengan rasa manis alami seimbang yang nyaman untuk lambung lansia.\n3. **Kurma Tunisia Tangkai**: Tekstur renyah dan rasa manis ringan yang tidak pekat.\n\nTips: Konsumsi 3-5 butir kurma di pagi hari dengan air hangat untuk manfaat maksimal ya Kak!`,
      recommendedProduct: context.products[0],
      suggestedQuickReplies: [
        'Lihat Kurma Ajwa',
        'Lihat Kurma Khalas',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 6. Vouchers, Discounts, Promotions
  if (query.includes('diskon') || query.includes('voucher') || query.includes('promo') || query.includes('murah') || query.includes('potongan')) {
    return {
      replyText: `Halo ${name}! 🎉 Banyak penawaran hemat spesial untuk Kakak hari ini:\n\n🎟️ **Voucher Ikuti Toko**: Diskon 15% (Kode: \`FOLLOWER15\`) langsung aktif saat Kakak klik tombol [+ Ikuti Toko].\n🚚 **Voucher Gratis Ongkir XTRA**: Subsidi ongkir s/d Rp50.000 otomatis tersedia di halaman keranjang/checkout.\n🎁 **Promo Bundling Berkah**: Diskon tambahan s/d 20% jika membeli 2 produk atau lebih sekaligus!\n\nJangan lupa klaim semua voucher sebelum menyelesaikan pesanan ya Kak!`,
      suggestedQuickReplies: [
        'Klaim Voucher Toko',
        'Lihat Paket Bundling Hemat',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 7. Wholesale / B2B / Kartonan
  if (query.includes('grosir') || query.includes('karton') || query.includes('partai') || query.includes('reseller') || query.includes('b2b') || query.includes('10kg')) {
    return {
      replyText: `Halo ${name}! 🏢 AllKurma adalah importir & distributor tangan pertama kurma se-Indonesia.\n\nUntuk pembelian grosir kartonan (isi 10kg, 12 box, atau kontainer), kami memberikan:\n• Harga khusus distributor (diskon hingga 35-40% dari harga retail)\n• Layanan ekspedisi kargo bertarif hemat\n• Fasilitas pembayaran tempo (Term of Payment 30 Hari) via Portal B2B resmi kami.\n\nSilakan klik menu **Portal B2B** di atas atau hubungi tim sales grosir kami ya Kak!`,
      suggestedQuickReplies: [
        'Buka Portal B2B Grosir',
        'Hubungi Sales Representatif',
        'Bicara dengan Penjual'
      ]
    };
  }

  // 8. Order Status / Lacak Pesanan
  if (query.includes('pesanan') || query.includes('resi') || query.includes('status') || query.includes('lacak') || query.includes('order')) {
    const latestOrder = context.orders && context.orders.length > 0 ? context.orders[0] : null;
    if (latestOrder) {
      const orderTotal = latestOrder.total || latestOrder.totalAmount || 0;
      const receipt = latestOrder.trackingNumber || '';
      const courier = latestOrder.courierName || latestOrder.courier || 'J&T Express';
      return {
        replyText: `Halo ${name}! Status pesanan terbaru Kakak:\n\n📦 **No. Pesanan**: #${latestOrder.orderNumber}\n📌 **Status**: **${latestOrder.status}**\n💰 **Total**: Rp ${orderTotal.toLocaleString('id-ID')}\n${receipt ? `🚚 **Resi Pengiriman**: ${receipt} (${courier})\n` : ''}\nKakak juga bisa melihat rincian lengkap perjalanan paket di menu **Pesanan Saya**. Ada yang ingin ditanyakan lagi seputar pesanan ini?`,
        suggestedQuickReplies: [
          'Kapan pesanan saya sampai?',
          'Buka Menu Pesanan Saya',
          'Bicara dengan Penjual'
        ]
      };
    } else {
      return {
        replyText: `Halo ${name}! Kakak bisa memantau semua status transaksi dan nomor resi pengiriman secara real-time melalui menu **Pesanan Saya** di bagian profil/navbar atas. Jika pesanan baru saja dibayar, tim gudang kami akan langsung memprosesnya dalam 1-2 jam kerja ya Kak!`,
        suggestedQuickReplies: [
          'Cara cek pesanan saya',
          'Kapan pesanan dikirim?',
          'Bicara dengan Penjual'
        ]
      };
    }
  }

  // Default Friendly Greeting / Fallback response
  return {
    replyText: `Halo ${name}! Terima kasih telah menghubungi **AllKurma Official Store** (Shopee Mall) 😊.\n\nSaya adalah **Asisten AI Toko** yang siap membantu Kakak 24/7 seputar info jenis kurma, ketersediaan stok, promo voucher, maupun pengiriman.\n\nAda yang bisa kami bantu untuk pilihan kurma terbaik hari ini? Jika Kakak ingin berbicara dengan Customer Service manusia kami, silakan klik tombol **[Bicara dengan Penjual]** di bawah ya!`,
    recommendedProduct: context.activeProduct || context.products[0],
    suggestedQuickReplies: [
      'Apakah produk ready stock?',
      'Rekomendasi kurma terlaris',
      'Cara klaim voucher diskon',
      'Bicara dengan Penjual'
    ]
  };
}
