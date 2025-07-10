import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../context/CartContext';
import ImageGallery from './ImageGallery';
import ProductTabs from './ProductTabs';
import ProductRecommendations from './ProductRecommendations';
import StockNotification from './StockNotification';
import ReviewForm from './ReviewForm';
import StarRating from './StarRating';
import { API_CONFIG } from '../utils/apiConfig';

const ProductDetail = ({ productId, onBack, onProductClick, onBuyNow }) => {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(API_CONFIG.getUrl(`products/${productId}`));
      if (response.ok) {
        const data = await response.json();
        // Fetch reviews for this product
        const reviewsResponse = await fetch(API_CONFIG.getUrl(`reviews/${productId}`));
        if (reviewsResponse.ok) {
          const reviews = await reviewsResponse.json();
          data.reviews = reviews;
          data.reviewCount = reviews.length;
          data.avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 4;
        } else {
          data.reviews = [];
          data.reviewCount = 0;
          data.avgRating = 4;
        }
        setProduct(data);
      } else {
        setProduct({
          _id: productId,
          name: 'Premium Luxury Product',
          brand: 'Elite Brand',
          category: 'Fashion',
          price: 2999,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
          inStock: true,
          stock: 15,
          description: 'Experience luxury and sophistication with this premium product.',
          avgRating: 4,
          reviewCount: 0
        });
      }
    } catch (error) {
      setProduct({
        _id: productId,
        name: 'Premium Luxury Product',
        brand: 'Elite Brand',
        category: 'Fashion',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        inStock: true,
        stock: 15,
        description: 'Experience luxury and sophistication with this premium product.',
        avgRating: 4,
        reviewCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow({ ...product, quantity });
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return alert('Please login to add items to wishlist');
    
    try {
      await fetch(API_CONFIG.getUrl('wishlist'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton h-8 w-32 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton h-96 w-full"></div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-4 w-1/3"></div>
            <div className="skeleton h-6 w-1/4"></div>
            <div className="skeleton h-20 w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Product not found</h2>
        <button className="btn btn-primary" onClick={onBack}>← Back to Products</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="breadcrumbs text-sm mb-4 fade-in">
        <ul>
          <li><a className="text-primary hover:underline" onClick={onBack}>Home</a></li>
          <li className="text-primary">{product.category}</li>
          <li className="text-base-content/60">{product.name}</li>
        </ul>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
        <div className="lg:col-span-3 slide-up">
          <ImageGallery 
            images={product.images && product.images.length > 0 ? product.images : [product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=600&fit=crop']} 
            productName={product.name} 
          />
        </div>
        
        <div className="lg:col-span-2 space-y-6 fade-in lg:sticky lg:top-24 lg:self-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-primary font-medium">{product.brand}</span>
              <span className="text-sm text-base-content/60">SKU: {product._id}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black brand-name mb-4">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <StarRating rating={product.avgRating || product.rating || 4} size="sm" />
            <span className="text-sm text-base-content/60">({product.reviewCount || 0} reviews)</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-primary">₹{product.price}</span>
              <div className="badge badge-error">20% OFF</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {product.inStock ? (
              <div className="badge badge-success badge-lg">✓ In Stock</div>
            ) : (
              <div className="badge badge-error badge-lg">Out of Stock</div>
            )}
          </div>
          
          {product.inStock ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-sm btn-circle btn-outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
                    className="input input-bordered w-20 text-center"
                  />
                  <button 
                    className="btn btn-sm btn-circle btn-outline"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  className="btn btn-primary btn-lg w-full"
                  onClick={() => handleAddToCart()}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-outline btn-lg w-full"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
                <div className="flex gap-2">
                  {user && (
                    <button 
                      className="btn btn-outline flex-1"
                      onClick={() => handleAddToWishlist()}
                    >
                      ♡ Wishlist
                    </button>
                  )}
                  <button className="btn btn-outline flex-1">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <StockNotification productId={productId} inStock={product.inStock} />
          )}

          <div className="glass-effect p-4 rounded-xl">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ProductTabs 
        description={product.description}
        specifications={product.specifications}
        reviews={product.reviews || []}
      />
      
      {/* Review Form */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
        <ReviewForm 
          productId={productId} 
          onReviewSubmitted={() => fetchProduct()}
        />
      </div>
      
      <ProductRecommendations productId={productId} onProductClick={onProductClick || onBack} />
    </div>
  );
};

export default ProductDetail;