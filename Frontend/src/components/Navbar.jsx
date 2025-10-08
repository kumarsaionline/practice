import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaUser, 
  FaSignInAlt, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span>📝 TodoApp</span>
        </Link>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            <FaHome className="navbar-icon" />
            <span>Home</span>
          </Link>
          
          {isAuthenticated && (
            <>
              <Link to="/add-task" className="navbar-link" onClick={closeMenu}>
                <FaPlus className="navbar-icon" />
                <span>Add Task</span>
              </Link>
              <Link to="/tasks" className="navbar-link" onClick={closeMenu}>
                <FaList className="navbar-icon" />
                <span>View Tasks</span>
              </Link>
            </>
          )}
        </div>

        <div className={`navbar-auth ${isMenuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <div className="dropdown">
              <button className="dropdown-toggle">
                <FaUser className="navbar-icon" />
                <span>{user?.name}</span>
              </button>
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt className="navbar-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="navbar-link" onClick={closeMenu}>
              <FaSignInAlt className="navbar-icon" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;