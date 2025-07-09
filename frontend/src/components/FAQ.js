import React, { useState, useEffect } from 'react';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/faqs');
      if (response.ok) {
        const data = await response.json();
        setFaqs(Array.isArray(data) ? data : []);
        setError('');
      } else {
        setError('Failed to load FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq && faq.question && faq.answer &&
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const groupedFaqs = filteredFaqs.reduce((groups, faq) => {
    const category = faq.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(faq);
    return groups;
  }, {});

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Frequently Asked Questions</h2>
        <p>Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Frequently Asked Questions</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchFaqs} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg opacity-70">Find answers to common questions about our products and services</p>
      </div>
      
      <div className="mb-8">
        <input
          className="input-elegant"
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold mb-4">No FAQs found</h3>
          <p className="opacity-70">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold mb-4 text-primary border-b-2 border-primary/20 pb-2">{category}</h3>
              <div className="space-y-2">
                {categoryFaqs.map(faq => (
                  <div key={faq._id} className="collapse-elegant">
                    <input 
                      type="radio" 
                      name={`faq-${category}`} 
                      checked={expandedFaq === faq._id}
                      onChange={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                    />
                    <div className="collapse-title text-lg font-medium">
                      {faq.question}
                    </div>
                    <div className="collapse-content">
                      <p className="opacity-80 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQ;