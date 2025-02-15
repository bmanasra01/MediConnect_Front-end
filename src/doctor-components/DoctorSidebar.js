import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/mediconnect.png';
import './DoctorSidebar.css'; 
import { FaUserMd } from 'react-icons/fa'; 
import { useNavigate } from "react-router-dom"; // ✅ استيراد useNavigate للتوجيه
import { FaSignOutAlt } from "react-icons/fa"; // ✅ أيقونة تسجيل الخروج
import  { useEffect, useState } from "react";
import axios from "./axiosConfig";




import {
  FaCalendarAlt,
  FaClock,
  FaComments,
  FaCog,
  FaUserInjured,
  FaUserCircle
} from 'react-icons/fa';




const DoctorSidebar = () => {
  const location = useLocation();

  const [doctor, setDoctor] = useState(null);


  const navigate = useNavigate(); // ✅ لإنشاء وظيفة التنقل بين الصفحات

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token"); // ✅ استخدم الاسم الصحيح للتوكن

    if (!token) {
      console.warn("No token found in localStorage, redirecting to login...");
      navigate("/"); // ✅ إعادة التوجيه إذا لم يكن هناك توكن
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Authorization": `Bearer ${token}`, // ✅ إرسال التوكن الصحيح في الهيدر
        },
      });

      if (response.ok) {
        console.log("Logged out successfully");
        localStorage.removeItem("access_token"); // ✅ حذف التوكن الصحيح
        navigate("/"); // ✅ إعادة التوجيه إلى صفحة تسجيل الدخول
      } else {
        console.error("Failed to log out:", await response.text());
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
};


  useEffect(() => {
    axios.get("/doctors/auth/me")
      .then((response) => {
        setDoctor(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch doctor data", error);
      });
  }, []);


  
  
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

        <li className={`DoctorSidebar-item ${location.pathname === '/doctor-profile' ? 'active' : ''}`}>
          <Link to="/doctor-profile">
            <FaUserCircle className="DoctorSidebar-icon" />
            <span>Profile</span>
          </Link>
        </li>

        <li className="DoctorSidebar-item" onClick={handleLogout}>
          <FaSignOutAlt className="DoctorSidebar-icon" /> {/* ✅ أيقونة تسجيل الخروج */}
          <span>LogOut</span>
        </li>

      </ul>

      {/* Doctor Profile */}
      <div className="DoctorSidebar-profile">
        <FaUserMd className="profile-icon" />
        <div className="profile-info">
          <span>{doctor?.user?.firstName} {doctor?.user?.lastName}</span>
          <span className="profile-role">{doctor?.specialization?.special_name}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;
