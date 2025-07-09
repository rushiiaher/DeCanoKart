import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const SupportManagement = () => {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/support-tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    }
  };

  const updateTicket = async (id, status, adminResponse) => {
    try {
      await fetch(`http://localhost:5000/api/admin/support-tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, adminResponse })
      });
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  return (
    <div>
      <h3>Support Ticket Management</h3>
      {tickets.map(ticket => (
        <div key={ticket._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
          <h4>Ticket #{ticket._id}</h4>
          <p><strong>From:</strong> {ticket.name} ({ticket.email})</p>
          <p><strong>Subject:</strong> {ticket.subject}</p>
          <p><strong>Message:</strong> {ticket.message}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Submitted:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
          
          <div>
            <select
              value={ticket.status}
              onChange={(e) => updateTicket(ticket._id, e.target.value, ticket.adminResponse)}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <textarea
              placeholder="Admin Response"
              defaultValue={ticket.adminResponse}
              onBlur={(e) => updateTicket(ticket._id, ticket.status, e.target.value)}
              rows="3"
              style={{ width: '100%', marginTop: '10px' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupportManagement;