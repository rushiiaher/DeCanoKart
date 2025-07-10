import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Login from './components/Login';
import Register from './components/Register';
import PasswordReset from './components/PasswordReset';
import Profile from './components/Profile';
import ProfileEdit from './components/ProfileEdit';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductSlider from './components/ProductSlider';
import HeroBanner from './components/HeroBanner';
import { useFeaturedProducts } from './hooks/useFeaturedProducts';
import OurCollection from './components/OurCollection';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import CheckoutFlow from './components/CheckoutFlow';
import OrderConfirmation from './components/OrderConfirmation';
import AdminPanel from './components/AdminPanel';
import RecentlyViewed from './components/RecentlyViewed';
import ReturnRequest from './components/ReturnRequest';
import ContactForm from './components/ContactForm';
import FAQ from './components/FAQ';
import AboutUs from './components/AboutUs';
import OrderHistory from './components/OrderHistory';
import OrderTracking from './components/OrderTracking';
import OrderTrackingNew from './components/OrderTrackingNew';
import SellerDashboard from './components/SellerDashboard';
import PremiumSearch from './components/PremiumSearch';
import LuxuryProfileDropdown from './components/LuxuryProfileDropdown';
import SearchResults from './components/SearchResults';
import ProfileSidebar from './components/ProfileSidebar';
import Footer from './components/Footer';
import './App.css';

// Theme Toggle Function
const toggleTheme = () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

