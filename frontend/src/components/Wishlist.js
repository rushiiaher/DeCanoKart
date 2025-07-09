import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const Wishlist = ({ onProductClick }) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-5xl lg:text-6xl font-black mb-6 brand-name">My Wishlist</h2>
          <p className="text-xl text-base-content/70">Your favorite items saved for later</p>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass-effect p-12 rounded-2xl luxury-shadow max-w-md mx-auto">
              <svg className="w-24 h-24 mx-auto mb-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-2xl font-bold mb-4">Your wishlist is empty</h3>
              <p className="text-base-content/70 mb-6">Add some items you love to get started</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg">You have {items.length} items in your wishlist</p>
              <button 
                onClick={clearWishlist}
                className="btn btn-outline btn-sm"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(product => (
                <div key={product._id} className="card bg-base-100 shadow-xl luxury-shadow-hover">
                  <figure className="aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </figure>
                  <div className="card-body p-4">
                    <h3 className="card-title text-base">{product.name}</h3>
                    <p className="text-sm text-base-content/60">{product.brand}</p>
                    <p className="text-xl font-bold text-primary">₹{product.price}</p>
                    <div className="card-actions justify-between mt-4">
                      <button 
                        onClick={() => onProductClick(product._id)}
                        className="btn btn-sm btn-outline flex-1 mr-2"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => addToCart(product)}
                        className="btn btn-sm btn-primary flex-1 mr-2"
                      >
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => removeFromWishlist(product._id)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;