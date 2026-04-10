import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!token) {
      return [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
      ];
    }

    const links = [{ path: '/', label: 'Home' }];

    if (user?.role === 'ROLE_FARMER') {
      links.push(
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/my-products', label: 'My Products' },
        { path: '/orders', label: 'Orders' }
      );
    } else if (user?.role === 'ROLE_BUYER') {
      links.push(
        { path: '/products', label: 'Products' },
        { path: '/cart', label: 'Cart' },
        { path: '/orders', label: 'Orders' }
      );
    } else if (user?.role === 'ROLE_ADMIN') {
      links.push(
        { path: '/admin', label: 'Admin' },
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/products', label: 'Products' }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <span className="agro">AgroValue</span>{' '}
          <span className="connect">Connect</span>
        </Link>
      </div>
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className="auth-buttons">
        {!token ? (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="user-greeting">👋 {user?.name || user?.email?.split('@')[0]}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;