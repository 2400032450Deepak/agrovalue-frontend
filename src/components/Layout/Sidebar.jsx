import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const userRole = user?.role;

  console.log('Sidebar userRole:', userRole);

  const getMenuItems = () => {
    // FARMER MENU
    // FARMER MENU
if (userRole === 'FARMER') {
  return [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/products/new', icon: '➕', label: 'Add Product' },
    { path: '/my-products', icon: '📋', label: 'My Products' },
    { path: '/farmer-orders', icon: '📦', label: 'Manage Orders' },  
    { path: '/profile', icon: '👤', label: 'Profile' },
  ];
}
    
    // BUYER MENU - Added Wishlist
    if (userRole === 'BUYER') {
      return [
        { path: '/products', icon: '🛍️', label: 'Browse Products' },
        { path: '/cart', icon: '🛒', label: 'My Cart' },
        { path: '/wishlist', icon: '❤️', label: 'My Wishlist' },
        { path: '/orders', icon: '📦', label: 'My Orders' },
        { path: '/profile', icon: '👤', label: 'Profile' },
      ];
    }
    
    // ADMIN MENU
    if (userRole === 'ADMIN') {
      return [
        { path: '/admin', icon: '📊', label: 'Dashboard' },
        { path: '/admin/users', icon: '👥', label: 'Manage Users' },
        { path: '/admin/products', icon: '🛍️', label: 'Manage Products' },
        { path: '/admin/orders', icon: '📦', label: 'Manage Orders' },
        { path: '/profile', icon: '👤', label: 'Profile' },
      ];
    }
    
    return [];
  };

  const menuItems = getMenuItems();

  if (menuItems.length === 0) return null;

  return (
    <div style={{
      width: '280px',
      background: '#1a472a',
      color: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>🌾 AgroValue</h2>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
          {userRole === 'FARMER' ? 'Farmer Portal' : 
           userRole === 'BUYER' ? 'Buyer Portal' : 
           userRole === 'ADMIN' ? 'Admin Portal' : 'Portal'}
        </p>
      </div>
      <div style={{ padding: '1rem 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '0.8rem 1.5rem',
              margin: '0.2rem 0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: location.pathname === item.path ? '#f59e0b' : '#e2e8f0',
              textDecoration: 'none',
              transition: 'all 0.3s',
              background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent'
            }}
          >
            <span style={{ fontSize: '1.2rem', width: '28px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;