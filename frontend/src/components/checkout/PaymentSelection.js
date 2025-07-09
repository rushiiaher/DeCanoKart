import React, { useState } from 'react';

const PaymentSelection = ({ checkoutData, updateCheckoutData, nextStep, prevStep }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, Rupay'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'GPay, PhonePe, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major banks'
    },
    {
      id: 'wallet',
      name: 'Wallets',
      icon: '👛',
      description: 'Paytm, PhonePe, Amazon Pay'
    },
    {
      id: 'emi',
      name: 'EMI',
      icon: '📊',
      description: 'No cost EMI available'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive'
    }
  ];

  const handlePaymentSelect = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleProceedToPay = () => {
    const paymentData = {
      method: selectedPayment,
      details: selectedPayment === 'card' ? cardDetails : 
               selectedPayment === 'upi' ? { upiId } : {}
    };
    
    updateCheckoutData({ paymentMethod: paymentData });
    
    // Simulate payment processing
    setTimeout(() => {
      const orderId = 'ORD-' + Date.now();
      updateCheckoutData({ orderId });
      nextStep();
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Choose Payment Method</h2>

          {/* Payment Methods */}
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-lg">
                <div
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? 'bg-blue-50 border-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handlePaymentSelect(method.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <h3 className="font-medium">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      checked={selectedPayment === method.id}
                      onChange={() => handlePaymentSelect(method.id)}
                    />
                  </div>
                </div>

                {/* Payment Method Details */}
                {selectedPayment === method.id && (
                  <div className="p-4 border-t bg-gray-50">
                    {method.id === 'card' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Card Number"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                          className="px-3 py-2 border rounded-lg md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="Cardholder Name"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="px-3 py-2 border rounded-lg md:col-span-2"
                        />
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                          className="px-3 py-2 border rounded-lg"
                        />
                        <div className="flex items-center md:col-span-2">
                          <input type="checkbox" className="mr-2" />
                          <label className="text-sm">Save card for future payments</label>
                        </div>
                      </div>
                    )}

                    {method.id === 'upi' && (
                      <div>
                        <input
                          type="text"
                          placeholder="Enter UPI ID (e.g., user@paytm)"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg mb-4"
                        />
                        <div className="flex gap-4">
                          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                            <span>📱</span> GPay
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                            <span>💜</span> PhonePe
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                            <span>💙</span> Paytm
                          </button>
                        </div>
                      </div>
                    )}

                    {method.id === 'netbanking' && (
                      <div>
                        <h4 className="font-medium mb-3">Popular Banks</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Canara'].map(bank => (
                            <button key={bank} className="p-2 border rounded text-sm hover:bg-gray-100">
                              {bank}
                            </button>
                          ))}
                        </div>
                        <select className="w-full mt-3 px-3 py-2 border rounded-lg">
                          <option>Other Banks</option>
                        </select>
                      </div>
                    )}

                    {method.id === 'wallet' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100">
                          <span>💙</span> Paytm Wallet
                        </button>
                        <button className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100">
                          <span>💜</span> PhonePe Wallet
                        </button>
                        <button className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-100">
                          <span>🟠</span> Amazon Pay
                        </button>
                      </div>
                    )}

                    {method.id === 'emi' && (
                      <div>
                        <h4 className="font-medium mb-3">EMI Options</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <span className="font-medium">3 Months</span>
                              <span className="text-sm text-gray-600 ml-2">No Cost EMI</span>
                            </div>
                            <span>₹{(checkoutData.orderTotal / 3).toFixed(2)}/month</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <span className="font-medium">6 Months</span>
                              <span className="text-sm text-gray-600 ml-2">No Cost EMI</span>
                            </div>
                            <span>₹{(checkoutData.orderTotal / 6).toFixed(2)}/month</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {method.id === 'cod' && (
                      <div className="text-center py-4">
                        <p className="text-green-600 font-medium">✓ Cash on Delivery Available</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Pay ₹{checkoutData.orderTotal?.toFixed(2)} when your order is delivered
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Additional ₹20 handling charges may apply
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Security Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <span>🔒</span>
              <span className="font-medium">100% Safe & Secure Payments</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          {/* Items */}
          <div className="space-y-2 mb-4">
            {checkoutData.items.slice(0, 2).map((item) => (
              <div key={item._id} className="flex items-center gap-2">
                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                <div className="flex-1 text-sm">
                  <p className="truncate">{item.name}</p>
                  <p className="text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
            {checkoutData.items.length > 2 && (
              <p className="text-sm text-gray-600">
                +{checkoutData.items.length - 2} more items
              </p>
            )}
          </div>

          {/* Address */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Deliver to:</h4>
            <p className="text-sm text-gray-600">
              {checkoutData.selectedAddress?.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {checkoutData.selectedAddress?.area}, {checkoutData.selectedAddress?.city}
            </p>
          </div>

          {/* Price Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span>₹{checkoutData.orderTotal?.toFixed(2)}</span>
            </div>
            {selectedPayment === 'cod' && (
              <div className="flex justify-between text-orange-600">
                <span>COD Charges</span>
                <span>₹20</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Amount Payable</span>
              <span>
                ₹{(checkoutData.orderTotal + (selectedPayment === 'cod' ? 20 : 0)).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleProceedToPay}
              disabled={!selectedPayment}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300"
            >
              {selectedPayment === 'cod' ? 'Place Order' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;