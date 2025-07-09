import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import LoadingSkeleton from './LoadingSkeleton';
import MobileFilters from './MobileFilters';
import { useProducts, useApi } from '../hooks/useApi';

const ProductList = ({ products: propProducts, loading: propLoading, title = "Our Collection", subtitle, onProductClick, onBuyNow }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [subcategories, setSubcategories] = useState([]);
  const priceTimeoutRef = useRef(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use custom hooks for data fetching or props
  const { products: apiProducts, loading: apiLoading } = useProducts(filters);
  const products = propProducts || apiProducts;
  const loading = propLoading !== undefined ? propLoading : apiLoading;
  const { data: categories } = useApi('/categories', []);
  const { data: brands } = useApi('/brands', []);

  useEffect(() => {
    if (filters.category) {
      fetchSubcategories(filters.category);
    } else {
      setSubcategories([]);
    }
  }, [filters.category]);

  const fetchSubcategories = async (category) => {
    try {
      const response = await fetch(`http://localhost:5000/api/subcategories/${category}`);
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      const mockSubcategories = {
        'Electronics': ['Smartphones', 'Laptops', 'Headphones'],
        'Fashion': ['Clothing', 'Shoes', 'Accessories'],
        'Home & Garden': ['Furniture', 'Decor', 'Kitchen'],
        'Sports': ['Fitness', 'Outdoor', 'Team Sports'],
        'Books': ['Fiction', 'Non-Fiction', 'Educational']
      };
      setSubcategories(mockSubcategories[category] || []);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: parseInt(value) };
    setPriceRange(newRange);
    
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }
    
    priceTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        minPrice: newRange.min,
        maxPrice: newRange.max
      }));
    }, 300);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subcategory: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-5xl lg:text-6xl font-black mb-6 brand-name">Our Collection</h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">Discover premium products crafted for excellence and designed for the modern lifestyle</p>
        </div>
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  return (
    <div id="products" className="container mx-auto px-4 py-8">
      {/* Premium Hero Section */}
      <div className="text-center mb-16 fade-in">
        <h1 className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style={{fontFamily: 'Playfair Display, serif'}}>
          {title}
        </h1>
        <p className="text-xl lg:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
          {subtitle || "Discover premium products crafted for excellence and designed for the modern lifestyle"}
        </p>
      </div>
      
      {/* Mobile Filter Button */}
      {!propProducts && <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            className="btn btn-primary gap-2"
            onClick={() => setShowMobileFilters(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {(filters.category || filters.brand || filters.inStock || filters.minPrice || filters.maxPrice) && (
              <span className="badge badge-accent badge-sm">•</span>
            )}
          </button>
          <div className="text-sm text-base-content/60">
            {products.length} products
          </div>
        </div>
        
        {/* Active Filters Pills */}
        {(filters.category || filters.brand || filters.inStock) && (
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <div className="badge badge-primary gap-1">
                {filters.category}
                <button onClick={() => handleFilterChange('category', '')}>
                  ×
                </button>
              </div>
            )}
            {filters.brand && (
              <div className="badge badge-primary gap-1">
                {filters.brand}
                <button onClick={() => handleFilterChange('brand', '')}>
                  ×
                </button>
              </div>
            )}
            {filters.inStock && (
              <div className="badge badge-primary gap-1">
                In Stock
                <button onClick={() => handleFilterChange('inStock', false)}>
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>}

      {/* Desktop Layout with Sidebar */}
      {!propProducts && <div className="hidden lg:flex gap-8">
        {/* Left Sidebar Filters */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-32">
            <div className="bg-base-100 rounded-xl shadow-lg border border-base-200/50 p-4">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    className="select select-bordered w-full select-sm"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {(categories || ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books']).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Brand</label>
                  <select
                    className="select select-bordered w-full select-sm"
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                  >
                    <option value="">All Brands</option>
                    {(brands || ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG']).map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>₹{priceRange.min}</span>
                      <span>₹{priceRange.max}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="range range-primary range-sm w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="range range-primary range-sm w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <label className="cursor-pointer label justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                    <span className="text-sm">In Stock Only</span>
                  </label>
                </div>

                <button 
                  onClick={clearFilters}
                  className="btn btn-outline btn-sm w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Count & Sort */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-base-content/70">
              Showing <span className="font-semibold text-base-content">{products.length}</span> products
            </p>
            <select className="select select-bordered select-sm">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onProductClick={onProductClick}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        </div>
      </div>}

      {/* Product Grid */}
      <div className={`grid gap-6 ${propProducts ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'lg:hidden grid-cols-1 sm:grid-cols-2'}`}>
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onProductClick={onProductClick}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-3xl font-bold mb-4">No products found</h3>
          <p className="text-lg text-base-content/70">Try adjusting your filters or search terms</p>
        </div>
      )}
      
      {/* Mobile Filters Modal */}
      <MobileFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        categories={categories || ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books']}
        brands={brands || ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG']}
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        productCount={products.length}
      />
    </div>
  );
};

export default ProductList;