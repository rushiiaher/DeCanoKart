import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const ReturnRequest = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [returnRequests, setReturnRequests] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReturnRequests();
    }
  }, [user]);

  const fetchReturnRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/return-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReturnRequests(data);
      }
    } catch (error) {
      console.error('Error fetching return requests:', error);
    }
  };

  const submitReturnRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/return-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: selectedOrder, reason })
      });

      if (response.ok) {
        alert('Return request submitted successfully');
        setSelectedOrder('');
        setReason('');
        fetchReturnRequests();
      }
    } catch (error) {
      console.error('Error submitting return request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Please login to view return requests</p>;

  return (
    <div>
      <h2>Return/Refund Requests</h2>
      
      <form onSubmit={submitReturnRequest}>
        <h3>Submit New Return Request</h3>
        <input
          type="text"
          placeholder="Order ID"
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          required
        />
        <textarea
          placeholder="Reason for return"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>

      <div>
        <h3>Your Return Requests</h3>
        {returnRequests.map(request => (
          <div key={request._id}>
            <p><strong>Order:</strong> {request.orderId._id}</p>
            <p><strong>Reason:</strong> {request.reason}</p>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
            {request.refundAmount && <p><strong>Refund Amount:</strong> ${request.refundAmount}</p>}
            {request.adminNotes && <p><strong>Admin Notes:</strong> {request.adminNotes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReturnRequest;