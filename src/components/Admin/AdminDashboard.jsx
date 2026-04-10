import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllUsers()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>Admin Dashboard 👑</h1>
        <p>Manage users, products, and monitor platform activity</p>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <h3>Total Users</h3>
          <p>{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Farmers</h3>
          <p>{stats?.totalFarmers || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Buyers</h3>
          <p>{stats?.totalBuyers || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Products</h3>
          <p>{stats?.totalProducts || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Active Products</h3>
          <p>{stats?.activeProducts || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Orders</h3>
          <p>{stats?.totalOrders || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Total Revenue</h3>
          <p>₹{stats?.totalRevenue || 0}</p>
        </div>
        <div className="stat-box">
          <h3>Active Sessions</h3>
          <p>{stats?.activeSessions || 0}</p>
        </div>
      </div>

      <div className="products-section">
        <div className="section-header">
          <h2>Recent Users</h2>
          <Link to="/admin/users" className="btn-outline">View All</Link>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles?.map((role, index) => (
                      <span key={index} className="role-badge">
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}`}>
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;