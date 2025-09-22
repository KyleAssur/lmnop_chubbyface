import React, { useState, useEffect } from 'react';
import Button from '../Common/Button';
import { enrollmentAPI, courseAPI } from '../../services/api';

const AdminDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('enrollments'); // 'enrollments' or 'courses'
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    image: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsResponse, coursesResponse] = await Promise.all([
        enrollmentAPI.getAll(),
        courseAPI.getAll()
      ]);
      setEnrollments(enrollmentsResponse.data);
      setCourses(coursesResponse.data);
    } catch (error) {
      setMessage('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await enrollmentAPI.approve(id);
      setMessage('Enrollment approved successfully');
      fetchData(); // Refresh the list
    } catch (error) {
      setMessage('Failed to approve enrollment');
      console.error('Error approving enrollment:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await enrollmentAPI.reject(id);
      setMessage('Enrollment rejected successfully');
      fetchData(); // Refresh the list
    } catch (error) {
      setMessage('Failed to reject enrollment');
      console.error('Error rejecting enrollment:', error);
    }
  };

  const handleCourseInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setCourseForm({ ...courseForm, image: files[0] });
    } else {
      setCourseForm({ ...courseForm, [name]: value });
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!courseForm.title || !courseForm.description || !courseForm.image) {
      setMessage('Please fill all fields including the image');
      return;
    }

    const formData = new FormData();
    formData.append('title', courseForm.title);
    formData.append('description', courseForm.description);
    formData.append('image', courseForm.image);

    try {
      await courseAPI.create(formData);
      setMessage('Course created successfully!');
      setCourseForm({ title: '', description: '', image: null });
      setShowCourseForm(false);
      fetchData(); // Refresh courses list
    } catch (error) {
      setMessage('Failed to create course: ' + (error.response?.data?.message || error.message));
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await courseAPI.delete(courseId);
      setMessage('Course deleted successfully');
      fetchData(); // Refresh courses list
    } catch (error) {
      setMessage('Failed to delete course');
      console.error('Error deleting course:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <Button 
          variant={activeTab === 'enrollments' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('enrollments')}
        >
          Manage Enrollments
        </Button>
        <Button 
          variant={activeTab === 'courses' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('courses')}
        >
          Manage Courses
        </Button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Enrollments Tab */}
      {activeTab === 'enrollments' && (
        <div className="enrollment-section">
          <h2>Pending Enrollments</h2>
          
          {enrollments.length === 0 ? (
            <p>No pending enrollments</p>
          ) : (
            <div className="enrollment-list">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="enrollment-card">
                  <div className="enrollment-info">
                    <h3>{enrollment.courseTitle}</h3>
                    <p>
                      <strong>Student:</strong> {enrollment.studentFirstName} {enrollment.studentLastName}
                    </p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`status status-${enrollment.status.toLowerCase()}`}>
                        {enrollment.status}
                      </span>
                    </p>
                    <p>
                      <strong>Requested on:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {enrollment.status === 'PENDING' && (
                    <div className="enrollment-actions">
                      <Button 
                        variant="success" 
                        onClick={() => handleApprove(enrollment.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleReject(enrollment.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="courses-section">
          <div className="section-header">
            <h2>Manage Courses</h2>
            <Button 
              variant="primary" 
              onClick={() => setShowCourseForm(!showCourseForm)}
            >
              {showCourseForm ? 'Cancel' : 'Add New Course'}
            </Button>
          </div>

          {/* Course Creation Form */}
          {showCourseForm && (
            <div className="course-form-container">
              <form onSubmit={handleCourseSubmit} className="course-form">
                <div className="form-group">
                  <label htmlFor="title">Course Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={courseForm.title}
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={courseForm.description}
                    onChange={handleCourseInputChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">Course Image</label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleCourseInputChange}
                    required
                  />
                </div>

                <Button type="submit" variant="primary">
                  Create Course
                </Button>
              </form>
            </div>
          )}

          {/* Courses List */}
          <div className="courses-list">
            <h3>Existing Courses ({courses.length})</h3>
            
            {courses.length === 0 ? (
              <p>No courses available</p>
            ) : (
              <div className="course-grid">
                {courses.map((course) => (
                  <div key={course.id} className="course-card">
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
                      <h4>{course.title}</h4>
                      <p className="course-description">
                        {course.description.length > 100 
                          ? `${course.description.substring(0, 100)}...`
                          : course.description
                        }
                      </p>
                      
                      <div className="course-actions">
                        <Button 
                          variant="danger" 
                          onClick={() => handleDeleteCourse(course.id)}
                          size="small"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;