import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import StarRating from './StarRating';
import { API_CONFIG } from '../utils/apiConfig';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_CONFIG.getUrl('reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          rating,
          comment
        })
      });

      if (response.ok) {
        setRating(5);
        setComment('');
        if (onReviewSubmitted) onReviewSubmitted();
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p>Please login to write a review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <StarRating 
          rating={rating} 
          size="lg" 
          interactive={true} 
          onRatingChange={setRating}
        />
        <p className="text-sm text-gray-600 mt-1">Selected: {rating} star{rating !== 1 ? 's' : ''}</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="textarea textarea-bordered w-full"
          rows="4"
          placeholder="Share your experience with this product..."
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;