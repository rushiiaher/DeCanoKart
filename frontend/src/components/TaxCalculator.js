import React, { useState } from 'react';

const TaxCalculator = ({ subtotal, onTaxCalculated }) => {
  const [state, setState] = useState('CA');
  const [tax, setTax] = useState(0);

  const calculateTax = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal, state })
      });
      
      if (response.ok) {
        const data = await response.json();
        setTax(data.tax);
        onTaxCalculated(data.tax);
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
    }
  };

  return (
    <div>
      <h4>Tax Calculation</h4>
      <select value={state} onChange={(e) => setState(e.target.value)}>
        <option value="CA">California (8.75%)</option>
        <option value="NY">New York (8%)</option>
        <option value="TX">Texas (6.25%)</option>
        <option value="FL">Florida (6%)</option>
        <option value="OTHER">Other (5%)</option>
      </select>
      
      <button onClick={calculateTax}>Calculate Tax</button>
      {tax > 0 && <p>Tax: ${tax}</p>}
    </div>
  );
};

export default TaxCalculator;