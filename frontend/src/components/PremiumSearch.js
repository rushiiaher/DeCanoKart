import React, { useState, useEffect, useRef, useCallback } from 'react';

const PremiumSearch = ({ onProductClick, onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['smartphones', 'headphones', 'watches']);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300),
    []
  );

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        const products = data.products || data || [];
        setResults(products.slice(0, 8));
        setShowResults(true);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to mock results when API fails
      const mockResults = [
        { _id: '1', name: 'Premium Smartphone', price: 45999, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100', category: 'Electronics' },
        { _id: '2', name: 'Designer Watch', price: 12999, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100', category: 'Fashion' },
        { _id: '3', name: 'Wireless Headphones', price: 8999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', category: 'Electronics' }
      ].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setResults(mockResults);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
    if (value.trim()) {
      setShowResults(true);
    }
  };

  const handleSearchSubmit = (searchTerm = query) => {
    if (searchTerm.trim() && onSearch) {
      const term = searchTerm.trim();
      if (!recentSearches.includes(term)) {
        setRecentSearches(prev => [term, ...prev.slice(0, 4)]);
      }
      onSearch(term);
      setShowResults(false);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() || recentSearches.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = (productId) => {
    const searchTerm = query.trim();
    if (searchTerm && !recentSearches.includes(searchTerm)) {
      setRecentSearches(prev => [searchTerm, ...prev.slice(0, 4)]);
    }
    setQuery('');
    setShowResults(false);
    onProductClick(productId);
  };

  const handleRecentSearch = (term) => {
    setQuery(term);
    debouncedSearch(term);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Search products..." 
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
          className="input input-bordered w-80 pl-12 pr-10 py-2 rounded-full bg-base-100/50 backdrop-blur-sm border-base-300/50 focus:border-primary focus:bg-base-100 transition-all duration-300 focus:w-96 focus:shadow-lg"
        />
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {query && (
          <button 
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-base-200 rounded-full p-1 transition-colors duration-200"
          >
            <svg className="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="loading loading-spinner loading-sm text-primary"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-base-100/95 backdrop-blur-md border border-base-200/50 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <>
              <div className="p-3 border-b border-base-200/50">
                <p className="text-sm text-base-content/60">Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
              </div>
              {results.map((product) => (
                <div 
                  key={product._id}
                  onClick={() => handleResultClick(product._id)}
                  className="flex items-center gap-3 p-3 hover:bg-primary/5 cursor-pointer transition-colors duration-200 border-b border-base-200/30 last:border-b-0"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-xs text-base-content/60">{product.category}</p>
                    <p className="text-sm font-bold text-primary">₹{product.price}</p>
                  </div>
                  <svg className="h-4 w-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
              {results.length >= 8 && (
                <div className="p-3 text-center border-t border-base-200/50">
                  <button 
                    onClick={() => handleSearchSubmit()}
                    className="text-sm text-primary hover:underline"
                  >
                    View all results
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 text-center">
              <svg className="h-12 w-12 mx-auto mb-3 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-base-content/60">No products found for "{query}"</p>
              <p className="text-xs text-base-content/40 mt-1">Try different keywords</p>
              <button 
                onClick={() => handleSearchSubmit()}
                className="mt-3 text-sm text-primary hover:underline"
              >
                View full search results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumSearch;