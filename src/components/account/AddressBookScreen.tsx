import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddressBookScreen: React.FC = () => {
  const { addresses, addAddress, deleteAddress, setDefaultAddress, setCurrentView, showToast } = useApp();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Office' | 'Warehouse'>('Home');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('Jakarta Selatan');
  const [province, setProvince] = useState('DKI Jakarta');
  const [postalCode, setPostalCode] = useState('12430');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !phone || !streetAddress) {
      showToast('Harap lengkapi semua kolom alamat', 'error');
      return;
    }

    addAddress({
      label,
      recipientName,
      phone,
      streetAddress,
      city,
      province,
      postalCode,
      country: 'Indonesia',
      isDefault
    });

    setIsAddModalOpen(false);
    setRecipientName('');
    setPhone('');
    setStreetAddress('');
    showToast('Alamat baru berhasil disimpan!', 'success');
  };

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
          Buku Alamat Pengiriman
        </h1>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Address List */}
      <div className="p-4 space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 transition-all ${
              addr.isDefault ? 'border-amber-500 ring-1 ring-amber-500 bg-amber-50/20' : 'border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md font-bold text-[10px] uppercase">
                  {addr.label}
                </span>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-amber-800 text-white rounded-full font-bold text-[9px]">
                    Utama
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-[11px] text-amber-800 hover:underline font-medium"
                  >
                    Jadikan Utama
                  </button>
                )}
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-stone-400 hover:text-red-600 p-1"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs text-stone-900">{addr.recipientName}</h3>
              <p className="text-[11px] text-stone-500">{addr.phone}</p>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {addr.streetAddress}, {addr.city}, {addr.province} {addr.postalCode}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm">Tambah Alamat Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Label Alamat</label>
                <div className="flex gap-2">
                  {[
                    { key: 'Home', label: 'Rumah' },
                    { key: 'Office', label: 'Kantor / Toko' },
                    { key: 'Warehouse', label: 'Gudang' }
                  ].map(lbl => (
                    <button
                      key={lbl.key}
                      type="button"
                      onClick={() => setLabel(lbl.key as any)}
                      className={`flex-1 py-1.5 rounded-lg border font-medium text-xs ${
                        label === lbl.key ? 'bg-amber-800 text-white border-amber-800 font-bold' : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {lbl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Penerima</label>
                <input
                  type="text"
                  required
                  placeholder="Zaid Al-Fatih"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  required
                  placeholder="0812-9876-5432"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Jl. Cilandak Barat No. 88, Cilandak..."
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kota</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-amber-800"
                />
                <span className="text-stone-700 font-medium">Jadikan sebagai alamat utama</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 border border-stone-200 rounded-xl text-stone-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-800 text-white rounded-xl font-bold"
                >
                  Simpan Alamat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
