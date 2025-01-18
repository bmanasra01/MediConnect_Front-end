import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import DoctorSidebar from './DoctorSidebar'; // Sidebar component
import './PatientsPage.css';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch patients data from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('/doctors/patients', {
          params: {
            page: 1,
            size: 100,
            search: searchTerm,
          },
        });
        setPatients(response.data.content);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isNaN(searchTerm)) {
      navigate(`/patient-profile/${searchTerm}`);
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="patients-page">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <div className="patients-content">
        <h1>Patients</h1>

        {/* Search Bar */}
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name, ID, email, or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <button
            className="add-patient-button"
            onClick={() => navigate('/add-patient')}
          >
            + Add Patient
          </button>
        </div>

        {/* Patients Table */}
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.patientId}
                onClick={() => navigate(`/patient-profile/${patient.patientId}`)} // Redirect to profile
              >
                <td>{patient.patientId}</td>
                <td>{patient.user.firstName}</td>
                <td>{patient.user.lastName}</td>
                <td>{patient.gender}</td>
                <td>{patient.user.email}</td>
                <td>{patient.user.phone}</td>
                <td>{patient.user.dateOfBirth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsPage;
