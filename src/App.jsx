import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import CartPage from './components/Cart/CartPage';
import OrdersPage from './components/Orders/OrdersPage';
import Profile from './pages/Profile';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManageUsers from './components/Admin/ManageUsers';
import ManageProducts from './components/Admin/ManageProducts';
import ManageOrders from './components/Admin/ManageOrders';
import MyProducts from './components/Farmer/MyProducts';
import WishlistPage from './components/Buyer/WishlistPage';
import FarmerOrders from './components/Farmer/FarmerOrders';

// Routes that should have sidebar - Added '/wishlist' and '/farmer-orders'
const sidebarRoutes = ['/dashboard', '/profile', '/orders', '/cart', '/products', '/wishlist', '/farmer-orders', '/products/new', '/my-products', '/admin', '/admin/users', '/admin/products', '/admin/orders'];

function AppContent() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const shouldShowSidebar = token && sidebarRoutes.some(route => location.pathname.startsWith(route));

  if (!token) {
    return (
      <>
        <Toaster position="top-right" />
        <Navbar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
        <Footer />
      </>
    );
  }

  if (shouldShowSidebar) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="app-wrapper">
          <Sidebar user={user} />
          <div className="main-content">
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="content-area fade-in">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/wishlist" element={user?.role === 'BUYER' ? <WishlistPage /> : <Navigate to="/products" />} />
                
                {/* Farmer Only Routes */}
                <Route path="/dashboard" element={user?.role === 'FARMER' ? <Dashboard /> : <Navigate to="/products" />} />
                <Route path="/products/new" element={user?.role === 'FARMER' ? <ProductForm /> : <Navigate to="/products" />} />
                <Route path="/my-products" element={user?.role === 'FARMER' ? <MyProducts /> : <Navigate to="/products" />} />
                <Route path="/farmer-orders" element={user?.role === 'FARMER' ? <FarmerOrders /> : <Navigate to="/products" />} />
                
                {/* Buyer Only Routes */}
                <Route path="/cart" element={user?.role === 'BUYER' ? <CartPage /> : <Navigate to="/products" />} />
                
                {/* Admin Only Routes */}
                <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
                <Route path="/admin/users" element={user?.role === 'ADMIN' ? <ManageUsers /> : <Navigate to="/" />} />
                <Route path="/admin/products" element={user?.role === 'ADMIN' ? <ManageProducts /> : <Navigate to="/" />} />
                <Route path="/admin/orders" element={user?.role === 'ADMIN' ? <ManageOrders /> : <Navigate to="/" />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wishlist" element={user?.role === 'BUYER' ? <WishlistPage /> : <Navigate to="/products" />} />
          <Route path="/dashboard" element={user?.role === 'FARMER' ? <Dashboard /> : <Navigate to="/products" />} />
          <Route path="/products/new" element={user?.role === 'FARMER' ? <ProductForm /> : <Navigate to="/products" />} />
          <Route path="/my-products" element={user?.role === 'FARMER' ? <MyProducts /> : <Navigate to="/products" />} />
          <Route path="/farmer-orders" element={user?.role === 'FARMER' ? <FarmerOrders /> : <Navigate to="/products" />} />
          <Route path="/cart" element={user?.role === 'BUYER' ? <CartPage /> : <Navigate to="/products" />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/admin/users" element={user?.role === 'ADMIN' ? <ManageUsers /> : <Navigate to="/" />} />
          <Route path="/admin/products" element={user?.role === 'ADMIN' ? <ManageProducts /> : <Navigate to="/" />} />
          <Route path="/admin/orders" element={user?.role === 'ADMIN' ? <ManageOrders /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;