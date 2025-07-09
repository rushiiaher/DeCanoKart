import { useState, useEffect } from 'react';

export const useOurCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOurCollection();
  }, []);

  const fetchOurCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/our-collection');
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        // Fallback to regular products if collection fails
        const fallbackResponse = await fetch('http://localhost:5000/api/products');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData.slice(0, 20));
        } else {
          setProducts([]);
        }
      }
    } catch (err) {
      console.error('Error fetching our collection:', err);
      // Try to get any products as fallback
      try {
        const fallbackResponse = await fetch('http://localhost:5000/api/products');
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData.slice(0, 20));
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

  return { products, loading, error, refetch: fetchOurCollection };
};