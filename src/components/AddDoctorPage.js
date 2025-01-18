import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import Sidebar from './Sidebar';
import './AddDoctorPage.css';

const AddDoctorPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [doctorData, setDoctorData] = useState({
    doctorId: '',
    gender: 'MALE',
    special_name: '',
    user: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('/admin/specializations');
        setSpecializations(response.data);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError('Failed to fetch specializations.');
      }
    };

    fetchSpecializations();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('user.')) {
      const key = name.split('.')[1];
      setDoctorData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [key]: value },
      }));
    } else {
      setDoctorData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  // Confirm and send doctor data
  const confirmAddDoctor = async () => {
    setShowConfirmation(false);
    setError('');
    setSuccess('');

    try {
      const userID = doctorData.doctorId; // Use doctorId as UserID automatically
      const finalDoctorData = {
        ...doctorData,
        user: {
          ...doctorData.user,
          UserID: userID, // Set UserID programmatically
        },
      };

      console.log('[DEBUG] Final Payload:', finalDoctorData);

      const response = await axios.post('/admin/doctors/', finalDoctorData);
      console.log('Doctor added successfully:', response.data);

      setSuccess('Doctor added successfully!');
      setDoctorData({
        doctorId: '',
        gender: 'MALE',
        special_name: '',
        user: {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          dateOfBirth: '',
        },
      });
    } catch (err) {
      console.error('Error adding doctor:', err.response?.data || err.message);
      setError('Failed to add doctor. Please try again.');
    }
  };

  return (
    <div className="add-doctor-page-container">
      <Sidebar />

      <div className="add-doctor-page-content">
        <h2>Add Doctor</h2>
        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-group">
            <label>Doctor ID</label>
            <input
              type="text"
              name="doctorId"
              value={doctorData.doctorId}
              onChange={handleChange}
              placeholder="Enter Doctor ID"
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={doctorData.gender}
              onChange={handleChange}
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <select
              name="special_name"
              value={doctorData.special_name}
              onChange={handleChange}
              required
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec.special_name}>
                  {spec.special_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="user.email"
              value={doctorData.user.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="user.password"
              value={doctorData.user.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="user.firstName"
              value={doctorData.user.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="user.lastName"
              value={doctorData.user.lastName}
              onChange={handleChange}
              placeholder="Enter Last Name"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="user.phone"
              value={doctorData.user.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="user.dateOfBirth"
              value={doctorData.user.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                setDoctorData({
                  doctorId: '',
                  gender: 'MALE',
                  special_name: '',
                  user: {
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    dateOfBirth: '',
                  },
                })
              }
            >
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add Doctor
            </button>
          </div>
        </form>

        {showConfirmation && (
          <div className="confirmation-dialog">
            <h3>Confirm Doctor Details</h3>
            <ul>
              <li>Doctor ID: {doctorData.doctorId}</li>
              <li>Gender: {doctorData.gender}</li>
              <li>Specialization: {doctorData.special_name}</li>
              <li>Email: {doctorData.user.email}</li>
              <li>First Name: {doctorData.user.firstName}</li>
              <li>Last Name: {doctorData.user.lastName}</li>
              <li>Phone: {doctorData.user.phone}</li>
              <li>Date of Birth: {doctorData.user.dateOfBirth}</li>
            </ul>
            <button onClick={confirmAddDoctor} className="confirm-button">
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default AddDoctorPage;
