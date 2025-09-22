import React, { useState } from 'react';
import Button from '../Common/Button';
import { enrollmentAPI } from '../../services/api';

const CourseCard = ({ course, onEnrollSuccess }) => {
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState('');

  const handleEnrollClick = async () => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
      setMessage('Please login to enroll in courses');
      return;
    }

    setEnrolling(true);
    setMessage('');

    try {
      const enrollmentData = {
        courseName: course.title,
        firstName: user.firstName,
        lastName: user.lastName
      };

      await enrollmentAPI.enroll(enrollmentData);
      setMessage('Enrollment request submitted successfully!');
      
      // Callback to parent component if needed
      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Enrollment failed. Please try again.');
      console.error('Enrollment error:', error);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="course-card">
      <div className="course-image">
        {course.image ? (
          <img 
            src={`http://localhost:8080/courses/media/${course.id}`} 
            alt={course.title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/112240/64ffda?text=Course+Image';
            }}
          />
        ) : (
          <div className="image-placeholder">No Image</div>
        )}
      </div>
      
      <div className="course-content">
        <h3>{course.title}</h3>
        <p className="course-description">
          {course.description && course.description.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description || 'No description available.'}
        </p>
        
        {message && (
          <div className={`enrollment-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="course-actions">
          <Button 
            onClick={handleEnrollClick}
            variant="primary"
            disabled={enrolling}
            className="enroll-btn"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;