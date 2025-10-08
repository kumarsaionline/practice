import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaList, FaUser, FaTasks } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="home-hero">
          <h1>Welcome to TodoApp</h1>
          <p className="lead">
            Organize your life, one task at a time. Create, manage, and track your todos effortlessly.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaPlus className="feature-icon" />
              <h3>Easy Task Creation</h3>
              <p>Quickly add tasks with descriptions, priorities, and due dates</p>
            </div>
            <div className="feature-card">
              <FaList className="feature-icon" />
              <h3>Organize Your Tasks</h3>
              <p>View, filter, and manage all your tasks in one place</p>
            </div>
            <div className="feature-card">
              <FaTasks className="feature-icon" />
              <h3>Track Progress</h3>
              <p>Monitor your productivity with task statistics and completion rates</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Ready to tackle your tasks today?</p>
        </div>

        <div className="quick-actions">
          <div className="action-cards">
            <Link to="/add-task" className="action-card">
              <div className="action-icon">
                <FaPlus />
              </div>
              <div className="action-content">
                <h3>Add Task</h3>
                <p>Create a new task with details</p>
              </div>
            </Link>

            <Link to="/tasks" className="action-card">
              <div className="action-icon">
                <FaList />
              </div>
              <div className="action-content">
                <h3>View Tasks</h3>
                <p>See all your tasks and manage them</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;