import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/mediconnect.png';
import './DoctorSidebar.css'; 
import { FaUserMd } from 'react-icons/fa'; 
import {
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaCog,
  FaUserInjured,
} from 'react-icons/fa';

const DoctorSidebar = () => {
  const location = useLocation();

  return (
    <div className="DoctorSidebar">
    {/* Logo */}
    <div className="DoctorSidebar-logo">
        <Link to="/doctor-dashboard">
          <img src={logo} alt="MediConnect Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="DoctorSidebar-menu">
        <li className={`DoctorSidebar-item ${location.pathname === '/appointments' ? 'active' : ''}`}>
          <Link to="/appointments">
            <FaCalendarAlt className="DoctorSidebar-icon" />
            <span>Appointment</span>
          </Link>
        </li>
        
              <li className={`DoctorSidebar-item ${location.pathname === '/bappointments' ? 'active' : ''}`}>
        <Link to="/bappointments">
          <FaClock className="DoctorSidebar-icon" />
          <span>Book Appointment</span>
        </Link>
      </li>

        <li className={`DoctorSidebar-item ${location.pathname === '/patients' ? 'active' : ''}`}>
          <Link to="/patients">
            <FaUserInjured className="DoctorSidebar-icon" />
            <span>Patients</span>
          </Link>
        </li>

        <li className={`DoctorSidebar-item ${location.pathname === '/chat' ? 'active' : ''}`}>
          <Link to="/chat">
            <FaComments className="DoctorSidebar-icon" />
            <span>Chat</span>
          </Link>
        </li>

        <li className={`DoctorSidebar-item ${ location.pathname === "/doctor-visits" ? "active" : "" }`}>
          <Link to="/doctor-visits">
            <FaCalendarAlt className="DoctorSidebar-icon" /> {/* Change icon if needed */}
            <span>Doctor Visits</span>
          </Link>
        </li>

      </ul>

      {/* Bottom Links */}
      <ul className="DoctorSidebar-bottom-menu">

        <li className={`DoctorSidebar-item ${location.pathname === '/settings/schedule' ? 'active' : ''}`}>
          <Link to="/settings/schedule">
            <FaCog className="DoctorSidebar-icon" />
            <span>Schedule Settings</span>
          </Link>
        </li>

        <li className="DoctorSidebar-item">
        <Link to="/">
          <FaCog className="DoctorSidebar-icon" />
          <span>LogOut</span>
        </Link>
      </li>

      </ul>

      {/* Doctor Profile */}
      <div className="DoctorSidebar-profile">
      <FaUserMd className="profile-icon" />
        <div className="profile-info">
          <span>Dr. James Martin</span>
          <span className="profile-role">Cardiac Surgeon</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;
