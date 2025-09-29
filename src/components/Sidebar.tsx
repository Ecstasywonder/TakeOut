import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, UtensilsIcon, ShoppingBagIcon, TruckIcon, UsersIcon, BarChartIcon, ClipboardListIcon, MenuIcon, ShoppingCartIcon } from 'lucide-react';
interface SidebarProps {
  userRole: 'customer' | 'restaurant' | 'delivery' | 'admin';
}
export function Sidebar({
  userRole
}: SidebarProps) {
  const getNavLinks = () => {
    switch (userRole) {
      case 'customer':
        return [{
          to: '/',
          icon: <HomeIcon size={20} />,
          label: 'Dashboard'
        }, {
          to: '/restaurants',
          icon: <UtensilsIcon size={20} />,
          label: 'Restaurants'
        }, {
          to: '/cart',
          icon: <ShoppingCartIcon size={20} />,
          label: 'Cart'
        }];
      case 'restaurant':
        return [{
          to: '/',
          icon: <HomeIcon size={20} />,
          label: 'Dashboard'
        }, {
          to: '/menu',
          icon: <MenuIcon size={20} />,
          label: 'Menu Management'
        }, {
          to: '/orders',
          icon: <ClipboardListIcon size={20} />,
          label: 'Orders'
        }];
      case 'delivery':
        return [{
          to: '/',
          icon: <HomeIcon size={20} />,
          label: 'Dashboard'
        }, {
          to: '/',
          icon: <TruckIcon size={20} />,
          label: 'Deliveries'
        }];
      case 'admin':
        return [{
          to: '/',
          icon: <HomeIcon size={20} />,
          label: 'Dashboard'
        }, {
          to: '/users',
          icon: <UsersIcon size={20} />,
          label: 'User Management'
        }, {
          to: '/analytics',
          icon: <BarChartIcon size={20} />,
          label: 'Analytics'
        }];
      default:
        return [];
    }
  };
  return <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">TakeOut</h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {getNavLinks().map(link => <NavLink key={link.label} to={link.to} className={({
          isActive
        }) => `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </NavLink>)}
        </nav>
      </div>
    </div>;
}