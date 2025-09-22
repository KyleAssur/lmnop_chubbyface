import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { courseAPI } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollSuccess = () => {
    // You could refresh the course list or show a global message
    console.log('Enrollment successful!');
  };

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-list-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchCourses} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h1>Available Courses</h1>
        <p>Browse our selection of courses and enroll in ones that interest you</p>
      </div>

      {courses.length === 0 ? (
        <div className="no-courses">
          <h3>No courses available at the moment</h3>
          <p>Please check back later or contact support if you believe this is an error.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnrollSuccess={handleEnrollSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;