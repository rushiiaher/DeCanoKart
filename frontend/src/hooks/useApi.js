import { useState, useEffect } from 'react';
import { API_CONFIG } from '../utils/apiConfig';

export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_CONFIG.getUrl(endpoint));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const response = await fetch(API_CONFIG.getUrl(`products?${params}`));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
        
        // Fallback to mock data
        setProducts(getMockProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
};

// Mock data fallback
const getMockProducts = () => [
  {
    _id: '1',
    name: 'Premium Wireless Headphones',
    brand: 'Sony',
    category: 'Electronics',
    subcategory: 'Headphones',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    inStock: true,
    stock: 15
  },
  {
    _id: '2',
    name: 'Luxury Watch Collection',
    brand: 'Rolex',
    category: 'Fashion',
    subcategory: 'Accessories',
    price: 2499.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    inStock: true,
    stock: 5
  },
  {
    _id: '3',
    name: 'Designer Leather Handbag',
    brand: 'Gucci',
    category: 'Fashion',
    subcategory: 'Accessories',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    inStock: true,
    stock: 8
  },
  {
    _id: '4',
    name: 'Smart Fitness Tracker',
    brand: 'Apple',
    category: 'Electronics',
    subcategory: 'Wearables',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    inStock: true,
    stock: 25
  },
  {
    _id: '5',
    name: 'Premium Coffee Machine',
    brand: 'Breville',
    category: 'Home & Garden',
    subcategory: 'Kitchen',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    inStock: true,
    stock: 12
  },
  {
    _id: '6',
    name: 'Luxury Silk Scarf',
    brand: 'Hermès',
    category: 'Fashion',
    subcategory: 'Accessories',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    inStock: false,
    stock: 0
  },
  {
    _id: '7',
    name: 'Professional Camera Lens',
    brand: 'Canon',
    category: 'Electronics',
    subcategory: 'Photography',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop',
    inStock: true,
    stock: 7
  },
  {
    _id: '8',
    name: 'Artisan Ceramic Vase',
    brand: 'Local Artisan',
    category: 'Home & Garden',
    subcategory: 'Decor',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    inStock: true,
    stock: 3
  }
];

export default useApi;