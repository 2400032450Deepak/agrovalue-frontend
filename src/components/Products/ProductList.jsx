import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await api.get('/api/products');
      console.log('Products fetched:', response.data);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  };

  const addToCart = async (productId) => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    if (user.role !== 'BUYER') {
      toast.error('Only buyers can add to cart');
      return;
    }
    
    if (!userId) {
      toast.error('User ID not found. Please login again.');
      return;
    }
    
    try {
      await api.post('/api/cart/items', { 
        userId: parseInt(userId), 
        productId: productId, 
        quantity: 1 
      });
      toast.success('Added to cart! 🛒');
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

const addToWishlist = async (product) => {
  if (!user) {
    toast.error('Please login to add to wishlist');
    return;
  }
  if (user.role !== 'BUYER') {
    toast.error('Only buyers can add to wishlist');
    return;
  }
  
  try {
    // Get existing wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    // Check if product already in wishlist
    const exists = wishlist.some(item => item.id === product.id);
    
    if (exists) {
      toast.info('Product already in wishlist');
      return;
    }
    
    // Add to wishlist
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    toast.success('Added to wishlist! ❤️');
  } catch (error) {
    console.error('Add to wishlist error:', error);
    toast.error('Failed to add to wishlist');
  }
};

  const buyNow = async (productId, price) => {
    if (!user) {
      toast.error('Please login to buy');
      return;
    }
    if (user.role !== 'BUYER') {
      toast.error('Only buyers can purchase');
      return;
    }
    
    // Add to cart first then go to checkout
    try {
      await api.post('/api/cart/items', { 
        userId: parseInt(userId), 
        productId: productId, 
        quantity: 1 
      });
      toast.success('Product added to cart! Redirecting to checkout...');
      setTimeout(() => {
        navigate('/cart');
      }, 1000);
    } catch (error) {
      console.error('Buy now error:', error);
      toast.error('Failed to process purchase');
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      vegetables: '🥬',
      fruits: '🍎',
      grains: '🌾',
      dairy: '🥛',
      organic: '🌱',
      spices: '🌶️'
    };
    return icons[category?.toLowerCase()] || '🌽';
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-hero">
        <h1>Fresh from Farms 🚜</h1>
        <p>Discover the finest quality agricultural products directly from farmers</p>
      </div>

      <div className="products-container-simple">
        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-large"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          <span>{filteredProducts.length} products found</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or check back later for new products</p>
            {searchTerm && (
              <button className="btn-primary" onClick={() => setSearchTerm('')}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid-simple">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card-simple">
                <div className="product-badge-simple">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="product-image-simple">
                  {getCategoryIcon(product.category)}
                </div>
                <div className="product-details-simple">
                  <h3 className="product-name-simple">{product.name}</h3>
                  <p className="product-description-simple">
                    {product.description?.substring(0, 100)}
                    {product.description?.length > 100 ? '...' : ''}
                  </p>
                  <div className="product-price-simple">
                    <span className="price">₹{product.price}</span>
                    <span className="unit">/ kg</span>
                  </div>
                  <div className="product-footer-simple">
                    <div className="farmer-info-simple">
                      <span className="farmer-icon">👨‍🌾</span>
                      <span>{product.farmerName || product.farmer?.name || 'Local Farmer'}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons - Only for Buyers */}
                  {user?.role === 'BUYER' && product.stock > 0 && (
                    <div className="product-actions-simple">
                      <button
                        className="add-to-cart-btn-simple"
                        onClick={() => addToCart(product.id)}
                      >
                        🛒 Add to Cart
                      </button>

                       <button
                        className="wishlist-btn-simple"
                        onClick={() => addToWishlist(product)}
                      >
                        ❤️ Wishlist
                      </button>
                      
                      <button
                        className="buy-now-btn-simple"
                        onClick={() => buyNow(product.id, product.price)}
                      >
                        ⚡ Buy Now
                      </button>
                    </div>
                  )}
                  
                  {user?.role === 'BUYER' && product.stock === 0 && (
                    <div className="out-of-stock-message">
                      <span>🚫 Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;