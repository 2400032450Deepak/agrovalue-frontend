import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getTransactions();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    const statuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[currentIndex + 1];
    
    if (!nextStatus) {
      toast.error('Order already completed');
      return;
    }
    
    try {
      await adminAPI.updateOrderStatus(orderId, nextStatus);
      toast.success(`Order status updated to ${nextStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'DELIVERED': return 'status-delivered';
      case 'CONFIRMED': return 'status-confirmed';
      case 'SHIPPED': return 'status-shipped';
      case 'CANCELLED': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-orders-container">
      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>Track and manage all orders</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>{order.userEmail}</td>
                <td>₹{order.totalAmount}</td>
                <td>{new Date(order.orderedAt).toLocaleDateString()}</td>
                <td>
                  <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-small btn-primary"
                    onClick={() => updateOrderStatus(order.orderId, order.orderStatus)}
                    disabled={order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED'}
                  >
                    Update Status
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

export default ManageOrders;