function AppContent() {
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');
  const [currentView, setCurrentView] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [viewHistory, setViewHistory] = useState(['products']);

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.productId) {
          setSelectedProductId(event.state.productId);
        }
        if (event.state.orderId) {
          setSelectedOrderId(event.state.orderId);
        }
      } else if (viewHistory.length > 1) {
        const previousView = viewHistory[viewHistory.length - 2];
        setCurrentView(previousView);
        setViewHistory(prev => prev.slice(0, -1));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [viewHistory]);

  // Push state to history when view changes
  const pushToHistory = (view, data = {}) => {
    const state = { view, ...data };
    window.history.pushState(state, '', `#${view}`);
    setViewHistory(prev => [...prev, view]);
  };

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      // Check if scrolled
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const switchModal = (type) => {
    setModalType(type);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setCurrentView('productDetail');
    pushToHistory('productDetail', { productId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProducts = () => {
    window.history.back();
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
    pushToHistory('checkout');
  };

  const handleBuyNow = (product) => {
    // Store buy now product temporarily
    localStorage.setItem('buyNowProduct', JSON.stringify(product));
    setCurrentView('checkout');
  };

  const handleOrderComplete = (orderIdResult) => {
    setOrderId(orderIdResult);
    setCurrentView('orderConfirmation');
  };

  const handleOrderClick = (orderIdResult) => {
    setSelectedOrderId(orderIdResult);
    setCurrentView('orderTracking');
    pushToHistory('orderTracking', { orderId: orderIdResult });
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* FLIPKART-STYLE NAVIGATION BAR */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b border-base-200/50 transition-all duration-300 ${
        scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled ? 'bg-base-100 shadow-lg' : 'bg-base-100/95 shadow-sm'
      }`} style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="navbar min-h-[80px]">
            {/* Mobile Logo */}
            <div className="navbar-start lg:hidden">
              <a 
                className="text-xl font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity duration-300 brand-name" 
                style={{ color: 'var(--color-text-primary)' }}
                onClick={() => {
                  setCurrentView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                De Canokart
              </a>
            </div>

            {/* Desktop Logo */}
            <div className="navbar-center hidden lg:flex lg:navbar-start">
              <a 
                className="text-4xl font-bold tracking-tight cursor-pointer hover:opacity-70 transition-opacity duration-300 brand-name" 
                style={{ color: 'var(--color-text-primary)' }}
                onClick={() => {
                  setCurrentView('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                De Canokart
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-2 gap-2">
                <li><a className="font-medium text-base px-6 py-3 transition-opacity duration-200 cursor-pointer hover:opacity-70 relative group" style={{ color: 'var(--color-text-primary)' }} onClick={() => setCurrentView('products')}>
                  Products
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: 'var(--color-text-primary)' }}></span>
                </a></li>
                <li><a className="font-medium text-base px-6 py-3 transition-opacity duration-200 cursor-pointer hover:opacity-70 relative group" style={{ color: 'var(--color-text-primary)' }} onClick={() => document.getElementById('collection')?.scrollIntoView({behavior: 'smooth'})}>
                  Categories
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: 'var(--color-text-primary)' }}></span>
                </a></li>
                <li><a className="font-medium text-base px-6 py-3 transition-opacity duration-200 cursor-pointer hover:opacity-70 relative group" style={{ color: 'var(--color-text-primary)' }} onClick={() => setCurrentView('about')}>
                  About Us
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: 'var(--color-text-primary)' }}></span>
                </a></li>
                <li><a className="font-medium text-base px-6 py-3 transition-opacity duration-200 cursor-pointer hover:opacity-70 relative group" style={{ color: 'var(--color-text-primary)' }} onClick={() => setCurrentView('contact')}>
                  Contact
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0" style={{ backgroundColor: 'var(--color-text-primary)' }}></span>
                </a></li>
              </ul>
            </div>

            {/* Right Side Actions */}
            <div className="navbar-end gap-2">
              {/* Desktop Search */}
              <div className="hidden lg:flex relative">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for products, brands and more" 
                    className="w-96 px-4 py-2 pl-12 pr-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                    onKeyPress={async (e) => {
                      if (e.key === 'Enter') {
                        const query = e.target.value;
                        setSearchQuery(query);
                        setCurrentView('searchResults');
                        
                        // Log search for featured products algorithm
                        try {
                          const token = localStorage.getItem('token');
                          await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/search?q=` + encodeURIComponent(query), {
                            headers: token ? { Authorization: `Bearer ${token}` } : {}
                          });
                        } catch (error) {
                          console.error('Search logging error:', error);
                        }
                      }
                    }}
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Premium Cart with Badge */}
              <button className="btn btn-ghost btn-circle hover:bg-primary/10 transition-colors duration-200 relative" onClick={() => setCurrentView('cart')}>
                <div className="indicator">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {getCartItemsCount() > 0 && (
                    <span className="badge badge-sm badge-primary indicator-item animate-pulse">{getCartItemsCount()}</span>
                  )}
                </div>
              </button>

              {/* Premium Theme Toggle */}
              <button className="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-200 hover:rotate-180" onClick={toggleTheme}>
                <svg className="h-5 w-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
                <svg className="h-5 w-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>

              {/* User Menu */}
              {user ? (
                <button 
                  onClick={() => setShowProfileSidebar(true)}
                  className="btn btn-ghost btn-circle avatar hover:opacity-70 transition-opacity duration-200 relative"
                >
                  <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full border-2 flex items-center justify-center" style={{
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-background)'
                  }}>
                    <span className="text-sm lg:text-lg font-bold flex items-center justify-center w-full h-full">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 rounded-full border-2" style={{
                    backgroundColor: '#10B981',
                    borderColor: 'var(--color-background)'
                  }}></div>
                </button>
              ) : (
                <div className="gap-2 flex">
                  <button className="btn-minimal-text px-3 py-2 text-sm lg:px-6" onClick={() => openModal('login')}>Login</button>
                  <button className="btn-minimal-primary px-3 py-2 text-sm lg:px-6 rounded-lg" onClick={() => openModal('register')}>Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE SEARCH BAR */}
      <div className={`fixed w-full z-40 lg:hidden transition-all duration-300 ${
        scrollDirection === 'down' ? 'top-0' : 'top-[80px]'
      }`} style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
              onKeyPress={async (e) => {
                if (e.key === 'Enter') {
                  const query = e.target.value;
                  setSearchQuery(query);
                  setCurrentView('searchResults');
                  
                  // Log search for featured products algorithm
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/search?q=` + encodeURIComponent(query), {
                      headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                  } catch (error) {
                    console.error('Search logging error:', error);
                  }
                }
              }}
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-text-muted)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <main className={`flex-1 transition-all duration-300 ${
        scrollDirection === 'down' ? 'pt-[130px] lg:pt-[80px]' : 'pt-[130px] lg:pt-[80px]'
      }`}>
        {currentView === 'products' && !selectedProductId && (
          <>
            <section className="pt-16 pb-8 relative overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
              
              {/* Content */}
              <div className="container mx-auto px-4 text-center relative z-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 text-base-content fade-in">
                  Welcome to De Canokart
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-base-content/70 mb-6 max-w-2xl mx-auto slide-up">
                  Your trusted marketplace for quality products and exceptional service
                </p>
              </div>
            </section>
            
            {/* Hero Banner Section - Placed exactly below the subtitle */}
            <section className="pb-8">
              <div className="container mx-auto px-4">
                <HeroBanner />
              </div>
            </section>
            
            {/* Action Buttons Section */}
            <section className="pb-12">
              <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up">
                  <button className="btn btn-primary btn-lg px-6 md:px-8 py-3 text-base md:text-lg font-semibold" onClick={() => document.getElementById('featured')?.scrollIntoView({behavior: 'smooth'})}>
                    Shop Now
                  </button>
                  <button className="btn btn-outline btn-lg px-6 md:px-8 py-3 text-base md:text-lg font-semibold" onClick={() => document.getElementById('collection')?.scrollIntoView({behavior: 'smooth'})}>
                    Browse Collection
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Featured Products Section */}
        <div id="featured">
          {currentView === 'products' && (
            <ProductSlider 
              products={featuredProducts}
              title="Featured Products"
              subtitle="Based on trending searches and popular demand"
              loading={featuredLoading}
              onProductClick={handleProductClick}
              onBuyNow={handleBuyNow}
            />
          )}
        </div>
        
        {/* Our Collection Section */}
        <div id="collection">
          {currentView === 'products' && (
            <OurCollection 
              onProductClick={handleProductClick} 
              onBuyNow={handleBuyNow} 
            />
          )}
        </div>
        
        {currentView === 'productDetail' && selectedProductId && (
          <ProductDetail 
            productId={selectedProductId} 
            onBack={handleBackToProducts}
            onProductClick={handleProductClick}
            onBuyNow={handleBuyNow}
          />
        )}
        {currentView === 'cart' && (
          <Cart onCheckout={handleCheckout} />
        )}
        {currentView === 'wishlist' && (
          <Wishlist onProductClick={handleProductClick} />
        )}
        {currentView === 'checkout' && (
          <CheckoutFlow 
            onBack={() => setCurrentView('products')} 
            onNavigateToTracking={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('orderTracking');
            }}
          />
        )}
        {currentView === 'checkoutOld' && (
          <Checkout cartItems={cartItems} onOrderComplete={handleOrderComplete} />
        )}
        {currentView === 'orderConfirmation' && orderId && (
          <OrderConfirmation orderId={orderId} onTrackOrder={handleOrderClick} />
        )}
        {currentView === 'admin' && user?.isAdmin && (
          <AdminPanel />
        )}
        {currentView === 'returns' && (
          <ReturnRequest />
        )}
        {currentView === 'faq' && (
          <FAQ />
        )}
        {currentView === 'contact' && (
          <ContactForm />
        )}
        {currentView === 'about' && (
          <AboutUs />
        )}
        {currentView === 'orders' && (
          <OrderHistory onOrderClick={handleOrderClick} />
        )}
        {currentView === 'orderTracking' && selectedOrderId && (
          <OrderTrackingNew orderId={selectedOrderId} onBack={() => setCurrentView('orders')} />
        )}
        {currentView === 'seller' && user?.isSeller && (
          <SellerDashboard />
        )}
        {currentView === 'searchResults' && (
          <SearchResults 
            searchQuery={searchQuery}
            onProductClick={handleProductClick}
            onBack={() => setCurrentView('products')}
          />
        )}
        {currentView === 'profileEdit' && (
          <ProfileEdit />
        )}
      </main>
      
      {currentView === 'products' && (
        <aside className="hidden xl:block fixed right-4 top-1/2 transform -translate-y-1/2 w-64">
          <RecentlyViewed onProductClick={handleProductClick} />
        </aside>
      )}

      {showModal && (
        <div className="modal modal-open modal-luxury">
          <div className="modal-box luxury-shadow">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeModal}>✕</button>
            {modalType === 'login' && (
              <Login
                onClose={closeModal}
                switchToRegister={() => switchModal('register')}
                switchToReset={() => switchModal('reset')}
              />
            )}
            {modalType === 'register' && (
              <Register
                onClose={closeModal}
                switchToLogin={() => switchModal('login')}
              />
            )}
            {modalType === 'reset' && (
              <PasswordReset
                onClose={closeModal}
                switchToLogin={() => switchModal('login')}
              />
            )}
            {modalType === 'profile' && (
              <Profile onClose={closeModal} />
            )}
          </div>
          <div className="modal-backdrop" onClick={closeModal}></div>
        </div>
      )}
      
      {/* Premium Profile Sidebar */}
      <ProfileSidebar 
        isOpen={showProfileSidebar}
        onClose={() => setShowProfileSidebar(false)}
        onNavigate={(view) => {
          setShowProfileSidebar(false);
          let targetView = view;
          if (view === 'profile') targetView = 'profileEdit';
          else if (view === 'orders') targetView = 'orders';
          else if (view === 'wishlist') targetView = 'wishlist';
          else if (view === 'admin' && user?.isAdmin) targetView = 'admin';
          else if (view === 'seller' && user?.isSeller) targetView = 'seller';
          else targetView = view;
          
          setCurrentView(targetView);
          pushToHistory(targetView);
        }}
      />
      

      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
