import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
interface LayoutProps {
  userRole: 'customer' | 'restaurant' | 'delivery' | 'admin';
  onLogout: () => void;
}
export function Layout({
  userRole,
  onLogout
}: LayoutProps) {
  return <div className="flex h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>;
}