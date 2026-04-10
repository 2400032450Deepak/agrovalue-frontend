import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminAPI.updateProductStatus(productId, newStatus);
      toast.success('Product status updated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-products-container">
      <div className="page-header">
        <h1>Manage Products</h1>
        <p>View and manage all products on the platform</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Farmer</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.farmerName || 'N/A'}</td>
                <td>₹{product.price}</td>
                <td>{product.stock} kg</td>
                <td>
                  <span className={`status-badge ${product.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                    {product.status || 'PENDING'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-small btn-warning"
                    onClick={() => updateProductStatus(product.id, product.status)}
                  >
                    {product.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => deleteProduct(product.id)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;