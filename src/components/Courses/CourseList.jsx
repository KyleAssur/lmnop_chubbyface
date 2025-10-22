import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { courseAPI, authUtils } from '../../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const isAdmin = authUtils.hasRole('ADMIN');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on search term
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
      setFilteredCourses(response.data);
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.delete(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      // Show success message
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
        <div className="course-list-container">
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading courses...</p>
          </div>
        </div>
    );
  }

  if (error && courses.length === 0) {
    return (
        <div className="course-list-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
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

        {/* Admin Actions */}
        {isAdmin && (
            <div className="admin-actions-panel">
              <Link to="/course/create" className="btn btn-primary">
                <i className="fas fa-plus"></i>
                Create New Course
              </Link>
              <div className="admin-stats">
                <span>Total Courses: {courses.length}</span>
              </div>
            </div>
        )}

        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-input-container">
            <i className="fas fa-search"></i>
            <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            {searchTerm && (
                <button
                    onClick={() => setSearchTerm('')}
                    className="clear-search"
                >
                  <i className="fas fa-times"></i>
                </button>
            )}
          </div>
          {searchTerm && (
              <div className="search-results-info">
                Found {filteredCourses.length} course(s) matching "{searchTerm}"
              </div>
          )}
        </div>

        {error && courses.length > 0 && (
            <div className="error-message">
              {error}
            </div>
        )}

        {filteredCourses.length === 0 ? (
            <div className="no-courses">
              <i className="fas fa-book-open"></i>
              <h3>No courses found</h3>
              <p>
                {searchTerm
                    ? `No courses match your search for "${searchTerm}". Try different keywords.`
                    : 'No courses available at the moment. Please check back later or contact support if you believe this is an error.'
                }
              </p>
              {searchTerm && (
                  <button
                      onClick={() => setSearchTerm('')}
                      className="btn btn-secondary"
                  >
                    Clear Search
                  </button>
              )}
            </div>
        ) : (
            <>
              <div className="course-grid">
                {filteredCourses.map((course) => (
                    <div key={course.id} className="course-card-wrapper">
                      <CourseCard
                          course={course}
                          onEnrollSuccess={handleEnrollSuccess}
                      />

                      {/* Admin Actions */}
                      {isAdmin && (
                          <div className="admin-actions">
                            <Link
                                to={`/course/update/${course.id}`}
                                className="btn btn-warning btn-sm"
                            >
                              <i className="fas fa-edit"></i>
                              Edit
                            </Link>
                            <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="btn btn-danger btn-sm"
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          </div>
                      )}
                    </div>
                ))}
              </div>

              {/* Course Statistics */}
              <div className="course-statistics">
                <div className="stat-card">
                  <h4>Total Courses</h4>
                  <span className="stat-number">{courses.length}</span>
                </div>
                <div className="stat-card">
                  <h4>Showing</h4>
                  <span className="stat-number">{filteredCourses.length}</span>
                </div>
                {isAdmin && (
                    <div className="stat-card">
                      <h4>Admin Tools</h4>
                      <span className="stat-number">
                  <Link to="/course/create" className="btn-link">
                    Create New
                  </Link>
                </span>
                    </div>
                )}
              </div>
            </>
        )}
      </div>
  );
};

export default CourseList;