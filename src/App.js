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
import EnrollmentForm from "./components/Enrollment/EnrollmentForm";
import AdminRegister from './components/Auth/AdminRegister';
import Quizzes from "./pages/Quizzes";
import Quiz1 from "./pages/Quiz1";
import Quiz2 from "./pages/Quiz2";
import Quiz3 from "./pages/Quiz3";
import Quiz4 from "./pages/Quiz4";
import Quiz5 from "./pages/Quiz5";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
                        <AdminDashboard />
                      ) : (
                        <UserDashboard />
                      )
                    }
                  />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/enroll" element={<EnrollmentForm />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<Register onRegister={handleLogin} />}
            />
            <Route path="/admin-register" element={<AdminRegister />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
      <Routes>
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quiz1" element={<Quiz1 />} />
        <Route path="/quiz2" element={<Quiz2 />} />
        <Route path="/quiz3" element={<Quiz3 />} />
        <Route path="/quiz4" element={<Quiz4 />} />
        <Route path="/quiz5" element={<Quiz5 />} />
      </Routes>
    </Router>
  );
}

export default App;