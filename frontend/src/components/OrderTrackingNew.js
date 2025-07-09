import React, { useState, useEffect } from 'react';

const OrderTrackingNew = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [trackingSteps] = useState([
    { id: 1, title: 'Order Confirmed', description: 'Your order has been placed', completed: true },
    { id: 2, title: 'Processing', description: 'Your order is being prepared', completed: true },
    { id: 3, title: 'Shipped', description: 'Your order has been shipped', completed: false },
    { id: 4, title: 'Out for Delivery', description: 'Your order is out for delivery', completed: false },
    { id: 5, title: 'Delivered', description: 'Your order has been delivered', completed: false }
  ]);

  useEffect(() => {
    // Load order from localStorage
    const orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    const foundOrder = orders.find(o => o.orderId === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-4">We couldn't find an order with ID: {orderId}</p>
          <button onClick={onBack} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Track Your Order</h1>
          <button onClick={onBack} className="text-blue-600 hover:text-blue-800">
            ← Back
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order ID</h3>
            <p className="text-sm text-gray-600">{order.orderId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order Date</h3>
            <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Total Amount</h3>
            <p className="text-sm text-gray-600">₹{order.total?.toFixed(2)}</p>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="relative">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.completed ? '✓' : step.id}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`absolute left-4 w-0.5 h-6 mt-8 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{ top: `${index * 96 + 32}px` }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Delivery Address</h3>
          <p className="text-sm text-gray-600">
            {order.address?.fullName}<br />
            {order.address?.house}, {order.address?.area}<br />
            {order.address?.city}, {order.address?.state} - {order.address?.pincode}<br />
            Mobile: {order.address?.mobile}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingNew;