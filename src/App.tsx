import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Auth & Security Guard Views
import { CustomerLoginScreen } from './auth/CustomerLoginScreen';
import { CustomerRegisterScreen } from './auth/CustomerRegisterScreen';
import { CustomerForgotPasswordScreen } from './auth/CustomerForgotPasswordScreen';
import { AccessDeniedScreen } from './auth/AccessDeniedScreen';
import { AuthGuard } from './auth/AuthGuard';

// Customer Profile & Dashboard
import { CustomerDashboardScreen } from './customer/CustomerDashboardScreen';

// Shop Views
import { HomeScreen } from './components/shop/HomeScreen';
import { ProductCatalogScreen } from './components/shop/ProductCatalogScreen';
import { ProductDetailScreen } from './components/shop/ProductDetailScreen';
import { CartScreen } from './components/shop/CartScreen';
import { ShopeeCoinsGameScreen } from './components/shop/ShopeeCoinsGameScreen';
import { ShopeeClaimVouchersScreen } from './components/shop/ShopeeClaimVouchersScreen';
import { ShopeeWishlistScreen } from './components/shop/ShopeeWishlistScreen';
import { ShopeeChatDrawer } from './components/shop/ShopeeChatDrawer';
import { ShopeeNotificationModal } from './components/shop/ShopeeNotificationModal';

// Seller Views
import { SellerDashboardScreen } from './components/seller/SellerDashboardScreen';

// B2B Wholesale Views
import { B2BPortalScreen } from './components/b2b/B2BPortalScreen';
import { B2BQuickOrderScreen } from './components/b2b/B2BQuickOrderScreen';
import { B2BBulkUploadScreen } from './components/b2b/B2BBulkUploadScreen';
import { B2BTiersScreen } from './components/b2b/B2BTiersScreen';
import { B2BInvoicesScreen } from './components/b2b/B2BInvoicesScreen';

// Account & Orders Views
import { MyProfileScreen } from './components/account/MyProfileScreen';
import { MyOrdersScreen } from './components/account/MyOrdersScreen';
import { AddressBookScreen } from './components/account/AddressBookScreen';
import { LoyaltyRewardsScreen } from './components/account/LoyaltyRewardsScreen';
import { AccountSettingsScreen } from './components/account/AccountSettingsScreen';

// Admin Views
import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { AdminAddProductScreen } from './components/admin/AdminAddProductScreen';
import { AdminOrdersScreen } from './components/admin/AdminOrdersScreen';
import { AdminStockScreen } from './components/admin/AdminStockScreen';
import { AdminCustomersScreen } from './components/admin/AdminCustomersScreen';
import { AdminPromotionsScreen } from './components/admin/AdminPromotionsScreen';
import { AdminRolesScreen } from './components/admin/AdminRolesScreen';

