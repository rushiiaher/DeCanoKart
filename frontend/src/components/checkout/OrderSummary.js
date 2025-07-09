import React from 'react';

const OrderSummary = ({ checkoutData, nextStep, prevStep }) => {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

          {/* Delivery Address */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium mb-2">Delivery Address</h3>
                <p className="font-medium">{checkoutData.selectedAddress?.fullName}</p>
                <p className="text-gray-600 text-sm">
                  {checkoutData.selectedAddress?.house}, {checkoutData.selectedAddress?.area}
                </p>
                <p className="text-gray-600 text-sm">
                  {checkoutData.selectedAddress?.city}, {checkoutData.selectedAddress?.state} - {checkoutData.selectedAddress?.pincode}
                </p>
                <p className="text-gray-600 text-sm">Mobile: {checkoutData.selectedAddress?.mobile}</p>
              </div>
              <button
                onClick={prevStep}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Change
              </button>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {checkoutData.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    <p className="text-green-600 text-sm">
                      ✓ Estimated delivery: {estimatedDelivery.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Special Instructions (Optional)</h3>
            <textarea
              placeholder="Any special delivery instructions..."
              className="w-full px-3 py-2 border rounded-lg resize-none"
              rows="3"
            />
          </div>

          {/* Gift Options */}
          <div className="mb-6 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">🎁 Gift Wrap</h3>
                <p className="text-sm text-gray-600">Make it special with gift wrapping</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">₹50</span>
                <input type="checkbox" />
              </div>
            </div>
          </div>

          {/* Order Policies */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Free delivery on orders above ₹500</p>
            <p>• 7-day return policy</p>
            <p>• 100% authentic products</p>
            <p>• Secure payments</p>
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Price Details</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Price ({checkoutData.items.length} items)</span>
              <span>₹{checkoutData.totals?.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span className="text-green-600">
                {checkoutData.totals?.shipping === 0 ? 'FREE' : `₹${checkoutData.totals?.shipping}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{checkoutData.totals?.tax.toFixed(2)}</span>
            </div>
            {checkoutData.totals?.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{checkoutData.totals?.discount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>₹{checkoutData.orderTotal?.toFixed(2)}</span>
            </div>
          </div>

          {/* Savings */}
          {checkoutData.totals?.discount > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium text-sm">
                🎉 You will save ₹{checkoutData.totals?.discount.toFixed(2)} on this order
              </p>
            </div>
          )}

          {/* Continue Button */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Continue
            </button>
          </div>

          {/* Trust Signals */}
          <div className="mt-4 text-center">
            <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
              <span>🔒 Secure</span>
              <span>✓ Authentic</span>
              <span>📞 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;