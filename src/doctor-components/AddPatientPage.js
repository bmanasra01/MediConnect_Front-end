import React, { useState } from "react";
import axios from "./axiosConfig";
import DoctorSidebar from "./DoctorSidebar"; 
import "./AddPatientPage.css"; 
import "./UniqueModal.css"; 


import { auth, createUserWithEmailAndPassword } from "../firebaseConfig"; // Firebase Authentication
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";


const db = getFirestore(); 

const AddPatientPage = () => {
  const [successMessage, setSuccessMessage] = useState("");


  const [errorMessage, setErrorMessage] = useState("");


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
    setErrorMessage("");
  
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
  
    let firebaseUID = null; // لتخزين معرف المستخدم في Firebase
  
    try {
      // ✅ 1. إنشاء المريض في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Patient created in Firebase:", userCredential.user);
      firebaseUID = userCredential.user.uid;
  
      // ✅ 2. تخزين بيانات المريض في Firestore
      const patientFirestoreData = {
        uid: firebaseUID,
        patientId: patientId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        dateOfBirth: dateOfBirth,
        gender: gender,
        bloodType: bloodType || null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        remarks: remarks || null,
        role: "PATIENT",
      };
  
      await setDoc(doc(db, "users", firebaseUID), patientFirestoreData);
      console.log("Patient added to Firestore users collection");
  
      // ✅ 3. إرسال بيانات المريض إلى Spring Boot
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
  
      const response = await axios.post("/doctors/patients/addPatient", patientData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ أضف التوكن
        },
      });
  
      console.log("Patient added successfully to backend:", response.data);
      setSuccessMessage("Patient added successfully!");
  
      // ✅ 4. إعادة تعيين الفورم
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
  
    } catch (err) {
      console.error("Error adding patient:", err);
  
      // ✅ التحقق مما إذا كان الخطأ بسبب المستخدم المكرر
      if (err.response && err.response.status === 409) {
        setErrorMessage("A patient with this email, phone, or ID already exists.");
      } else {
        setErrorMessage(`Failed to add patient: ${err.response?.data || err.message}`);
      }
  
      // ✅ التراجع عن الإضافة في Firebase في حال فشل الإضافة في Spring Boot
      if (firebaseUID) {
        try {
          if (auth.currentUser && auth.currentUser.uid === firebaseUID) {
            await auth.currentUser.delete(); // حذف المريض من Firebase Auth
            console.log("Patient removed from Firebase Authentication.");
          }
          await deleteDoc(doc(db, "users", firebaseUID)); // حذف المريض من Firestore
          console.log("Patient removed from Firestore.");
        } catch (rollbackErr) {
          console.error("Failed to rollback Firebase:", rollbackErr.message);
        }
      }
    }
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
  <div className="add-patient-content">
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
      {/* error */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* added */}
      {successMessage && <p className="success-message">{successMessage}</p>}

    </div>
  </div>
)}

</div>
  );
};

export default AddPatientPage;