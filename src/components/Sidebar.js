// Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/mediconnect.png';
import { FaUserMd, FaClinicMedical, FaDisease, FaStream, FaBell, FaCog, FaUserShield ,FaListAlt,FaClipboardList} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="MediConnect Logo" />
      </div>

      {/* Top Navigation Links */}
      <div className="sidebar-menu-top">
        <ul className="sidebar-menu">
          <li className={`sidebar-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}>
            <Link to="/admin-dashboard">
              <FaStream className="sidebar-icon" />
              <span>Overview</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === '/doctors' ? 'active' : ''}`}>
            <Link to="/doctors">
              <FaUserMd className="sidebar-icon" />
              <span>Doctors</span>
            </Link>
          </li>
          <li className={`sidebar-item ${location.pathname === '/clinics' ? 'active' : ''}`}>
          <Link to="/clinics">
            <FaClinicMedical className="sidebar-icon" />
            <span>Clinic</span>
          </Link>
        </li>
          

          <li className={`sidebar-item ${location.pathname === '/specializations' ? 'active' : ''}`}>
          <Link to="/specializations">
            <FaStream className="sidebar-icon" />
            <span>Specialization</span>
          </Link>
        </li>

        <li className={`sidebar-item ${location.pathname === '/categories' ? 'active' : ''}`}>
          <Link to="/categories">
            <FaListAlt className="sidebar-icon" /> {/* Replace FaListAlt with the appropriate icon if needed */}
              <span>Categories</span>
          </Link>
        </li>

        <li className={`sidebar-item ${location.pathname === "/procedures" ? "active" : ""}`}>
        <Link to="/procedures">
          <FaClipboardList className="sidebar-icon" /> {/* Replace with another icon if desired */}
          <span>Procedures</span>
        </Link>
      </li>

         
        </ul>
      </div>

      {/* Bottom Navigation Links */}
      <div className="sidebar-menu-bottom">
        <ul className="sidebar-menu">
          
          <li className="sidebar-item">
            <Link to="#">
              <FaCog className="sidebar-icon" />
              <span>Settings</span>
            </Link>
          </li>

          <li className="sidebar-item">
        <Link to="/">
          <FaCog className="sidebar-icon" />
          <span>LogOut</span>
        </Link>
      </li>
        </ul>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <span>admin admin</span>
          <span className="profile-role">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
