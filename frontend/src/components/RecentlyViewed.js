import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const RecentlyViewed = ({ onProductClick }) => {
  const { user, token } = useAuth();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    if (user) fetchRecentlyViewed();
  }, [user]);

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recently-viewed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentProducts(data);
      }
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    }
  };

  if (!user || recentProducts.length === 0) return null;

  return (
    <div>
      <h3>Recently Viewed</h3>
      <div>
        {recentProducts.slice(0, 5).map(product => (
          <div key={product._id} onClick={() => onProductClick(product._id)}>
            <img src={product.image} alt={product.name} width="100" />
            <h5>{product.name}</h5>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;