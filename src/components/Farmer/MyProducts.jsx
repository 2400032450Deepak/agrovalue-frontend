import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchProducts();
    } else {
      console.error('No userId found');
      setLoading(false);
    }
  }, [userId]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products for farmerId:', userId);
      const response = await api.get(`/api/farmers/${userId}/products`);
      console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${productId}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="my-products-container">
      <div className="page-header">
        <h1>My Products</h1>
        <Link to="/products/new" className="btn-primary">+ Add New Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌾</div>
          <p>You haven't added any products yet</p>
          <Link to="/products/new" className="btn-primary">Add Your First Product</Link>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? `${product.stock} kg available` : 'Out of stock'}
                </span>
              </div>
              <p className="product-description">{product.description}</p>
              <div className="product-price">₹{product.price} / kg</div>
              <div className="product-actions">
                <button
                  className="btn-small btn-danger"
                  onClick={() => deleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;