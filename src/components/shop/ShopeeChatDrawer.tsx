import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  ShoppingBag, 
  Sparkles, 
  CheckCheck, 
  Store, 
  ChevronRight,
  Smile,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeChatDrawer: React.FC = () => {
  const { 
    isChatOpen, 
    setIsChatOpen, 
    chatMessages, 
    sendChatMessage, 
    products, 
    selectedProductId,
    setCurrentView,
    setSelectedProductId,
    showToast
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProduct = products.find(p => p.id === selectedProductId);

  const quickQuestions = [
    'Halo, apakah produk ini ready stock?',
    'Kira-kira berapa lama estimasi pengiriman ke alamat saya?',
    'Apakah ini kurma fresh panen terbaru?',
    'Bisa minta rekomendasi kurma yang lembut dan tidak terlalu manis?'
  ];

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendChatMessage(inputMsg.trim());
    setInputMsg('');
  };

  const handleSendQuick = (text: string) => {
    sendChatMessage(text);
  };

  const handleSendProductCard = () => {
    if (!activeProduct) return;
    sendChatMessage(
      `Halo kak, saya ingin tanya produk ini: ${activeProduct.name}`,
      {
        id: activeProduct.id,
        name: activeProduct.name,
        image: activeProduct.images[0],
        price: activeProduct.discountPrice || activeProduct.regularPrice
      }
    );
  };

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
        <div className="p-3.5 bg-linear-to-r from-amber-900 via-stone-900 to-amber-950 text-white flex items-center justify-between border-b border-amber-800/40">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-600/30 border border-amber-400/40 p-0.5 flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-300" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-tight font-['Playfair_Display',serif]">
                  AllKurma Official Store
                </h3>
                <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.2 rounded-xs font-black">
                  MALL
                </span>
              </div>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <span>Online</span> • <span>Performa Chat 100%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => showToast('Menghubungi Hotline CS AllKurma (+62 811-2345-6789)...', 'info')}
              className="p-1.5 rounded-lg text-amber-200 hover:bg-white/10"
              title="Hubungi Penjual"
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

        {/* 2. Optional: Active Product Inquired Pin */}
        {activeProduct && (
          <div className="bg-white p-2.5 px-3 border-b border-stone-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img 
                src={activeProduct.images[0]} 
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

        {/* 3. Messages List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          <div className="text-center my-2">
            <span className="text-[10px] text-stone-400 bg-stone-200/60 px-2.5 py-1 rounded-full">
              Hari ini • Percakapan Terenkripsi Aman
            </span>
          </div>

          {chatMessages.map((msg) => {
            const isMe = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Product Card Attachment if present */}
                {msg.productCard && (
                  <div 
                    onClick={() => {
                      setSelectedProductId(msg.productCard!.id);
                      setCurrentView('product-detail');
                      setIsChatOpen(false);
                    }}
                    className="p-2 bg-white rounded-xl border border-stone-200 shadow-sm max-w-[80%] flex items-center gap-2 cursor-pointer hover:border-amber-400 transition-colors mb-1"
                  >
                    <img 
                      src={msg.productCard.image} 
                      alt={msg.productCard.name} 
                      className="w-12 h-12 rounded-lg object-cover shrink-0" 
                    />
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-stone-900 truncate">{msg.productCard.name}</p>
                      <p className="text-xs font-bold text-amber-900">
                        Rp {msg.productCard.price.toLocaleString('id-ID')}
                      </p>
                      <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                        Lihat Produk <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                )}

                {/* Message Bubble */}
                <div 
                  className={`p-3 rounded-2xl text-xs max-w-[82%] leading-relaxed shadow-xs ${
                    isMe 
                      ? 'bg-amber-800 text-white rounded-br-xs' 
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${isMe ? 'text-amber-200' : 'text-stone-400'}`}>
                    <span>{msg.time}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-amber-300" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Quick Inquiries Pills Bar */}
        <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 flex gap-2 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuick(q)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 text-stone-700 px-3 py-1.5 rounded-full border border-stone-300 shadow-xs transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 5. Message Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Fitur lampiran gambar siap digunakan', 'info')}
              className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              title="Kirim Foto"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Tulis pesan ke penjual..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 bg-stone-100 border border-stone-200 rounded-full px-4 py-2 text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-amber-700/30 focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="p-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-full transition-all active:scale-95 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
