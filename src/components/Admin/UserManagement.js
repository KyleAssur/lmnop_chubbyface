import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { userManagementAPI } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const [showUserForm, setShowUserForm] = useState(false);
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // NEW: Track user being edited
    const [editingAdmin, setEditingAdmin] = useState(null); // NEW: Track admin being edited

    const [userForm, setUserForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [adminForm, setAdminForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersResponse, adminsResponse] = await Promise.all([
                userManagementAPI.getAllUsers(),
                userManagementAPI.getAllAdmins()
            ]);
            setUsers(usersResponse.data);
            setAdmins(adminsResponse.data);
        } catch (error) {
            setMessage('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === 'user') {
            setUserForm({ ...userForm, [name]: value });
        } else {
            setAdminForm({ ...adminForm, [name]: value });
        }
    };

    // NEW: Handle Edit User
    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '' // Don't pre-fill password for security
        });
        setShowUserForm(true);
        setMessage('');
    };

    // NEW: Handle Edit Admin
    const handleEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setAdminForm({
            firstName: admin.firstName,
            lastName: admin.lastName,
            email: admin.email,
            password: '' // Don't pre-fill password for security
        });
        setShowAdminForm(true);
        setMessage('');
    };

    // UPDATED: Handle Create/Update User
    const handleSaveUser = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!userForm.firstName || !userForm.lastName || !userForm.email) {
            setMessage('Please fill all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userForm.email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        // Validate password length only if creating new user or changing password
        if ((!editingUser || userForm.password) && userForm.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            if (editingUser) {
                // UPDATE existing user
                const updateData = {
                    firstName: userForm.firstName,
                    lastName: userForm.lastName,
                    email: userForm.email
                };

                // Only include password if provided
                if (userForm.password) {
                    updateData.password = userForm.password;
                }

                await userManagementAPI.updateUser(editingUser.id, updateData);
                setMessage('User updated successfully!');
            } else {
                // CREATE new user
                await userManagementAPI.createUser(userForm);
                setMessage('User created successfully!');
            }

            resetForms();
            fetchData(); // Refresh users list
        } catch (error) {
            setMessage(`Failed to ${editingUser ? 'update' : 'create'} user: ${error.response?.data?.message || error.message}`);
        }
    };

    // UPDATED: Handle Create/Update Admin
    const handleSaveAdmin = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!adminForm.firstName || !adminForm.lastName || !adminForm.email) {
            setMessage('Please fill all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(adminForm.email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        // Validate password length only if creating new admin or changing password
        if ((!editingAdmin || adminForm.password) && adminForm.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            if (editingAdmin) {
                // UPDATE existing admin
                const updateData = {
                    firstName: adminForm.firstName,
                    lastName: adminForm.lastName,
                    email: adminForm.email
                };

                // Only include password if provided
                if (adminForm.password) {
                    updateData.password = adminForm.password;
                }

                await userManagementAPI.updateAdmin(editingAdmin.id, updateData);
                setMessage('Admin updated successfully!');
            } else {
                // CREATE new admin
                await userManagementAPI.createAdmin(adminForm);
                setMessage('Admin created successfully!');
            }

            resetForms();
            fetchData(); // Refresh admins list
        } catch (error) {
            setMessage(`Failed to ${editingAdmin ? 'update' : 'create'} admin: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await userManagementAPI.deleteUser(userId);
            setMessage('User deleted successfully');
            fetchData();
        } catch (error) {
            setMessage('Failed to delete user: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
            return;
        }

        try {
            await userManagementAPI.deleteUser(adminId);
            setMessage('Admin deleted successfully');
            fetchData();
        } catch (error) {
            setMessage('Failed to delete admin: ' + (error.response?.data?.message || error.message));
        }
    };

    // UPDATED: Reset forms function
    const resetForms = () => {
        setUserForm({ firstName: '', lastName: '', email: '', password: '' });
        setAdminForm({ firstName: '', lastName: '', email: '', password: '' });
        setEditingUser(null);
        setEditingAdmin(null);
        setShowUserForm(false);
        setShowAdminForm(false);
        setMessage('');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading">Loading users data...</div>;
    }

    return (
        <div className="user-management">
            <h1>User Management</h1>

            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <Button
                    variant={activeTab === 'users' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users ({users.length})
                </Button>
                <Button
                    variant={activeTab === 'admins' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('admins')}
                >
                    Manage Admins ({admins.length})
                </Button>
            </div>

            {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="users-section">
                    <div className="section-header">
                        <h2>Manage Regular Users</h2>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setEditingUser(null);
                                setShowUserForm(!showUserForm);
                            }}
                        >
                            {showUserForm ? 'Cancel' : 'Add New User'}
                        </Button>
                    </div>

                    {/* User Creation/Edit Form */}
                    {showUserForm && (
                        <div className="user-form-container">
                            <form onSubmit={handleSaveUser} className="user-form">
                                <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name *</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={userForm.firstName}
                                            onChange={(e) => handleUserInputChange(e, 'user')}
                                            required
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name *</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={userForm.lastName}
                                            onChange={(e) => handleUserInputChange(e, 'user')}
                                            required
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={userForm.email}
                                        onChange={(e) => handleUserInputChange(e, 'user')}
                                        required
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">
                                        Password {editingUser ? '(leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={userForm.password}
                                        onChange={(e) => handleUserInputChange(e, 'user')}
                                        placeholder={editingUser ? "Enter new password (optional)" : "Enter password (min 6 characters)"}
                                        minLength={editingUser ? "0" : "6"}
                                    />
                                </div>

                                <div className="form-actions">
                                    <Button type="submit" variant="primary">
                                        {editingUser ? 'Update User' : 'Create User'}
                                    </Button>
                                    <Button type="button" onClick={resetForms} variant="secondary">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Users List */}
                    <div className="users-list">
                        <h3>Existing Users ({users.length})</h3>

                        {users.length === 0 ? (
                            <p>No users found. Create your first user!</p>
                        ) : (
                            <div className="table-container">
                                <table className="users-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="user-name">
                                                    <strong>{user.firstName} {user.lastName}</strong>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className="role-badge role-user">USER</span>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => handleEditUser(user)}
                                                        size="small"
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        size="small"
                                                    >
                                                        <i className="fas fa-trash"></i> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Admins Tab */}
            {activeTab === 'admins' && (
                <div className="admins-section">
                    <div className="section-header">
                        <h2>Manage Administrators</h2>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setEditingAdmin(null);
                                setShowAdminForm(!showAdminForm);
                            }}
                        >
                            {showAdminForm ? 'Cancel' : 'Add New Admin'}
                        </Button>
                    </div>

                    {/* Admin Creation/Edit Form */}
                    {showAdminForm && (
                        <div className="admin-form-container">
                            <form onSubmit={handleSaveAdmin} className="admin-form">
                                <h3>{editingAdmin ? 'Edit Admin' : 'Create New Admin'}</h3>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="adminFirstName">First Name *</label>
                                        <input
                                            type="text"
                                            id="adminFirstName"
                                            name="firstName"
                                            value={adminForm.firstName}
                                            onChange={(e) => handleUserInputChange(e, 'admin')}
                                            required
                                            placeholder="Enter first name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="adminLastName">Last Name *</label>
                                        <input
                                            type="text"
                                            id="adminLastName"
                                            name="lastName"
                                            value={adminForm.lastName}
                                            onChange={(e) => handleUserInputChange(e, 'admin')}
                                            required
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="adminEmail">Email *</label>
                                    <input
                                        type="email"
                                        id="adminEmail"
                                        name="email"
                                        value={adminForm.email}
                                        onChange={(e) => handleUserInputChange(e, 'admin')}
                                        required
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="adminPassword">
                                        Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        id="adminPassword"
                                        name="password"
                                        value={adminForm.password}
                                        onChange={(e) => handleUserInputChange(e, 'admin')}
                                        placeholder={editingAdmin ? "Enter new password (optional)" : "Enter password (min 6 characters)"}
                                        minLength={editingAdmin ? "0" : "6"}
                                    />
                                </div>

                                <div className="form-actions">
                                    <Button type="submit" variant="primary">
                                        {editingAdmin ? 'Update Admin' : 'Create Admin'}
                                    </Button>
                                    <Button type="button" onClick={resetForms} variant="secondary">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Admins List */}
                    <div className="admins-list">
                        <h3>Existing Admins ({admins.length})</h3>

                        {admins.length === 0 ? (
                            <p>No admins found. Create your first admin!</p>
                        ) : (
                            <div className="table-container">
                                <table className="admins-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {admins.map((admin) => (
                                        <tr key={admin.id}>
                                            <td>
                                                <div className="user-name">
                                                    <strong>{admin.firstName} {admin.lastName}</strong>
                                                </div>
                                            </td>
                                            <td>{admin.email}</td>
                                            <td>
                                                <span className="role-badge role-admin">ADMIN</span>
                                            </td>
                                            <td>{formatDate(admin.createdAt)}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <Button
                                                        variant="warning"
                                                        onClick={() => handleEditAdmin(admin)}
                                                        size="small"
                                                    >
                                                        <i className="fas fa-edit"></i> Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        size="small"
                                                    >
                                                        <i className="fas fa-trash"></i> Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Statistics Summary */}
            <div className="user-statistics">
                <div className="stat-card">
                    <h4>Total Users</h4>
                    <div className="stat-number">{users.length}</div>
                </div>
                <div className="stat-card">
                    <h4>Total Admins</h4>
                    <div className="stat-number">{admins.length}</div>
                </div>
                <div className="stat-card">
                    <h4>Total Accounts</h4>
                    <div className="stat-number">{users.length + admins.length}</div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;