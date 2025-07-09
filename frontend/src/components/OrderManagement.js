import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const OrderManagement = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div>
      <h3>Order Management</h3>
      {orders.map(order => (
        <div key={order._id}>
          <h4>Order #{order._id}</h4>
          <p>Customer: {order.userId?.name || order.guestInfo?.name}</p>
          <p>Email: {order.userId?.email || order.guestInfo?.email}</p>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          
          <div>
            <h5>Items:</h5>
            {order.items.map(item => (
              <p key={item._id}>
                {item.productId?.name} x {item.quantity} - ${item.price * item.quantity}
              </p>
            ))}
          </div>
          
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default OrderManagement;