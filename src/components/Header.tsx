import React, { useState } from 'react';
import { MenuIcon, BellIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface HeaderProps {
  userRole: 'customer' | 'restaurant' | 'delivery' | 'admin';
  onLogout: () => void;
}
export function Header({
  userRole,
  onLogout
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const roleLabels = {
    customer: 'Customer',
    restaurant: 'Restaurant',
    delivery: 'Delivery Agent',
    admin: 'Admin'
  };
  return <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button type="button" className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
            <div className="md:hidden flex items-center justify-center">
              <Link to="/" className="text-xl font-bold text-gray-800">
                TakeOut
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="hidden md:block text-sm font-medium text-gray-500 mr-4">
              {roleLabels[userRole]} Portal
            </span>
            <button type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button type="button" className="flex max-w-xs items-center rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" id="user-menu-button" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                  <span className="sr-only">Open user menu</span>
                  <UserIcon className="h-8 w-8 rounded-full p-1" />
                </button>
              </div>
              {isProfileMenuOpen && <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" onClick={onLogout}>
                    Sign out
                  </button>
                </div>}
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {userRole === 'customer' && <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/restaurants" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Restaurants
                </Link>
                <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Cart
                </Link>
              </>}
            {userRole === 'restaurant' && <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Menu Management
                </Link>
                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Orders
                </Link>
              </>}
            {userRole === 'delivery' && <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
              </>}
            {userRole === 'admin' && <>
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Dashboard
                </Link>
                <Link to="/users" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  User Management
                </Link>
                <Link to="/analytics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Analytics
                </Link>
              </>}
          </div>
        </div>}
    </header>;
}