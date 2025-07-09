import React from 'react';

const ProductCardSkeleton = () => (
  <div className="card bg-base-100 shadow-xl">
    <figure className="px-4 pt-4">
      <div className="skeleton h-48 w-full rounded-xl"></div>
    </figure>
    <div className="card-body">
      <div className="skeleton h-4 w-1/2 mb-2"></div>
      <div className="skeleton h-6 w-3/4 mb-2"></div>
      <div className="skeleton h-4 w-1/3 mb-4"></div>
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-20"></div>
        <div className="skeleton h-6 w-16"></div>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;