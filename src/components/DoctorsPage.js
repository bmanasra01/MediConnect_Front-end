// DoctorsPage.js
import React, { useEffect, useState } from 'react';
import axios from './axiosConfig'; // Import the configured Axios instance
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DoctorsPage.css';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate(); // Initialize navigate


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/admin/user', {
          params: {
            page: 1,
            size: 10,
            search: searchTerm, // Search term used for filtering
            role: 'DOCTOR',
          },
        });

        setDoctors(response.data.content); // Assuming data is in `content`
      } catch (error) {
        console.error('Error fetching doctors data:', error);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchTerm]); // Re-fetch doctors whenever the search term changes

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="doctors-page">
      <Sidebar />
      <div className="content">
        {/* Header with search bar, notification icons, and "Add Doctor" button */}
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <div className="icons">
            <i className="fas fa-bell"></i>
            <i className="fas fa-comment"></i>
          </div>
          <button className="add-doctor-button" onClick={() => navigate('/add-doctor')}> {/* Add click handler */}
            + Add Doctor
          </button>
        </div>

        <h2>Doctors List</h2>
        <table className="doctors-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor.userID}>
                <td>{doctor.userID}</td>
                <td>{doctor.email}</td>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.dateOfBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorsPage;
