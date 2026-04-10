import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');

  const featuredProducts = [
    { id: 1, name: 'Organic Rice', price: '₹120/kg', icon: '🍚', category: 'Grains' },
    { id: 2, name: 'Fresh Mangoes', price: '₹80/kg', icon: '🥭', category: 'Fruits' },
    { id: 3, name: 'Green Vegetables', price: '₹40/kg', icon: '🥬', category: 'Vegetables' },
    { id: 4, name: 'Pure Honey', price: '₹350/kg', icon: '🍯', category: 'Organic' },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌟 India's Largest Agri Marketplace</div>
          <h1>
            Empowering Farmers,<br />
            Connecting <span>Global Buyers</span>
          </h1>
          <p>
            Join thousands of farmers and buyers on India's fastest-growing agricultural 
            marketplace. Sell your products directly or find the best quality produce at fair prices.
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Browse Products →</Link>
            {!token && <Link to="/register" className="btn-outline">Start Selling</Link>}
          </div>
        </div>
        <div className="hero-image">
          <div style={{ fontSize: '8rem' }}>🌾</div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Happy Farmers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50,000+</span>
            <span className="stat-label">Products Sold</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100+</span>
            <span className="stat-label">Cities Covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">₹10Cr+</span>
            <span className="stat-label">Farmer Revenue</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Why Choose AgroValue?</h2>
        <p className="section-subtitle">We're revolutionizing the way India farms and sells</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Direct Farm to Table</h3>
            <p>Eliminate middlemen and get fair prices for your produce directly from farmers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payments</h3>
            <p>100% secure payment gateway with instant settlements for farmers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Pan India Delivery</h3>
            <p>Fast and reliable logistics network covering all major cities</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>Track your sales, inventory, and earnings with detailed insights</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>24/7 Support</h3>
            <p>Dedicated customer support for both farmers and buyers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Quality Assurance</h3>
            <p>Strict quality checks to ensure premium product standards</p>
          </div>
        </div>
      </div>

      {/* Products Preview */}
      <div className="products-preview">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Discover the best quality agricultural products</p>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{product.category}</p>
                <div className="product-price">{product.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <Link to="/products" className="btn-outline">View All Products →</Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Grow Your Agricultural Business?</h2>
        <p>Join thousands of farmers and buyers already using AgroValue Connect</p>
        {!token ? (
          <Link to="/register" className="btn-cta">Get Started Today →</Link>
        ) : (
          <Link to="/dashboard" className="btn-cta">Go to Dashboard →</Link>
        )}
      </div>
    </>
  );
};

export default Home;