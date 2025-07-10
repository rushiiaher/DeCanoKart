import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import StarRating from './StarRating';
import { API_CONFIG } from '../utils/apiConfig';

const Reviews = ({ productId }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(API_CONFIG.getUrl(`reviews/${productId}`));
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const response = await fetch(API_CONFIG.getUrl('reviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating: Number(rating), comment })
      });

      if (response.ok) {
        setComment('');
        setRating(5);
        fetchReviews();
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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-2">Reviews ({reviews.length})</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Average Rating: {getAverageRating()}/5</span>
          <StarRating rating={parseFloat(getAverageRating())} size="md" />
        </div>
      </div>

      {user && (
        <form onSubmit={submitReview} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="text-lg font-semibold">Write a Review</h4>
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
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review._id} className="border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <h5 className="font-semibold">{review.userId?.name || 'Anonymous'}</h5>
              <StarRating rating={review.rating} size="sm" />
              <span className="text-sm text-gray-500">({review.rating}/5)</span>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <small className="text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;