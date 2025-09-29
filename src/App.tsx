import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { RestaurantList } from './pages/customer/RestaurantList';
import { RestaurantMenu } from './pages/customer/RestaurantMenu';
import { OrderTracking } from './pages/customer/OrderTracking';
import { RestaurantDashboard } from './pages/restaurant/RestaurantDashboard';
import { MenuManagement } from './pages/restaurant/MenuManagement';
import { OrderManagement } from './pages/restaurant/OrderManagement';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { DeliveryOrderDetails } from './pages/delivery/DeliveryOrderDetails';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { Analytics } from './pages/admin/Analytics';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { Cart } from './pages/customer/Cart';
import { OrderConfirmation } from './pages/customer/OrderConfirmation';
export function App() {
  const [userRole, setUserRole] = useState<'customer' | 'restaurant' | 'delivery' | 'admin' | null>(null);
  // This would normally be handled by authentication, but for demo purposes
  // we'll use a simple state to switch between user roles
  const handleRoleChange = (role: 'customer' | 'restaurant' | 'delivery' | 'admin' | null) => {
    setUserRole(role);
  };
  if (!userRole) {
    return <Routes>
        <Route path="/login" element={<Login onRoleSelect={handleRoleChange} />} />
        <Route path="/register" element={<Register onRoleSelect={handleRoleChange} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>;
  }
  return <Routes>
      <Route path="/" element={<Layout userRole={userRole} onLogout={() => handleRoleChange(null)} />}>
        {/* Customer Routes */}
        {userRole === 'customer' && <>
            <Route index element={<CustomerDashboard />} />
            <Route path="restaurants" element={<RestaurantList />} />
            <Route path="restaurants/:id" element={<RestaurantMenu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="orders/:id/tracking" element={<OrderTracking />} />
          </>}
        {/* Restaurant Routes */}
        {userRole === 'restaurant' && <>
            <Route index element={<RestaurantDashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </>}
        {/* Delivery Agent Routes */}
        {userRole === 'delivery' && <>
            <Route index element={<DeliveryDashboard />} />
            <Route path="orders/:id" element={<DeliveryOrderDetails />} />
          </>}
        {/* Admin Routes */}
        {userRole === 'admin' && <>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </>}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>;
}