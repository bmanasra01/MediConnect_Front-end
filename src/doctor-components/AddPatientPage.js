import React, { useState } from "react";
import axios from "./axiosConfig";
import DoctorSidebar from "./DoctorSidebar"; 
import "./AddPatientPage.css"; 

const AddPatientPage = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    height: "",
    weight: "",
    remarks: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddPatient = async () => {
    const {
      patientId,
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      bloodType,
      height,
      weight,
      remarks,
    } = formData;

    const patientData = {
      patientId: Number(patientId),
      user: {
        userID: Number(patientId),
        email,
        password,
        firstName,
        lastName,
        phone,
        dateOfBirth,
      },
      bloodType: bloodType || null,
      gender: gender || null,
      dateOfBirth,
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      remarks: remarks || null,
    };

    try {
      const response = await axios.post("/doctors/patients/addPatient", patientData);
      console.log("Patient added successfully:", response.data);
      alert("Patient added successfully!");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setFormData({
      patientId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      bloodType: "",
      height: "",
      weight: "",
      remarks: "",
    });
    setShowModal(false);
  };

  return (
    <div className="add-patient-page">
  <DoctorSidebar />
  <div className="content">
    <h2>Add Patient</h2>
    <form
      className="patient-form"
      onSubmit={(e) => {
        e.preventDefault();
        setShowModal(true);
      }}
    >
          <div className="form-row">
            <div>
              <label>Patient ID</label>
              <input
                type="number"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label>Blood Type</label>
              <select
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="">Select Blood Type</option>
                <option value="A_POSITIVE">A+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="O_POSITIVE">O+</option>
                <option value="O_NEGATIVE">O-</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="AB_NEGATIVE">AB-</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min="50" /* أقل ارتفاع منطقي */
                max="250" /* أقصى ارتفاع منطقي */
              />
            </div>
            <div>
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="10" /* أقل وزن منطقي */
                max="300" /* أقصى وزن منطقي */
              />
            </div>
            <div>
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
           
            <button type="submit" className="add-patient-button">
              Add
            </button>
          </div>
        </form>
      </div>

      {showModal && (
  <div id="unique-modal" className="unique-modal">
    <div className="unique-modal-content">
      <h3>Confirm Patient Details</h3>
      <div className="unique-confirmation-form">
        <div className="confirmation-row">
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Patient ID:</label>
            <span className="unique-confirmation-value">{formData.patientId || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">First Name:</label>
            <span className="unique-confirmation-value">{formData.firstName || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Last Name:</label>
            <span className="unique-confirmation-value">{formData.lastName || "N/A"}</span>
          </div>
        </div>

        <div className="confirmation-row">
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Email:</label>
            <span className="unique-confirmation-value">{formData.email || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Phone:</label>
            <span className="unique-confirmation-value">{formData.phone || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Password:</label>
            <span className="unique-confirmation-value">{formData.password || "N/A"}</span>
          </div>
        </div>

        <div className="confirmation-row">
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Date of Birth:</label>
            <span className="unique-confirmation-value">{formData.dateOfBirth || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Gender:</label>
            <span className="unique-confirmation-value">{formData.gender || "N/A"}</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Blood Type:</label>
            <span className="unique-confirmation-value">{formData.bloodType || "N/A"}</span>
          </div>
        </div>

        <div className="confirmation-row">
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Height:</label>
            <span className="unique-confirmation-value">{formData.height || "N/A"} cm</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Weight:</label>
            <span className="unique-confirmation-value">{formData.weight || "N/A"} kg</span>
          </div>
          <div className="confirmation-item">
            <label className="unique-confirmation-label">Remarks:</label>
            <span className="unique-confirmation-value">{formData.remarks || "N/A"}</span>
          </div>
        </div>
      </div>
      <div className="unique-modal-actions">
        <button onClick={handleCancel} className="unique-cancel-button">
          Cancel
        </button>
        <button onClick={handleAddPatient} className="unique-confirm-button">
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

</div>
  );
};

export default AddPatientPage;