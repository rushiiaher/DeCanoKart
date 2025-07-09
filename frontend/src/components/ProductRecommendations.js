import React from 'react';
import ProductCard from './ProductCard';

const ProductRecommendations = ({ productId, onProductClick }) => {
  // Mock recommendations data
  const recommendations = [
    {
      _id: 'rec1',
      name: 'Complementary Product',
      brand: 'Premium Brand',
      category: 'Accessories',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
      inStock: true,
      stock: 12
    },
    {
      _id: 'rec2',
      name: 'Similar Style Item',
      brand: 'Luxury Co',
      category: 'Fashion',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      inStock: true,
      stock: 8
    },
    {
      _id: 'rec3',
      name: 'Matching Accessory',
      brand: 'Elite Brand',
      category: 'Accessories',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
      inStock: true,
      stock: 15
    },
    {
      _id: 'rec4',
      name: 'Premium Alternative',
      brand: 'Designer Label',
      category: 'Fashion',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop',
      inStock: true,
      stock: 5
    }
  ];

  const frequentlyBought = [
    {
      _id: 'fb1',
      name: 'Essential Add-on',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
      selected: true
    },
    {
      _id: 'fb2',
      name: 'Care Kit',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200&h=200&fit=crop',
      selected: false
    }
  ];

  return (
    <div className="space-y-16 mt-16">
      {/* Frequently Bought Together */}
      <section>
        <h2 className="text-3xl font-bold brand-name mb-8">Frequently Bought Together</h2>
        <div className="glass-effect p-8 rounded-2xl luxury-shadow">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
              <span className="text-sm">This item</span>
            </div>
            <span className="text-2xl">+</span>
            {frequentlyBought.map((item, index) => (
              <div key={item._id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-primary" 
                  defaultChecked={item.selected}
                />
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-sm text-primary font-bold">${item.price}</div>
                  </div>
                </div>
                {index < frequentlyBought.length - 1 && <span className="text-2xl">+</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-base-content/60">Total price:</div>
              <div className="text-2xl font-bold text-primary">$199.97</div>
              <div className="text-sm text-success">Save $25.00</div>
            </div>
            <button className="btn btn-primary btn-lg">Add Selected to Cart</button>
          </div>
        </div>
      </section>

      {/* You May Also Like */}
      <section>
        <h2 className="text-3xl font-bold brand-name mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section>
        <h2 className="text-3xl font-bold brand-name mb-8">Recently Viewed</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {recommendations.slice(0, 3).map(product => (
            <div key={`recent-${product._id}`} className="flex-shrink-0 w-48">
              <ProductCard
                product={product}
                onProductClick={onProductClick}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductRecommendations;