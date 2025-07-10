import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { API_CONFIG } from '../utils/apiConfig';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from API or localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(API_CONFIG.getUrl('cart'), {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const cartData = await response.json();
          const items = cartData.items?.map(item => ({
            ...item.productId,
            quantity: item.quantity
          })) || [];
          dispatch({ type: 'LOAD_CART', payload: items });
        }
      } catch (error) {
        console.error('Error loading cart from API:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('luxe-cart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      }
    } else {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('luxe-cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    }
  };

  // Save cart to localStorage for guest users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.setItem('luxe-cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(API_CONFIG.getUrl('cart'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product._id, quantity: 1 })
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(API_CONFIG.getUrl(`cart/${productId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    }
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Remove old item and add new with updated quantity
        await fetch(API_CONFIG.getUrl(`cart/${productId}`), {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetch(API_CONFIG.getUrl('cart'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });
      } catch (error) {
        console.error('Error updating cart quantity:', error);
      }
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Clear each item from database
        for (const item of state.items) {
          await fetch(API_CONFIG.getUrl(`cart/${item._id}`), {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const buyNow = (product) => {
    // Create temporary cart with single item for buy now
    return [{ ...product, quantity: 1 }];
  };

  const value = {
    items: state.items,
    cartItems: state.items, // Alias for compatibility
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    buyNow
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};