import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Analytics = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div>
      <h3>Analytics Dashboard</h3>
      
      <div>
        <div>
          <h4>Total Users</h4>
          <p>{analytics.totalUsers}</p>
        </div>
        <div>
          <h4>Total Products</h4>
          <p>{analytics.totalProducts}</p>
        </div>
        <div>
          <h4>Total Orders</h4>
          <p>{analytics.totalOrders}</p>
        </div>
        <div>
          <h4>Total Revenue</h4>
          <p>${analytics.totalRevenue}</p>
        </div>
      </div>

      <div>
        <h4>Recent Orders</h4>
        {analytics.recentOrders.map(order => (
          <div key={order._id}>
            <p>Order #{order._id}</p>
            <p>Customer: {order.userId?.name || 'Guest'}</p>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;