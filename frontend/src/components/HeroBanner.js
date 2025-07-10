import React, { useState, useEffect } from 'react';
// Fixed images for production deployment

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
      title: 'Premium Collection',
      subtitle: 'Discover luxury products crafted for excellence',
      buttonText: 'Shop Now',
      buttonLink: '#products'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop',
      title: 'Exclusive Deals',
      subtitle: 'Up to 50% off on selected items',
      buttonText: 'Explore Deals',
      buttonLink: '#products'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop',
      title: 'New Arrivals',
      subtitle: 'Latest trends and fashion essentials',
      buttonText: 'View Collection',
      buttonLink: '#products'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=600&fit=crop',
      title: 'Free Shipping',
      subtitle: 'On orders above ₹999 across India',
      buttonText: 'Start Shopping',
      buttonLink: '#products'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, banners.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] overflow-hidden rounded-xl md:rounded-2xl luxury-shadow">
      {/* Banner Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="w-full h-full flex-shrink-0 relative bg-gradient-to-r from-primary/20 to-secondary/20"
          >
            {/* Background Image */}
            <img 
              src={banner.image}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.7)' }}
              onError={(e) => {
                console.error('Image failed to load:', banner.image);
                e.target.style.display = 'none';
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl lg:max-w-2xl text-white">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black brand-name mb-3 md:mb-4 slide-up">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 text-white/90 slide-up">
                    {banner.subtitle}
                  </p>
                  <a
                    href={banner.buttonLink}
                    className="btn btn-primary btn-md md:btn-lg px-6 md:px-8 py-2 md:py-3 text-sm md:text-base lg:text-lg font-semibold hover:scale-105 transition-transform duration-300 slide-up"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('products')?.scrollIntoView({behavior: 'smooth'});
                    }}
                  >
                    {banner.buttonText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invisible Click Areas for Navigation */}
      <div 
        className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      />
      
      <div 
        className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      />

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white w-6 sm:w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Swipe Indicators */}
      <div className="sm:hidden absolute bottom-3 right-3 bg-black/50 rounded-full px-2 py-1">
        <span className="text-white text-xs">
          {currentSlide + 1} / {banners.length}
        </span>
      </div>
    </section>
  );
};

export default HeroBanner;