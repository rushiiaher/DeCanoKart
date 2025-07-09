import React, { useState, useEffect } from 'react';

const OrderTracking = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) fetchOrder();
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

  const getOrderSteps = () => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', icon: '✓' },
      { key: 'processing', label: 'Processing', icon: '⚙️' },
      { key: 'shipped', label: 'Shipped', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '📦' }
    ];

    const statusOrder = ['confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  if (loading) return <div>Loading order details...</div>;
  if (!order) return <div>Order not found</div>;

  const steps = getOrderSteps();

  return (
    <div>
      <h2>Order Tracking</h2>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${order.total}</p>

      <div style={{ margin: '20px 0' }}>
        <h3>Order Status</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {steps.map((step, index) => (
            <div key={step.key} style={{ textAlign: 'center', flex: 1 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step.completed ? '#4CAF50' : '#ddd',
                  color: step.completed ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px',
                  fontSize: '18px'
                }}
              >
                {step.completed ? '✓' : step.icon}
              </div>
              <p style={{ 
                fontSize: '12px', 
                color: step.active ? '#4CAF50' : step.completed ? '#333' : '#999',
                fontWeight: step.active ? 'bold' : 'normal'
              }}>
                {step.label}
              </p>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    width: '100%',
                    height: '2px',
                    backgroundColor: step.completed ? '#4CAF50' : '#ddd',
                    zIndex: -1
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>Order Items</h3>
        {order.items.map(item => (
          <div key={item._id} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
            <img src={item.productId.image} alt={item.productId.name} width="60" />
            <div style={{ marginLeft: '15px' }}>
              <h4>{item.productId.name}</h4>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {order.guestInfo && (
        <div>
          <h3>Delivery Information</h3>
          <p><strong>Name:</strong> {order.guestInfo.name}</p>
          <p><strong>Email:</strong> {order.guestInfo.email}</p>
          <p><strong>Address:</strong> {order.guestInfo.address}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;