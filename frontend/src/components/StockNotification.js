import React from 'react';
import { useAuth } from '../AuthContext';

const StockNotification = ({ productId, inStock }) => {
  const { user, token } = useAuth();

  const requestNotification = async () => {
    if (!user) {
      alert('Please login to get stock notifications');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stock-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        alert('You will be notified when this item is back in stock!');
      }
    } catch (error) {
      console.error('Error setting stock notification:', error);
    }
  };

  if (inStock) return null;

  return (
    <div>
      <p>This item is currently out of stock</p>
      <button onClick={requestNotification}>
        Notify me when available
      </button>
    </div>
  );
};

export default StockNotification;