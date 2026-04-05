import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'General',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { title, description, priority, category, dueDate } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
    if (description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim() || 'General',
      };

      if (dueDate) {
        taskData.dueDate = dueDate;
      }

      await axios.post('/api/tasks', taskData);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-4">
            <div className="card-header">
              <h2>Add New Task</h2>
            </div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    name="title"
                    value={title}
                    onChange={onChange}
                    placeholder="Enter task title"
                    maxLength="100"
                  />
                  {errors.title && <div className="text-danger">{errors.title}</div>}
                  <small className="text-muted">{title.length}/100 characters</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Enter task description (optional)"
                    rows="4"
                    maxLength="500"
                  />
                  {errors.description && <div className="text-danger">{errors.description}</div>}
                  <small className="text-muted">{description.length}/500 characters</small>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-control"
                        name="priority"
                        value={priority}
                        onChange={onChange}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        name="category"
                        value={category}
                        onChange={onChange}
                        placeholder="Enter category"
                        maxLength="50"
                      />
                      <small className="text-muted">e.g., Work, Personal, Shopping</small>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date (Optional)</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={dueDate}
                    onChange={onChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating Task...' : 'Create Task'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate('/tasks')}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;