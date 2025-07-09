import React, { useState } from 'react';

const CouponInput = ({ orderTotal, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal })
      });
      
      if (response.ok) {
        const data = await response.json();
        onCouponApplied(data.discount, couponCode);
        setMessage(`Coupon applied! Discount: $${data.discount}`);
      } else {
        const error = await response.json();
        setMessage(error.error);
      }
    } catch (error) {
      setMessage('Error applying coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4>Discount Code</h4>
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
      />
      <button onClick={applyCoupon} disabled={loading}>
        {loading ? 'Applying...' : 'Apply'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CouponInput;