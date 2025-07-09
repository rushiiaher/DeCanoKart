import React, { useState } from 'react';

const CartReview = ({ checkoutData, updateCheckoutData, nextStep }) => {
  const [couponCode, setCouponCode] = useState('');
  const [pincode, setPincode] = useState('');

  const calculateTotals = () => {
    const subtotal = checkoutData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18;
    const discount = couponCode === 'SAVE10' ? subtotal * 0.1 : 0;
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, discount, total };
  };

  const totals = calculateTotals();

  const handleProceedToCheckout = () => {
    updateCheckoutData({ orderTotal: totals.total, totals });
    nextStep();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
          
          {checkoutData.items.map((item) => (
            <div key={item._id} className="flex items-center py-4 border-b">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-500">₹{item.price} each</p>
              </div>
            </div>
          ))}

          {/* Coupon Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Apply Coupon</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Apply
              </button>
            </div>
            {couponCode === 'SAVE10' && (
              <p className="text-green-600 text-sm mt-2">✓ 10% discount applied!</p>
            )}
          </div>

          {/* Pincode Check */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Check Delivery</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Check
              </button>
            </div>
            {pincode && (
              <p className="text-green-600 text-sm mt-2">✓ Delivery available in 2-3 days</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Price Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({checkoutData.items.length} items)</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className={totals.shipping === 0 ? 'text-green-600' : ''}>
                {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{totals.tax.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{totals.discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Proceed to Checkout
          </button>

          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>✓ Safe and Secure Payments</p>
            <p>✓ Easy Returns & Refunds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartReview;