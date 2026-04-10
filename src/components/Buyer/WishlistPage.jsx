import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    setLoading(false);
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('Removed from wishlist');
  };

  const addToCart = async (product) => {
    try {
      await api.post('/api/cart/items', {
        userId: parseInt(userId),
        productId: product.id,
        quantity: 1
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-container">
      <h2>My Wishlist ❤️</h2>
      
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-wishlist-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save your favorite products here</p>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-item">
              <div className="wishlist-item-image">
                {product.category === 'vegetables' ? '🥬' : 
                 product.category === 'fruits' ? '🍎' : '🌾'}
              </div>
              <div className="wishlist-item-details">
                <h3>{product.name}</h3>
                <p>{product.description?.substring(0, 60)}</p>
                <p className="price">₹{product.price} / kg</p>
              </div>
              <div className="wishlist-item-actions">
                <button 
                  className="btn-primary" 
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => removeFromWishlist(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;