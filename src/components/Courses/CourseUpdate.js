import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../Common/Button';
import { courseAPI } from '../../services/api';

const CourseUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await courseAPI.getById(id);
            const courseData = response.data;
            setCourse(courseData);
            setTitle(courseData.title);
            setDescription(courseData.description);
            if (courseData.id) {
                setPreviewImage(courseAPI.getImage(courseData.id));
            }
        } catch (error) {
            setMessage('Failed to load course details');
            console.error('Error fetching course:', error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            setMessage('Title and description are required');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            // For course updates
            const formData = new FormData();
            formData.append('id', id);
            formData.append('title', title);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }

            await courseAPI.update(formData);
            setMessage('Course updated successfully!');

            // Redirect after success
            setTimeout(() => {
                navigate('/courses');
            }, 2000);

        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to update course');
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/courses');
    };

    if (!course) {
        return (
            <div className="course-update-container">
                <div className="loading">Loading course details...</div>
            </div>
        );
    }

    return (
        <div className="course-update-container">
            <div className="update-form-card">
                <h2>Update Course</h2>

                {message && (
                    <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Course Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Course Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <div className="image-preview">
                                <img src={previewImage} alt="Preview" />
                                <p>Current/New Image Preview</p>
                            </div>
                        )}
                        <p className="help-text">
                            Leave empty to keep current image. Only JPEG and PNG files are supported.
                        </p>
                    </div>

                    <div className="form-actions">
                        <Button
                            type="submit"
                            disabled={loading}
                            variant="primary"
                        >
                            {loading ? 'Updating...' : 'Update Course'}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseUpdate;