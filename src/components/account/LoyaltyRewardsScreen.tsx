import React from 'react';
import { 
  ArrowLeft, 
  Gift, 
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoyaltyRewardsScreen: React.FC = () => {
  const { user, rewards, redeemReward, setCurrentView } = useApp();

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('my-profile')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Poin Loyalitas & Reward
        </h1>

        <div className="w-8" />
      </div>

      {/* 1. Point Balance Hero Card */}
      <div className="p-4">
        <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 shadow-xl border border-amber-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                Saldo Poin Reward Anda
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-mono text-amber-100">
                  {user.rewardPoints}
                </span>
                <span className="text-xs text-amber-300 font-bold">Points</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Coins className="w-6 h-6" />
            </div>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed border-t border-white/10 pt-2.5">
            Dapatkan <strong>1 Poin</strong> setiap transaksi Rp 10.000. Tukarkan poin dengan sampel produk gratis dan kupon potongan belanja!
          </p>
        </div>
      </div>

      {/* 2. Rewards Catalog */}
      <div className="px-4 space-y-3">
        <h2 className="text-xs font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-amber-800" />
          <span>Katalog Penukaran Hadiah Kurma</span>
        </h2>

        <div className="space-y-3">
          {rewards.map((reward) => {
            const canRedeem = user.rewardPoints >= reward.pointsCost;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-2xl border border-stone-200 p-3.5 shadow-xs flex items-center justify-between gap-3"
              >
                <img
                  src={reward.image}
                  alt={reward.title}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xs text-stone-900 truncate">
                    {reward.title}
                  </h3>
                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                    {reward.description}
                  </p>
                  <span className="inline-block mt-1 font-mono font-bold text-xs text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm">
                    {reward.pointsCost} Pts
                  </span>
                </div>

                <button
                  onClick={() => redeemReward(reward)}
                  disabled={!canRedeem}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    canRedeem
                      ? 'bg-amber-800 hover:bg-amber-900 active:scale-95 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {canRedeem ? 'Tukar' : 'Poin Kurang'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
