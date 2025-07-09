import React, { useState } from 'react';

const ShippingCalculator = ({ onShippingCalculated }) => {
  const [shippingData, setShippingData] = useState({
    weight: 1,
    distance: 100,
    method: 'standard'
  });
  const [shipping, setShipping] = useState(0);

  const calculateShipping = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shippingData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setShipping(data.shipping);
        onShippingCalculated(data.shipping);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
    }
  };

  return (
    <div>
      <h4>Shipping</h4>
      <select
        value={shippingData.method}
        onChange={(e) => setShippingData({...shippingData, method: e.target.value})}
      >
        <option value="standard">Standard ($5+)</option>
        <option value="express">Express ($15+)</option>
      </select>
      
      <input
        type="number"
        placeholder="Weight (lbs)"
        value={shippingData.weight}
        onChange={(e) => setShippingData({...shippingData, weight: Number(e.target.value)})}
      />
      
      <input
        type="number"
        placeholder="Distance (miles)"
        value={shippingData.distance}
        onChange={(e) => setShippingData({...shippingData, distance: Number(e.target.value)})}
      />
      
      <button onClick={calculateShipping}>Calculate Shipping</button>
      {shipping > 0 && <p>Shipping: ${shipping}</p>}
    </div>
  );
};

export default ShippingCalculator;