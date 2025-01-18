
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./axiosConfig"; // Import the axios instance with token interceptor
import DoctorSidebar from "./DoctorSidebar"; // Sidebar component
import "./PatientProfile.css";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon from React Icons


const PatientProfile = () => {
  const { patientId } = useParams(); // Get patientId from the route
  const navigate = useNavigate(); // For navigation to details
  const [patient, setPatient] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [xrays, setXrays] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For X-ray details modal
  const [selectedXray, setSelectedXray] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Patient Details
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientResponse = await axios.get(`/doctors/patients/${patientId}`);
        setPatient(patientResponse.data);

        const diseasesResponse = await axios.get(`/patients/diseases/patient/${patientId}`);
        setDiseases(diseasesResponse.data);

        const familyHistoryResponse = await axios.get(
          `/patients/family-diseases/patient/${patientId}`
        );
        setFamilyHistory(familyHistoryResponse.data);

        const xrayResponse = await axios.get(`/x-rays/doctor/patient/${patientId}`, {
          params: { page: 1, size: 10 },
        });
        setXrays(xrayResponse.data.content);

        const labTestsResponse = await axios.get(`/lab-tests/doctor/patient/${patientId}`, {
          params: { page: 1, size: 10 },
        });
        setLabTests(labTestsResponse.data.content);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to load some patient details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  // Fetch X-ray details
  const fetchXrayDetails = async (xrayId) => {
    try {
      const response = await axios.get(`/x-rays/doctor/patient/${patientId}/${xrayId}`);
      setSelectedXray(response.data);
      setIsModalOpen(true); // Open the modal
    } catch (err) {
      console.error("Error fetching X-ray details:", err);
      alert("Failed to load X-ray details. Please try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedXray(null);
  };

  if (loading) return <p>Loading patient details...</p>;

  return (
    <div className="patient-profile">
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <div className="profile-content">
        {/* Header with Create Visit Button */}
        <div className="profile-header">
          <h1>Patient Profile</h1>
          <button
            className="create-visit-button"
            onClick={() => navigate(`/create-visit/${patientId}`)}
          >
            Create Visit
          </button>
        </div>

        {/* Patient Personal Information Header */}
        <div className="patient-info-box">
        <FaUserCircle className="patient-photo-icon" />

          <div className="patient-info">
            <h2>
              {patient?.user?.firstName || "N/A"} {patient?.user?.lastName || ""}
            </h2>
            <div className="patient-info-grid">
              <p><strong>Patient ID:</strong> {patient?.patientId || "N/A"}</p>
              <p><strong>Email:</strong> {patient?.user?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {patient?.user?.phone || "N/A"}</p>
              <p><strong>Date of Birth:</strong> {patient?.dateOfBirth || "N/A"}</p>
              <p><strong>Gender:</strong> {patient?.gender || "N/A"}</p>
              <p><strong>Blood Type:</strong> {patient?.bloodType || "N/A"}</p>
              <p><strong>Height:</strong> {patient?.height || "N/A"} cm</p>
              <p><strong>Weight:</strong> {patient?.weight || "N/A"} kg</p>
            </div>
          </div>
        </div>

        {/* Patient Diseases Section */}
        <h1>Patient Diseases</h1>
        <table className="diseases-table">
          <thead>
            <tr>
              <th>Disease Name</th>
              <th>Disease Type</th>
              <th>Disease Date</th>
              <th>Insert Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {diseases.length > 0 ? (
              diseases.map((disease, index) => (
                <tr key={index}>
                  <td>{disease.diseaseName}</td>
                  <td>{disease.disease.diseaseType}</td>
                  <td>{disease.diseaseDate}</td>
                  <td>{disease.insertTime}</td>
                  <td>{disease.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Family History Section */}
        <h1>Family History</h1>
        <table className="family-history-table">
          <thead>
            <tr>
              <th>Family Member</th>
              <th>Disease Name</th>
              <th>Disease Type</th>
              <th>Diagnosis Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {familyHistory.length > 0 ? (
              familyHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.familyMember}</td>
                  <td>{history.diseaseName}</td>
                  <td>{history.diseaseType}</td>
                  <td>{history.diagnosisDate}</td>
                  <td>{history.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* X-rays Section */}
        <h1>X-rays</h1>
        <table className="xrays-table">
          <thead>
            <tr>
              <th>X-ray ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {xrays.length > 0 ? (
              xrays.map((xray) => (
                <tr key={xray.xrayId}>
                  <td>{xray.xrayId}</td>
                  <td>{xray.title}</td>
                  <td>{xray.xrayDate}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => fetchXrayDetails(xray.xrayId)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Lab Tests Section */}
        <h1>Lab Tests</h1>
        <table className="lab-tests-table">
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Title</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {labTests.length > 0 ? (
              labTests.map((test) => (
                <tr key={test.testId}>
                  <td>{test.testId}</td>
                  <td>{test.title}</td>
                  <td>{test.testDate}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => navigate(`/lab-test-details/${test.testId}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            )}
          </tbody>
        </table>

 {/* Modal for X-ray Details */}
{isModalOpen && selectedXray && (
  <div className="modal-overlay">
    <div className="modal">
      {/* Title in the top left */}
      <div className="modal-header">
        <h2>{selectedXray.title}</h2>
      </div>

      {/* Details in the middle */}
      <div className="modal-info-box">
        <div className="modal-row">
          <strong>Date:</strong>
          <span>{selectedXray.xrayDate}</span>
        </div>
        <div className="modal-row">
          <strong>Time:</strong>
          <span>{selectedXray.xrayTime}</span>
        </div>
        <div className="modal-row">
          <strong>Details:</strong>
          <span>{selectedXray.xrayDetails}</span>
        </div>
        <div className="modal-row">
          <strong>Result:</strong>
          <span>{selectedXray.xrayResult}</span>
        </div>
        <div className="modal-row">
          <strong>Remark:</strong>
          <span>{selectedXray.remark}</span>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="xray-image-box">
        <p>Placeholder for X-ray image or PDF</p>
      </div>

      {/* Close button in the bottom-right */}
      <button className="close-button" onClick={closeModal}>
        Close
      </button>
    </div>
  </div>
)}



      </div>
    </div>
  );
};

export default PatientProfile;



