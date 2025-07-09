import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

const ProductSlider = ({ products = [], title = "Featured Products", subtitle, loading = false, onProductClick, onBuyNow }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);
  const { addToCart } = useCart();

  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(4);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || products.length <= slidesToShow) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev >= products.length - slidesToShow ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length, slidesToShow]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev >= products.length - slidesToShow ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev <= 0 ? products.length - slidesToShow : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-base-100 to-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="skeleton h-12 w-64 mx-auto mb-4"></div>
            <div className="skeleton h-6 w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-80 w-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-base-100 to-base-200">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h2 className="text-4xl lg:text-5xl font-black brand-name mb-4">{title}</h2>
          <p className="text-xl text-base-content/70">{subtitle || "Discover our handpicked selection"}</p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative overflow-hidden rounded-2xl luxury-shadow"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={sliderRef}
        >
          {/* Slides */}
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`
            }}
          >
            {products.map((product, index) => (
              <div 
                key={product._id || index}
                className={`flex-shrink-0 p-3 ${
                  slidesToShow === 1 ? 'w-full' :
                  slidesToShow === 2 ? 'w-1/2' : 'w-1/4'
                }`}
              >
                <div 
                  className="glass-effect rounded-2xl overflow-hidden luxury-shadow-hover group cursor-pointer"
                  onClick={() => onProductClick?.(product._id)}
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && (
                        <span className="badge badge-primary badge-sm">New</span>
                      )}
                      {product.isTrending && (
                        <span className="badge badge-warning badge-sm">Trending</span>
                      )}
                      {product.stock < 5 && product.stock > 0 && (
                        <span className="badge badge-error badge-sm">Only {product.stock} Left</span>
                      )}
                    </div>

                    {/* Quick Actions */}


                    {/* Sticky CTA */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-primary btn-sm flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        {product.inStock && onBuyNow && (
                          <button 
                            className="btn btn-outline btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBuyNow(product);
                            }}
                          >
                            Buy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="breadcrumbs text-xs mb-2">
                      <ul>
                        <li className="text-primary">{product.category}</li>
                      </ul>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-base-content/60 mb-3">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                      <div className="rating rating-sm">
                        {[...Array(5)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            className="mask mask-star-2 bg-orange-400"
                            defaultChecked={i < Math.floor(product.avgRating || product.rating || 4)}
                            disabled
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md glass-effect md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm md:btn-md glass-effect md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: Math.max(1, products.length - slidesToShow + 1) }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-primary w-8' 
                  : 'bg-base-content/20 hover:bg-base-content/40'
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-base-content/10 rounded-full h-1 mt-4">
          <div 
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / Math.max(1, products.length - slidesToShow + 1)) * 100}%`
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;