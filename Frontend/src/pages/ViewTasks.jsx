import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaClock, 
  FaPlay,
  FaFilter,
  FaSearch
} from 'react-icons/fa';

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      
      const res = await axios.get(`/api/tasks?${params.toString()}`);
      let filteredTasks = res.data.tasks;

      // Client-side search filter
      if (filters.search) {
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          task.category.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTasks(filteredTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      toast.success('Task status updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        toast.success('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/tasks/${editingTask._id}`, {
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        category: editingTask.category,
        dueDate: editingTask.dueDate
      });
      toast.success('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck className="text-success" />;
      case 'in-progress': return <FaPlay className="text-warning" />;
      default: return <FaClock className="text-secondary" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="tasks-header">
        <h1>My Tasks</h1>
        <Link to="/add-task" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-section card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">
                  <FaSearch className="me-2" />
                  Search
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">
                  <FaFilter className="me-2" />
                  Status
                </label>
                <select
                  className="form-control"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-control"
                  value={filters.priority}
                  onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                >
                  <option value="">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label className="form-label">Actions</label>
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => setFilters({ status: '', priority: '', search: '' })}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="no-tasks card">
            <div className="card-body text-center">
              <h3>No tasks found</h3>
              <p>You haven't created any tasks yet or they don't match your filters.</p>
              <Link to="/add-task" className="btn btn-primary">
                Create Your First Task
              </Link>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-card card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}>
              <div className="card-body">
                {editingTask && editingTask._id === task._id ? (
                  /* Edit Mode */
                  <div className="edit-form">
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <textarea
                        className="form-control"
                        value={editingTask.description}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <select
                          className="form-control"
                          value={editingTask.priority}
                          onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Category"
                          value={editingTask.category}
                          onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className="form-control"
                          value={editingTask.dueDate ? editingTask.dueDate.split('T')[0] : ''}
                          onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="edit-actions mt-3">
                      <button className="btn btn-success btn-sm" onClick={handleSaveEdit}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingTask(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="task-header">
                      <div className="task-status">
                        {getStatusIcon(task.status)}
                      </div>
                      <h4 className="task-title">{task.title}</h4>
                      <div className="task-priority">
                        <span
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}

                    <div className="task-meta">
                      <div className="task-category">
                        <strong>Category:</strong> {task.category}
                      </div>
                      <div className="task-due-date">
                        <strong>Due:</strong> {formatDate(task.dueDate)}
                        {isOverdue(task.dueDate, task.status) && (
                          <span className="overdue-label">Overdue!</span>
                        )}
                      </div>
                      <div className="task-created">
                        <strong>Created:</strong> {formatDate(task.createdAt)}
                      </div>
                    </div>

                    <div className="task-actions">
                      <div className="status-buttons">
                        <button
                          className={`btn btn-sm ${task.status === 'pending' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                          onClick={() => handleStatusChange(task._id, 'pending')}
                          disabled={task.status === 'pending'}
                        >
                          Pending
                        </button>
                        <button
                          className={`btn btn-sm ${task.status === 'in-progress' ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => handleStatusChange(task._id, 'in-progress')}
                          disabled={task.status === 'in-progress'}
                        >
                          In Progress
                        </button>
                        <button
                          className={`btn btn-sm ${task.status === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleStatusChange(task._id, 'completed')}
                          disabled={task.status === 'completed'}
                        >
                          Completed
                        </button>
                      </div>

                      <div className="action-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(task)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(task._id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewTasks;