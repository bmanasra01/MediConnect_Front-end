
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "./axiosConfig"; 
import DoctorSidebar from "./DoctorSidebar"; 
import "./PatientProfile.css";
import "./Info-box.css";
import "./ModalOverlay.css";


import { FaUserCircle } from "react-icons/fa"; 
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


const PatientProfile = () => {
  const { patientId } = useParams(); 
  const navigate = useNavigate(); 

  const [patient, setPatient] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [familyHistory, setFamilyHistory] = useState([]);
  const [xrays, setXrays] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedXray, setSelectedXray] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showAllXrays, setShowAllXrays] = useState(false);
  const [showAllLabTests, setShowAllLabTests] = useState(false);

  const [showAllDiseases, setShowAllDiseases] = useState(false);
  const [showAllFamilyHistory, setShowAllFamilyHistory] = useState(false);

  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);


  const [selectedLabTest, setSelectedLabTest] = useState(null);

  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
  const [diseaseList, setDiseaseList] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [diseaseDate, setDiseaseDate] = useState("");
  const [diseaseRemarks, setDiseaseRemarks] = useState("");

  const [isFamilyHistoryModalOpen, setIsFamilyHistoryModalOpen] = useState(false);
  const [familyDiseaseList, setFamilyDiseaseList] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyDisease, setSelectedFamilyDisease] = useState("");
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [familyRemarks, setFamilyRemarks] = useState("");

  const [currentDoctorId, setCurrentDoctorId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  // const [showDeactivationModal, setShowDeactivationModal] = useState(false);
  // const [selectedPrescription, setSelectedPrescription] = useState(null);
  // const [message, setMessage] = useState(""); 
  // const [messageType, setMessageType] = useState(""); 


  const [showDeactivationModal, setShowDeactivationModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isDeactivated, setIsDeactivated] = useState(false); 





  //fetch current doctor 
  useEffect(() => {
    const fetchCurrentDoctor = async () => {
      try {
        const response = await axios.get("/doctors/auth/me");
        setCurrentDoctorId(response.data.doctorId); // save current doctor id 
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      }
    };
  
    fetchCurrentDoctor();
  }, []);

  //to fetch Prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get(`/prescriptions/patient/${patientId}`);
        setPrescriptions(Array.isArray(response.data) ? response.data : []); 
        // console.log(prescription.is_active); // Check the value in the console
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]); 
      }
    };
  
    fetchPrescriptions();
  }, [patientId]);


  //to fetch and open X-ray or Lab Test file
  const fetchFile = async (type, id) => {
    try {
      const apiUrl = type === "xray"
        ? `/x-rays/${id}/download-result`
        : `/lab-tests/${id}/download-result`;
  
      const response = await axios.get(apiUrl, {
        responseType: "blob", 
      });
  
      // Detect content type
      const contentType = response.headers["content-type"];
      setFileType(contentType);
  
      // Convert blob to URL
      const fileBlob = new Blob([response.data], { type: contentType });
      const fileUrl = URL.createObjectURL(fileBlob);
  
      setFileUrl(fileUrl);
      setIsFileModalOpen(true);
    } catch (error) {
      console.error("Error fetching file:", error);
      alert("Failed to load file. Please try again.");
    }
  };
  

//to deactive medication 
const deactivatePrescription = async (prescriptionId) => {
  try {
    await axios.put(`/prescriptions/deactivate/${prescriptionId}`);
    setPrescriptions(prescriptions.map(prescription => 
      prescription.prescriptionId === prescriptionId ? { ...prescription, active: false } : prescription
    ));
  } catch (error) {
    console.error("Error deactivating prescription:", error);
  }
};

//handle deactavate 
// const handleDeactivate = async (prescriptionId) => {
//   try {
//     await deactivatePrescription(prescriptionId); // Call your existing function to deactivate
//     setShowDeactivationModal(false); // Close the modal after successful deactivation
//     alert("Medication deactivated successfully.");
//   } catch (error) {
//     console.error("Error deactivating medication:", error);
//     alert("Failed to deactivate medication.");
//   }
// };

