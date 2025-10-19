import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../Common/Button';
import { userAPI, adminAPI, authUtils } from '../../services/api';

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

      const { token, ...userData } = response.data;

      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Call the onLogin callback with both user data and token
      onLogin(userData, token);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Access your LMNOP Learning Management System account</p>

          {error && (
              <div className="error-message">
                {typeof error === 'string' ? error : 'An error occurred during login'}
              </div>
          )}

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
                  disabled={loading}
                  placeholder="Enter your email"
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
                  disabled={loading}
                  placeholder="Enter your password"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    disabled={loading}
                />
                <span className="checkmark"></span>
                Login as Administrator
              </label>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="auth-btn"
                style={{ width: '100%' }}
            >
              {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Signing In...
                  </>
              ) : (
                  'Sign In'
              )}
            </Button>
          </form>

          <div className="auth-links">
            <p className="auth-link">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
            {!formData.isAdmin && (
                <p className="auth-link">
                  Are you an admin? <Link to="/admin-register">Create admin account</Link>
                </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Login;