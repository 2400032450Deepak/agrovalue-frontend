import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-users-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View and manage all platform users</p>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                <td>
                  <button
                    className="btn-small btn-warning"
                    onClick={() => updateUserStatus(user.id, user.status)}
                  >
                    {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => deleteUser(user.id)}
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

export default ManageUsers;