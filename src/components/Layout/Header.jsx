import React from 'react';
import Button from '../Common/Button';

const Header = ({ onToggleSidebar, user }) => {
  return (
    <div className="header">
      <div className="header-left">
        <Button onClick={onToggleSidebar} className="menu-toggle">
          <i className="fas fa-bars"></i>
        </Button>
        <h1>LMNOP Learning Management System</h1>
      </div>
      {user && (
        <div className="user-info">
          <span>Welcome, {user.firstName} {user.lastName}</span>
          <span className="user-role">({user.role})</span>
        </div>
      )}
    </div>
  );
};

export default Header;