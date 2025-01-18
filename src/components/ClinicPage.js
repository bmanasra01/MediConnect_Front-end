// ClinicPage.js
import React, { useEffect, useState } from 'react';
import axios from './axiosConfig'; 
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import './ClinicPage.css';

const ClinicPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('/admin/clinics', {
          params: {
            page: 1,
            size: 10,
            search: searchTerm,
          },
        });

        setClinics(response.data.content); // Assuming data is in `content`
      } catch (error) {
        console.error('Error fetching clinic data:', error);
        setError('Failed to load clinics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, [searchTerm]);

  if (loading) return <p>Loading clinics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="clinic-page">
      <Sidebar />
      <div className="content">
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
          <button className="add-clinic-button" onClick={() => navigate('/add-clinic')}>
            + Add Clinic
          </button>
        </div>

        <h2>Clinic List</h2>
        <table className="clinic-table">
          <thead>
            <tr>
              <th>Clinic ID</th>
              <th>Clinic Name</th>
              <th>Address</th>
              
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic.clinicId}>
                <td>{clinic.clinicId}</td>
                <td>{clinic.clinicName}</td>
                <td>{clinic.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClinicPage;
