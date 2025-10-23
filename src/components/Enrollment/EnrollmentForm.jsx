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
      console.log('Fetching courses...');
      const response = await courseAPI.getAll();
      console.log('Courses fetched:', response.data);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Failed to fetch courses. Please try again.');
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
      console.log('User from localStorage:', user);

      if (!user || !user.firstName || !user.lastName) {
        setMessage('User information not found. Please log in again.');
        setLoading(false);
        return;
      }

      const enrollmentData = {
        courseName: selectedCourse,
        firstName: user.firstName,
        lastName: user.lastName
      };

      console.log('Sending enrollment data:', enrollmentData);

      const response = await enrollmentAPI.enroll(enrollmentData);
      console.log('Enrollment response:', response);

      setMessage('Enrollment request submitted successfully!');
      setSelectedCourse('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Full enrollment error:', error);
      console.error('Error response:', error.response);

      let errorMessage = 'Enrollment failed. Please try again.';

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }

      setMessage(errorMessage);
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
                  disabled={loading}
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
                  disabled={loading}
              >
                Browse Courses
              </Button>
              <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  disabled={loading}
              >
                Back to Dashboard
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