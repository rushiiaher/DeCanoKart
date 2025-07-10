import { useState, useEffect } from 'react';
import { API_CONFIG } from '../utils/apiConfig';

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_CONFIG.getUrl('featured-products'));
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        // Fallback to regular products if featured fails
        const fallbackResponse = await fetch(API_CONFIG.getUrl('products'));
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData.slice(0, 6));
        } else {
          setProducts([]);
        }
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      // Try to get any products as fallback
      try {
        const fallbackResponse = await fetch(API_CONFIG.getUrl('products'));
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData.slice(0, 6));
        } else {
          setProducts([]);
        }
      } catch (fallbackErr) {
        setProducts([]);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchFeaturedProducts };
};