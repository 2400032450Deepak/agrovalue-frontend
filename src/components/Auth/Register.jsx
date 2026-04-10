import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'BUYER'
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    // For phone number, only allow numbers and limit to 10 digits
    if (e.target.name === 'phone') {
      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [e.target.name]: value
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone number validation (10 digits)
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone || ''
    };

    const success = await register(registerData);

    setLoading(false);

    if (success) {
      navigate('/login');
    }

  };

  return (

    <div className="auth-wrapper">

      <div className="auth-card">

        <h2>🌾 Create Account</h2>

        <p className="auth-subtitle">
          Join AgroValue Connect today
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

          </div>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />

          </div>

          <div className="form-group">

            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength="10"
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />

          </div>

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />

          </div>

          <div className="form-group">

            <label>Register As</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >

              <option value="BUYER">
                Buyer
              </option>

              <option value="FARMER">
                Farmer
              </option>

            </select>

          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >

            {loading ? 'Creating Account...' : 'Create Account'}

          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>

          Already have an account?{' '}

          <Link to="/login" style={{ color: '#2d6a4f' }}>
            Login
          </Link>

        </p>

      </div>

    </div>

  );

};

export default Register;