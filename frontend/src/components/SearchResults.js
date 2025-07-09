import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

const SearchResults = ({ searchQuery, onProductClick, onBack }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 50000,
    rating: 0,
    inStock: false
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(searchQuery);
  const priceTimeoutRef = useRef(null);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters, sortBy]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        q: searchQuery,
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.rating && { rating: filters.rating }),
        ...(filters.inStock && { inStock: 'true' }),
        sortBy: sortBy
      });

      const response = await fetch(`http://localhost:5000/api/search?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.products || data || []);
      } else {
        throw new Error(`Search API failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock results
      const mockResults = [
        { _id: '1', name: 'Premium Leather Handbag', price: 4500, originalPrice: 5500, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', category: 'Fashion', brand: 'Luxury Co', rating: 4.5, reviews: 89, inStock: true, stock: 12 },
        { _id: '2', name: 'Designer Crossbody Bag', price: 3200, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Fashion', brand: 'Style House', rating: 4.3, reviews: 156, inStock: true, stock: 8 },
        { _id: '3', name: 'Smartphone Pro Max', price: 45999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', category: 'Electronics', brand: 'TechCorp', rating: 4.7, reviews: 234, inStock: true, stock: 25 }
      ].filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(mockResults);
    } finally {
      setLoading(false);
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
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 50000,
      rating: 0,
      inStock: false
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== 0 && value !== false && value !== 50000
    ).length;
  };

  const categories = ['Fashion', 'Business', 'Casual', 'Sports'];
  const brands = ['Luxury Co', 'Style House', 'Heritage', 'Urban Style', 'Professional', 'Everyday'];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Search Header */}
      <div className="border-b border-base-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-base-content/60 hover:text-base-content mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to shopping
          </button>
          
          <h1 className="text-3xl font-light text-base-content mb-2">
            Search results for "{searchQuery}"
          </h1>
          <p className="text-base-content/60">{results.length} products found</p>
          
          {/* Persistent Search Bar */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <input 
                type="text" 
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentQuery(currentQuery);
                    performSearch();
                  }
                }}
                className="w-full px-4 py-3 pr-12 border border-base-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-base-100 text-base-content"
                placeholder="Refine your search..."
              />
              <button 
                onClick={() => setCurrentQuery('')}
                className="absolute right-3 top-3 text-base-content/40 hover:text-base-content/60 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="btn btn-outline btn-sm lg:hidden"
              >
                🔍 Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
              </button>
              <span className="text-sm text-base-content/60">
                {results.length} products found
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {getActiveFilterCount() > 0 && (
                <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Desktop Filters */}
          <div className={`${showMobileFilters ? 'block' : 'hidden lg:block'} bg-base-200/30 rounded-xl p-6`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Brand</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Price Range</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    handleFilterChange('minPrice', min || 0);
                    handleFilterChange('maxPrice', max || 50000);
                  }}
                >
                  <option value="">All Prices</option>
                  <option value="0-500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-5000">₹1000 - ₹5000</option>
                  <option value="5000">Above ₹5000</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Sort By</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Best Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">

          {/* Results Section */}
          <main className="flex-1">


            {/* Results Grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map(product => (
                  <ProductCard 
                    key={product._id}
                    product={product}
                    onProductClick={onProductClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <svg className="w-16 h-16 mx-auto mb-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-2xl font-light text-base-content mb-4">No products found</h2>
                <p className="text-base-content/60 mb-8">Try adjusting your filters or search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;