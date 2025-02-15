import React, { useState } from 'react';
import axios from './axiosConfig'; // Axios instance
import './AddClinicPage.css'; // CSS for styling
import Sidebar from './Sidebar';


const AddClinicPage = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    clinicName: '',
    address: '',
    street: '',
    phone: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/clinics/', formData);
      console.log('Clinic added successfully:', response.data);
      setSuccessMessage('Clinic added successfully!');
      setErrorMessage('');
      setFormData({
        clinicName: '',
        address: '',
        street: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error adding clinic:', error.response || error.message);
      setErrorMessage('Failed to add clinic. Please try again.');
      setSuccessMessage('');
    }
  };

  
  return (


    <div className="add-clinic-container">
            <Sidebar />

      <h1>Add Clinic</h1>
      <div className="add-clinic-content">

      <form className="add-clinic-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="clinicName">Clinic Name</label>
          <input
            type="text"
            id="clinicName"
            name="clinicName"
            value={formData.clinicName}
            onChange={handleChange}
            placeholder="Enter clinic name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Enter street"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="add-button">Add Clinic</button>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
        
        
          </div>

      
    </div>
  );
};

export default AddClinicPage;
