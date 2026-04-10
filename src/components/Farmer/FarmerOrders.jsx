import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const FarmerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchFarmerOrders();
    }
  }, [userId]);

  const fetchFarmerOrders = async () => {
    try {
      const response = await api.get(`/api/farmers/${userId}/orders`);
      console.log('Farmer orders:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch farmer orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    const statusFlow = {
      'PENDING': 'ACCEPTED',
      'ACCEPTED': 'PACKAGING',
      'PACKAGING': 'SHIPPED',
      'SHIPPED': 'DELIVERED'
    };
    
    const nextStatus = statusFlow[currentStatus];
    
    if (!nextStatus) {
      toast.info('Order already completed');
      return;
    }
    
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: nextStatus });
      toast.success(`Order status updated to ${nextStatus}`);
      fetchFarmerOrders();
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toUpperCase()) {
      case 'DELIVERED': return 'status-delivered';
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
      case 'SHIPPED': return '🚚';
      case 'PACKAGING': return '📦';
      case 'ACCEPTED': return '👍';
      case 'CANCELLED': return '❌';
      default: return '⏳';
    }
  };

  const getNextAction = (status) => {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 'Accept Order';
      case 'ACCEPTED': return 'Start Packaging';
      case 'PACKAGING': return 'Ship Order';
      case 'SHIPPED': return 'Mark Delivered';
      default: return null;  // Return null for completed orders
    }
  };

  // Check if order is in actionable state (not completed)
  const isActionable = (status) => {
    const actionableStatuses = ['PENDING', 'ACCEPTED', 'PACKAGING', 'SHIPPED'];
    return actionableStatuses.includes(status?.toUpperCase());
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-orders-icon">📦</div>
        <h2>No orders yet</h2>
        <p>When customers order your products, they will appear here</p>
      </div>
    );
  }

  return (
    <div className="farmer-orders-container">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>Track and update customer orders</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const nextAction = getNextAction(order.status);
          const actionable = isActionable(order.status);
          
          return (
            <div key={order.orderId} className="order-card farmer-order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.orderId}</span>
                  <span className="order-date">{new Date(order.orderedAt).toLocaleDateString()}</span>
                </div>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
              
              <div className="order-customer">
                <span>👤 Customer ID: {order.userId}</span>
              </div>
              
              <div className="order-items">
                <h4>Products:</h4>
                {order.items?.map((item) => (
                  <div key={item.orderItemId} className="order-item">
                    <span className="order-item-name">{item.productName}</span>
                    <span className="order-item-qty">{item.quantity} kg × ₹{item.price}</span>
                    <span className="order-item-total">₹{item.lineTotal}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">Total: ₹{order.totalAmount}</div>
                {actionable && nextAction && (
                  <button
                    className="btn-primary update-status-btn"
                    onClick={() => updateOrderStatus(order.orderId, order.status)}
                  >
                    {nextAction} →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FarmerOrders;