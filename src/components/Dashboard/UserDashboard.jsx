import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { courseAPI, enrollmentAPI } from '../../services/api';

const UserDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesResponse, enrollmentsResponse] = await Promise.all([
        courseAPI.getAll(),
        enrollmentAPI.getAll()
      ]);
      
      setCourses(coursesResponse.data);
      setEnrollments(enrollmentsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const userEnrollments = enrollments.filter(e => e.status !== 'REJECTED');
  const approvedCourses = userEnrollments.filter(e => e.status === 'APPROVED');
  const pendingCourses = userEnrollments.filter(e => e.status === 'PENDING');

  return (
    <div className="user-dashboard">
      <h1>Student Dashboard</h1>
      <p>Welcome to your learning journey</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <div className="number">{courses.length}</div>
        </div>
        <div className="stat-card">
          <h3>Approved Enrollments</h3>
          <div className="number">{approvedCourses.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pending Enrollments</h3>
          <div className="number">{pendingCourses.length}</div>
        </div>
      </div>
      
      <div className="enrollment-section">
        <h2>Your Enrollments</h2>
        
        {userEnrollments.length === 0 ? (
          <p>You haven't enrolled in any courses yet.</p>
        ) : (
          <div className="enrollment-list">
            {userEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="enrollment-card">
                <div className="enrollment-info">
                  <h3>{enrollment.courseTitle}</h3>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`status status-${enrollment.status.toLowerCase()}`}>
                      {enrollment.status}
                    </span>
                  </p>
                  <p>
                    <strong>Enrolled on:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>
                
                {enrollment.status === 'APPROVED' && (
                  <div className="enrollment-actions">
                    <Button variant="primary">
                      Start Learning
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="available-courses-section">
        <h2>Available Courses</h2>
        <p>Explore and enroll in new courses to continue your learning journey</p>
        
        <Button 
          onClick={() => window.location.href = '/courses'}
          variant="primary"
        >
          Browse All Courses
        </Button>
      </div>
    </div>
  );
};

export default UserDashboard;