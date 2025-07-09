import React, { useState, useEffect } from 'react';

const OrderConfirmation = ({ orderId, onTrackOrder }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Total:</strong> ${order.total}</p>
      <p><strong>Status:</strong> {order.status}</p>
      
      <h3>Items Ordered:</h3>
      {order.items.map(item => (
        <div key={item.productId._id}>
          <p>{item.productId.name} x {item.quantity} - ${item.price * item.quantity}</p>
        </div>
      ))}
      
      {order.guestInfo && (
        <div>
          <h3>Delivery Information:</h3>
          <p><strong>Name:</strong> {order.guestInfo.name}</p>
          <p><strong>Email:</strong> {order.guestInfo.email}</p>
          <p><strong>Address:</strong> {order.guestInfo.address}</p>
        </div>
      )}
      
      <p>A confirmation email has been sent to your email address.</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => onTrackOrder && onTrackOrder(orderId)}>Track Your Order</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;