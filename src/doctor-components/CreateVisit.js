import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "./axiosConfig"; 
import DoctorSidebar from "./DoctorSidebar";
import "./CreateVisit.css";
import { FaUserCircle } from "react-icons/fa";


const CreateVisit = () => {
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const appointmentID = location.state?.appointmentID;
  const visitID = appointmentID;

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showXRaySection, setShowXRaySection] = useState(false);
  const [xRays, setXRays] = useState([]);

  const [showLabTestSection, setShowLabTestSection] = useState(false);
  const [labTests, setLabTests] = useState([]);

  const [showProcedureSection, setShowProcedureSection] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [procedureOptions, setProcedureOptions] = useState([]);

  const [showPrescriptionSection, setShowPrescriptionSection] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicationOptions, setMedicationOptions] = useState([]);

  const [showSaveModal, setShowSaveModal] = useState(false);


  const [visitData, setVisitData] = useState({
    visitID,
    patientId,
    visitTime: "",
    complaint: "",
    diagnoses: "",
    followUp: "",
    medicalLeaveDays: "",
  });

  //ceck if there appointment 
  useEffect(() => {
    if (!appointmentID) {
      alert("No appointment ID provided! Unable to create a visit.");
      console.error("No appointmentID provided!");
      navigate("/doctor-dashboard");
    }
  }, [appointmentID, navigate]);


  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        console.log(`[DEBUG] Fetching patient details for ID: ${patientId}`);
        const response = await axios.get(`/doctors/patients/${patientId}`);
        setPatient(response.data);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        alert("Failed to fetch patient details. Please try again later.");
        setError("Failed to fetch patient details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [patientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // x-ray :
  const handleXRayChange = (index, e) => {
    const { name, value } = e.target;
    setXRays((prevXrays) =>
      prevXrays.map((xray, i) =>
        i === index ? { ...xray, [name]: value } : xray
      )
    );
  };

  const handleXRayFileChange = (index, e) => {
    const file = e.target.files[0];
    setXRays((prevXrays) =>
      prevXrays.map((xray, i) =>
        i === index ? { ...xray, file, fileName: file.name } : xray
      )
    );
  };

  const addXRay = () => {
    setShowXRaySection(true);
    setXRays([
      ...xRays,
      { title: "", xrayDate: "", xrayTime: "", xrayDetails: "", xrayResult: "", remark: "", file: null, fileName: "" },
    ]);
  };

  const removeXRay = (index) => {
    setXRays(xRays.filter((_, i) => i !== index));
  };

  //lab test : 
  const handleLabTestChange = (index, e) => {
    const { name, value } = e.target;
    setLabTests((prevLabTests) =>
      prevLabTests.map((test, i) =>
        i === index ? { ...test, [name]: value } : test
      )
    );
  };
  
  const handleLabTestFileChange = (index, e) => {
    const file = e.target.files[0];
    setLabTests((prevLabTests) =>
      prevLabTests.map((test, i) =>
        i === index ? { ...test, file, fileName: file.name } : test
      )
    );
  };
  
  const addLabTest = () => {
    setShowLabTestSection(true);
    setLabTests([
      ...labTests,
      { title: "", testDate: "", testTime: "", testDetails: "", testResult: "", remark: "", file: null, fileName: "" },
    ]);
  };
  
  const removeLabTest = (index) => {
    setLabTests(labTests.filter((_, i) => i !== index));
  };

  //for procedures 
  const fetchProcedures = async (query) => {
    try {
      const response = await fetch(`http://localhost:8080/admin/procedures/?search=${query}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        setProcedureOptions(data);
      } else {
        console.error("Error fetching procedures");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Handle Procedure Selection
  const handleProcedureChange = (index, e) => {
    const { name, value } = e.target;
    setProcedures((prevProcedures) =>
      prevProcedures.map((procedure, i) =>
        i === index ? { ...procedure, [name]: value } : procedure
      )
    );
  };

  const addProcedure = () => {
    setShowProcedureSection(true);
    setProcedures([
      ...procedures,
      { procedureName: "", procedureDate: "", procedureTime: "", remarks: "" },
    ]);
  };

  const removeProcedure = (index) => {
    setProcedures(procedures.filter((_, i) => i !== index));
  };


  //medications :
  // Fetch Medications (All or Search)
  const fetchMedications = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:8080/medications?search=${query}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMedicationOptions(data);
      } else {
        console.error("Error fetching medications");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Handle Prescription Selection
  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
  
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription, i) =>
        i === index ? { ...prescription, [name]: value } : prescription
      )
    );
  };

  // Handle medication selection separately
  const handleMedicationSelect = (index, medication) => {
    console.log(`[DEBUG] Selected medication for prescription ${index}:`, medication);
  
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription, i) =>
        i === index
          ? {
              ...prescription,
              medicationId: medication.medicationID,  // ✅ Store ID for API
              medicationName: medication.scientificName, // ✅ Show only name in input
            }
          : prescription
      )
    );
  
    console.log(`[DEBUG] Prescription ${index} updated:`, {
      medicationId: medication.medicationID,
      medicationName: medication.scientificName,
    });
  };
  

  const handleMedicationSelectionFromList = (index, selectedValue) => {
    console.log(`[DEBUG] User selected: ${selectedValue}`);
  
    // Extract ID and Name from selected value (assuming format "ID - Name")
    const selectedMed = medicationOptions.find(
      (med) => `${med.medicationID} - ${med.scientificName}` === selectedValue
    );
  
    if (selectedMed) {
      console.log(`[DEBUG] Storing medicationId: ${selectedMed.medicationID}, medicationName: ${selectedMed.scientificName}`);
  
      setPrescriptions((prevPrescriptions) =>
        prevPrescriptions.map((prescription, i) =>
          i === index
            ? {
                ...prescription,
                medicationId: selectedMed.medicationID, // ✅ Store the correct medication ID
                medicationName: selectedMed.scientificName, // ✅ Display only the name
              }
            : prescription
        )
      );
    } else {
      console.warn(`[WARNING] No matching medication found for input: ${selectedValue}`);
    }
  };
  
  
  // Add New Prescription
  const addPrescription = () => {
    setShowPrescriptionSection(true);
    setPrescriptions([
      ...prescriptions,
      {
        medicationId: "",
        doseType: "",
        doseAmount: "",
        morningDose: false,
        noonDose: false,
        eveningDose: false,
        dayInterval: "",
        totalDays: "",
        startDate: "",
        notes: "",
      },
    ]);
  };

  // Remove Prescription
  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };
  
  //save visit
  const handleSaveVisit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No access token found! Please log in again.");
        console.error("No access token found!");
        return;
      }
  
      if (!visitData.visitTime) {
        alert("Please enter a visit time before saving.");
        return;
      }

      // ✅ Validate prescriptions before proceeding
    for (let i = 0; i < prescriptions.length; i++) {
      if (!prescriptions[i].medicationId) {
        alert(`Medication ID is required for prescription at index ${i}.`);
        console.error(`[ERROR] Medication ID is missing for prescription at index ${i}`);
        return; // 🚫 Stop execution if medicationId is missing
      }
    }
  
      console.log("[DEBUG] Saving visit with visitID:", visitData.visitID);



  
      const updatedVisitData = { ...visitData, visitID };
  
      // Save visit
      const visitResponse = await axios.post("/visits", updatedVisitData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("[DEBUG] Visit saved successfully. ID:", visitResponse.data.visitID);
  
      // Mark appointment as done
      if (appointmentID) {
        await axios.put(`/appointments/doctor/mark-done/${appointmentID}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`[DEBUG] Appointment ${appointmentID} marked as done successfully.`);
      }
  
      // Prepare errors list
      const errors = [];
  
      // Upload X-Rays
      if (xRays.length > 0) {
        try {
          const formData = new FormData();
          formData.append(
            "xRays",
            JSON.stringify(
              xRays.map(({ file, fileName, ...xray }) => ({
                ...xray,
                visitId: visitResponse.data.visitID,
              }))
            )
          );
  
          xRays.forEach(({ file }) => file && formData.append("files", file));
  
          await axios.post("/x-rays/batch-with-files", formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
        } catch (error) {
          console.error("Error uploading X-Rays:", error);
          errors.push("Failed to upload X-Rays.");
        }
      }
  
      // Upload Lab Tests
      if (labTests.length > 0) {
        try {
          const labFormData = new FormData();
          labFormData.append(
            "labTests",
            JSON.stringify(
              labTests.map(({ file, fileName, ...test }) => ({
                ...test,
                visitId: visitResponse.data.visitID,
              }))
            )
          );
  
          labTests.forEach(({ file }) => file && labFormData.append("files", file));
  
          await axios.post("/lab-tests/batch-with-files", labFormData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
        } catch (error) {
          console.error("Error uploading Lab Tests:", error);
          errors.push("Failed to upload Lab Tests.");
        }
      }
  
      // Save Procedures
      if (procedures.length > 0) {
        try {
          await axios.post("/procedure/procedurevisit/batch", procedures.map((p) => ({
            ...p,
            visitID: visitResponse.data.visitID,
          })), {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("Error saving Procedures:", error);
          errors.push("Failed to save Procedures.");
        }
      }
  
      // Save Prescriptions
      if (prescriptions.length > 0) {
        try {
          console.log("[DEBUG] Prescriptions data before sending:", prescriptions);
      
          const filteredPrescriptions = prescriptions.map(({ medicationName, ...p }) => ({
            ...p,
            visitId: visitID,
          }));
      
          console.log("[DEBUG] Processed prescriptions data:", filteredPrescriptions);
      
          await axios.post("/prescriptions", filteredPrescriptions, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
      
          console.log("[DEBUG] Prescriptions saved successfully.");
        } catch (error) {
          console.error("[ERROR] Failed to save Prescriptions:", error.response ? error.response.data : error);
          errors.push("Failed to save Prescriptions.");
        }
      }
      

      // Success message if everything is saved
      // alert("Visit and all related data saved successfully!");
      navigate("/doctor-dashboard");
  
    } catch (error) {
      console.error("Error saving visit:", error);
      alert("An error occurred while saving. Please try again.");
    }
  };
  

  return (
    <div className="create-visit-page">
      <DoctorSidebar />
      <div className="create-visit-content">
        {error && <div className="error-message"><p>{error}</p></div>}
        <h2>Create Visit</h2>

        {loading ? <p>Loading patient details...</p> : (
          <>
             {/* Patient Personal Information Header */}
                    <div className="patient-info-container">
                      <FaUserCircle className="patient-photo-icon-lg" />
                      <div className="patient-info-content">
                        <h2>{patient?.user?.firstName || "N/A"} {patient?.user?.lastName || ""}</h2>
                        <div className="patient-info-grid-unique">
                          <p><strong>Patient ID:</strong> {patient?.patientId || "N/A"}</p>
                          <p><strong>Email:</strong> {patient?.user?.email || "N/A"}</p>
                          <p><strong>Phone:</strong> {patient?.user?.phone || "N/A"}</p>
                          <p><strong>Date of Birth:</strong> {patient?.user?.dateOfBirth || "N/A"}</p>
                          <p><strong>Gender:</strong> {patient?.gender || "N/A"}</p>
                          <p><strong>Blood Type:</strong> {patient?.bloodType || "N/A"}</p>
                          <p><strong>Height:</strong> {patient?.height || "N/A"} cm</p>
                          <p><strong>Weight:</strong> {patient?.weight || "N/A"} kg</p>
                        </div>
                      </div>
                    </div>

            <div className="visit-form">
              <h3>Visit Information</h3>
              <form>
                <label>Visit Time:
                  <input type="time" name="visitTime" value={visitData.visitTime} onChange={handleInputChange} required />
                </label>
                <label>Complaint:
                  <textarea name="complaint" value={visitData.complaint} onChange={handleInputChange} />
                </label>
                <label>Diagnoses:
                  <textarea name="diagnoses" value={visitData.diagnoses} onChange={handleInputChange} />
                </label>
                <label>Follow-Up:
                  <input type="text" name="followUp" value={visitData.followUp} onChange={handleInputChange} />
                </label>
                <label>Medical Leave Days:
                  <input type="number" name="medicalLeaveDays" value={visitData.medicalLeaveDays} onChange={handleInputChange} />
                </label>
              </form>
            </div>
            <div className="xray-section">
                {/* X-Ray Section Header */}
                <h3>X-Rays</h3>

                {/* X-Ray Form (Shows When Section is Open) */}
                {showXRaySection && (
                  <>
                    {xRays.map((xray, index) => (
                      <div key={index} className="xray-entry">
                        {/* Title, Date, and Time in One Row */}
                        <div className="xray-row">
                          <input type="text" name="title" placeholder="Title" value={xray.title} onChange={(e) => handleXRayChange(index, e)} />
                          <input type="date" name="xrayDate" value={xray.xrayDate} onChange={(e) => handleXRayChange(index, e)} />
                          <input type="time" name="xrayTime" value={xray.xrayTime} onChange={(e) => handleXRayChange(index, e)} />
                        </div>

                        {/* Details, Results, and Remarks */}
                        <textarea name="xrayDetails" placeholder="Details" value={xray.xrayDetails} onChange={(e) => handleXRayChange(index, e)} />
                        <textarea name="xrayResult" placeholder="Results" value={xray.xrayResult} onChange={(e) => handleXRayChange(index, e)} />
                        <textarea name="remark" placeholder="Remarks" value={xray.remark} onChange={(e) => handleXRayChange(index, e)} />

                        {/* File Upload */}
                        <div className="file-upload">
                          <label htmlFor={`file-upload-${index}`}>Upload File</label>
                          <input id={`file-upload-${index}`} type="file" onChange={(e) => handleXRayFileChange(index, e)} />
                          {xray.fileName && <span>{xray.fileName}</span>}
                        </div>

                        {/* Remove Button */}
                        <button className="remove-button" onClick={() => removeXRay(index)}>Remove</button>
                      </div>
                    ))}

                    {/* Add X-Ray Button (Now Below the Form) */}
                    <button className="add-xray-button" onClick={addXRay}>Add X-Ray</button>
                  </>
                )}

                {/* Show Add X-Ray Button if No Forms Exist */}
                {!showXRaySection && (
                  <button className="add-xray-button" onClick={() => { setShowXRaySection(true); addXRay(); }}>
                    Add X-Ray
                  </button>
                )}
              </div>

              <div className="labtest-section">
                      <h3>Lab Tests</h3>

                      {showLabTestSection && (
                        <>
                          {labTests.map((test, index) => (
                            <div key={index} className="labtest-entry">
                              {/* Title, Date, and Time */}
                              <div className="labtest-row">
                                <input type="text" name="title" placeholder="Test Title" value={test.title} onChange={(e) => handleLabTestChange(index, e)} />
                                <input type="date" name="testDate" value={test.testDate} onChange={(e) => handleLabTestChange(index, e)} />
                                <input type="time" name="testTime" value={test.testTime} onChange={(e) => handleLabTestChange(index, e)} />
                              </div>

                              {/* Details, Results, and Remarks */}
                              <textarea name="testDetails" placeholder="Details" value={test.testDetails} onChange={(e) => handleLabTestChange(index, e)} />
                              <textarea name="testResult" placeholder="Results" value={test.testResult} onChange={(e) => handleLabTestChange(index, e)} />
                              <textarea name="remark" placeholder="Remarks" value={test.remark} onChange={(e) => handleLabTestChange(index, e)} />

                              {/* File Upload */}
                              <div className="file-upload">
                                <label htmlFor={`lab-file-upload-${index}`}>Upload File</label>
                                <input id={`lab-file-upload-${index}`} type="file" onChange={(e) => handleLabTestFileChange(index, e)} />
                                {test.fileName && <span>{test.fileName}</span>}
                              </div>

                              {/* Remove Button */}
                              <button className="remove-button" onClick={() => removeLabTest(index)}>Remove</button>
                            </div>
                          ))}

                          {/* Add Lab Test Button (Below Form) */}
                          <button className="add-labtest-button" onClick={addLabTest}>Add Lab Test</button>
                        </>
                      )}

                      {/* Show Add Lab Test Button if No Forms Exist */}
                      {!showLabTestSection && (
                        <button className="add-labtest-button" onClick={() => { setShowLabTestSection(true); addLabTest(); }}>
                          Add Lab Test
                        </button>
                      )}
                </div>

                <div className="procedure-section">
                      <h3>Procedures</h3>

                      {showProcedureSection && (
                        <>
                          {procedures.map((procedure, index) => (
                            <div key={index} className="procedure-entry">
                              <div className="procedure-row">
                                {/* Procedure Selection with Searchable Dropdown */}
                                <input
                                  type="text"
                                  name="procedureName"
                                  placeholder="Search for a procedure..."
                                  value={procedure.procedureName}
                                  onFocus={() => fetchProcedures("")} // Show all when focused
                                  onChange={(e) => {
                                    handleProcedureChange(index, e);
                                    fetchProcedures(e.target.value);
                                  }}
                                  list={`procedure-options-${index}`}
                                  className="procedure-input"
                                />

                                <datalist id={`procedure-options-${index}`}>
                                  {procedureOptions.map((option, idx) => (
                                    <option key={idx} value={option.procedure_name}>
                                      {option.procedure_name} - {option.procedure_description}
                                    </option>
                                  ))}
                                </datalist>

                                <input type="date" name="procedureDate" value={procedure.procedureDate} onChange={(e) => handleProcedureChange(index, e)} />
                                <input type="time" name="procedureTime" value={procedure.procedureTime} onChange={(e) => handleProcedureChange(index, e)} />
                              </div>

                              <textarea name="remarks" placeholder="Remarks" value={procedure.remarks} onChange={(e) => handleProcedureChange(index, e)} />

                              <button className="remove-button" onClick={() => removeProcedure(index)}>Remove</button>
                            </div>
                          ))}

                          <button className="add-procedure-button" onClick={addProcedure}>Add Procedure</button>
                        </>
                      )}

                      {!showProcedureSection && (
                        <button className="add-procedure-button" onClick={() => { setShowProcedureSection(true); addProcedure(); }}>
                          Add Procedure
                        </button>
                      )}
                </div>

                <div className="prescription-section">
                        <h3>Prescriptions</h3>

                        {showPrescriptionSection && (
                          <>
                            {prescriptions.map((prescription, index) => (
                              <div key={index} className="prescription-entry">
                                <div className="prescription-row">
                                 {/* Visible Input: Shows Medication Name */}
                                 <div className="prescription-row">
                                    {/* Visible Input: Shows Medication Name */}
                                    <input
                                      type="text"
                                      name="medicationName"
                                      placeholder="Search for medication..."
                                      value={prescription.medicationName || ""}
                                      onFocus={() => fetchMedications("")}
                                      onChange={(e) => {
                                        handlePrescriptionChange(index, e);
                                        fetchMedications(e.target.value);
                                      }}
                                      onInput={(e) => handleMedicationSelectionFromList(index, e.target.value)} // ✅ New event
                                      list={`medication-options-${index}`}
                                      className="prescription-input"
                                    />

                                    {/* Hidden Input: Stores Medication ID */}
                                    <input type="hidden" name="medicationId" value={prescription.medicationId || ""} />

                                    {/* Datalist: Shows ID and Name */}
                                    <datalist id={`medication-options-${index}`}>
                                      {medicationOptions.map((option) => (
                                        <option key={option.medicationID} value={`${option.medicationID} - ${option.scientificName}`} />
                                      ))}
                                    </datalist>
                                  </div>

                                        <select
                                          name="doseType"
                                          value={prescription.doseType}
                                          onChange={(e) => handlePrescriptionChange(index, e)}
                                        >
                                          <option value="">Select Dose Type</option>
                                          <option value="pills">Pills</option>
                                          <option value="liquid">Liquid</option>
                                          <option value="injection">Injection</option>
                                        </select>
                                        <input type="text" name="doseAmount" placeholder="Dose Amount" value={prescription.doseAmount} onChange={(e) => handlePrescriptionChange(index, e)} />
                                      </div>

                                      <div className="dosage-checkboxes">
                                        <label>
                                          <input type="checkbox" name="morningDose" checked={prescription.morningDose} onChange={(e) => handlePrescriptionChange(index, { target: { name: "morningDose", value: e.target.checked } })} /> Morning
                                        </label>
                                        <label>
                                          <input type="checkbox" name="noonDose" checked={prescription.noonDose} onChange={(e) => handlePrescriptionChange(index, { target: { name: "noonDose", value: e.target.checked } })} /> Noon
                                        </label>
                                        <label>
                                          <input type="checkbox" name="eveningDose" checked={prescription.eveningDose} onChange={(e) => handlePrescriptionChange(index, { target: { name: "eveningDose", value: e.target.checked } })} /> Evening
                                        </label>
                                      </div>

                                      {/* Day Interval & Total Days in One Row */}
                                      <div className="prescription-duration">
                                        <input type="number" name="dayInterval" placeholder="Day Interval" value={prescription.dayInterval} onChange={(e) => handlePrescriptionChange(index, e)} />
                                        <input type="number" name="totalDays" placeholder="Total Days" value={prescription.totalDays} onChange={(e) => handlePrescriptionChange(index, e)} />
                                      </div>

                                      {/* Start Date in One Row with Label */}
                                      <div className="start-date-row">
                                        <label className="start-date-label">Start Date:</label>
                                        <input type="date" name="startDate" value={prescription.startDate} onChange={(e) => handlePrescriptionChange(index, e)} />
                                      </div>

                                      <textarea name="notes" placeholder="Notes" value={prescription.notes} onChange={(e) => handlePrescriptionChange(index, e)} />

                                      <button className="remove-button" onClick={() => removePrescription(index)}>Remove</button>
                                    </div>
                                  ))}
                                  <button className="add-prescription-button" onClick={addPrescription}>Add Prescription</button>
                                </>
                              )}

                              {!showPrescriptionSection && <button className="add-prescription-button" onClick={addPrescription}>Add Prescription</button>}
                  </div>
            {/* <button onClick={handleSaveVisit} className="save-button">Save Visit</button> */}
            <button onClick={() => setShowSaveModal(true)} className="save-button">Save Visit</button>

           

            {showSaveModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Confirm Visit Save</h2>
                  <p>Are you sure you want to save this visit?</p>
                  <div className="modal-actions">
                    <button className="confirm-button" onClick={(e) => { setShowSaveModal(false); handleSaveVisit(e); }}>
                      Yes, Save
                    </button>
                    <button className="cancel-button" onClick={() => setShowSaveModal(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}



          </>
        )}
      </div>
    </div>
  );
};

export default CreateVisit;
