import React from 'react';
import { useApp } from '../context/AppContext';
import { AccessDeniedScreen } from './AccessDeniedScreen';
import { UserRoleType } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'seller' | 'customer';
  allowedRoles?: UserRoleType[];
  viewName?: string;
  targetModuleName?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole,
  allowedRoles,
  viewName,
  targetModuleName
}) => {
  const { user } = useApp();
  const displayName = targetModuleName || viewName || 'Halaman Terproteksi';

  // 1. If explicit allowedRoles array is provided
  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.includes(user.role);
    if (!isAllowed) {
      const isSellerView = allowedRoles.includes('seller');
      return <AccessDeniedScreen targetViewName={displayName} isSellerPortal={isSellerView} />;
    }
    return <>{children}</>;
  }

  // 2. Admin Guard: Must have super_admin, warehouse_manager, sales_rep, or marketing_admin role
  if (requiredRole === 'admin') {
    const isAdmin = ['super_admin', 'warehouse_manager', 'sales_rep', 'marketing_admin'].includes(user.role);
    if (!isAdmin) {
      return <AccessDeniedScreen targetViewName={displayName} isSellerPortal={false} />;
    }
  }

  // 3. Seller Guard: Must have seller or super_admin role
  if (requiredRole === 'seller') {
    const isSeller = ['seller', 'super_admin'].includes(user.role);
    if (!isSeller) {
      return <AccessDeniedScreen targetViewName={displayName} isSellerPortal={true} />;
    }
  }

  return <>{children}</>;
};
