import React from 'react';
import { 
  Sparkles, 
  Award, 
  Gift, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  ShoppingBag,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerRewardsSection: React.FC = () => {
  const { user, kurmaPoints, rewards, redeemReward, pointTransactions, showToast } = useApp();

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header & Balance Card */}
      <div className="p-6 bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            Program Loyalitas ALLKURMA
          </span>
          <h2 className="text-3xl font-bold font-['Playfair_Display',serif] text-white">
            {user.rewardPoints.toLocaleString('id-ID')} Poin
          </h2>
          <p className="text-xs text-stone-300">
            Setara dengan potongan belanja senilai <strong className="text-amber-300">Rp {(user.rewardPoints * 100).toLocaleString('id-ID')}</strong>
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/20 text-center sm:text-right space-y-1">
          <span className="text-[10px] text-stone-300 block uppercase tracking-wider">Status Anggota</span>
          <span className="text-base font-bold text-amber-300 flex items-center justify-center sm:justify-end gap-1">
            <Award className="w-4 h-4" /> Member {user.tier}
          </span>
          <span className="text-[10px] text-stone-300 block">Dapatkan 1 Poin setiap belanja Rp 10.000</span>
        </div>
      </div>

      {/* Redeemable Rewards Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900 font-['Playfair_Display',serif]">
            Katalog Penukaran Hadiah
          </h3>
          <span className="text-xs text-stone-500">Tukarkan poin Anda langsung</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rewards.slice(0, 6).map((reward) => (
            <div 
              key={reward.id}
              className="border border-stone-200 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-400 transition-all bg-stone-50/50"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">{reward.title}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2">{reward.description}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-200/70 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  {reward.pointsCost.toLocaleString('id-ID')} Poin
                </span>
                <button
                  onClick={() => {
                    const success = redeemReward(reward);
                    if (success) {
                      showToast(`Berhasil menukarkan reward "${reward.title}"!`, 'success');
                    } else {
                      showToast('Poin Anda tidak mencukupi untuk menukar reward ini.', 'error');
                    }
                  }}
                  className="py-1.5 px-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer"
                >
                  Tukarkan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Point History */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-base text-stone-900 font-['Playfair_Display',serif]">
          Riwayat Perolehan Poin
        </h3>
        
        <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
          {pointTransactions.slice(0, 4).map((tx) => (
            <div key={tx.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === 'earned' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">{tx.description}</p>
                  <p className="text-[11px] text-stone-400">{tx.date}</p>
                </div>
              </div>

              <span className={`font-bold ${tx.type === 'earned' ? 'text-emerald-700' : 'text-stone-700'}`}>
                {tx.type === 'earned' ? `+${tx.points}` : `-${tx.points}`} Poin
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