export default function App() {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      // 1. Customer Authentication Suite
      case 'customer-login':
        return <CustomerLoginScreen />;
      case 'customer-register':
        return <CustomerRegisterScreen />;
      case 'customer-forgot-password':
        return <CustomerForgotPasswordScreen />;
      case 'customer-dashboard':
        return (
          <AuthGuard allowedRoles={['customer', 'wholesale_partner', 'seller', 'super_admin']}>
            <CustomerDashboardScreen />
          </AuthGuard>
        );
      case 'access-denied':
        return <AccessDeniedScreen />;

      // 2. Shop & Customer Views
      case 'home':
        return <HomeScreen />;
      case 'catalog':
        return <ProductCatalogScreen />;
      case 'product-detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'shopee-coins':
      case 'shopee-games':
        return <ShopeeCoinsGameScreen />;
      case 'shopee-vouchers':
        return <ShopeeClaimVouchersScreen />;
      case 'wishlist':
        return <ShopeeWishlistScreen />;

      // 3. Protected Seller Views (Strict RBAC)
      case 'seller-dashboard':
      case 'seller-center':
      case 'seller-products':
      case 'seller-orders':
      case 'seller-settings':
      case 'seller-vouchers':
      case 'seller-finances':
      case 'seller-reviews':
        return (
          <AuthGuard allowedRoles={['seller', 'super_admin']} targetModuleName="Toko Seller Official ALLKURMA">
            <SellerDashboardScreen />
          </AuthGuard>
        );

      // 4. B2B Wholesale
      case 'b2b-portal':
        return <B2BPortalScreen />;
      case 'b2b-quick-order':
        return <B2BQuickOrderScreen />;
      case 'b2b-bulk-upload':
        return <B2BBulkUploadScreen />;
      case 'b2b-tiers':
        return <B2BTiersScreen />;
      case 'b2b-invoices':
        return <B2BInvoicesScreen />;

      // 5. User Account & Orders
      case 'my-profile':
      case 'shopee-wallet':
        return <CustomerDashboardScreen />;
      case 'my-orders':
      case 'request-return':
      case 'rma-management':
        return <MyOrdersScreen />;
      case 'address-book':
        return <AddressBookScreen />;
      case 'loyalty-rewards':
      case 'loyalty-hub':
      case 'point-history':
      case 'rewards-catalog':
      case 'personalized-offers':
        return <LoyaltyRewardsScreen />;
      case 'account-settings':
        return <AccountSettingsScreen />;

      // 6. Protected Admin Command Center (Strict RBAC)
      case 'admin-dashboard':
        return (
          <AuthGuard allowedRoles={['super_admin', 'warehouse_manager', 'sales_rep', 'marketing_admin']} targetModuleName="Admin Command Center">
            <AdminDashboardScreen />
          </AuthGuard>
        );
      case 'admin-add-product':
        return (
          <AuthGuard allowedRoles={['super_admin', 'warehouse_manager', 'marketing_admin']} targetModuleName="Admin Tambah Produk">
            <AdminAddProductScreen />
          </AuthGuard>
        );
      case 'admin-orders':
        return (
          <AuthGuard allowedRoles={['super_admin', 'warehouse_manager', 'sales_rep']} targetModuleName="Admin Pesanan">
            <AdminOrdersScreen />
          </AuthGuard>
        );
      case 'admin-stock':
        return (
          <AuthGuard allowedRoles={['super_admin', 'warehouse_manager']} targetModuleName="Admin Stok Gudang">
            <AdminStockScreen />
          </AuthGuard>
        );
      case 'admin-customers':
        return (
          <AuthGuard allowedRoles={['super_admin', 'sales_rep']} targetModuleName="Admin Data Pelanggan">
            <AdminCustomersScreen />
          </AuthGuard>
        );
      case 'admin-promotions':
        return (
          <AuthGuard allowedRoles={['super_admin', 'marketing_admin']} targetModuleName="Admin Promosi Voucher">
            <AdminPromotionsScreen />
          </AuthGuard>
        );
      case 'admin-roles':
        return (
          <AuthGuard allowedRoles={['super_admin']} targetModuleName="Admin Manajemen Hak Akses">
            <AdminRolesScreen />
          </AuthGuard>
        );
      case 'admin-settings':
        return (
          <AuthGuard allowedRoles={['super_admin']} targetModuleName="Admin Konfigurasi Sistem">
            <AccountSettingsScreen />
          </AuthGuard>
        );

      default:
        return <HomeScreen />;
    }
  };

  const isStandaloneAuthView = ['customer-login', 'customer-register', 'customer-forgot-password'].includes(currentView);
  const isAdminView = currentView.startsWith('admin-');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#009A44] selection:text-white flex flex-col justify-between">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Global Interactive Drawers & Overlays (not shown on standalone auth views) */}
      {!isStandaloneAuthView && (
        <>
          <ShopeeChatDrawer />
          <ShopeeNotificationModal />
        </>
      )}

      {/* Main Top Header Navbar (Hidden on standalone auth & deep admin cockpit) */}
      {!isAdminView && !isStandaloneAuthView && <Navbar />}

      {/* Main Screen Content Body */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Bottom Sticky Mobile Navigation Bar (Hidden on standalone auth & admin) */}
      {!isStandaloneAuthView && !isAdminView && <BottomNav />}
    </div>
  );
}
