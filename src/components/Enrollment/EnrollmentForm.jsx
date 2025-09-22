import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import { courseAPI, enrollmentAPI } from '../../services/api';

const EnrollmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      setMessage('Failed to fetch courses');
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      setMessage('Please select a course');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Get user data from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      
      const enrollmentData = {
        courseName: selectedCourse,
        firstName: user.firstName,
        lastName: user.lastName
      };

      await enrollmentAPI.enroll(enrollmentData);
      setMessage('Enrollment request submitted successfully!');
      setSelectedCourse('');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Enrollment failed');
      console.error('Enrollment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enrollment-form-container">
      <div className="form-card">
        <h2>Enroll in a Course</h2>
        <p>Select a course from the list below to request enrollment</p>
        
        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseSelect">Select Course:</label>
            <select
              id="courseSelect"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              required
            >
              <option value="">-- Select a Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button 
              type="submit" 
              disabled={loading || !selectedCourse}
              variant="primary"
            >
              {loading ? 'Submitting...' : 'Request Enrollment'}
            </Button>
            <Button 
              type="button" 
              onClick={() => navigate('/courses')}
              variant="secondary"
            >
              Browse Courses
            </Button>
          </div>
        </form>

        <div className="enrollment-info">
          <h3>Enrollment Process</h3>
          <ol>
            <li>Select a course from the dropdown</li>
            <li>Submit your enrollment request</li>
            <li>Wait for admin approval (usually within 24 hours)</li>
            <li>Once approved, the course will appear in your dashboard</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;