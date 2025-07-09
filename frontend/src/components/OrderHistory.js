import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const OrderHistory = ({ onOrderClick }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let apiOrders = [];
      let localOrders = [];
      
      // Get orders from localStorage (from new checkout system)
      localOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      
      // Try to get orders from API if user is logged in
      if (user && token) {
        try {
          const response = await fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            apiOrders = await response.json();
          }
        } catch (error) {
          console.error('API orders fetch failed:', error);
        }
      }
      
      // Combine and deduplicate orders
      const allOrders = [...localOrders, ...apiOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => (o._id || o.orderId) === (order._id || order.orderId))
      );
      
      // Sort by date (newest first)
      uniqueOrders.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      
      setOrders(uniqueOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'badge-warning',
      'confirmed': 'badge-info', 
      'processing': 'badge-primary',
      'shipped': 'badge-secondary',
      'delivered': 'badge-success',
      'cancelled': 'badge-error'
    };
    return statusColors[status?.toLowerCase()] || 'badge-neutral';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': '⏳',
      'confirmed': '✅',
      'processing': '⚙️',
      'shipped': '🚚',
      'delivered': '📦',
      'cancelled': '❌'
    };
    return icons[status?.toLowerCase()] || '📋';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-base-content/70">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 fade-in">
        <h2 className="text-5xl lg:text-6xl font-black mb-6 brand-name">Order History</h2>
        <p className="text-xl text-base-content/70">Track all your purchases and orders</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="glass-effect p-12 rounded-2xl luxury-shadow max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto mb-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-2xl font-bold mb-4">No orders yet</h3>
            <p className="text-base-content/70 mb-6">Start shopping to see your order history here</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-medium">You have {orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            <button 
              onClick={fetchOrders}
              className="btn btn-outline btn-sm"
            >
              🔄 Refresh
            </button>
          </div>
          
          {orders.map(order => (
            <div key={order._id || order.orderId} className="card bg-base-100 shadow-xl luxury-shadow-hover">
              <div className="card-body">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="card-title text-xl mb-2">
                      {getStatusIcon(order.status || 'processing')} Order #{(order._id || order.orderId)?.slice(-8)}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-base-content/60">
                      <span>📅 {new Date(order.createdAt || order.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>💰 ₹{(order.total || order.orderTotal)?.toFixed(2)}</span>
                      <span>•</span>
                      <span>📦 {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4 lg:mt-0">
                    <div className={`badge ${getStatusColor(order.status || 'processing')} badge-lg`}>
                      {(order.status || 'Processing').toUpperCase()}
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => onOrderClick(order._id || order.orderId)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-base-content/80">Items Ordered:</h4>
                  <div className="grid gap-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={item._id || index} className="flex items-center gap-4 p-3 bg-base-200/30 rounded-lg">
                        <figure className="w-16 h-16">
                          <img 
                            src={item.productId?.image || item.image} 
                            alt={item.productId?.name || item.name} 
                            className="w-full h-full object-cover rounded-lg" 
                          />
                        </figure>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.productId?.name || item.name}</h5>
                          <p className="text-xs text-base-content/60">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-base-content/60">₹{item.price} each</p>
                        </div>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-base-content/60">
                          +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Delivery Address */}
                {(order.address || order.selectedAddress) && (
                  <div className="mt-4 p-3 bg-base-200/20 rounded-lg">
                    <h5 className="font-medium text-sm mb-2">📍 Delivery Address:</h5>
                    <p className="text-sm text-base-content/70">
                      {order.address?.fullName || order.selectedAddress?.fullName}<br/>
                      {order.address?.area || order.selectedAddress?.area}, {order.address?.city || order.selectedAddress?.city}<br/>
                      {order.address?.state || order.selectedAddress?.state} - {order.address?.pincode || order.selectedAddress?.pincode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;