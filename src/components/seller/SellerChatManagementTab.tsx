import React, { useState } from 'react';
import { 
  MessageSquare, 
  Bot, 
  UserCheck, 
  Send, 
  CheckCheck, 
  Search, 
  Filter, 
  Sparkles, 
  Store, 
  Phone, 
  ShoppingBag, 
  Clock, 
  AlertCircle,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';

export const SellerChatManagementTab: React.FC = () => {
  const { 
    chatMessages, 
    sendSellerChatMessage, 
    chatMode, 
    setChatMode,
    handoverToSeller,
    handoverToAi,
    isAiTyping,
    products,
    orders,
    showToast 
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'needs_seller' | 'ai_handled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedChatCustomerId, setSelectedChatCustomerId] = useState<string>('all');

  // Quick preset templates for seller fast response
  const SELLER_PRESETS = [
    'Halo Kak! Stok produk kami selalu fresh import langsung dari Madinah, siap kirim hari ini ya! 😊',
    'Pesanan sudah kami proses dan dipacking kardus tebal + bubble wrap aman berstandar ekspor.',
    'Semua kurma kami memiliki sertifikat Halal resmi & EXP Date panjang hingga akhir 2027 kak.',
    'Bisa klaim voucher Diskon Toko dan Voucher Gratis Ongkir XTRA saat checkout ya Kak!'
  ];

  // Group messages or filter
  const filteredMessages = chatMessages.filter(msg => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = msg.text.toLowerCase().includes(q);
      const matchSender = (msg.senderName || '').toLowerCase().includes(q);
      const matchCustomer = (msg.customerName || '').toLowerCase().includes(q);
      if (!matchText && !matchSender && !matchCustomer) return false;
    }

    if (filterMode === 'needs_seller') {
      return msg.chatMode === 'live_seller' || msg.source === 'customer';
    }
    if (filterMode === 'ai_handled') {
      return msg.source === 'ai';
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    sendSellerChatMessage(replyText.trim());
    setReplyText('');
    showToast('Balasan toko berhasil dikirim & tersinkron real-time ke pembeli', 'success');
  };

  const handleApplyPreset = (preset: string) => {
    setReplyText(preset);
  };

  const isCurrentLiveSeller = chatMode === 'live_seller';

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      
      {/* 1. Header Banner & Quick Stats */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 text-white shadow-xl border border-amber-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-serif">
                  Pusat Pesan &amp; Layanan Chat Toko
                </h3>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                  Realtime Cloud Sync
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Monitoring riwayat chat pelanggan, sistem auto-reply cerdas AI 24 jam, dan fitur alih kendala langsung ke tim CS penjual.
              </p>
            </div>
          </div>

          {/* Quick Mode Status & Toggle */}
          <div className="flex items-center gap-3 bg-stone-800/80 backdrop-blur-xs border border-stone-700/80 p-2.5 rounded-2xl">
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-semibold">Mode Layanan Toko Saat Ini:</div>
              <div className="text-xs font-bold flex items-center justify-end gap-1.5 mt-0.5">
                {isCurrentLiveSeller ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    🧑‍💼 Live CS Penjual
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Bot className="w-3.5 h-3.5" />
                    🤖 Asisten AI Otomatis
                  </span>
                )}
              </div>
            </div>

            {isCurrentLiveSeller ? (
              <button
                type="button"
                onClick={handoverToAi}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                title="Aktifkan Asisten AI untuk menjawab otomatis"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Aktifkan AI Auto-Reply</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handoverToSeller}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                title="Alihkan semua pesan masuk ke penjual manusia"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Ambil Alih (Live CS)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-stone-800">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-stone-400 block font-medium">Total Pesan Chat:</span>
            <span className="text-base font-black text-amber-400 font-mono">{chatMessages.length} Pesan</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-stone-400 block font-medium">Kecepatan Respon Toko:</span>
            <span className="text-base font-black text-emerald-400 font-mono">Instan (&lt;1 Menit)</span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-stone-400 block font-medium">Status AI Auto-Reply:</span>
            <span className="text-base font-black text-white font-mono">
              {isCurrentLiveSeller ? 'Manual (Live CS)' : 'Aktif 24 Jam'}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-stone-400 block font-medium">Sinkronisasi Multi-Device:</span>
            <span className="text-base font-black text-blue-400 font-mono">100% Realtime</span>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace: Chat Feed & Seller Reply Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Filter and Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Filter Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-600" />
                <span>Filter Pesan Masuk</span>
              </h4>
              <span className="text-[10px] font-bold text-stone-400">
                {filteredMessages.length} Ditampilkan
              </span>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari isi pesan / nama pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('needs_seller')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'needs_seller'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                Live CS
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('ai_handled')}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterMode === 'ai_handled'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                Dijawab AI
              </button>
            </div>
          </div>

          {/* Shopee AI Chat Features Info Card */}
          <div className="bg-amber-50/80 rounded-2xl border border-amber-200/80 p-4 space-y-2.5">
            <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Standar Shopee Smart Chat AI</span>
            </h5>
            <ul className="text-[11px] text-amber-900/90 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Deteksi Niat Otomatis:</strong> AI menjawab pertanyaan stok, diskon, masa exp, pengiriman, dan rekomendasi jenis kurma.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Alihkan ke Penjual:</strong> Jika pembeli mengetik "Bicara dengan penjual" atau klik tombol alihkan, sesi berpindah ke Live CS.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">✓</span>
                <span><strong>Seller Control:</strong> Penjual dapat membalas chat kapan saja langsung melalui kolom balasan di samping.</span>
              </li>
            </ul>
          </div>

          {/* Quick Presets for Seller */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-2.5">
            <h5 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Template Balasan Cepat Penjual (Quick Replies)</span>
            </h5>
            <p className="text-[10px] text-stone-500">
              Klik salah satu template di bawah untuk langsung mengisi kolom balasan pesan:
            </p>
            <div className="space-y-1.5">
              {SELLER_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="w-full text-left p-2 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200 rounded-xl text-[11px] text-stone-700 transition-colors cursor-pointer line-clamp-2"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Live Conversation Feed & Direct Reply Bar (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
            
            {/* Top Bar inside chat room */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <span>Ruang Chat Pelanggan Toko</span>
                    <span className="text-[9px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded-xs font-semibold">
                      Live Feed
                    </span>
                  </h4>
                  <p className="text-[10px] text-stone-500">
                    Semua riwayat percakapan antara pembeli, Asisten AI, dan penjual tersinkron ke cloud.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
                  Cloud Active
                </span>
              </div>
            </div>

            {/* Chat message bubbles list */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-stone-50/50">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                  <MessageSquare className="w-10 h-10 text-stone-300 mb-2" />
                  <p className="text-xs font-bold text-stone-600">Belum ada pesan chat yang cocok dengan filter.</p>
                  <p className="text-[11px] text-stone-400 mt-1">Pesan dari pembeli akan otomatis muncul di sini secara real-time.</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isCustomer = msg.sender === 'user';
                  const isBot = msg.sender === 'bot';
                  const isSeller = msg.sender === 'seller' && msg.source !== 'system';
                  const isSystem = msg.source === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center my-1.5">
                        <span className="text-[10px] text-stone-600 bg-stone-200/80 px-3 py-1 rounded-full border border-stone-300/60 max-w-md text-center">
                          ℹ️ {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isSeller ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      {/* Identity tag */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500 px-1">
                        {isCustomer ? (
                          <span className="text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded-xs">
                            👤 {msg.senderName || msg.customerName || 'Pembeli / Pelanggan'}
                          </span>
                        ) : isBot ? (
                          <span className="text-blue-900 bg-blue-100 px-1.5 py-0.2 rounded-xs flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" />
                            🤖 Asisten AI Shopee (Dijawab Otomatis)
                          </span>
                        ) : (
                          <span className="text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded-xs flex items-center gap-1">
                            <Store className="w-2.5 h-2.5" />
                            🏪 Tim Penjual (Anda)
                          </span>
                        )}
                        <span className="text-stone-400 font-normal font-mono">{msg.time || 'Baru saja'}</span>
                      </div>

                      {/* Product Card if attached */}
                      {msg.productCard && (
                        <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-2xs max-w-sm flex items-center gap-2.5 mb-1">
                          <img 
                            src={msg.productCard.image || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'} 
                            alt={msg.productCard.name} 
                            className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" 
                          />
                          <div className="min-w-0 text-left">
                            <p className="text-xs font-bold text-stone-900 truncate">{msg.productCard.name}</p>
                            <p className="text-xs font-black text-amber-900">
                              Rp {msg.productCard.price.toLocaleString('id-ID')}
                            </p>
                            <span className="text-[9px] text-stone-500">Lampiran kartu produk yang ditanyakan</span>
                          </div>
                        </div>
                      )}

                      {/* Bubble */}
                      <div 
                        className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed shadow-xs ${
                          isSeller 
                            ? 'bg-[#009A44] text-white rounded-br-xs' 
                            : isCustomer
                              ? 'bg-white text-stone-900 border border-stone-200 rounded-bl-xs'
                              : 'bg-blue-50 text-blue-950 border border-blue-200 rounded-bl-xs'
                        }`}
                      >
                        <div className="whitespace-pre-line">{msg.text}</div>

                        <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                          isSeller ? 'text-emerald-200' : 'text-stone-400'
                        }`}>
                          <span>{msg.time}</span>
                          {isSeller && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {isAiTyping && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 w-fit">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                  <span>Asisten AI Toko sedang memproses jawaban untuk pembeli...</span>
                </div>
              )}
            </div>

            {/* Bottom: Seller direct reply input bar */}
            <div className="p-3.5 bg-white border-t border-stone-200">
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik balasan resmi penjual (akan langsung tampil di chat pembeli)..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 bg-[#009A44] hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Balasan Toko</span>
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
