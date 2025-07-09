import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const ReturnManagement = () => {
  const { token } = useAuth();
  const [returnRequests, setReturnRequests] = useState([]);

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const fetchReturnRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/return-requests', {
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

  const updateReturnRequest = async (id, status, refundAmount, adminNotes) => {
    try {
      await fetch(`http://localhost:5000/api/admin/return-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, refundAmount, adminNotes })
      });
      fetchReturnRequests();
    } catch (error) {
      console.error('Error updating return request:', error);
    }
  };

  return (
    <div>
      <h3>Return Request Management</h3>
      {returnRequests.map(request => (
        <div key={request._id}>
          <h4>Request #{request._id}</h4>
          <p><strong>Customer:</strong> {request.userId.name} ({request.userId.email})</p>
          <p><strong>Order:</strong> {request.orderId._id}</p>
          <p><strong>Order Total:</strong> ${request.orderId.total}</p>
          <p><strong>Reason:</strong> {request.reason}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
          
          <div>
            <select
              value={request.status}
              onChange={(e) => updateReturnRequest(request._id, e.target.value, request.refundAmount, request.adminNotes)}
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="processed">Processed</option>
            </select>
            
            <input
              type="number"
              placeholder="Refund Amount"
              defaultValue={request.refundAmount}
              onBlur={(e) => updateReturnRequest(request._id, request.status, e.target.value, request.adminNotes)}
            />
            
            <textarea
              placeholder="Admin Notes"
              defaultValue={request.adminNotes}
              onBlur={(e) => updateReturnRequest(request._id, request.status, request.refundAmount, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReturnManagement;