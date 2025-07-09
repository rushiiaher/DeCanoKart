import React, { useState } from 'react';

const PaymentForm = ({ total, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock payment processing
      const response = await fetch('http://localhost:5000/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, paymentMethod })
      });

      if (response.ok) {
        const paymentResult = await response.json();
        onPaymentComplete(paymentMethod, paymentResult);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Payment Information</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="credit-card"
              checked={paymentMethod === 'credit-card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit Card
          </label>
          <label>
            <input
              type="radio"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            PayPal
          </label>
        </div>

        {paymentMethod === 'credit-card' && (
          <div>
            <input
              type="text"
              placeholder="Card Number (Demo: 4111-1111-1111-1111)"
              value={paymentDetails.cardNumber}
              onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={paymentDetails.cardName}
              onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
              required
            />
          </div>
        )}

        <div>
          <h4>Total: ${total}</h4>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : `Pay $${total}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;