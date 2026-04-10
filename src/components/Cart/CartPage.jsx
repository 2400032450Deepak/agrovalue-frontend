import React, { useState, useEffect } from 'react';
import { cartAPI, orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart(userId);
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.updateItem(cartItemId, quantity);
      fetchCart();
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await cartAPI.removeItem(cartItemId);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      await orderAPI.placeOrder(parseInt(userId));
      toast.success('Order placed successfully!');
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items to your cart yet</p>
        <button className="btn-primary" onClick={() => window.location.href = '/products'}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.cartItemId} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.productName}</h4>
              <p className="cart-item-price">₹{item.unitPrice} / kg</p>
            </div>
            <div className="cart-item-actions">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.cartItemId, parseInt(e.target.value))}
                min="1"
              />
              <button className="btn-danger" onClick={() => removeItem(item.cartItemId)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        <div className="summary-total">
          <span>Total:</span>
          <span>₹{cart.totalAmount}</span>
        </div>
        <button 
          className="btn-primary place-order-btn" 
          onClick={placeOrder}
          disabled={placingOrder}
        >
          {placingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;