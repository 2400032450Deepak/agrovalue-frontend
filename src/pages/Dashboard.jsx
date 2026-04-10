import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  console.log('Dashboard - user:', user);
  console.log('Dashboard - userId:', userId);

  useEffect(() => {
    if (user?.role === 'FARMER' && userId) {
      fetchFarmerData();
    } else {
      setLoading(false);
    }
  }, [user, userId]);

  const fetchFarmerData = async () => {
    try {
      console.log('Fetching farmer stats for userId:', userId);
      const [productsRes, statsRes] = await Promise.all([
        api.get(`/api/farmers/${userId}/products`),
        api.get(`/api/farmers/${userId}/dashboard-stats`)
      ]);
      setProducts(productsRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Failed to load farmer data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Only farmers should see dashboard
  if (user?.role !== 'FARMER') {
    return (
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Access Denied</h1>
          <p>This page is only for farmers.</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>Welcome, Farmer {user?.name}! 🌾</h1>
        <p>Manage your products and track orders</p>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <h3>Total Products</h3>
          <p>{stats?.totalProducts || products.length || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Orders</h3>
          <p>{stats?.totalOrders || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Low Stock</h3>
          <p>{stats?.lowStockProducts || 0}</p>
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>Your Products</h2>
          <Link to="/products/new" className="btn-primary">+ Add Product</Link>
        </div>
        {products.length === 0 ? (
          <div className="empty-state">
            <p>No products yet. Start selling!</p>
            <Link to="/products/new" className="btn-primary" style={{ marginTop: '1rem' }}>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-item">
                <h3>{p.name}</h3>
                <p className="product-price">₹{p.price}</p>
                <p className="product-stock">Stock: {p.stock} kg</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;