import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProfileSidebar = ({ isOpen, onClose, onNavigate }) => {
  const { user, logout, token } = useAuth();
  const { getCartItemsCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [userStats, setUserStats] = useState({
    orders: 0,
    wishlist: 0,
    notifications: 0,
    memberSince: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      fetchUserStats();
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      let apiOrders = [];
      let localOrders = [];
      
      // Get orders from localStorage (from new checkout system)
      localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      
      // Try to get orders from API if user is logged in
      if (user && token) {
        try {
          const ordersResponse = await fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (ordersResponse.ok) {
            apiOrders = await ordersResponse.json();
          }
        } catch (error) {
          console.error('API orders fetch failed:', error);
        }
      }
      
      // Combine and deduplicate orders
      const allOrders = [...localOrders, ...apiOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => (o._id || o.orderId) === (order._id || order.orderId))
      );
      
      // Get wishlist count from context
      const wishlistCount = getWishlistCount();
      
      setUserStats({
        orders: uniqueOrders.length,
        wishlist: wishlistCount,
        notifications: 0,
        memberSince: new Date(user?.createdAt || Date.now()).getFullYear()
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.reload();
  };

  const menuItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Products',
      color: '#3B82F6',
      action: () => onNavigate('products'),
      mobileOnly: true
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Categories',
      color: '#3B82F6',
      action: () => {
        onClose();
        document.getElementById('collection')?.scrollIntoView({behavior: 'smooth'});
      },
      mobileOnly: true
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Edit Profile',
      color: '#3B82F6',
      action: () => onNavigate('profile')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      label: 'Orders',
      color: '#10B981',
      badge: userStats.orders > 0 ? userStats.orders.toString() : null,
      action: () => onNavigate('orders')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Wishlist',
      color: '#EF4444',
      badge: userStats.wishlist > 0 ? userStats.wishlist.toString() : null,
      action: () => onNavigate('wishlist')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8m0-8L17 21" />
        </svg>
      ),
      label: 'Cart',
      color: '#8B5CF6',
      badge: getCartItemsCount() > 0 ? getCartItemsCount().toString() : null,
      action: () => onNavigate('cart')
    },
    ...(user?.isSeller ? [{
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: 'Seller Dashboard',
      color: '#F59E0B',
      action: () => onNavigate('seller')
    }] : []),
    ...(user?.isAdmin ? [{
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Admin Panel',
      color: '#DC2626',
      action: () => onNavigate('admin')
    }] : []),
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Help & Support',
      color: '#6366F1',
      action: () => onNavigate('contact')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
      label: 'Share App',
      color: '#EC4899',
      action: () => {
        if (navigator.share) {
          navigator.share({
            title: 'De Canokart',
            text: 'Check out De Canokart - Premium Indian E-Commerce',
            url: window.location.origin
          });
        }
      }
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      label: 'Sign Out',
      color: '#DC2626',
      action: handleLogout
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="h-48 p-6 relative overflow-hidden" style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'var(--color-background)'
        }}>
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center" style={{ 
              backgroundColor: 'var(--color-background)', 
              borderColor: 'var(--color-background)',
              color: 'var(--color-primary)'
            }}>
              <span className="text-3xl font-bold flex items-center justify-center w-full h-full">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-white/80 text-sm">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium border" style={{ 
                  backgroundColor: 'var(--color-background)', 
                  color: 'var(--color-primary)',
                  borderColor: 'var(--color-background)'
                }}>
                  ✓ Premium Member
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {loading ? '...' : userStats.orders}
            </div>
            <div className="text-xs text-gray-500 font-medium">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {loading ? '...' : userStats.wishlist}
            </div>
            <div className="text-xs text-gray-500 font-medium">Wishlist</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {loading ? '...' : getCartItemsCount()}
            </div>
            <div className="text-xs text-gray-500 font-medium">Cart Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? '...' : userStats.memberSince}
            </div>
            <div className="text-xs text-gray-500 font-medium">Member Since</div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 max-h-96">
          <div className="space-y-2">
            {menuItems.filter(item => window.innerWidth < 1024 || !item.mobileOnly).map((item, index) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 border"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-primary)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  {item.icon}
                </div>
                <span className="flex-1 text-left font-medium text-gray-900 group-hover:text-gray-700">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full border" style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-background)',
                    borderColor: 'var(--color-primary)'
                  }}>
                    {item.badge}
                  </span>
                )}
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200 group"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors" style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)'
            }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="flex-1 text-left font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;