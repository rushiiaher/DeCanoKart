import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';

const OrderConfirmation = ({ checkoutData }) => {
  const { clearCart } = useCart();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  useEffect(() => {
    // Clear cart after successful order
    clearCart();
    
    // Save order to localStorage for order history
    const order = {
      _id: checkoutData.orderId,
      orderId: checkoutData.orderId,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      items: checkoutData.items?.map(item => ({
        _id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        productId: {
          _id: item._id,
          name: item.name,
          image: item.image
        }
      })) || [],
      total: checkoutData.orderTotal,
      orderTotal: checkoutData.orderTotal,
      address: checkoutData.selectedAddress,
      selectedAddress: checkoutData.selectedAddress,
      payment: checkoutData.paymentMethod,
      paymentMethod: checkoutData.paymentMethod,
      status: 'Processing'
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
  }, [checkoutData, clearCart]);

  const handleTrackOrder = () => {
    // Use callback to navigate to order tracking
    if (window.navigateToOrderTracking) {
      window.navigateToOrderTracking(checkoutData.orderId);
    }
  };

  const handleContinueShopping = () => {
    // Use callback to navigate to products
    if (window.navigateToProducts) {
      window.navigateToProducts();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
              <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{checkoutData.orderId}</span></p>
              <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
              <p className="text-sm text-gray-600">Total: <span className="font-medium">₹{checkoutData.orderTotal?.toFixed(2)}</span></p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Delivery Information</h3>
              <p className="text-sm text-gray-600">
                Estimated Delivery: <span className="font-medium text-green-600">{estimatedDelivery.toLocaleDateString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Address: <span className="font-medium">{checkoutData.selectedAddress?.area}, {checkoutData.selectedAddress?.city}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="text-left mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Items Ordered ({checkoutData.items.length})</h3>
          <div className="space-y-3">
            {checkoutData.items.map((item) => (
              <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="text-left mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
          <p className="text-sm text-gray-600 capitalize">
            {checkoutData.paymentMethod?.method === 'cod' ? 'Cash on Delivery' : checkoutData.paymentMethod?.method}
          </p>
          {checkoutData.paymentMethod?.method === 'cod' && (
            <p className="text-xs text-orange-600 mt-1">
              Please keep ₹{checkoutData.orderTotal?.toFixed(2)} ready for delivery
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTrackOrder}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Track Your Order
          </button>
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-xs text-gray-500 space-y-1">
          <p>📧 Order confirmation sent to your email</p>
          <p>📱 SMS updates will be sent to your mobile number</p>
          <p>🔄 You can track your order anytime from your account</p>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
          <p className="text-sm text-gray-600 mb-3">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <button className="text-blue-600 hover:text-blue-800">📞 Call Support</button>
            <button className="text-blue-600 hover:text-blue-800">💬 Live Chat</button>
            <button className="text-blue-600 hover:text-blue-800">📧 Email Us</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;