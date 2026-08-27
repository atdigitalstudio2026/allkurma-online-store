import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  Home, 
  Building, 
  X,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Address } from '../types';

export const CustomerAddressesSection: React.FC = () => {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress, showToast } = useApp();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [label, setLabel] = useState('Rumah');
  const [fullAddress, setFullAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setRecipientName('');
    setPhone('');
    setLabel('Rumah');
    setFullAddress('');
    setCity('Jakarta Selatan');
    setPostalCode('');
    setIsDefault(false);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (addr: Address) => {
    setEditingId(addr.id);
    setRecipientName(addr.recipientName);
    setPhone(addr.phone);
    setLabel(addr.label);
    setFullAddress(addr.fullAddress || addr.streetAddress || '');
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setIsDefault(addr.isDefault);
    setIsAdding(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim() || !phone.trim() || !fullAddress.trim()) {
      showToast('Harap lengkapi semua kolom alamat.', 'error');
      return;
    }

    if (editingId) {
      updateAddress(editingId, {
        recipientName,
        phone,
        label,
        fullAddress,
        city,
        postalCode,
        isDefault
      });
      showToast('Alamat berhasil diperbarui!', 'success');
    } else {
      addAddress({
        recipientName,
        phone,
        label,
        fullAddress,
        city,
        postalCode,
        isDefault: isDefault || addresses.length === 0
      });
      showToast('Alamat baru berhasil ditambahkan!', 'success');
    }

    resetForm();
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-stone-900 font-['Playfair_Display',serif]">
            Alamat Saya
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar alamat pengiriman kurma pesanan Anda. Alamat utama akan otomatis dipilih saat checkout.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Alamat Baru</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Inline Block */}
      {isAdding && (
        <div className="p-5 bg-stone-50 rounded-2xl border border-amber-300/80 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>{editingId ? 'Edit Alamat Pengiriman' : 'Tambah Alamat Pengiriman Baru'}</span>
            </h3>
            <button 
              onClick={resetForm}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama Lengkap Penerima"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nomor HP Penerima <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Label Alamat
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
                >
                  <option value="Rumah">Rumah</option>
                  <option value="Kantor">Kantor</option>
                  <option value="Apartemen">Apartemen</option>
                  <option value="Gudang">Gudang</option>
                  <option value="Toko">Toko</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kota / Kabupaten <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Kota Jakarta Selatan"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="12345"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Alamat Lengkap & Patokan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="Jl. Kurma Raya No. 88, Blok C, Dekat Masjid Raya"
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/40"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="def-check"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-amber-800 focus:ring-amber-700 border-stone-300 cursor-pointer"
              />
              <label htmlFor="def-check" className="text-xs text-stone-700 font-medium cursor-pointer">
                Jadikan sebagai alamat utama (Default)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="py-2 px-4 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah Alamat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-4 rounded-2xl border transition-all relative ${
              addr.isDefault 
                ? 'border-amber-700 bg-amber-50/40 shadow-xs' 
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-800 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Utama
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(addr)}
                  className="p-1.5 text-stone-500 hover:text-amber-800 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title="Edit Alamat"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {addresses.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm('Hapus alamat ini?')) {
                        deleteAddress(addr.id);
                        showToast('Alamat dihapus.', 'info');
                      }
                    }}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Hapus Alamat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <h4 className="font-bold text-xs text-stone-900">
              {addr.recipientName} <span className="text-stone-500 font-normal">({addr.phone})</span>
            </h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {addr.fullAddress || addr.streetAddress}, {addr.city} {addr.postalCode}
            </p>

            {!addr.isDefault && (
              <button
                onClick={() => {
                  setDefaultAddress(addr.id);
                  showToast('Alamat utama berhasil diubah!', 'success');
                }}
                className="mt-3 text-[11px] font-bold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
              >
                Atur sebagai alamat utama
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
