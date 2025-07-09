import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import CouponInput from './CouponInput';
import ShippingCalculator from './ShippingCalculator';
import TaxCalculator from './TaxCalculator';
import PaymentForm from './PaymentForm';

const Checkout = ({ cartItems, onOrderComplete }) => {
  const { user, token, guestCheckout } = useAuth();
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal() - discount + shipping + tax;
  };

  const handlePaymentComplete = (method, result) => {
    setPaymentMethod(method);
    setPaymentResult(result);
    processOrder();
  };

  const processOrder = async () => {
    setLoading(true);

    try {
      if (user) {
        // User checkout
        const response = await fetch('http://localhost:5000/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ paymentMethod, paymentDetails: paymentResult })
        });
        
        if (response.ok) {
          const data = await response.json();
          onOrderComplete(data.orderId);
        }
      } else {
        // Guest checkout
        const items = cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price
        }));
        
        const result = await guestCheckout(items, { ...guestInfo, paymentMethod });
        if (result.success) {
          onOrderComplete(result.orderId);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  return (
    <div>
      <h2>Checkout</h2>
      
      <div>
        <h3>Order Summary</h3>
        {cartItems.map(item => (
          <div key={item.productId._id}>
            <span>{item.productId.name} x {item.quantity}</span>
            <span>₹{item.productId.price * item.quantity}</span>
          </div>
        ))}
        
        <div>
          <p>Subtotal: ₹{getSubtotal()}</p>
          {discount > 0 && <p>Discount: -₹{discount}</p>}
          {shipping > 0 && <p>Shipping: ₹{shipping}</p>}
          {tax > 0 && <p>Tax: ₹{tax}</p>}
          <h4>Total: ₹{getTotal()}</h4>
        </div>
        
        <CouponInput 
          orderTotal={getSubtotal()} 
          onCouponApplied={(discountAmount, code) => {
            setDiscount(discountAmount);
            setCouponCode(code);
          }} 
        />
        
        <ShippingCalculator onShippingCalculated={setShipping} />
        
        <TaxCalculator subtotal={getSubtotal()} onTaxCalculated={setTax} />
      </div>

      <form onSubmit={handleCheckout}>
        {!user && (
          <div>
            <h3>Guest Information</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={guestInfo.name}
              onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
              required
            />
            <textarea
              placeholder="Address"
              value={guestInfo.address}
              onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
              required
            />
          </div>
        )}
        
        {!showPayment ? (
          <button type="submit" disabled={loading}>
            Proceed to Payment
          </button>
        ) : (
          <PaymentForm 
            total={getTotal()} 
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </form>
    </div>
  );
};

export default Checkout;