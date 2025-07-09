import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const CouponManagement = () => {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiryDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      setFormData({
        code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiryDate: ''
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  return (
    <div>
      <h3>Coupon Management</h3>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Coupon Code"
          value={formData.code}
          onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
          required
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          value={formData.value}
          onChange={(e) => setFormData({...formData, value: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Min Order Amount"
          value={formData.minOrder}
          onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max Uses"
          value={formData.maxUses}
          onChange={(e) => setFormData({...formData, maxUses: e.target.value})}
        />
        <input
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
        />
        <button type="submit">Create Coupon</button>
      </form>

      <div>
        <h4>Existing Coupons</h4>
        {coupons.map(coupon => (
          <div key={coupon._id}>
            <p><strong>{coupon.code}</strong> - {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</p>
            <p>Used: {coupon.usedCount}/{coupon.maxUses || '∞'}</p>
            <p>Status: {coupon.active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponManagement;