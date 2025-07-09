import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const ProductManagement = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: '', subcategory: '', brand: '', description: '',
    price: '', stock: '', image: '', inStock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('http://localhost:5000/api/products');
    const data = await response.json();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `http://localhost:5000/api/admin/products/${editingProduct._id}`
      : 'http://localhost:5000/api/admin/products';
    
    const method = editingProduct ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '', category: '', subcategory: '', brand: '', description: '',
      price: '', stock: '', image: '', inStock: true
    });
  };

  return (
    <div>
      <h3>Product Management</h3>
      
      <form onSubmit={handleSubmit}>
        <h4>{editingProduct ? 'Edit Product' : 'Add Product'}</h4>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
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
          type="text"
          placeholder="Subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
        />
        <input
          type="text"
          placeholder="Brand"
          value={formData.brand}
          onChange={(e) => setFormData({...formData, brand: e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
        />
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({...formData, image: e.target.value})}
        />
        <label>
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
          />
          In Stock
        </label>
        <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
        {editingProduct && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div>
        <h4>Products</h4>
        {products.map(product => (
          <div key={product._id}>
            <img src={product.image} alt={product.name} width="50" />
            <span>{product.name} - ${product.price}</span>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;