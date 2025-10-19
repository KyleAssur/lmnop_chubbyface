import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, user, onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>LMNOP</h2>
        </div>
        <div className="sidebar-menu">
          <Link
              to="/"
              className={`menu-item ${isActive('/') ? 'active' : ''}`}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>

          <Link
              to="/courses"
              className={`menu-item ${isActive('/courses') ? 'active' : ''}`}
          >
            <i className="fas fa-book"></i>
            <span>Courses</span>
          </Link>

          {/* Quizzes Link - Available for all users */}
          <Link
              to="/quizzes"
              className={`menu-item ${isActive('/quizzes') ? 'active' : ''}`}
          >
            <i className="fas fa-question-circle"></i>
            <span>Quizzes</span>
          </Link>

          {user.role !== 'ADMIN' && (
              <Link
                  to="/enroll"
                  className={`menu-item ${isActive('/enroll') ? 'active' : ''}`}
              >
                <i className="fas fa-user-graduate"></i>
                <span>Enroll</span>
              </Link>
          )}

          {user.role === 'ADMIN' && (
              <>
                <div className="menu-section">Admin</div>
                <Link
                    to="/admin/users"
                    className={`menu-item ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  <i className="fas fa-users"></i>
                  <span>User Management</span>
                </Link>
                <Link
                    to="/admin/enrollments"
                    className={`menu-item ${isActive('/admin/enrollments') ? 'active' : ''}`}
                >
                  <i className="fas fa-clipboard-list"></i>
                  <span>Enrollments</span>
                </Link>
              </>
          )}
        </div>

        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
  );
};

export default Sidebar;