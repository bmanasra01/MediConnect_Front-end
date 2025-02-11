import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./VisitDetailsPage.css";
import { FaUserCircle } from "react-icons/fa"; 


const VisitDetailsPage = () => {
  const { visitID } = useParams();
  const [visitDetails, setVisitDetails] = useState(null);
  const [xRays, setXRays] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [procedures, setProcedures] = useState([]);

  // Fetch Visit Details
  useEffect(() => {
    const fetchVisitDetails = async () => {
      try {
        const response = await axios.get(`/visits/visit/${visitID}`);
        setVisitDetails(response.data);
      } catch (error) {
        console.error("Error fetching visit details:", error);
      }
    };

    fetchVisitDetails();
  }, [visitID]);

  // Fetch X-rays
  useEffect(() => {
    const fetchXrays = async () => {
      try {
        const patientID = visitDetails?.patient.patientId;
        if (patientID) {
          const response = await axios.get(
            `/x-rays/doctor/patient/${patientID}/visit/${visitID}`,
            { params: { page: 1, size: 10 } }
          );
          setXRays(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching X-rays:", error);
      }
    };

    if (visitDetails) fetchXrays();
  }, [visitDetails, visitID]);

  // Fetch Lab Tests
  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        const patientID = visitDetails?.patient.patientId;
        if (patientID) {
          const response = await axios.get(
            `/lab-tests/doctor/patient/${patientID}/visit/${visitID}`,
            { params: { page: 1, size: 10 } }
          );
          setLabTests(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };

    if (visitDetails) fetchLabTests();
  }, [visitDetails, visitID]);

  // Fetch Procedures
  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(
          `/procedure/visit/${visitID}/procedures`
        );
        setProcedures(response.data);
      } catch (error) {
        console.error("Error fetching procedures:", error);
      }
    };

    fetchProcedures();
  }, [visitID]);

  if (!visitDetails) return <p>Loading...</p>;

  return (
    <div className="visit-details-page">
      <Sidebar />

      <div className="content">
        {/* Personal Information */}
        <h3 className="section-title">Personal Information</h3>
        {/* Patient Personal Information Box */}
        <div className="patient-info-container">
          <FaUserCircle className="patient-photo-icon-lg" />
          <div className="patient-info-content">
            <h2>{visitDetails.patient.user.firstName} {visitDetails.patient.user.lastName}</h2>
            <div className="patient-info-grid-unique">
              <p><strong>Patient ID:</strong> {visitDetails.patient.patientId}</p>
              <p><strong>Email:</strong> {visitDetails.patient.user.email}</p>
              <p><strong>Phone:</strong> {visitDetails.patient.user.phone}</p>
              <p><strong>Date of Birth:</strong> {visitDetails.patient.user.dateOfBirth || "N/A"}</p>
              <p><strong>Blood Type:</strong> {visitDetails.patient.bloodType}</p>
              <p><strong>Gender:</strong> {visitDetails.patient.gender}</p>
              <p><strong>Height:</strong> {visitDetails.patient.height} cm</p>
              <p><strong>Weight:</strong> {visitDetails.patient.weight} kg</p>
            </div>
          </div>
        </div>


        {/* Visit Information */}
        <h3 className="section-title">Visit Information</h3>
        <div className="info-box special-box">
          <p><strong>Visit ID:</strong> {visitID}</p>
          <p><strong>Date:</strong> {visitDetails.visitDate}</p>
          <p><strong>Time:</strong> {visitDetails.visitTime}</p>
          <p><strong>Complaint:</strong> {visitDetails.complaint}</p>
          <p><strong>Diagnoses:</strong> {visitDetails.diagnoses}</p>
          <p><strong>Follow-up:</strong> {visitDetails.followUp}</p>
          <p><strong>Medical Leave Days:</strong> {visitDetails.medicalLeaveDays}</p>
        </div>

        {/* X-rays Section */}
        <h3 className="section-title">X-ray Information</h3>
        <div className="info-box">
          {xRays.length > 0 ? (
            xRays.map((xray) => (
              <div key={xray.xrayId} className="item-box">
                <p><strong>Title:</strong> {xray.title}</p>
                <p><strong>Date/Time:</strong> {xray.xrayDate} / {xray.xrayTime}</p>
                <p><strong>Details:</strong> {xray.xrayDetails}</p>
                <p><strong>Result:</strong> {xray.xrayResult || "N/A"}</p>
                <p><strong>Remark:</strong> {xray.remark || "N/A"}</p>
                <button className="pdf-button">View PDF</button>
              </div>
            ))
          ) : (
            <p>No X-rays available.</p>
          )}
        </div>

        {/* Lab Tests Section */}
        <h3 className="section-title">Lab Test Information</h3>
        <div className="info-box">
          {labTests.length > 0 ? (
            labTests.map((test) => (
              <div key={test.testId} className="item-box">
                <p><strong>Title:</strong> {test.title}</p>
                <p><strong>Date/Time:</strong> {test.testDate} / {test.testTime}</p>
                <p><strong>Details:</strong> {test.testDetails}</p>
                <p><strong>Result:</strong> {test.testResult || "N/A"}</p>
                <p><strong>Remark:</strong> {test.remark || "N/A"}</p>
                <button className="pdf-button">View PDF</button>
              </div>
            ))
          ) : (
            <p>No lab tests available.</p>
          )}
        </div>

        {/* Procedures Section */}
        <h3 className="section-title">Procedure Information</h3>
        <div className="info-box">
          {procedures.length > 0 ? (
            procedures.map((procedure) => (
              <div key={procedure.procedureVisitId} className="item-box">
                <p><strong>Name:</strong> {procedure.procedureName}</p>
                <p><strong>Date/Time:</strong> {procedure.procedureDate} / {procedure.procedureTime}</p>
                <p><strong>Description:</strong> {procedure.procedureMaster?.procedure_description || "N/A"}</p>
                <p><strong>Remarks:</strong> {procedure.remarks || "N/A"}</p>
                <button className="pdf-button">View PDF</button>
              </div>
            ))
          ) : (
            <p>No procedures available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitDetailsPage;
