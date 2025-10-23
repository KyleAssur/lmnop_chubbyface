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
  const [imagePreview, setImagePreview] = useState('');

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

  // NEW: Handle reset enrollment
  const handleReset = async (id) => {
    try {
      await enrollmentAPI.reset(id);
      setMessage('Enrollment reset to pending successfully');
      fetchData(); // Refresh the list
    } catch (error) {
      setMessage('Failed to reset enrollment');
      console.error('Error resetting enrollment:', error);
    }
  };

  // NEW: Handle status change with dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      await enrollmentAPI.updateStatus(id, newStatus);
      setMessage(`Enrollment status updated to ${newStatus.toLowerCase()} successfully`);
      fetchData(); // Refresh the list
    } catch (error) {
      setMessage(`Failed to update enrollment status to ${newStatus}`);
      console.error('Error updating enrollment status:', error);
    }
  };

  const handleCourseInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setCourseForm({ ...courseForm, image: file });

      // Create preview
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview('');
      }
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

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(courseForm.image.type)) {
      setMessage('Please select a JPEG or PNG image file');
      return;
    }

    // Validate file size (5MB max)
    if (courseForm.image.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('title', courseForm.title);
    formData.append('description', courseForm.description);
    formData.append('image', courseForm.image);

    try {
      console.log('Creating course with:', {
        title: courseForm.title,
        description: courseForm.description,
        image: courseForm.image.name,
        imageSize: courseForm.image.size
      });

      const response = await courseAPI.create(formData);
      console.log('Course creation response:', response);

      setMessage('Course created successfully!');
      setCourseForm({ title: '', description: '', image: null });
      setImagePreview('');
      setShowCourseForm(false);
      fetchData(); // Refresh courses list
    } catch (error) {
      console.error('Course creation error:', error);
      setMessage('Failed to create course: ' + (error.response?.data?.message || error.message));
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

  const resetCourseForm = () => {
    setCourseForm({ title: '', description: '', image: null });
    setImagePreview('');
    setShowCourseForm(false);
  };

  // Helper function to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-pending';
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
            Manage Enrollments ({enrollments.filter(e => e.status === 'PENDING').length})
          </Button>
          <Button
              variant={activeTab === 'courses' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('courses')}
          >
            Manage Courses ({courses.length})
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
              <h2>Enrollment Management</h2>

              {enrollments.length === 0 ? (
                  <p>No enrollments found</p>
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
                              <span className={`status ${getStatusClass(enrollment.status)}`}>
                                {enrollment.status}
                              </span>
                            </p>
                            <p>
                              <strong>Requested on:</strong> {enrollment.enrollmentDate ? new Date(enrollment.enrollmentDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>

                          <div className="enrollment-actions">
                            {/* Quick Action Buttons */}
                            {enrollment.status === 'PENDING' && (
                                <>
                                  <Button
                                      variant="success"
                                      onClick={() => handleApprove(enrollment.id)}
                                      size="small"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                      variant="danger"
                                      onClick={() => handleReject(enrollment.id)}
                                      size="small"
                                  >
                                    Reject
                                  </Button>
                                </>
                            )}

                            {/* Reset Button for Approved/Rejected enrollments */}
                            {(enrollment.status === 'APPROVED' || enrollment.status === 'REJECTED') && (
                                <Button
                                    variant="warning"
                                    onClick={() => handleReset(enrollment.id)}
                                    size="small"
                                >
                                  Reset to Pending
                                </Button>
                            )}

                            {/* Status Dropdown for All Enrollments */}
                            <div className="status-dropdown">
                              <label htmlFor={`status-${enrollment.id}`}>Change Status:</label>
                              <select
                                  id={`status-${enrollment.id}`}
                                  value={enrollment.status}
                                  onChange={(e) => handleStatusChange(enrollment.id, e.target.value)}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                              </select>
                            </div>
                          </div>
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
                        <label htmlFor="title">Course Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={courseForm.title}
                            onChange={handleCourseInputChange}
                            required
                            placeholder="Enter course title"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={courseForm.description}
                            onChange={handleCourseInputChange}
                            rows="4"
                            required
                            placeholder="Enter course description"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="image">Course Image *</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/jpeg, image/png, image/jpg"
                            onChange={handleCourseInputChange}
                            required
                        />
                        <small>Only JPEG and PNG files allowed (max 5MB)</small>

                        {imagePreview && (
                            <div className="image-preview">
                              <img src={imagePreview} alt="Preview" />
                              <p>Image Preview</p>
                            </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <Button type="submit" variant="primary">
                          Create Course
                        </Button>
                        <Button type="button" onClick={resetCourseForm} variant="secondary">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
              )}

              {/* Courses List */}
              <div className="courses-list">
                <h3>Existing Courses ({courses.length})</h3>

                {courses.length === 0 ? (
                    <p>No courses available. Create your first course!</p>
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
                                {course.description && course.description.length > 100
                                    ? `${course.description.substring(0, 100)}...`
                                    : course.description || 'No description available'
                                }
                              </p>

                              <div className="course-actions">
                                <Button
                                    variant="warning"
                                    onClick={() => window.location.href = `/course/update/${course.id}`}
                                    size="small"
                                >
                                  Edit
                                </Button>
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