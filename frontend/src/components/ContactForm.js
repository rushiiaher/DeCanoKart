import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card-elegant">
          <div className="card-body text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-serif font-bold mb-4 text-success">Thank You!</h2>
            <p className="text-lg opacity-80 mb-6">Your support ticket has been submitted successfully. We'll get back to you within 24 hours.</p>
            <button className="btn-primary-elegant" onClick={() => setSubmitted(false)}>Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold mb-4">Customer Support</h2>
        <p className="text-lg opacity-70">We're here to help. Send us a message and we'll respond as soon as possible.</p>
      </div>
      
      <div className="card-elegant">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Name</span>
                </label>
                <input
                  className="input-elegant"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  className="input-elegant"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Subject</span>
              </label>
              <input
                className="input-elegant"
                type="text"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Message</span>
              </label>
              <textarea
                className="textarea-elegant h-32"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>
            
            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn-primary-elegant ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;