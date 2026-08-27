import React from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star, 
  ArrowLeft, 
  Store, 
  ChevronRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeWishlistScreen: React.FC = () => {
  const { 
    products, 
    wishlistProductIds, 
    toggleWishlist, 
    addToCart, 
    setCurrentView, 
    setSelectedProductId,
    showToast 
  } = useApp();

  const favoriteProducts = products.filter(p => wishlistProductIds.includes(p.id));

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-100 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('home')}
            className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h1 className="font-bold text-sm text-stone-900 font-['Playfair_Display',serif]">
              Favorit Saya ({favoriteProducts.length})
            </h1>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-0.5"
        >
          <span>Jelajahi Produk</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {favoriteProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 my-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Belum Ada Produk Favorit</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Tekan tombol hati ❤️ pada produk kurma yang Anda sukai untuk menyimpannya di sini.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Cari Kurma Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favoriteProducts.map((p) => (
              <div 
                key={p.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
              >
                {/* Image + Remove from wishlist button */}
                <div className="relative aspect-square bg-stone-100 overflow-hidden">
                  <img 
                    src={p.images[0]} 
                    alt={p.name} 
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setCurrentView('product-detail');
                    }}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300" 
                  />
                  
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-red-500 shadow-md hover:bg-white active:scale-90 transition-all"
                    title="Hapus dari Favorit"
                  >
                    <Heart className="w-4 h-4 fill-red-500" />
                  </button>

                  {/* Badge */}
                  <span className="absolute bottom-2 left-2 text-[9px] font-black bg-amber-500/90 backdrop-blur-xs text-black px-2 py-0.5 rounded-sm">
                    {p.badge || 'MALL'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setCurrentView('product-detail');
                      }}
                      className="text-xs font-bold text-stone-900 line-clamp-2 hover:text-amber-800 cursor-pointer"
                    >
                      {p.name}
                    </h4>

                    {/* Pricing */}
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="text-xs font-black text-amber-950 font-mono">
                        Rp {(p.discountPrice || p.regularPrice).toLocaleString('id-ID')}
                      </span>
                      {p.discountPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          Rp {p.regularPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    {/* Rating & Sold */}
                    <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-stone-800">{p.rating}</span>
                      <span>• Terjual {p.soldCount}</span>
                    </div>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
