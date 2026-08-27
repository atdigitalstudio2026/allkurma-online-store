import React from 'react';
import { useApp } from '../context/AppContext';
import { AccessDeniedScreen } from './AccessDeniedScreen';
import { CustomerLoginScreen } from './CustomerLoginScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'seller' | 'customer';
  viewName?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole = 'customer',
  viewName = 'Halaman Terproteksi'
}) => {
  const { user } = useApp();

  // Admin Guard: Must have super_admin, warehouse_manager, sales_rep, or marketing_admin role
  if (requiredRole === 'admin') {
    const isAdmin = ['super_admin', 'warehouse_manager', 'sales_rep', 'marketing_admin'].includes(user.role);
    if (!isAdmin) {
      return <AccessDeniedScreen targetViewName={viewName} />;
    }
  }

  // Seller Guard: Must have seller or super_admin role
  if (requiredRole === 'seller') {
    const isSeller = ['seller', 'super_admin'].includes(user.role);
    if (!isSeller) {
      return <AccessDeniedScreen targetViewName={viewName} />;
    }
  }

  return <>{children}</>;
};