const handleDeactivate = async (prescriptionId) => {
  try {
    await deactivatePrescription(prescriptionId); // Deactivate the prescription
    setMessage("Medication deactivated successfully.");
    setMessageType("success");
    setIsDeactivated(true); // Set deactivated flag to true
  } catch (error) {
    console.error("Error deactivating medication:", error);
    setMessage("Failed to deactivate medication.");
    setMessageType("error");
  }
};




  // Fetch fami list when the modal opens
    useEffect(() => {
      if (isFamilyHistoryModalOpen) {
        const fetchDiseases = async () => {
          try {
            const response = await axios.get("/admin/diseases/");
            setFamilyDiseaseList(response.data);
          } catch (err) {
            console.error("Error fetching diseases:", err);
          }
        };
        fetchDiseases();
      }
    }, [isFamilyHistoryModalOpen]);


  // Fetch diseases list when the modal opens
    useEffect(() => {
      if (isDiseaseModalOpen) {
        const fetchDiseases = async () => {
          try {
            const response = await axios.get("/admin/diseases/");
            setDiseaseList(response.data);
          } catch (err) {
            console.error("Error fetching diseases:", err);
          }
        };
        fetchDiseases();
      }
    }, [isDiseaseModalOpen]);


  const [newDisease, setNewDisease] = useState({
      diseaseName: "",
      diseaseDate: "",
      remarks: "",
    });

  const [newFamilyHistory, setNewFamilyHistory] = useState({
      familyMember: "",
      diseaseName: "",
      diagnosisDate: "",
      remarks: "",
    });

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
          params: { page: 1, size: 100 },
        });
        setXrays(xrayResponse.data.content);

        const labTestsResponse = await axios.get(`/lab-tests/doctor/patient/${patientId}`, {
          params: { page: 1, size: 100 },
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



// fetch lab test : 
  const fetchLabTestDetails = async (testId) => {
    try {
      const response = await axios.get(`/lab-tests/doctor/patient/${patientId}/${testId}`);
      setSelectedLabTest(response.data);
      setIsModalOpen(true); // Open the modal
    } catch (err) {
      console.error("Error fetching lab test details:", err);
      alert("Failed to load lab test details. Please try again.");
    }
  };
  

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

 
  // Add New Disease
  const handleAddDisease = async () => {
    if (!selectedDisease || !diseaseDate) {
      alert("Please select a disease and enter a date.");
      return;
    }
  
    try {
      await axios.post("/patients/diseases/", {
        patientId: patientId,
        diseaseName: selectedDisease,
        diseaseDate: diseaseDate,
        remarks: diseaseRemarks,
      });
  
      alert("Disease added successfully!");
      setIsDiseaseModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error adding disease:", err);
      alert("Failed to add disease.");
    }
  };


    // Add New Family History
    const handleAddFamilyHistory = async () => {
      if (!selectedFamilyMember || !selectedFamilyDisease || !diagnosisDate) {
        alert("Please select a family member, disease, and enter a diagnosis date.");
        return;
      }

      try {
        await axios.post("/patients/family-diseases/", {
          patientId: patientId,
          familyMember: selectedFamilyMember,
          diseaseName: selectedFamilyDisease,
          diagnosisDate: diagnosisDate,
          remarks: familyRemarks,
        });

        alert("Family history added successfully!");
        setIsFamilyHistoryModalOpen(false);
        window.location.reload();
      } catch (err) {
        console.error("Error adding family history:", err);
        alert("Failed to add family history.");
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
      <DoctorSidebar/>

      {/* Main Content */}
      <div className="profile-content">
        {/* Header with Create Visit Button */}
        <div className="profile-header">
          <h1>Patient Profile</h1>
         
        </div>

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


       {/* Patient Diseases Section */}
      <h1>Patient Diseases <button className="add-button" onClick={() => setIsDiseaseModalOpen(true)}>+</button></h1>

      {/* Disease Modal */}
      {isDiseaseModalOpen && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Add New Disease</h2>

            <label><strong>Select Disease:</strong></label>
            <select onChange={(e) => setSelectedDisease(e.target.value)}>
              <option value="">Select a Disease</option>
              {diseaseList.map((disease, index) => (
                <option key={index} value={disease.name}>{disease.name}</option>
              ))}
            </select>

            <label><strong>Disease Date:</strong></label>
            <input type="date" onChange={(e) => setDiseaseDate(e.target.value)} />

            <label><strong>Remarks:</strong></label>
            <textarea onChange={(e) => setDiseaseRemarks(e.target.value)} placeholder="Optional remarks"></textarea>

            {/* زر الإضافة */}
            <button className="add-btn" onClick={handleAddDisease}>Add</button>

            {/* زر الإلغاء */}
            <button className="cancel-btn" onClick={() => setIsDiseaseModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="diseases-list">
        {diseases.slice(0, showAllDiseases ? diseases.length : 2).map((disease, index) => (
          <div key={index} className="disease-card">
            <div className="card-content">
              <div className="info-item"><label>Disease Name:</label> <span>{disease.diseaseName}</span></div>
              <div className="info-item"><label>Disease Type:</label> <span>{disease.disease.diseaseType}</span></div>
              <div className="info-item"><label>Disease Date:</label> <span>{disease.diseaseDate}</span></div>
              <div className="info-item"><label>Insert Date:</label> <span>{disease.insertTime.split("T")[0]}</span></div>
              <div className="info-item"><label>Remarks:</label> <span>{disease.remarks}</span></div>
            </div>
          </div>
        ))}
        {diseases.length > 2 && (
          <button className="view-more-button" onClick={() => setShowAllDiseases(!showAllDiseases)}>
            {showAllDiseases ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>


      {/* Family History Section */}
      <h1>Family History <button className="add-button" onClick={() => setIsFamilyHistoryModalOpen(true)}>+</button></h1>
     {/* Family History Modal */}
        {isFamilyHistoryModalOpen && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h2>Add Family History</h2>

              <label><strong>Select Family Member:</strong></label>
              <select onChange={(e) => setSelectedFamilyMember(e.target.value)}>
                <option value="">Select a Family Member</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Grandmother">Grandmother</option>
              </select>

              <label><strong>Select Disease:</strong></label>
              <select onChange={(e) => setSelectedFamilyDisease(e.target.value)}>
                <option value="">Select a Disease</option>
                {familyDiseaseList.map((disease, index) => (
                  <option key={index} value={disease.name}>{disease.name}</option>
                ))}
              </select>

              <label><strong>Diagnosis Date:</strong></label>
              <input type="date" onChange={(e) => setDiagnosisDate(e.target.value)} />

              <label><strong>Remarks:</strong></label>
              <textarea onChange={(e) => setFamilyRemarks(e.target.value)} placeholder="Optional remarks"></textarea>

              
              <button className="add-btn" onClick={handleAddFamilyHistory}>Add</button>

             
              <button className="cancel-btn" onClick={() => setIsFamilyHistoryModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}

      <div className="family-history-list">
        {familyHistory.slice(0, showAllFamilyHistory ? familyHistory.length : 2).map((history, index) => (
          <div key={index} className="family-history-card">
            <div className="card-content">
              <div className="info-item"><label>Family Member:</label> <span>{history.familyMember}</span></div>
              <div className="info-item"><label>Disease Name:</label> <span>{history.diseaseName}</span></div>
              <div className="info-item"><label>Diagnosis Date:</label> <span>{history.diagnosisDate}</span></div>
              <div className="info-item"><label>Remarks:</label> <span>{history.remarks}</span></div>
            </div>
          </div>
        ))}
        {familyHistory.length > 2 && (
          <button className="view-more-button" onClick={() => setShowAllFamilyHistory(!showAllFamilyHistory)}>
            {showAllFamilyHistory ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {/* X-rays Section */}
      <h1>X-rays</h1>
      <div className="xrays-list">
        {xrays.slice(0, showAllXrays ? xrays.length : 2).map((xray) => (
          <div key={xray.xrayId} className="xray-card">
            <div className="card-content">
            {/* <div className="info-item"><label>ID:</label> <span>{xray.xrayId}</span></div> */}
              <div className="info-item"><label>Title:</label> <span>{xray.title}</span></div>
              <div className="info-item"><label>Date:</label> <span>{xray.xrayDate}</span></div>
              {/* زر عرض التفاصيل */}
              <button className="view-buttonoo" onClick={() => fetchXrayDetails(xray.xrayId)}>View Details</button>
            </div>
          </div>
        ))}
        {xrays.length > 2 && (
          <button className="view-more-button" onClick={() => setShowAllXrays(!showAllXrays)}>
            {showAllXrays ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {/* Lab Tests Section */}
      <h1>Lab Tests</h1>
      <div className="lab-tests-list">
      {labTests.slice(0, showAllLabTests ? labTests.length : 2).map((test) => (
        <div key={test.testId} className="lab-test-card">
          <div className="card-content">
            {/* <div className="info-item"><label>ID:</label> <span>{test.testId}</span></div> */}
            <div className="info-item"><label>Title:</label> <span>{test.title}</span></div>
            <div className="info-item"><label>Date:</label> <span>{test.testDate}</span></div>

            <button className="view-buttonoo" onClick={() => fetchLabTestDetails(test.testId)}>View Details</button>
          </div>
        </div>
      ))}
      {labTests.length > 2 && (
        <button className="view-more-button" onClick={() => setShowAllLabTests(!showAllLabTests)}>
          {showAllLabTests ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      )}
    </div>

    <h1>Prescriptions</h1>
    <div className="prescriptions-list">
      {prescriptions.slice(0, showAllPrescriptions ? prescriptions.length : 2).map((prescription) => (
        <div key={prescription.prescriptionId} className="prescription-card">
          <div className="card-content">
            <div className="info-item">
              <label>Medication:</label>
              <span>{prescription.medication.scientificName}</span>
            </div>
            <div className="info-item">
              <label>International Name:</label>
              <span>{prescription.medication.internationalName}</span>
            </div>
            <div className="info-item">
              <label>Dose Type:</label>
              <span>{prescription.doseType}</span>
            </div>
            <div className="info-item">
              <label>Dose Amount:</label>
              <span>{prescription.doseAmount}</span>
            </div>
            <div className="info-item">
              <label>Start Date:</label>
              <span>{prescription.startDate}</span>
            </div>
            <div className="info-item">
              <label>Total Days:</label>
              <span>{prescription.totalDays}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={prescription.active ? "status-active" : "status-inactive"}>
                {prescription.active ? "Active" : "Stopped"}
              </span>
            </div>

            {/* Show Deactivate button if doctor is the owner */}
            {currentDoctorId === prescription.doctorId && prescription.active && (
              <button
                className="deactivate-btn"
                onClick={() => {
                  setSelectedPrescription(prescription);
                  setShowDeactivationModal(true);
                }}
              >
                Deactivate
              </button>
            )}
          </div>
        </div>
      ))}
      {prescriptions.length > 2 && (
        <button className="view-more-button" onClick={() => setShowAllPrescriptions(!showAllPrescriptions)}>
          {showAllPrescriptions ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      )}
    </div>


      {/* details modal */}
    {(isModalOpen && (selectedXray || selectedLabTest)) && (
      <div id="pp-modal" className="pp-modal">
        <div className="pp-modal-content">
          <h3>{selectedXray ? "X-ray Details" : "Lab Test Details"}</h3>
          
          <div className="pp-confirmation-form">
            <div className="confirmation-item full-width">
              <label className="pp-confirmation-label">Date & Time:</label>
              <span className="pp-confirmation-value">
                {selectedXray ? `${selectedXray.xrayDate} - ${selectedXray.xrayTime}` 
                              : `${selectedLabTest.testDate} - ${selectedLabTest.testTime}` || "N/A"}
              </span>
            </div>

            <div className="confirmation-item full-width">
              <label className="pp-confirmation-label">Details:</label>
              <span className="pp-confirmation-value">
                {selectedXray ? selectedXray.xrayDetails : selectedLabTest.testDetails || "N/A"}
              </span>
            </div>

            <div className="confirmation-item full-width">
              <label className="pp-confirmation-label">Result:</label>
              <span className="pp-confirmation-value">
                {selectedXray ? selectedXray.xrayResult : selectedLabTest.testResult || "N/A"}
              </span>
            </div>

            <div className="confirmation-item full-width">
              <label className="pp-confirmation-label">Remarks:</label>
              <span className="pp-confirmation-value">
                {selectedXray ? selectedXray.remark : selectedLabTest.remark || "N/A"}
              </span>
            </div>
          </div>

          <div className="pp-modal-actions">
          {selectedXray?.xrayId || selectedLabTest?.testId ? (
            <button
              className="view-file-button"
              onClick={() =>
                fetchFile(
                  selectedXray ? "xray" : "lab-test",
                  selectedXray ? selectedXray.xrayId : selectedLabTest.testId
                )
              }
            >
              View File or Image
            </button>
          ) : (
            <p className="no-file-text">No file available</p>
          )}

          <button className="pp-cancel-button" onClick={closeModal}>
            Close
          </button>
        </div>

        {/*image or file modal*/}
        {isFileModalOpen && (
        <div className="file-overlay">
          <div className="file-modal">
            <h3>File Preview</h3>
            
            {fileUrl && fileType ? (
              <>
                {fileType.startsWith("image") ? (
                  <img src={fileUrl} alt="Medical File" className="file-image" />
                ) : (
                  <a href={fileUrl} download="MedicalFile" className="download-link">
                    Download File
                  </a>
                )}
              </>
            ) : (
              <p className="no-file-text">File cannot be displayed.</p>
            )}

            <button className="close-file-button" onClick={() => setIsFileModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
        </div>
      </div>
    )}

    {/* Confirmation Modal for Deactivating Medication */}
    {showDeactivationModal && selectedPrescription && (
      <div className="modal-overlay">
        <div className="modal">
          {/* Close Button (X) */}
          <button
            className="close-modal-btn"
            onClick={() => setShowDeactivationModal(false)}
          >
            X
          </button>

          <h2>Confirm Deactivation</h2>
          
          {/* Display the message */}
          {message && (
            <div
              className={`modal-message ${messageType === "success" ? "success-message" : "error-message"}`}
            >
              {message}
            </div>
          )}

          <p>
            Are you sure you want to deactivate the medication{" "}
            <strong>{selectedPrescription.medication.scientificName}</strong> for{" "}
            <strong>{selectedPrescription.medication.internationalName}</strong>?
          </p>

          <div className="modal-actions">
            {/* Hide this button once the medication is deactivated */}
            {!isDeactivated && (
              <button
                className="confirm-button"
                onClick={() => handleDeactivate(selectedPrescription.prescriptionId)}
              >
                Yes, Deactivate
              </button>
            )}
            
            <button
              className="cancel-button"
              onClick={() => setShowDeactivationModal(false)}
            >
              No, Go Back
            </button>
          </div>
        </div>
      </div>
    )}
      </div>
    </div>
  );
};
export default PatientProfile;



