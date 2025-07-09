import React, { useState } from 'react';

const MobileFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  categories = [], 
  brands = [], 
  isOpen, 
  onClose,
  productCount = 0 
}) => {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 1000]);
  const [expandedSections, setExpandedSections] = useState({
    category: false,
    brand: false,
    price: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = value;
    setPriceRange(newRange);
    onFilterChange('minPrice', newRange[0]);
    onFilterChange('maxPrice', newRange[1]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.inStock) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Filter Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-base-100 rounded-t-2xl max-h-[75vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-200">
          <h3 className="text-lg font-semibold">
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </h3>
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quick Filters */}
        <div className="p-4 border-b border-base-200">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`btn btn-sm ${filters.inStock ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onFilterChange('inStock', !filters.inStock)}
            >
              In Stock
            </button>
            <button className="btn btn-sm btn-outline">On Sale</button>
            <button className="btn btn-sm btn-outline">Free Shipping</button>
            <button className="btn btn-sm btn-outline">New</button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4" style={{ maxHeight: 'calc(75vh - 140px)' }}>
          {/* Category Filter */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2"
              onClick={() => toggleSection('category')}
            >
              <span className="font-medium">Category</span>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.category && (
              <div className="space-y-2 mt-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      className="radio radio-primary radio-sm"
                      checked={filters.category === cat}
                      onChange={() => onFilterChange('category', cat)}
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2"
              onClick={() => toggleSection('brand')}
            >
              <span className="font-medium">Brand</span>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.brand ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.brand && (
              <div className="space-y-2 mt-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="brand"
                      className="radio radio-primary radio-sm"
                      checked={filters.brand === brand}
                      onChange={() => onFilterChange('brand', brand)}
                    />
                    <span className="text-sm">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <button 
              className="flex items-center justify-between w-full py-2"
              onClick={() => toggleSection('price')}
            >
              <span className="font-medium">Price Range</span>
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.price && (
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-base-content/60">Min</label>
                    <input
                      type="number"
                      className="input input-bordered input-sm w-full"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-base-content/60">Max</label>
                    <input
                      type="number"
                      className="input input-bordered input-sm w-full"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    className="range range-primary range-sm"
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    className="range range-primary range-sm"
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  />
                </div>
                <div className="flex justify-between text-xs text-base-content/60">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-base-200 bg-base-100">
          <div className="flex gap-3">
            <button 
              className="btn btn-outline flex-1"
              onClick={onClearFilters}
            >
              Clear All
            </button>
            <button 
              className="btn btn-primary flex-1"
              onClick={onClose}
            >
              Apply {productCount > 0 && `(${productCount})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;