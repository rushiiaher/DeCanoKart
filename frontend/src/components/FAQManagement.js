import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const FAQManagement = () => {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [formData, setFormData] = useState({
    question: '', answer: '', category: '', order: 0, active: true
  });
  const [editingFaq, setEditingFaq] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/faqs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFaq 
        ? `http://localhost:5000/api/admin/faqs/${editingFaq._id}`
        : 'http://localhost:5000/api/admin/faqs';
      
      const method = editingFaq ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      resetForm();
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData(faq);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this FAQ?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/faqs/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFaqs();
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: '', order: 0, active: true });
  };

  return (
    <div>
      <h3>FAQ Management</h3>
      
      <form onSubmit={handleSubmit}>
        <h4>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h4>
        <input
          type="text"
          placeholder="Question"
          value={formData.question}
          onChange={(e) => setFormData({...formData, question: e.target.value})}
          required
        />
        <textarea
          placeholder="Answer"
          value={formData.answer}
          onChange={(e) => setFormData({...formData, answer: e.target.value})}
          rows="4"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Order"
          value={formData.order}
          onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
        />
        <label>
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => setFormData({...formData, active: e.target.checked})}
          />
          Active
        </label>
        <button type="submit">{editingFaq ? 'Update' : 'Add'} FAQ</button>
        {editingFaq && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div>
        <h4>Existing FAQs</h4>
        {faqs.map(faq => (
          <div key={faq._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h5>{faq.question}</h5>
            <p>{faq.answer}</p>
            <p><strong>Category:</strong> {faq.category}</p>
            <p><strong>Status:</strong> {faq.active ? 'Active' : 'Inactive'}</p>
            <button onClick={() => handleEdit(faq)}>Edit</button>
            <button onClick={() => handleDelete(faq._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQManagement;