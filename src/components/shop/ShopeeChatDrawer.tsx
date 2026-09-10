import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCheck, 
  Store, 
  ChevronRight, 
  PhoneCall,
  UserCheck,
  Bot,
  RefreshCw,
  HelpCircle,
  MessageCircleQuestion
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeChatDrawer: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    sendChatMessage, 
    sendSellerChatMessage,
    chatMode,
    handoverToSeller,
    handoverToAi,
    isAiTyping,
    products, 
    selectedProductId,
    setCurrentView,
    setSelectedProductId,
    showToast,
    user
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [activeRoleSender, setActiveRoleSender] = useState<'user' | 'seller'>(
    user?.role === 'seller' || user?.role === 'super_admin' ? 'seller' : 'user'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProduct = products.find(p => p.id === selectedProductId);

  const quickQuestions = [
    'Halo, apakah produk ini ready stock?',
    'Berapa lama estimasi pengiriman ke alamat saya?',
    'Rekomendasi kurma lembut & manis alami',
    'Voucher diskon & gratis ongkir hari ini',
    '🧑‍💼 Bicara dengan Penjual'
  ];

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen, isAiTyping]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    if (activeRoleSender === 'seller') {
      sendSellerChatMessage(inputMsg.trim());
    } else {
      sendChatMessage(inputMsg.trim());
    }
    setInputMsg('');
  };

  const handleSendQuick = (text: string) => {
    if (text.includes('Bicara dengan Penjual')) {
      handoverToSeller();
    } else {
      sendChatMessage(text);
    }
  };

  const handleSendProductCard = () => {
    if (!activeProduct) return;
    sendChatMessage(
      `Halo kak, saya ingin tanya info stok dan garansi produk ini: ${activeProduct.name}`,
      activeProduct
    );
  };

  const isSellerRole = user?.role === 'seller' || user?.role === 'super_admin';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsChatOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* 1. Header (Shopee Chat Seller Banner) */}
        <div className="p-3.5 bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-400/40 p-0.5 flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-300" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-tight font-serif">
                  AllKurma Official Store
                </h3>
                <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded-xs font-black">
                  MALL
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span>Online</span>
                </p>
                <span className="text-[10px] text-stone-400">•</span>
                <span className="text-[10px] text-amber-200">
                  Respon Cepat (&lt;1 mnt)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast('Menghubungi Hotline CS AllKurma (+62 811-2345-6789)...', 'info')}
              className="p-1.5 rounded-lg text-amber-200 hover:bg-white/10"
              title="Hotline CS"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Shopee-style Mode Indicator & Switcher Banner */}
        <div className={`px-3 py-2 border-b flex items-center justify-between text-xs transition-colors ${
          chatMode === 'ai_assistant' 
            ? 'bg-amber-50/90 border-amber-200 text-amber-950'
            : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            {chatMode === 'ai_assistant' ? (
              <span className="p-1 bg-amber-600 text-white rounded-md shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="p-1 bg-emerald-600 text-white rounded-md shrink-0">
                <UserCheck className="w-3.5 h-3.5" />
              </span>
            )}
            <div className="min-w-0">
              <p className="font-bold text-[11px] truncate flex items-center gap-1">
                {chatMode === 'ai_assistant' ? (
                  <>
                    <span>Asisten AI Toko Aktif</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded-sm font-semibold">Otomatis 24/7</span>
                  </>
                ) : (
                  <>
                    <span>Terhubung ke Tim Penjual</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded-sm font-semibold">Live CS</span>
                  </>
                )}
              </p>
              <p className="text-[10px] text-stone-600 truncate">
                {chatMode === 'ai_assistant' 
                  ? 'Menjawab pertanyaan secara instan' 
                  : 'Pesan diteruskan langsung ke Seller'}
              </p>
            </div>
          </div>

          {chatMode === 'ai_assistant' ? (
            <button
              onClick={handoverToSeller}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-300 shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
              title="Alihkan percakapan ke tim penjual"
            >
              <UserCheck className="w-3 h-3 text-amber-700" />
              <span>Bicara dg Penjual</span>
            </button>
          ) : (
            <button
              onClick={handoverToAi}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 font-bold text-[11px] rounded-lg border border-emerald-300 shadow-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all"
              title="Kembalikan ke Asisten AI otomatis"
            >
              <Bot className="w-3 h-3 text-emerald-700" />
              <span>Tanya AI</span>
            </button>
          )}
        </div>

        {/* Optional Role Switcher for Seller/Admin testing */}
        {isSellerRole && (
          <div className="bg-stone-800 text-stone-200 px-3 py-1.5 text-[11px] flex items-center justify-between border-b border-stone-700">
            <span className="text-[10px] text-stone-300">Mode Akun Toko Anda:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveRoleSender('user')}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                  activeRoleSender === 'user' ? 'bg-amber-600 text-white' : 'bg-stone-700 text-stone-300'
                }`}
              >
                Kirim sbg Pembeli
              </button>
              <button
                onClick={() => setActiveRoleSender('seller')}
                className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                  activeRoleSender === 'seller' ? 'bg-[#009A44] text-white' : 'bg-stone-700 text-stone-300'
                }`}
              >
                Balas sbg Penjual
              </button>
            </div>
          </div>
        )}

        {/* 3. Optional: Active Product Inquired Pin */}
        {activeProduct && (
          <div className="bg-white p-2.5 px-3 border-b border-stone-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={activeProduct.images?.[0] || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'} 
                alt={activeProduct.name} 
                className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0" 
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-stone-900 truncate">{activeProduct.name}</p>
                <p className="text-xs font-bold text-amber-900">
                  Rp {(activeProduct.discountPrice || activeProduct.regularPrice).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <button
              onClick={handleSendProductCard}
              className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 shrink-0 active:scale-95 transition-all"
            >
              Kirim Link Produk
            </button>
          </div>
        )}

        {/* 4. Messages List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          <div className="text-center my-2">
            <span className="text-[10px] text-stone-400 bg-stone-200/60 px-2.5 py-1 rounded-full">
              Percakapan Terenkripsi Aman • AllKurma Official Mall
            </span>
          </div>

          {chatMessages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isBot = msg.sender === 'bot';
            const isSystem = msg.source === 'system';
            const isSeller = msg.sender === 'seller' && !isSystem;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-stone-200/80 text-stone-700 text-[10px] px-3 py-1 rounded-full max-w-[85%] text-center border border-stone-300/60">
                    ℹ️ {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Sender Identity Tag */}
                {!isMe && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-500 ml-1">
                    {isBot ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-xs">
                        <Bot className="w-2.5 h-2.5 text-amber-700" />
                        Asisten AI Shopee
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-xs">
                        <Store className="w-2.5 h-2.5 text-emerald-700" />
                        {msg.senderName || 'Penjual (Official Store)'}
                      </span>
                    )}
                  </div>
                )}

                {/* Product Card Attachment if present */}
                {msg.productCard && (
                  <div 
                    onClick={() => {
                      setSelectedProductId(msg.productCard!.id);
                      setCurrentView('product-detail');
                      setIsChatOpen(false);
                    }}
                    className="p-2 bg-white rounded-xl border border-stone-200 shadow-sm max-w-[85%] flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition-colors mb-1"
                  >
                    <img 
                      src={msg.productCard.image || 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?w=600&auto=format&fit=crop&q=80'} 
                      alt={msg.productCard.name} 
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-stone-100" 
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-stone-900 truncate">{msg.productCard.name}</p>
                      <p className="text-xs font-bold text-amber-900">
                        Rp {msg.productCard.price.toLocaleString('id-ID')}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5 mt-0.5">
                        Lihat Produk <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={`p-3 rounded-2xl text-xs max-w-[84%] leading-relaxed shadow-xs ${
                    isMe 
                      ? 'bg-amber-800 text-white rounded-br-xs' 
                      : isBot
                        ? 'bg-white text-stone-800 border border-amber-200/80 rounded-bl-xs'
                        : 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  
                  <div className={`flex items-center justify-end gap-1 mt-1.5 text-[9px] ${
                    isMe ? 'text-amber-200' : 'text-stone-400'
                  }`}>
                    <span>{msg.time || 'Baru saja'}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-amber-300" />}
                  </div>
                </div>

                {/* Handover suggestion pill if message is from AI and user is in AI mode */}
                {isBot && chatMode === 'ai_assistant' && (
                  <div className="ml-1 mt-1">
                    <button
                      onClick={handoverToSeller}
                      className="text-[10px] text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all active:scale-95"
                    >
                      <HelpCircle className="w-2.5 h-2.5 text-amber-600" />
                      <span>Belum puas? <strong>Bicara dengan Penjual</strong></span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Typing Indicator */}
          {isAiTyping && (
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-xs ml-1 flex items-center gap-1">
                <Bot className="w-2.5 h-2.5" />
                Asisten AI Toko
              </span>
              <div className="p-3 bg-white text-stone-600 border border-amber-200 rounded-2xl rounded-bl-xs shadow-xs text-xs flex items-center gap-2">
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-bounce"></span>
                </span>
                <span className="text-[11px] text-stone-500">Asisten AI sedang merangkum jawaban...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 5. Quick Questions Pills Bar */}
        <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex gap-2 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuick(q)}
              className={`text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full border shadow-xs transition-colors shrink-0 ${
                q.includes('Bicara dengan Penjual')
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 font-bold'
                  : 'bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-stone-700 border-stone-300'
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* 6. Message Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Fitur upload gambar siap digunakan.', 'info')}
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer"
              title="Kirim Foto"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={
                activeRoleSender === 'seller'
                  ? 'Balas pesan sebagai Penjual Toko...'
                  : chatMode === 'ai_assistant' 
                    ? 'Tanya Asisten AI seputar kurma, stok, promo...' 
                    : 'Tulis pesan ke Penjual Langsung...'
              }
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="p-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-full transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
