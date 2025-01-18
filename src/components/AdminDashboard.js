// AdminDashboard.js
import React from 'react';
import Sidebar from './Sidebar';
import DashboardCard from './DashboardCard';
import { FaUserMd, FaHospital, FaProcedures } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-cards">
          <DashboardCard
            title="Doctors"
            value="1500"
            percentage={5.11}
            icon={FaUserMd}
            iconColor="#a3c293"
            percentageColor="#34a853"
          />
          <DashboardCard
            title="Hospital"
            value="248"
            percentage={7.11}
            icon={FaHospital}
            iconColor="#a3c293"
            percentageColor="#34a853"
          />
          <DashboardCard
            title="Patients"
            value="84756"
            percentage={5.11}
            icon={FaProcedures}
            iconColor="#a3c293"
            percentageColor="#fbbc05"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
