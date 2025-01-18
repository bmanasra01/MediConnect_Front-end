import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "./axiosConfig";
import DoctorSidebar from "./DoctorSidebar";
import "./CreateVisit.css";

const CreateVisit = () => {
  const { patientId } = useParams();

  const [visitData, setVisitData] = useState({
    patientId,
    visitTime: "",
    complaint: "",
    diagnoses: "",
    followUp: "",
    medicalLeaveDays: "",
  });

  const [visitId, setVisitId] = useState(null);

  // States for multiple entries
  const [labTests, setLabTests] = useState([]);
  const [xrays, setXrays] = useState([]);
  const [procedures, setProcedures] = useState([]);

  // Add new empty entry
  const addNewEntry = (stateSetter, newEntry) => {
    stateSetter((prev) => [...prev, newEntry]);
  };

  // Remove specific entry
  const removeEntry = (index, stateSetter) => {
    stateSetter((prev) => prev.filter((_, i) => i !== index));
  };

  // Input handler for dynamic forms
  const handleInputChange = (e, index, stateSetter) => {
    const { name, value } = e.target;
    stateSetter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const handleSaveVisit = async (e) => {
    e.preventDefault();
    try {
      // Save visit first
      const visitResponse = await axios.post("/visits", visitData);
      const newVisitId = visitResponse.data.visitID;
      setVisitId(newVisitId);

      // Save batch Lab Tests
      if (labTests.length > 0) {
        await axios.post("/lab-tests/labtest/batch", labTests.map(test => ({ ...test, visitId: newVisitId })));
      }

      // Save batch X-Rays
      if (xrays.length > 0) {
        await axios.post("/x-rays/xray/batch", xrays.map(xray => ({ ...xray, visitId: newVisitId })));
      }

      // Save batch Procedures
      if (procedures.length > 0) {
        await axios.post("/procedure/procedurevisit/batch", procedures.map(proc => ({ ...proc, visitID: newVisitId })));
      }

      alert("Visit and all related details saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };

  return (
    <div className="create-visit-page">
      <DoctorSidebar />
      <div className="create-visit-content">
        <h2>Create Visit for Patient ID: {patientId}</h2>

        {/* Visit Information */}
        <div className="visit-form">
          <h3>Visit Information</h3>
          <form>
            <label>Visit Time: <input type="time" name="visitTime" onChange={(e) => setVisitData({ ...visitData, visitTime: e.target.value })} /></label>
            <label>Complaint: <input type="text" name="complaint" onChange={(e) => setVisitData({ ...visitData, complaint: e.target.value })} /></label>
            <label>Diagnoses: <input type="text" name="diagnoses" onChange={(e) => setVisitData({ ...visitData, diagnoses: e.target.value })} /></label>
            <label>Follow-Up: <input type="text" name="followUp" onChange={(e) => setVisitData({ ...visitData, followUp: e.target.value })} /></label>
            <label>Medical Leave Days: <input type="number" name="medicalLeaveDays" onChange={(e) => setVisitData({ ...visitData, medicalLeaveDays: e.target.value })} /></label>
          </form>
        </div>

        {/* Procedures */}
        <div className="dropdown-section">
          <h3>Procedures</h3>
          {procedures.map((proc, index) => (
            <div key={index} className="form-card">
              <label>Procedure Name: <input type="text" name="procedureName" onChange={(e) => handleInputChange(e, index, setProcedures)} /></label>
              <label>Procedure Date: <input type="date" name="procedureDate" onChange={(e) => handleInputChange(e, index, setProcedures)} /></label>
              <label>Procedure Time: <input type="time" name="procedureTime" onChange={(e) => handleInputChange(e, index, setProcedures)} /></label>
              <label>Remarks: <input type="text" name="remarks" onChange={(e) => handleInputChange(e, index, setProcedures)} /></label>
              <button className="remove-button" onClick={() => removeEntry(index, setProcedures)}>Remove</button>
            </div>
          ))}
          <button className="section-button" onClick={() => addNewEntry(setProcedures, { procedureName: "", procedureDate: "", procedureTime: "", remarks: "" })}>Add Procedure</button>
        </div>

        {/* X-Rays */}
        <div className="dropdown-section">
          <h3>X-Rays</h3>
          {xrays.map((xray, index) => (
            <div key={index} className="form-card">
              <label>Title: <input type="text" name="title" onChange={(e) => handleInputChange(e, index, setXrays)} /></label>
              <label>X-Ray Date: <input type="date" name="xrayDate" onChange={(e) => handleInputChange(e, index, setXrays)} /></label>
              <label>X-Ray Time: <input type="time" name="xrayTime" onChange={(e) => handleInputChange(e, index, setXrays)} /></label>
              <label>Details: <input type="text" name="xrayDetails" onChange={(e) => handleInputChange(e, index, setXrays)} /></label>
              <button className="remove-button" onClick={() => removeEntry(index, setXrays)}>Remove</button>
            </div>
          ))}
          <button className="section-button" onClick={() => addNewEntry(setXrays, { title: "", xrayDate: "", xrayTime: "", xrayDetails: "" })}>Add X-Ray</button>
        </div>

        {/* Lab Tests */}
        <div className="dropdown-section">
          <h3>Lab Tests</h3>
          {labTests.map((test, index) => (
            <div key={index} className="form-card">
              <label>Title: <input type="text" name="title" onChange={(e) => handleInputChange(e, index, setLabTests)} /></label>
              <label>Test Date: <input type="date" name="testDate" onChange={(e) => handleInputChange(e, index, setLabTests)} /></label>
              <label>Test Time: <input type="time" name="testTime" onChange={(e) => handleInputChange(e, index, setLabTests)} /></label>
              <label>Details: <input type="text" name="testDetails" onChange={(e) => handleInputChange(e, index, setLabTests)} /></label>
              <button className="remove-button" onClick={() => removeEntry(index, setLabTests)}>Remove</button>
            </div>
          ))}
          <button className="section-button" onClick={() => addNewEntry(setLabTests, { title: "", testDate: "", testTime: "", testDetails: "" })}>Add Lab Test</button>
        </div>

        {/* Save Button */}
        <button onClick={handleSaveVisit} className="save-button">Save Visit</button>
      </div>
    </div>
  );
};

export default CreateVisit;
