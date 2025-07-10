import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { API_CONFIG } from '../utils/apiConfig';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      if (state.items.find(item => item._id === action.payload._id)) {
        return state;
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: []
      };

    case 'LOAD_WISHLIST':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  // Load wishlist from API or localStorage on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(API_CONFIG.getUrl('wishlist'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const wishlistData = await response.json();
          dispatch({ type: 'LOAD_WISHLIST', payload: wishlistData.productIds || [] });
        }
      } catch (error) {
        console.error('Error loading wishlist from API:', error);
        // Fallback to localStorage
        const savedWishlist = localStorage.getItem('luxe-wishlist');
        if (savedWishlist) {
          dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
        }
      }
    } else {
      // Load from localStorage for guest users
      const savedWishlist = localStorage.getItem('luxe-wishlist');
      if (savedWishlist) {
        dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
      }
    }
  };

  // Save wishlist to localStorage for guest users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('luxe-wishlist', JSON.stringify(state.items));
    }
  }, [state.items]);

  const addToWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(API_CONFIG.getUrl('wishlist'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product._id })
        });
      } catch (error) {
        console.error('Error adding to wishlist:', error);
      }
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(API_CONFIG.getUrl(`wishlist/${productId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const clearWishlist = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Clear each item from database
        for (const item of state.items) {
          await fetch(API_CONFIG.getUrl(`wishlist/${item._id}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
    dispatch({ type: 'CLEAR_WISHLIST' });
  };

  const isInWishlist = (productId) => {
    return state.items.some(item => item._id === productId);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    items: state.items,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};