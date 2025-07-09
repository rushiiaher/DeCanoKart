import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = ({ onCheckout }) => {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h2 className="text-5xl lg:text-6xl font-black mb-6 brand-name">Shopping Cart</h2>
        <p className="text-xl text-base-content/70">Review your selected items</p>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass-effect p-12 rounded-2xl luxury-shadow max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto mb-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8m0-8L17 21" />
            </svg>
            <h3 className="text-2xl font-bold mb-4">Your cart is empty</h3>
            <p className="text-base-content/70 mb-6">Add some luxury items to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item._id} className="card bg-base-100 shadow-xl luxury-shadow-hover">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <figure className="w-20 h-20">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    </figure>
                    <div className="flex-1">
                      <h3 className="card-title text-lg">{item.name}</h3>
                      <p className="text-sm text-base-content/60">{item.brand}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <button 
                            className="btn btn-sm btn-circle btn-outline"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            className="btn btn-sm btn-circle btn-outline"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xl font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          className="btn btn-sm btn-error btn-outline ml-auto"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl luxury-shadow sticky top-24">
              <div className="card-body">
                <h3 className="card-title text-2xl mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <button 
                    className="btn btn-primary w-full btn-lg"
                    onClick={() => onCheckout()}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    className="btn btn-outline w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;