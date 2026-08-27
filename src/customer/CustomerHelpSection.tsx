import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Truck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerHelpSection: React.FC = () => {
  const { setIsChatOpen } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah semua kurma di ALLKURMA asli dan memiliki sertifikasi resmi?',
      a: 'Ya, seluruh produk kurma ALLKURMA diimpor langsung oleh PT Exindokarsa Agung dari perkebunan pilihan di Madinah (Arab Saudi), Mesir, Tunisia, dan Amerika Serikat dengan sertifikat fitosanitari karantina dan izin edar resmi BPOM/Kementan.'
    },
    {
      q: 'Bagaimana cara melacak pengiriman kurma saya?',
      a: 'Setelah pesanan Anda berstatus "Dikirim", Anda dapat melihat nomor resi pengiriman di menu Pesanan Saya > Rincian Invoice atau menggunakan fitur live chat untuk menanyakan status paket secara real-time.'
    },
    {
      q: 'Bagaimana kebijakan retur jika kurma rusak saat diterima?',
      a: 'Kami memberikan garansi 100% ganti baru jika kurma diterima dalam kondisi berjamur, kemasan rusak berat, atau tidak sesuai pesanan. Sertakan foto/video unboxing dalam 1x24 jam setelah kurma diterima.'
    },
    {
      q: 'Bagaimana cara mendapatkan harga grosir / B2B Kartonan?',
      a: 'Untuk pembelian dalam jumlah karton (5kg, 10kg, 20kg atau partai kontainer), Anda dapat mengunjungi menu Portal Grosir B2B atau menghubungi Sales Representative PT Exindokarsa Agung.'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="border-b border-stone-100 pb-5">
        <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
          Pusat Bantuan & Layanan Pelanggan
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          Kami siap membantu kendala pesanan, pertanyaan produk kurma, dan informasi kemitraan PT Exindokarsa Agung.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-stone-900">Live Chat CS</h4>
            <p className="text-[11px] text-stone-600">Respon cepat dalam hitungan menit</p>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer text-center"
          >
            Buka Chat Sekarang
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-stone-900">WhatsApp Resmi</h4>
            <p className="text-[11px] text-stone-600">+62 811-9876-5432 (24 Jam)</p>
          </div>
          <a
            href="https://wa.me/6281198765432"
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer text-center"
          >
            Hubungi WhatsApp
          </a>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-xl bg-stone-800 text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-stone-900">Email Support</h4>
            <p className="text-[11px] text-stone-600">help@allkurma.id</p>
          </div>
          <a
            href="mailto:help@allkurma.id"
            className="py-2 px-3 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-[11px] transition-all cursor-pointer text-center"
          >
            Kirim Email
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-base text-stone-900 font-['Playfair_Display',serif]">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h3>

        <div className="divide-y divide-stone-200 border border-stone-200 rounded-2xl overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="bg-white">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-amber-800 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed bg-stone-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Corporate Info Footer */}
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
        <div className="flex items-center gap-2 font-bold text-stone-900">
          <Building2 className="w-4 h-4 text-amber-800" />
          <span>PT Exindokarsa Agung — Kantor Pusat & Distribusi Utama</span>
        </div>
        <p className="text-[11px] text-stone-500">
          Kawasan Pergudangan Prima Center 1, Blok C8-C9, Jl. Pesing Poglar No. 45, Jakarta Barat 11710.
        </p>
        <p className="text-[11px] text-stone-500">
          Jam Operasional Pengiriman: Senin – Sabtu, 08:00 – 17:00 WIB.
        </p>
      </div>

    </div>
  );
};
