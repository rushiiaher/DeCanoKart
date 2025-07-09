import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../context/CartContext';

const LuxuryProfileDropdown = ({ onClose, onNavigate }) => {
  const { user, logout } = useAuth();
  const { getCartTotal, getCartItemsCount } = useCart();
  const [userStats, setUserStats] = useState({
    orders: 12,
    wishlist: 8,
    points: 2450,
    walletBalance: 1250
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    if (showLogoutConfirm) {
      logout();
      localStorage.clear();
      window.location.reload();
    } else {
      setShowLogoutConfirm(true);
      setTimeout(() => setShowLogoutConfirm(false), 3000);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: '👤', label: 'Profile Settings', action: () => onNavigate('profile') },
        { icon: '📍', label: 'Addresses', action: () => onNavigate('addresses') },
        { icon: '💳', label: 'Payment Methods', action: () => onNavigate('payments') }
      ]
    },
    {
      section: 'Orders & Returns',
      items: [
        { icon: '📦', label: 'Order History', action: () => onNavigate('orders'), badge: userStats.orders },
        { icon: '🚚', label: 'Track Orders', action: () => onNavigate('tracking') },
        { icon: '↩️', label: 'Return Requests', action: () => onNavigate('returns') }
      ]
    },
    {
      section: 'Shopping',
      items: [
        { icon: '❤️', label: 'My Wishlist', action: () => onNavigate('wishlist'), badge: userStats.wishlist },
        { icon: '🎁', label: 'Rewards & Offers', action: () => onNavigate('rewards') },
        { icon: '💰', label: 'Wallet', action: () => onNavigate('wallet'), amount: userStats.walletBalance }
      ]
    }
  ];

  return (
    <div className="w-80 bg-base-100/95 backdrop-blur-md rounded-2xl shadow-2xl border border-base-200/50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
      {/* Header Section */}
      <div className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-200/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary flex items-center justify-center">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-base-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-base-content/60 font-medium">{getGreeting()},</div>
            <h3 className="text-lg font-bold text-base-content truncate">{user?.name || 'User'}</h3>
            <p className="text-sm text-base-content/60 truncate">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <div className="badge badge-primary badge-sm">Premium Member</div>
              <div className="badge badge-success badge-sm">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-1 p-3 bg-base-200/30">
        <div className="text-center p-2 rounded-lg hover:bg-base-100/50 transition-colors cursor-pointer">
          <div className="text-lg font-bold text-primary">{userStats.orders}</div>
          <div className="text-xs text-base-content/60">Orders</div>
        </div>
        <div className="text-center p-2 rounded-lg hover:bg-base-100/50 transition-colors cursor-pointer">
          <div className="text-lg font-bold text-secondary">{userStats.wishlist}</div>
          <div className="text-xs text-base-content/60">Wishlist</div>
        </div>
        <div className="text-center p-2 rounded-lg hover:bg-base-100/50 transition-colors cursor-pointer">
          <div className="text-lg font-bold text-accent">{userStats.points}</div>
          <div className="text-xs text-base-content/60">Points</div>
        </div>
        <div className="text-center p-2 rounded-lg hover:bg-base-100/50 transition-colors cursor-pointer">
          <div className="text-lg font-bold text-success">₹{userStats.walletBalance}</div>
          <div className="text-xs text-base-content/60">Wallet</div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-h-80 overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={section.section} className="p-3">
            <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2 px-2">
              {section.section}
            </h4>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-200 group"
                  style={{ animationDelay: `${(sectionIndex * 3 + itemIndex) * 50}ms` }}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span className="flex-1 text-left font-medium text-base-content group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="badge badge-primary badge-sm">{item.badge}</span>
                  )}
                  {item.amount && (
                    <span className="text-sm font-bold text-success">₹{item.amount}</span>
                  )}
                  <svg className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
            {sectionIndex < menuItems.length - 1 && (
              <div className="divider my-3 opacity-30"></div>
            )}
          </div>
        ))}
      </div>

      {/* Settings & Logout */}
      <div className="p-3 border-t border-base-200/50 bg-base-50/50">
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:translate-x-1 transition-all duration-200 group mb-2"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">⚙️</span>
          <span className="flex-1 text-left font-medium text-base-content group-hover:text-primary transition-colors">
            Settings
          </span>
          <svg className="w-4 h-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            showLogoutConfirm 
              ? 'bg-error/20 text-error border border-error/30' 
              : 'hover:bg-error/10 hover:translate-x-1 text-error'
          }`}
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
            {showLogoutConfirm ? '⚠️' : '🚪'}
          </span>
          <span className="flex-1 text-left font-medium transition-colors">
            {showLogoutConfirm ? 'Click again to confirm' : 'Sign Out'}
          </span>
          {showLogoutConfirm && (
            <div className="loading loading-spinner loading-sm"></div>
          )}
        </button>
      </div>

      {/* Profile Completion */}
      <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-base-content">Profile Completion</span>
          <span className="text-sm font-bold text-primary">85%</span>
        </div>
        <div className="w-full bg-base-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500" style={{width: '85%'}}></div>
        </div>
        <p className="text-xs text-base-content/60 mt-1">Add payment method to reach 100%</p>
      </div>
    </div>
  );
};

export default LuxuryProfileDropdown;