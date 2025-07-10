import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { API_CONFIG } from '../utils/apiConfig';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, totalRevenue: 0 });
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    images: [''],
    sku: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    tags: '',
    warranty: '',
    condition: 'new'
  });

  const { token, user } = useAuth();

  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive'];
  const conditions = ['new', 'used', 'refurbished'];

  useEffect(() => {
    fetchSellerProducts();
    fetchSellerStats();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_CONFIG.getUrl('seller/products'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setError('');
      } else {
        setProducts([]);
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      const response = await fetch(API_CONFIG.getUrl('seller/stats'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setStats({ totalProducts: products.length, totalSales: 0, totalRevenue: 0 });
      }
    } catch (error) {
      setStats({ totalProducts: products.length, totalSales: 0, totalRevenue: 0 });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        inStock: Number(newProduct.stock) > 0,
        images: newProduct.images.filter(img => img.trim() !== ''),
        tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        weight: newProduct.weight ? Number(newProduct.weight) : undefined,
        dimensions: {
          length: newProduct.dimensions.length ? Number(newProduct.dimensions.length) : undefined,
          width: newProduct.dimensions.width ? Number(newProduct.dimensions.width) : undefined,
          height: newProduct.dimensions.height ? Number(newProduct.dimensions.height) : undefined
        }
      };

      const response = await fetch(API_CONFIG.getUrl('seller/products'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        resetForm();
        setShowAddForm(false);
        fetchSellerProducts();
        setError('');
      } else {
        setError('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product');
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      category: '',
      subcategory: '',
      brand: '',
      description: '',
      price: '',
      stock: '',
      image: '',
      images: [''],
      sku: '',
      weight: '',
      dimensions: { length: '', width: '', height: '' },
      tags: '',
      warranty: '',
      condition: 'new'
    });
  };

  const addImageField = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, '']
    });
  };

  const updateImageField = (index, value) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = value;
    setNewProduct({
      ...newProduct,
      images: updatedImages
    });
  };

  const removeImageField = (index) => {
    const updatedImages = newProduct.images.filter((_, i) => i !== index);
    setNewProduct({
      ...newProduct,
      images: updatedImages.length > 0 ? updatedImages : ['']
    });
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...editingProduct,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        inStock: Number(editingProduct.stock) > 0,
        images: editingProduct.images?.filter(img => img.trim() !== '') || [],
        tags: editingProduct.tags ? editingProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
        weight: editingProduct.weight ? Number(editingProduct.weight) : undefined,
        dimensions: {
          length: editingProduct.dimensions?.length ? Number(editingProduct.dimensions.length) : undefined,
          width: editingProduct.dimensions?.width ? Number(editingProduct.dimensions.width) : undefined,
          height: editingProduct.dimensions?.height ? Number(editingProduct.dimensions.height) : undefined
        }
      };

      const response = await fetch(API_CONFIG.getUrl(`seller/products/${editingProduct._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (response.ok) {
        setEditingProduct(null);
        fetchSellerProducts();
        fetchSellerStats();
        setError('');
      } else {
        setError('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(API_CONFIG.getUrl(`seller/products/${productId}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchSellerProducts();
        fetchSellerStats();
        setError('');
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  if (!user?.isSeller) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="glass-effect p-12 rounded-2xl luxury-shadow max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-base-content/70">You need seller privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Premium Header */}
      <div className="glass-effect border-b border-base-200/50 mb-8">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl lg:text-6xl font-black brand-name mb-4 text-primary">Seller Central</h1>
            <p className="text-xl text-base-content/70">Welcome back, {user.name}! Manage your premium marketplace</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-8">

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-sm text-success font-medium">+12.5%</span>
          </div>
          <h3 className="text-3xl font-bold text-primary mb-2">{stats.totalProducts}</h3>
          <p className="text-sm text-base-content/60">Total Products</p>
        </div>
        
        <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-success/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-success/10 rounded-xl">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-sm text-success font-medium">+8.2%</span>
          </div>
          <h3 className="text-3xl font-bold text-success mb-2">{stats.totalSales}</h3>
          <p className="text-sm text-base-content/60">Total Orders</p>
        </div>
        
        <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-warning/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-warning/10 rounded-xl">
              <svg className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <span className="text-sm text-success font-medium">+15.3%</span>
          </div>
          <h3 className="text-3xl font-bold text-warning mb-2">${stats.totalRevenue}</h3>
          <p className="text-sm text-base-content/60">Total Revenue</p>
        </div>
        
        <div className="glass-effect luxury-shadow-hover p-6 rounded-2xl border border-error/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-error/10 rounded-xl">
              <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <button className="text-sm text-primary hover:underline">View</button>
          </div>
          <h3 className="text-3xl font-bold text-error mb-2">5</h3>
          <p className="text-sm text-base-content/60">Pending Actions</p>
        </div>
      </div>

      {/* Premium Navigation Tabs */}
      <div className="glass-effect p-2 rounded-2xl mb-8 luxury-shadow">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'products' 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('products')}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Products ({products.length})
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'orders' 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </button>
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'analytics' 
                ? 'bg-primary text-primary-content shadow-lg' 
                : 'hover:bg-primary/10 hover:text-primary'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold brand-name mb-2">Product Management</h2>
              <p className="text-base-content/60">Manage your product inventory and listings</p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Import CSV
              </button>
              <button className="btn btn-outline">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M4 7h16" />
                </svg>
                Export
              </button>
              <button 
                className="btn btn-primary luxury-shadow-hover"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {showAddForm ? 'Cancel' : 'Add Product'}
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="glass-effect luxury-shadow rounded-2xl mb-8 border border-primary/20">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold brand-name">Add New Product</h3>
                </div>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Required Fields */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Product Name *</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Category *</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Price *</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Stock Quantity *</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        required
                      />
                    </div>

                    {/* Optional Fields */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Subcategory</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Brand</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">SKU/Product Code</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Condition</span>
                      </label>
                      <select
                        className="select select-bordered"
                        value={newProduct.condition}
                        onChange={(e) => setNewProduct({...newProduct, condition: e.target.value})}
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>
                            {condition.charAt(0).toUpperCase() + condition.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Description</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-24"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Primary Image URL *</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      required
                    />
                  </div>

                  {/* Additional Images */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Additional Images</span>
                    </label>
                    {newProduct.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="url"
                          className="input input-bordered flex-1"
                          placeholder="Image URL"
                          value={image}
                          onChange={(e) => updateImageField(index, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-error btn-sm"
                          onClick={() => removeImageField(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={addImageField}
                    >
                      + Add Image
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Weight (kg)</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input input-bordered"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Length (cm)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={newProduct.dimensions.length}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: {...newProduct.dimensions, length: e.target.value}
                        })}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Width (cm)</span>
                      </label>
                      <input
                        type="number"
                        className="input input-bordered"
                        value={newProduct.dimensions.width}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: {...newProduct.dimensions, width: e.target.value}
                        })}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Tags (comma separated)</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="electronics, gadget, premium"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Warranty Information</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      placeholder="1 year manufacturer warranty"
                      value={newProduct.warranty}
                      onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-base-200">
                    <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary luxury-shadow-hover px-8">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Add Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-xl">
                  <div className="skeleton h-48 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="card bg-base-100 shadow-xl luxury-shadow-hover">
                  <figure>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
                      }}
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>
                    <div className="badge badge-outline">{product.category}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <div className={`badge ${product.inStock ? 'badge-success' : 'badge-error'}`}>
                        {product.inStock ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                    </div>
                    <p className="text-sm text-base-content/70 line-clamp-2">{product.description}</p>
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setEditingProduct({
                            ...product,
                            images: product.images || [''],
                            tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
                            dimensions: product.dimensions || { length: '', width: '', height: '' }
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold mb-2">No products yet</h3>
              <p className="text-base-content/60 mb-6">Start by adding your first product to the marketplace</p>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold mb-2">Orders Management</h3>
          <p className="text-base-content/60">Order management features coming soon</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-2">Analytics Dashboard</h3>
          <p className="text-base-content/60">Analytics and reporting features coming soon</p>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Edit Product</h3>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Product Name *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Price *</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input input-bordered"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Stock *</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Image URL *</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SellerDashboard;