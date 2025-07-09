import React, { useState } from 'react';
import StarRating from './StarRating';

const ProductTabs = ({ description, specifications, reviews = [], sizeGuide }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', count: null },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'specifications', label: 'Specifications', count: null },
    { id: 'shipping', label: 'Shipping & Returns', count: null }
  ];

  return (
    <div className="mt-16">
      {/* Tab Navigation */}
      <div className="tabs tabs-bordered mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab tab-lg ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count && (
              <span className="badge badge-sm badge-primary ml-2">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="glass-effect p-8 rounded-2xl luxury-shadow">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <h3 className="text-2xl font-bold mb-4">Product Description</h3>
            <p className="text-base-content/80 leading-relaxed mb-6">
              {description || 'Experience luxury and comfort with this premium product, crafted with attention to detail and designed for the modern lifestyle.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Premium materials and construction</li>
                  <li>• Ergonomic design for comfort</li>
                  <li>• Durable and long-lasting</li>
                  <li>• Easy maintenance and care</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Care Instructions</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Follow care label instructions</li>
                  <li>• Store in cool, dry place</li>
                  <li>• Avoid direct sunlight</li>
                  <li>• Professional cleaning recommended</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Customer Reviews</h3>
              <button className="btn btn-primary btn-outline">Write a Review</button>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-base-200 pb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-10">
                          <span className="text-sm">{(review.userId?.name || review.name || 'User')[0].toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{review.userId?.name || review.name || 'Anonymous'}</div>
                        <div className="rating rating-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`mask mask-star-2 w-4 h-4 ${star <= review.rating ? 'bg-orange-400' : 'bg-gray-300'}`}
                            ></span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p className="text-base-content/80">{review.comment || 'Great product, highly recommended!'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h4 className="text-xl font-semibold mb-2">No reviews yet</h4>
                <p className="text-base-content/60 mb-4">Be the first to share your experience</p>
                <button className="btn btn-primary">Write First Review</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Specifications</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <tbody>
                  <tr><td className="font-semibold">Material</td><td>Premium Quality</td></tr>
                  <tr><td className="font-semibold">Dimensions</td><td>Standard Size</td></tr>
                  <tr><td className="font-semibold">Weight</td><td>Lightweight</td></tr>
                  <tr><td className="font-semibold">Color Options</td><td>Multiple Available</td></tr>
                  <tr><td className="font-semibold">Warranty</td><td>1 Year Manufacturer Warranty</td></tr>
                  <tr><td className="font-semibold">Origin</td><td>Imported</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-2xl font-bold mb-6">Shipping & Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Shipping Information
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• Free shipping on orders over ₹500</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days</li>
                  <li>• International shipping available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Return Policy
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• 30-day return policy</li>
                  <li>• Free returns on all orders</li>
                  <li>• Items must be in original condition</li>
                  <li>• Refund processed within 5-7 days</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;