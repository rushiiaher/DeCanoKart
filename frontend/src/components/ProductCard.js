import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from './StarRating';

const ProductCard = ({ product, onProductClick, onBuyNow, className = "" }) => {
  const { addToCart, buyNow } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product._id);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=320&fit=crop';
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    addToCart(product);
    setIsLoading(false);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const getStockStatus = () => {
    if (!product.inStock) return { color: 'text-error', text: 'Out of Stock', dot: 'bg-error' };
    if (product.stock <= 5) return { color: 'text-warning', text: `Only ${product.stock} left`, dot: 'bg-warning' };
    return { color: 'text-success', text: 'In Stock', dot: 'bg-success' };
  };

  const stockStatus = getStockStatus();
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div 
      className={`group relative rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border overflow-hidden ${className}`} 
      style={{ 
        backgroundColor: 'var(--color-background)', 
        borderColor: 'var(--color-border)' 
      }}
      onClick={() => onProductClick(product._id)}
    >
      {/* Sale Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 text-xs font-bold px-2 py-1 rounded border" style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'var(--color-background)',
          borderColor: 'var(--color-primary)'
        }}>
          -{discountPercent}%
        </div>
      )}
      
      {/* New Badge */}
      {product.isNew && (
        <div className="absolute top-3 right-3 z-10 text-xs font-bold px-2 py-1 rounded border" style={{ 
          backgroundColor: 'var(--color-background)', 
          color: 'var(--color-primary)',
          borderColor: 'var(--color-border)'
        }}>
          NEW
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <button 
              onClick={handleWishlist}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
            >
              <svg className={`w-5 h-5 transition-colors duration-200 ${isWishlisted ? 'text-error fill-current' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500 font-medium">
            {product.category}{product.subcategory && ` • ${product.subcategory}`}
          </div>
          <div className="text-xs text-gray-400 font-medium">{product.brand}</div>
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-semibold text-base leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.avgRating || product.rating || 4} size="sm" />
          <span className="text-sm text-gray-500">({product.reviewCount || product.reviews || 0})</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>₹{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm line-through" style={{ color: 'var(--color-text-muted)' }}>₹{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {!product.inStock ? '✕ Out of Stock' : 
             product.stock <= 5 ? `! Only ${product.stock} left` : 
             '✓ In Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {product.inStock ? (
            <>
              <button 
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full btn-minimal-primary font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="loading loading-spinner loading-sm"></div>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8m0-8L17 21" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full btn-minimal-secondary font-medium py-2.5 px-4 rounded-xl"
              >
                Buy Now
              </button>
            </>
          ) : (
            <button className="w-full font-medium py-3 px-4 rounded-xl cursor-not-allowed opacity-50" style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)'
            }} disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;