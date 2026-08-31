import React, { useState } from 'react';
import { 
  Coins, 
  Sparkles, 
  CalendarCheck, 
  Gift, 
  RotateCw, 
  Droplet, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  Plus, 
  Check, 
  ChevronRight,
  Flame,
  Award,
  BadgePercent,
  TrendingUp,
  Store,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ShopeeCoinsGameScreen: React.FC = () => {
  const { 
    shopeeCoins, 
    checkInStreak, 
    lastCheckInDate, 
    claimDailyCoin, 
    spinWheel, 
    plantCoinLevel, 
    waterCoinPlant, 
    shopeePayBalance, 
    topUpShopeePay, 
    spayLaterLimit, 
    spayLaterUsed,
    setCurrentView,
    showToast 
  } = useApp();

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(100000);

  const isCheckedInToday = lastCheckInDate === new Date().toISOString().split('T')[0];

  const handleSpinClick = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    const randomExtra = Math.floor(Math.random() * 360) + 1440; // 4 full spins + random
    const newDegree = rotationDegree + randomExtra;
    setRotationDegree(newDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const res = spinWheel();
      setSpinResult(res.prizeName);
    }, 3000);
  };

  const handleWaterClick = () => {
    waterCoinPlant();
  };

  const handleTopUpConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    topUpShopeePay(topUpAmount);
    setShowTopUpModal(false);
  };

  return (
    <div className="pb-32 max-w-lg mx-auto bg-stone-100 min-h-screen">
      
      {/* 1. Header: Poin Kurma & Digital Wallet Summary */}
      <div className="bg-gradient-to-b from-amber-800 via-amber-900 to-stone-900 text-white p-5 pt-7 rounded-b-3xl shadow-xl space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shadow-inner">
              <Coins className="w-7 h-7 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-amber-200 uppercase tracking-wider font-bold">
                Saldo Poin Reward
              </span>
              <h1 className="text-2xl font-black text-white font-mono flex items-center gap-1.5">
                <span>{shopeeCoins.toLocaleString('id-ID')}</span>
                <span className="text-xs font-normal text-amber-200">Poin (Rp {shopeeCoins.toLocaleString('id-ID')})</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('catalog')}
            className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-bold rounded-xl border border-amber-400/30 flex items-center gap-1 active:scale-95 transition-all"
          >
            <span>Belanja</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* KurmaPay & PayLater Card */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 grid grid-cols-2 gap-3 text-xs">
          
          {/* KurmaPay */}
          <div className="border-r border-white/10 pr-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <Wallet className="w-3.5 h-3.5" />
                <span>KurmaPay</span>
              </div>
              <button 
                onClick={() => setShowTopUpModal(true)}
                className="text-[10px] bg-amber-500/30 hover:bg-amber-500 text-amber-100 hover:text-white px-2 py-0.5 rounded-full font-bold transition-all"
              >
                + Top Up
              </button>
            </div>
            <p className="font-bold text-sm text-white font-mono">
              Rp {shopeePayBalance.toLocaleString('id-ID')}
            </p>
          </div>

          {/* PayLater */}
          <div className="pl-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <CreditCard className="w-3.5 h-3.5" />
                <span>KurmaPayLater</span>
              </div>
              <span className="text-[9px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                Cicilan 0%
              </span>
            </div>
            <p className="font-bold text-sm text-white font-mono">
              Rp {(spayLaterLimit - spayLaterUsed).toLocaleString('id-ID')}
            </p>
            <p className="text-[9px] text-stone-300">
              Sisa Limit dari Rp {spayLaterLimit.toLocaleString('id-ID')}
            </p>
          </div>

        </div>
      </div>

      <div className="p-4 space-y-4 font-['Plus_Jakarta_Sans',sans-serif]">
        
        {/* 2. Daily Check-In Streak 7-Day Matrix */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900">Check-in Harian Poin Kurma</h3>
                <p className="text-[11px] text-stone-500">Check-in berturut-turut untuk poin lebih banyak!</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-orange-100 text-orange-900 px-2.5 py-1 rounded-full text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
              <span>Streak {checkInStreak} Hari</span>
            </div>
          </div>

          {/* 7-Day Badges */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const isPast = day <= checkInStreak;
              const isCurrent = day === checkInStreak + 1;
              const coinReward = day === 7 ? '+1.000' : `+${day * 150}`;

              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between transition-all ${
                    isPast
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : isCurrent
                      ? 'bg-amber-500 border-amber-600 text-white shadow-md animate-pulse'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="text-[10px] font-bold">H-{day}</span>
                  <div className="my-1">
                    {isPast ? (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    ) : (
                      <Coins className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-amber-500'}`} />
                    )}
                  </div>
                  <span className="text-[9px] font-bold">{coinReward}</span>
                </div>
              );
            })}
          </div>

          {/* Check-in Button */}
          <button
            onClick={claimDailyCoin}
            disabled={isCheckedInToday}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all ${
              isCheckedInToday
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 active:scale-98 text-white shadow-sm'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>{isCheckedInToday ? 'Sudah Check-in Hari Ini (Kembali Besok)' : 'Klaim Poin Hari Ini Sekarang!'}</span>
          </button>
        </div>

        {/* 3. Games Hub: Spin Wheel & Pohon Koin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Game 1: Roda Putar Berhadiah (Spin Wheel) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-stone-900">Roda Putar Berhadiah</h3>
                  <p className="text-[10px] text-stone-500">Putar gratis tiap hari!</p>
                </div>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                Gratis
              </span>
            </div>

            {/* Wheel Visual */}
            <div className="relative py-4 flex flex-col items-center justify-center overflow-hidden">
              <div 
                style={{ 
                  transform: `rotate(${rotationDegree}deg)`, 
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none' 
                }}
                className="w-36 h-36 rounded-full border-4 border-amber-600 bg-gradient-to-tr from-amber-400 via-purple-400 to-red-400 shadow-lg flex items-center justify-center relative"
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-amber-900 text-xs z-10">
                  AK
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-white/60" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-45">
                  <div className="w-full h-0.5 bg-white/60" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center rotate-90">
                  <div className="w-full h-0.5 bg-white/60" />
                </div>
              </div>

              {/* Needle Indicator */}
              <div className="absolute top-2 text-red-600 font-black text-base z-20 animate-bounce">
                ▼
              </div>

              {spinResult && (
                <div className="mt-3 text-center">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    🎉 Menang: {spinResult}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Sedang Memutar...' : 'Putar Roda Sekarang'}</span>
            </button>
          </div>

          {/* Game 2: Pohon Tanam Koin (Watering Game) */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-stone-900">Tanam Pohon Poin</h3>
                  <p className="text-[10px] text-stone-500">Siram & panen +500 Poin Kurma</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                Panen Poin
              </span>
            </div>

            {/* Tree Growth Visual */}
            <div className="py-2 flex flex-col items-center justify-center space-y-2">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="text-5xl transform transition-transform hover:scale-110 duration-200">
                  {plantCoinLevel >= 100 ? '🌳💰' : plantCoinLevel >= 50 ? '🌿' : '🌱'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600">
                  <span>Pertumbuhan:</span>
                  <span className="font-bold text-emerald-700 font-mono">{plantCoinLevel}%</span>
                </div>
                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200">
                  <div 
                    style={{ width: `${Math.min(100, plantCoinLevel)}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleWaterClick}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            >
              <Droplet className="w-3.5 h-3.5 fill-cyan-300 text-cyan-300" />
              <span>Siram Pohon (+25% Air)</span>
            </button>
          </div>

        </div>

        {/* 4. Voucher Tukar Poin Section */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-100 text-red-700">
                <BadgePercent className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900">Tukar Poin Jadi Voucher Diskon</h3>
                <p className="text-[10px] text-stone-500">Gunakan poin Anda untuk potongan harga toko</p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentView('allkurma-vouchers')}
              className="text-[11px] text-amber-800 font-bold flex items-center gap-0.5"
            >
              <span>Semua Voucher</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            
            {/* Voucher Item 1 */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex flex-col items-center justify-center font-bold">
                  <span className="text-[9px]">DISKON</span>
                  <span className="text-xs">20%</span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Voucher Diskon Toko 20%</h4>
                  <p className="text-[10px] text-stone-500">Min. Belanja Rp 100.000 • Maks. Rp 30.000</p>
                  <p className="text-[10px] font-bold text-amber-900 mt-0.5">Tukar 200 Poin Kurma</p>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Voucher Diskon 20% berhasil ditukarkan dengan 200 poin!', 'success');
                }}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg shrink-0 shadow-2xs"
              >
                Tukar
              </button>
            </div>

            {/* Voucher Item 2 */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex flex-col items-center justify-center font-bold">
                  <span className="text-[9px]">GRATIS</span>
                  <span className="text-xs">ONGKIR</span>
                </div>
                <div>
                  <h4 className="font-bold text-stone-900">Gratis Ongkir XTRA Rp 20.000</h4>
                  <p className="text-[10px] text-stone-500">Berlaku untuk semua kurir ekspedisi</p>
                  <p className="text-[10px] font-bold text-amber-900 mt-0.5">Tukar 100 Poin Kurma</p>
                </div>
              </div>

              <button
                onClick={() => {
                  showToast('Voucher Gratis Ongkir XTRA berhasil ditukarkan dengan 100 poin!', 'success');
                }}
                className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg shrink-0 shadow-2xs"
              >
                Tukar
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Top Up KurmaPay Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-stone-900 text-sm">Top Up Saldo KurmaPay</h3>
              </div>
              <button 
                onClick={() => setShowTopUpModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopUpConfirm} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-2">Pilih Nominal Top Up Instant:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                        topUpAmount === amt 
                          ? 'bg-amber-100 border-amber-600 text-amber-950 shadow-2xs' 
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      Rp {amt.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="font-bold">BCA Virtual Account / QRIS</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Admin:</span>
                  <span className="font-bold text-emerald-700">Rp 0 (Bebas Biaya)</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold"
                >
                  Bayar Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
