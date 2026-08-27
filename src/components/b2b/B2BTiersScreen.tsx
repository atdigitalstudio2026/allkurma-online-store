import React from 'react';
import { 
  ArrowLeft, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Truck, 
  Clock, 
  PhoneCall 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const B2BTiersScreen: React.FC = () => {
  const { user, tiers, setCurrentView, showToast } = useApp();

  const currentSpend = 120000000; // Rp 120M
  const nextTierTarget = 150000000; // Rp 150M for Platinum
  const progressPercent = Math.min(100, Math.round((currentSpend / nextTierTarget) * 100));

  const handleContactAM = () => {
    showToast('Permintaan konsultasi peningkatan tier telah diajukan ke Head of Wholesale AllKurma.', 'success');
  };

  return (
    <div className="pb-28 max-w-lg mx-auto bg-stone-50 min-h-screen">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentView('b2b-portal')}
          className="p-1.5 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-stone-900 font-['Playfair_Display',serif]">
          Status & Benefit Tier B2B
        </h1>

        <div className="w-8" />
      </div>

      {/* 1. Current User Tier Status Card (Matching Screenshot 3 screen 5) */}
      <div className="p-4">
        <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-3xl p-5 shadow-xl border border-amber-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Status Kemitraan Anda
                </span>
                <h2 className="text-lg font-bold font-['Playfair_Display',serif] text-amber-50">
                  {user.tier} Partner Tier
                </h2>
              </div>
            </div>

            <span className="px-3 py-1 bg-amber-500 text-stone-950 font-black text-xs rounded-full">
              Diskon 12%
            </span>
          </div>

          {/* Spend progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Akumulasi Belanja 2026:</span>
              <span className="font-bold text-amber-200 font-mono">Rp {currentSpend.toLocaleString('id-ID')}</span>
            </div>

            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-stone-400">
              <span>Target Platinum: Rp {nextTierTarget.toLocaleString('id-ID')}</span>
              <span>{progressPercent}% Tercapai</span>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl text-xs text-amber-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Belanja <strong>Rp 30.000.000</strong> lagi untuk membuka Diskon Platinum 20% & Prioritas Kontainer!</span>
          </div>
        </div>
      </div>

      {/* 2. All Tier Levels Breakdown (Matching Screenshot 3 screen 5) */}
      <div className="px-4 space-y-4">
        <h3 className="font-bold text-xs text-stone-900 tracking-tight">
          Perbandingan Lengkap Seluruh Tier Kemitraan
        </h3>

        {tiers.map((t) => {
          const isCurrent = user.tier === t.name;

          return (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-amber-50/70 border-amber-500 shadow-md ring-1 ring-amber-500'
                  : 'bg-white border-stone-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold font-['Playfair_Display',serif] text-stone-900">
                      Tier {t.name}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-amber-800 text-white text-[9px] font-bold rounded-full">
                        Tier Anda Saat Ini
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Minimal belanja akumulasi: <strong>Rp {t.minSpendAnnual.toLocaleString('id-ID')} / tahun</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700 block">
                    Diskon {t.discountPercent}%
                  </span>
                  <span className="text-[10px] text-stone-400">Termin {t.paymentTermsDays} Hari</span>
                </div>
              </div>

              {/* Benefits list */}
              <div className="mt-3 pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
                {t.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">{b}</span>
                  </div>
                ))}
              </div>

              {!isCurrent && (
                <div className="mt-3 pt-2">
                  <button
                    onClick={handleContactAM}
                    className="w-full py-1.5 bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Ajukan Upgrade ke Tier {t.name}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
