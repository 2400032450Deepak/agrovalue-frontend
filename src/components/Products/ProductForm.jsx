import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ProductForm = () => {
  const { user } = useAuth();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  console.log('ProductForm - userId:', userId);
  console.log('ProductForm - user:', user);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product.name || !product.price || !product.stock) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (!userId) {
      toast.error('User ID not found. Please login again.');
      return;
    }
    
    setLoading(true);
    try {
      const productData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stock: parseInt(product.stock),
        farmerId: parseInt(userId),
        category: product.category || 'general'
      };
      
      console.log('Sending product data:', productData);
      
      const response = await api.post('/api/products', productData);
      console.log('Product added response:', response.data);
      
      toast.success('Product added successfully!');
      navigate('/my-products');
    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Add New Product</h2>
        <p>List your agricultural product for sale</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="e.g., Organic Basmati Rice"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price per kg"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock (kg) *</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                placeholder="Available stock"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="">Select Category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains & Cereals</option>
              <option value="dairy">Dairy Products</option>
              <option value="organic">Organic Products</option>
              <option value="spices">Spices</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;