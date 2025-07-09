import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { useOurCollection } from '../hooks/useOurCollection';

const OurCollection = ({ onProductClick, onBuyNow }) => {
  const { products, loading } = useOurCollection();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', priceRange: '', sortBy: 'relevance' });
  };

  const categories = [...new Set(products.map(p => p.category))];
  const priceRanges = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹5000', value: '1000-5000' },
    { label: 'Above ₹5000', value: '5000' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="skeleton h-16 w-96 mx-auto mb-4"></div>
          <div className="skeleton h-6 w-128 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-96 w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h1 className="text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Our Collection
        </h1>
        <p className="text-xl lg:text-2xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
          Curated products based on ratings, popularity, and freshness
        </p>
      </div>

      {/* Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-sm lg:hidden"
            >
              🔍 Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
            </button>
            <span className="text-sm text-base-content/60">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {Object.values(filters).some(Boolean) && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className={`${showFilters ? 'block' : 'hidden lg:block'} bg-base-200/30 rounded-xl p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Price Range Filter */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Price Range</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Sort By</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onProductClick={onProductClick}
            onBuyNow={onBuyNow}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && products.length > 0 && (
        <div className="text-center py-16">
          <h3 className="text-3xl font-bold mb-4">No products match your filters</h3>
          <p className="text-lg text-base-content/70 mb-4">Try adjusting your search criteria</p>
          <button onClick={clearFilters} className="btn btn-primary">
            Clear Filters
          </button>
        </div>
      )}
      
      {products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-3xl font-bold mb-4">No products found</h3>
          <p className="text-lg text-base-content/70">Check back later for new products</p>
        </div>
      )}
    </div>
  );
};

export default OurCollection;