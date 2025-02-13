
import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import Sidebar from './Sidebar';
import { auth, createUserWithEmailAndPassword } from '../firebaseConfig'; // Import Firebase functions
import './AddDoctorPage.css';
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Firestore imports
import { deleteDoc } from "firebase/firestore";


const db = getFirestore(); // Initialize Firestore

const AddDoctorPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  // Fetch specializations from backend
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

  // Handle form field changes
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



  const confirmAddDoctor = async () => {
    setShowConfirmation(false);
    setError('');
    setSuccess('');

    let firebaseUID = null; // ✅ Declare firebaseUID outside try-catch
    try {
        // ✅ 1. Create the doctor in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            doctorData.user.email,
            doctorData.user.password
        );

        console.log("Doctor created in Firebase:", userCredential.user);
         firebaseUID = userCredential.user.uid;

        // ✅ 2. Store doctor details in Firestore `users` collection
        const doctorFirestoreData = {
            uid: firebaseUID,
            doctorId: doctorData.doctorId,
            email: doctorData.user.email,
            firstName: doctorData.user.firstName,
            lastName: doctorData.user.lastName,
            phone: doctorData.user.phone,
            dateOfBirth: doctorData.user.dateOfBirth,
            gender: doctorData.gender,
            role: "DOCTOR",
            special_name: doctorData.special_name,
        };

        await setDoc(doc(db, "users", firebaseUID), doctorFirestoreData);
        console.log("Doctor added to Firestore users collection");

        // ✅ 3. Prepare doctor data for Spring Boot backend
        const finalDoctorData = {
            doctorId: doctorData.doctorId,
            gender: doctorData.gender,
            special_name: doctorData.special_name,
            user: {
                email: doctorData.user.email,
                password: doctorData.user.password,
                firstName: doctorData.user.firstName,
                lastName: doctorData.user.lastName,
                phone: doctorData.user.phone,
                dateOfBirth: doctorData.user.dateOfBirth,
                UserID: doctorData.doctorId,
            },
        };

        // ✅ 4. Send the doctor data to Spring Boot backend (No need to add token manually)
        const response = await axios.post('/admin/doctors/', finalDoctorData);

        console.log('Doctor added successfully to backend:', response.data);
        setSuccess('Doctor added successfully!');

        // ✅ 5. Reset the form
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
      console.error('Error adding doctor:', err);

      // ✅ Rollback: If Firebase added the doctor but backend failed, remove from Firebase
      if (doctorData.user.email) {
          console.log("Rolling back Firebase user creation...");
          try {
              if (auth.currentUser && auth.currentUser.uid === firebaseUID) {
                  await auth.currentUser.delete(); // Delete user from Firebase Auth
                  console.log("Doctor removed from Firebase Authentication.");
              }
              // await setDoc(doc(db, "users", firebaseUID), {}); 
              await deleteDoc(doc(db, "users", firebaseUID)); // ✅ Safe Firestore removal
              console.log("Doctor removed from Firestore.");
          } catch (rollbackErr) {
              console.error("Failed to rollback Firebase:", rollbackErr.message);
          }
      }

      // ✅ Show error in confirmation dialog
      setError(`Failed to add doctor: ${err.response?.data || err.message}`);
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
            <select name="gender" value={doctorData.gender} onChange={handleChange} required>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <select name="special_name" value={doctorData.special_name} onChange={handleChange} required>
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

          <button type="submit" className="add-button">Add Doctor</button>
        </form>

              {showConfirmation && (
        <div className="confirmation-dialog">
            <h3>Confirm Doctor Details</h3>

            {/* Show error message if exists */}
            {error && <p className="error-message">{error}</p>}

            {/* Show success message if exists */}
            {success && <p className="success-message">{success}</p>}

            {/* Show doctor details */}
            <ul className="doctor-details-list">
                <li><strong>Doctor ID:</strong> {doctorData.doctorId}</li>
                <li><strong>Gender:</strong> {doctorData.gender}</li>
                <li><strong>Specialization:</strong> {doctorData.special_name}</li>
                <li><strong>Email:</strong> {doctorData.user.email}</li>
                <li><strong>First Name:</strong> {doctorData.user.firstName}</li>
                <li><strong>Last Name:</strong> {doctorData.user.lastName}</li>
                <li><strong>Phone:</strong> {doctorData.user.phone}</li>
                <li><strong>Date of Birth:</strong> {doctorData.user.dateOfBirth}</li>
            </ul>

            {/* Confirm & Cancel buttons */}
            <div className="dialog-actions">
                <button 
                    onClick={confirmAddDoctor} 
                    className="confirm-button"
                    disabled={!doctorData.doctorId || !doctorData.user.email || !doctorData.special_name}
                >
                    Confirm
                </button>
                <button onClick={() => setShowConfirmation(false)} className="cancel-button">
                    Cancel
                </button>
            </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default AddDoctorPage;






