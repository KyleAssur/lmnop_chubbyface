import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import CourseList from "./components/Courses/CourseList";
import CourseUpdate from "./components/Courses/CourseUpdate";
import EnrollmentForm from "./components/Enrollment/EnrollmentForm";
import AdminRegister from './components/Auth/AdminRegister';
import Quizzes from "./pages/Quizzes";
import Quiz1 from "./pages/Quiz1";
import Quiz2 from "./pages/Quiz2";
import Quiz3 from "./pages/Quiz3";
import Quiz4 from "./pages/Quiz4";
import Quiz5 from "./pages/Quiz5";
import UserManagement from "./components/Admin/UserManagement"; // NEW IMPORT
import { authUtils } from "./services/api";
import "./styles/App.css";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  const user = authUtils.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authUtils.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const initializeAuth = () => {
      const isAuthenticated = authUtils.isAuthenticated();
      if (isAuthenticated) {
        const userData = authUtils.getCurrentUser();
        setUser(userData);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    // Token is already stored in localStorage by the Login component
  };

  const handleLogout = () => {
    setUser(null);
    authUtils.logout(); // This will clear storage and redirect
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
        <div className="app-loading">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        </div>
    );
  }

  return (
      <Router>
        <div className="app">
          {user ? (
              <>
                <Sidebar
                    isOpen={isSidebarOpen}
                    user={user}
                    onLogout={handleLogout}
                />
                <div
                    className={`main-content ${
                        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
                    }`}
                >
                  <Header onToggleSidebar={toggleSidebar} user={user} />
                  <div className="content">
                    <Routes>
                      <Route
                          path="/"
                          element={
                            user.role === "ADMIN" ? (
                                <ProtectedRoute requiredRole="ADMIN">
                                  <AdminDashboard />
                                </ProtectedRoute>
                            ) : (
                                <ProtectedRoute>
                                  <UserDashboard />
                                </ProtectedRoute>
                            )
                          }
                      />
                      <Route
                          path="/courses"
                          element={
                            <ProtectedRoute>
                              <CourseList />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/course/update/:id"
                          element={
                            <ProtectedRoute requiredRole="ADMIN">
                              <CourseUpdate />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/enroll"
                          element={
                            <ProtectedRoute requiredRole="USER">
                              <EnrollmentForm />
                            </ProtectedRoute>
                          }
                      />
                      {/* NEW USER MANAGEMENT ROUTE */}
                      <Route
                          path="/admin/users"
                          element={
                            <ProtectedRoute requiredRole="ADMIN">
                              <UserManagement />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quizzes"
                          element={
                            <ProtectedRoute>
                              <Quizzes />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quiz1"
                          element={
                            <ProtectedRoute>
                              <Quiz1 />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quiz2"
                          element={
                            <ProtectedRoute>
                              <Quiz2 />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quiz3"
                          element={
                            <ProtectedRoute>
                              <Quiz3 />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quiz4"
                          element={
                            <ProtectedRoute>
                              <Quiz4 />
                            </ProtectedRoute>
                          }
                      />
                      <Route
                          path="/quiz5"
                          element={
                            <ProtectedRoute>
                              <Quiz5 />
                            </ProtectedRoute>
                          }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </div>
              </>
          ) : (
              <Routes>
                <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <Login onLogin={handleLogin} />
                      </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                      <PublicRoute>
                        <Register onRegister={handleLogin} />
                      </PublicRoute>
                    }
                />
                <Route
                    path="/admin-register"
                    element={
                      <PublicRoute>
                        <AdminRegister />
                      </PublicRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
          )}
        </div>
      </Router>
  );
}

export default App;