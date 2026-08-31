/**
 * Export Sales & Financial Report to Excel-compatible CSV / Spreadsheets
 * Formatted with UTF-8 BOM so Microsoft Excel, Google Sheets, & LibreOffice display correctly.
 */
import { Order } from '../types';

export function exportSalesReportToExcel(orders: Order[], titlePrefix: string = 'Laporan_Penjualan_AllKurma') {
  if (!orders || orders.length === 0) {
    throw new Error('Tidak ada data transaksi untuk diekspor.');
  }

  // Define Headers for Excel Report
  const headers = [
    'No. Invoice / Pesanan',
    'Tanggal & Waktu Transaksi',
    'Nama Pelanggan',
    'Tipe Akun Pelanggan',
    'No. WhatsApp / HP',
    'Alamat Penerima',
    'Kota & Provinsi Tujuan',
    'Daftar Produk & Varian (Qty)',
    'Total Berat (Gram)',
    'Jasa Ekspedisi / Kurir',
    'Layanan Pengiriman',
    'Nomor Resi Pengiriman',
    'Subtotal Produk (Rp)',
    'Biaya Ongkos Kirim (Rp)',
    'Potongan Diskon / Kupon (Rp)',
    'Diskon Koin (Rp)',
    'Total Pembayaran (Rp)',
    'Metode Pembayaran',
    'Status Pembayaran',
    'Status Pengiriman'
  ];

  // Helper to escape CSV fields
  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Convert each order to row
  const rows = orders.map((order) => {
    const itemsDescription = order.items
      .map(it => {
        const varName = it.selectedVariation?.name ? ` [${it.selectedVariation.name}]` : '';
        const price = it.unitPrice || (it.lineTotal / (it.quantity || 1));
        return `${it.productName}${varName} (${it.quantity}x @ Rp ${price.toLocaleString('id-ID')})`;
      })
      .join('; ');

    const totalWeight = order.totalWeightGram || order.items.reduce((sum, it) => sum + ((it.weightGram || 500) * it.quantity), 0);
    const destination = `${order.shippingAddress?.city || '-'}, ${order.shippingAddress?.province || '-'}`;
    const fullStreet = `${order.shippingAddress?.streetAddress || order.shippingAddress?.fullAddress || '-'}`;

    const discountAmount = (order.voucherDiscount || 0) + (order.wholesaleDiscount || 0);

    return [
      escapeCell(order.orderNumber),
      escapeCell(order.createdAt),
      escapeCell(order.customerName),
      escapeCell(order.customerType || 'Retail'),
      escapeCell(order.shippingAddress?.phone || order.customerPhone || '-'),
      escapeCell(fullStreet),
      escapeCell(destination),
      escapeCell(itemsDescription),
      escapeCell(totalWeight),
      escapeCell(order.courierName || order.courier || '-'),
      escapeCell(order.shippingService || 'Reguler'),
      escapeCell(order.trackingNumber || 'Belum Terbit'),
      escapeCell(order.subtotal || (order.total - (order.shippingCost || 0))),
      escapeCell(order.shippingCost || 0),
      escapeCell(discountAmount),
      escapeCell(order.coinsDiscount || 0),
      escapeCell(order.total),
      escapeCell(order.paymentMethod || 'QRIS / Virtual Account'),
      escapeCell(order.paymentStatus || 'Paid'),
      escapeCell(order.status)
    ].join(',');
  });

  // Calculate Summary Row
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalShipping = orders.reduce((sum, o) => sum + (o.shippingCost || 0), 0);
  const totalDiscount = orders.reduce((sum, o) => sum + ((o.voucherDiscount || 0) + (o.wholesaleDiscount || 0)), 0);

  const summaryRow = [
    escapeCell('TOTAL REKAPITULASI'),
    escapeCell(`${orders.length} Transaksi`),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(totalShipping),
    escapeCell(totalDiscount),
    escapeCell(''),
    escapeCell(totalRevenue),
    escapeCell(''),
    escapeCell(''),
    escapeCell('')
  ].join(',');

  // UTF-8 BOM (\uFEFF) ensures Excel renders Indonesian characters correctly
  const csvContent = '\uFEFF' + [
    headers.map(h => escapeCell(h)).join(','),
    ...rows,
    summaryRow
  ].join('\r\n');

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${titlePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInventoryReportToExcel(products: any[], titlePrefix: string = 'Laporan_Stok_SKU_AllKurma') {
  if (!products || products.length === 0) {
    throw new Error('Tidak ada data produk untuk diekspor.');
  }

  const headers = [
    'Kode SKU Master / Varian',
    'Barcode (EAN-13)',
    'Nama Produk',
    'Varian Kemasan',
    'Kategori',
    'Asal / Origin',
    'Tahun Panen',
    'Lokasi Rak Gudang',
    'Kondisi Penyimpanan',
    'Stok Fisik (Unit)',
    'Batas Stok Minimum',
    'Status Stok',
    'HPP Modal per Unit (Rp)',
    'Harga Jual Eceran (Rp)',
    'Estimasi Total Modal Aset (Rp)',
    'Estimasi Total Nilai Jual (Rp)',
    'Estimasi Potensi Margin Laba (Rp)',
    'Margin (%)',
    'Tanggal Kedaluwarsa (Exp Date)',
    'Sertifikasi'
  ];

  const escapeCell = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows: string[] = [];
  let totalStockCount = 0;
  let totalAssetHpp = 0;
  let totalAssetRevenue = 0;

  products.forEach((prod) => {
    if (prod.variations && prod.variations.length > 0) {
      prod.variations.forEach((v: any) => {
        const cost = v.costPrice || prod.costPrice || Math.round((v.discountPrice || v.regularPrice) * 0.6);
        const sellPrice = v.discountPrice || v.regularPrice;
        const stockQty = v.stock;
        const subHpp = cost * stockQty;
        const subRev = sellPrice * stockQty;
        const profit = subRev - subHpp;
        const marginPct = sellPrice > 0 ? Math.round(((sellPrice - cost) / sellPrice) * 100) : 0;

        totalStockCount += stockQty;
        totalAssetHpp += subHpp;
        totalAssetRevenue += subRev;

        const stockStatus = stockQty === 0 ? 'HABIS' : stockQty <= (v.minStockAlert || prod.minStockAlert || 10) ? 'KRITIS / MENIPIS' : 'AMAN';

        rows.push([
          escapeCell(v.sku || prod.sku),
          escapeCell(v.barcode || prod.barcode || '-'),
          escapeCell(prod.name),
          escapeCell(v.name),
          escapeCell(prod.category),
          escapeCell(prod.origin),
          escapeCell(prod.harvestYear || 'Panen 2025/2026'),
          escapeCell(v.warehouseRack || prod.warehouseRack || prod.warehouseLocation),
          escapeCell(prod.storageCondition || 'Suhu Ruang Sejuk'),
          escapeCell(stockQty),
          escapeCell(v.minStockAlert || prod.minStockAlert || 10),
          escapeCell(stockStatus),
          escapeCell(cost),
          escapeCell(sellPrice),
          escapeCell(subHpp),
          escapeCell(subRev),
          escapeCell(profit),
          escapeCell(`${marginPct}%`),
          escapeCell(prod.expiryDate || '2027-12-31'),
          escapeCell(prod.certification || 'Halal MUI')
        ].join(','));
      });
    } else {
      const cost = prod.costPrice || Math.round((prod.discountPrice || prod.regularPrice) * 0.6);
      const sellPrice = prod.discountPrice || prod.regularPrice;
      const stockQty = prod.stock;
      const subHpp = cost * stockQty;
      const subRev = sellPrice * stockQty;
      const profit = subRev - subHpp;
      const marginPct = sellPrice > 0 ? Math.round(((sellPrice - cost) / sellPrice) * 100) : 0;

      totalStockCount += stockQty;
      totalAssetHpp += subHpp;
      totalAssetRevenue += subRev;

      const stockStatus = stockQty === 0 ? 'HABIS' : stockQty <= (prod.minStockAlert || 10) ? 'KRITIS / MENIPIS' : 'AMAN';

      rows.push([
        escapeCell(prod.sku),
        escapeCell(prod.barcode || '-'),
        escapeCell(prod.name),
        escapeCell('Standar (Single SKU)'),
        escapeCell(prod.category),
        escapeCell(prod.origin),
        escapeCell(prod.harvestYear || 'Panen 2025/2026'),
        escapeCell(prod.warehouseRack || prod.warehouseLocation),
        escapeCell(prod.storageCondition || 'Suhu Ruang Sejuk'),
        escapeCell(stockQty),
        escapeCell(prod.minStockAlert || 10),
        escapeCell(stockStatus),
        escapeCell(cost),
        escapeCell(sellPrice),
        escapeCell(subHpp),
        escapeCell(subRev),
        escapeCell(profit),
        escapeCell(`${marginPct}%`),
        escapeCell(prod.expiryDate || '2027-12-31'),
        escapeCell(prod.certification || 'Halal MUI')
      ].join(','));
    }
  });

  const totalProfit = totalAssetRevenue - totalAssetHpp;
  const overallMargin = totalAssetRevenue > 0 ? Math.round((totalProfit / totalAssetRevenue) * 100) : 0;

  const summaryRow = [
    escapeCell('TOTAL VALUASI INVENTORI'),
    escapeCell(''),
    escapeCell(`${products.length} Master Produk`),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(totalStockCount),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(''),
    escapeCell(totalAssetHpp),
    escapeCell(totalAssetRevenue),
    escapeCell(totalProfit),
    escapeCell(`${overallMargin}%`),
    escapeCell(''),
    escapeCell('')
  ].join(',');

  const csvContent = '\uFEFF' + [
    headers.map(h => escapeCell(h)).join(','),
    ...rows,
    summaryRow
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `${titlePrefix}_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

