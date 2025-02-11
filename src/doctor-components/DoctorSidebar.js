import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/mediconnect.png';
import './DoctorSidebar.css'; 

import {
  FaCalendarAlt,
  FaUserPlus,
  FaClock,
  FaFileAlt,
  FaComments,
  FaBell,
  FaCog,
  FaUserInjured,
} from 'react-icons/fa';

const DoctorSidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
    {/* Logo */}
    <div className="sidebar-logo">
        <Link to="/doctor-dashboard">
          <img src={logo} alt="MediConnect Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-menu">
        <li className={`sidebar-item ${location.pathname === '/appointments' ? 'active' : ''}`}>
          <Link to="/appointments">
            <FaCalendarAlt className="sidebar-icon" />
            <span>Appointment</span>
          </Link>
        </li>
        
              <li className={`sidebar-item ${location.pathname === '/bappointments' ? 'active' : ''}`}>
        <Link to="/bappointments">
          <FaClock className="sidebar-icon" />
          <span>Book Appointment</span>
        </Link>
      </li>

        <li className={`sidebar-item ${location.pathname === '/documents' ? 'active' : ''}`}>
          <Link to="/documents">
            <FaFileAlt className="sidebar-icon" />
            <span>Documents</span>
          </Link>
        </li>

        <li className={`sidebar-item ${location.pathname === '/patients' ? 'active' : ''}`}>
          <Link to="/patients">
            <FaUserInjured className="sidebar-icon" />
            <span>Patients</span>
          </Link>
        </li>

        <li className={`sidebar-item ${location.pathname === '/chat' ? 'active' : ''}`}>
          <Link to="/chat">
            <FaComments className="sidebar-icon" />
            <span>Chat</span>
          </Link>
        </li>

        <li className={`sidebar-item ${ location.pathname === "/doctor-visits" ? "active" : "" }`}>
          <Link to="/doctor-visits">
            <FaCalendarAlt className="sidebar-icon" /> {/* Change icon if needed */}
            <span>Doctor Visits</span>
          </Link>
        </li>

      </ul>

      {/* Bottom Links */}
      <ul className="sidebar-bottom-menu">
        <li className={`sidebar-item ${location.pathname === '/notifications' ? 'active' : ''}`}>
          <Link to="/notifications">
            <FaBell className="sidebar-icon" />
            <span>Notification</span>
          </Link>
        </li>
        {/* <li className={`sidebar-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Link to="/settings">
            <FaCog className="sidebar-icon" />
            <span>Settings</span>
          </Link>
        </li> */}

        <li className={`sidebar-item ${location.pathname === '/settings/schedule' ? 'active' : ''}`}>
          <Link to="/settings/schedule">
            <FaCog className="sidebar-icon" />
            <span>Schedule Settings</span>
          </Link>
        </li>




        <li className="sidebar-item">
        <Link to="/">
          <FaCog className="sidebar-icon" />
          <span>LogOut</span>
        </Link>
      </li>

      </ul>

      {/* Doctor Profile */}
      <div className="sidebar-profile">
        <img
          src="/path/to/profile/image.png"
          alt="Doctor Profile"
          className="profile-image"
        />
        <div className="profile-info">
          <span>Dr. James Martin</span>
          <span className="profile-role">Cardiac Surgeon</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;
