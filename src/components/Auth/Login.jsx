import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import { userAPI, adminAPI } from '../../services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isAdmin: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (formData.isAdmin) {
        response = await adminAPI.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await userAPI.login({
          email: formData.email,
          password: formData.password
        });
      }
      if (formData.isAdmin) {
  response = await adminAPI.login({
    email: formData.email,
    password: formData.password
  });
} else {
  response = await userAPI.login({
    email: formData.email,
    password: formData.password
  });
}
      
      // Add role to user data
      const userData = {
        ...response.data,
        role: formData.isAdmin ? 'ADMIN' : 'USER'
      };
      
      onLogin(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Access your LMNOP Learning Management System account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              Login as Administrator
            </label>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="auth-btn"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;