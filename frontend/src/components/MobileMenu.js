import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const MobileMenu = ({ isOpen, onClose, onNavigate, openModal }) => {
  const { user, logout } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[9998] lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className="fixed top-0 left-0 h-full w-80 z-[9999] lg:hidden transform transition-transform duration-300 ease-out" style={{
        backgroundColor: 'var(--color-background)',
        borderRight: '1px solid var(--color-border)'
      }}>
        {/* Header Section */}
        <div className="h-44 p-6 relative" style={{ backgroundColor: 'var(--color-primary)' }}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'var(--color-background)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {user ? (
            <div className="flex items-center gap-4 mt-8">
              <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ 
                backgroundColor: 'var(--color-background)', 
                borderColor: 'var(--color-background)',
                color: 'var(--color-primary)'
              }}>
                <span className="text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--color-background)' }}>
                  {user?.name || 'User'}
                </h2>
                <p className="text-sm opacity-80" style={{ color: 'var(--color-background)' }}>
                  Premium Member
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-background)' }}>Welcome</h2>
              <p className="text-sm opacity-80" style={{ color: 'var(--color-background)' }}>Sign in to access your account</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Main Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Main</h3>
            <div className="space-y-1">
              <button
                onClick={() => { onClose(); onNavigate('products'); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)'
                }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Products</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => { onClose(); onNavigate('faq'); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)'
                }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Categories</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Account Section */}
          {user && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Account</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { onClose(); openModal('profile'); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)'
                  }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>My Profile</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => { onClose(); onNavigate('orders'); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)'
                  }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Orders</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => { onClose(); onNavigate('wishlist'); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)'
                  }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Wishlist</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Support Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Support</h3>
            <div className="space-y-1">
              <button
                onClick={() => { onClose(); onNavigate('contact'); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)'
                }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Help & Support</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Auth Section */}
          {!user ? (
            <div className="space-y-3">
              <button
                onClick={() => { onClose(); openModal('login'); }}
                className="w-full btn-minimal-secondary font-medium py-3 px-4 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={() => { onClose(); openModal('register'); }}
                className="w-full btn-minimal-primary font-medium py-3 px-4 rounded-xl"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => { onClose(); logout(); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:opacity-70 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl border flex items-center justify-center" style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)'
                }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-primary)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="flex-1 text-left font-medium" style={{ color: 'var(--color-text-primary)' }}>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;