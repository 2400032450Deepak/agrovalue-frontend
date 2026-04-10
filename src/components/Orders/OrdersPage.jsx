import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(userId);
      console.log('Orders fetched:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return 'status-delivered';
      case 'CONFIRMED': return 'status-confirmed';
      case 'SHIPPED': return 'status-shipped';
      case 'PACKAGING': return 'status-packaging';
      case 'ACCEPTED': return 'status-accepted';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return '✅';
      case 'CONFIRMED': return '✓';
      case 'SHIPPED': return '🚚';
      case 'PACKAGING': return '📦';
      case 'ACCEPTED': return '👍';
      case 'CANCELLED': return '❌';
      default: return '⏳';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here</p>
        <button className="btn-primary" onClick={() => window.location.href = '/products'}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <div>
                <span className="order-id">Order #{order.orderId}</span>
                <span className="order-date">{new Date(order.orderedAt).toLocaleDateString()}</span>
              </div>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {getStatusIcon(order.status)} {order.status}
              </span>
            </div>
            
            <div className="order-items">
              {order.items?.map((item) => (
                <div key={item.orderItemId} className="order-item">
                  <span className="order-item-name">{item.productName}</span>
                  <span className="order-item-qty">{item.quantity} kg × ₹{item.price}</span>
                  <span className="order-item-total">₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
            
            <div className="order-footer">
              <span className="order-total">Total: ₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;