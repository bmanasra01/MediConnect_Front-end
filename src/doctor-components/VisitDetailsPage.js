import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DoctorSidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./VisitDetailsPage.css";
import { FaUserCircle } from "react-icons/fa"; 

const VisitDetailsPage = () => {
  const { visitID } = useParams();
  const [visitDetails, setVisitDetails] = useState(null);
  const [xRays, setXRays] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  const [fileUrl, setFileUrl] = useState(null);
  const [isFileOverlayOpen, setIsFileOverlayOpen] = useState(false);

  const handleUploadFile = async (file, id, type) => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      // تحديد الـ API بناءً على النوع (X-ray أو Lab Test)
      const apiPath = type === "x-rays" 
        ? `/x-rays/${id}/upload-result` 
        : `/lab-tests/${id}/upload-result`;
  
      const response = await axios.post(apiPath, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      alert("File uploaded successfully!");
  
      // تحديث البيانات بعد رفع الملف مباشرةً
      if (type === "x-rays") {
        setXRays(prev => prev.map(item => item.xrayId === id ? { ...item, resultFilePath: response.data.filePath } : item));
      } else if (type === "lab-tests") {
        setLabTests(prev => prev.map(item => item.testId === id ? { ...item, resultFilePath: response.data.filePath } : item));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };
  
    

  const handleUpdateXRay = async (xrayId, xray) => {
    try {
      const updateData = {
        title: xray.title, // Keep the title as it is
        xrayTime: xray.xrayTime,
        xrayDate: xray.xrayDate,
        xrayDetails: xray.newDetails || xray.xrayDetails, // Use new value if entered
        xrayResult: xray.newResult || xray.xrayResult,
        remark: xray.newRemark || xray.remark,
      };
  
      await axios.put(`/x-rays/updateXRay/${xrayId}`, updateData);
  
      alert("X-ray details updated successfully!");
  
      // Update state to show new values
      setXRays(prev =>
        prev.map(item =>
          item.xrayId === xrayId
            ? {
                ...item,
                xrayDetails: updateData.xrayDetails,
                xrayResult: updateData.xrayResult,
                remark: updateData.remark,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating X-ray:", error);
      alert("Failed to update X-ray details.");
    }
  };
  

  const handleUpdateLabTest = async (testId, test) => {
    try {
      await axios.put(`/lab-tests/updateLabTest/${testId}`, {
        title: test.title,
        testTime: test.testTime,
        testDate: test.testDate,
        testDetails: test.newDetails || test.testDetails,
        testResult: test.newResult || test.testResult,
        remark: test.newRemark || test.remark,
      });
      alert("Lab test details updated successfully!");
      setLabTests(prev => prev.map(item => item.testId === testId ? { ...item, testDetails: test.newDetails || item.testDetails, testResult: test.newResult || item.testResult, remark: test.newRemark || item.remark } : item));
    } catch (error) {
      console.error("Error updating Lab Test:", error);
      alert("Failed to update Lab Test details.");
    }
  };


  const handleViewFile = async (fileApiUrl) => {
    try {
      const response = await axios.get(fileApiUrl, { responseType: "blob" });

      const file = window.URL.createObjectURL(new Blob([response.data]));
      const fileType = response.headers["content-type"];

      if (fileType.startsWith("image/")) {
        setFileUrl(file);
        setIsFileOverlayOpen(true);
      } else {
        const link = document.createElement("a");
        link.href = file;
        link.setAttribute("download", "file");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

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

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(`/procedure/visit/${visitID}/procedures`);
        setProcedures(response.data);
      } catch (error) {
        console.error("Error fetching procedures:", error);
      }
    };

    fetchProcedures();
  }, [visitID]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const patientID = visitDetails?.patient.patientId;
        if (patientID) {
          const response = await axios.get(`/prescriptions/patient/${patientID}/visit/${visitID}`);
          setPrescriptions(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]);
      }
    };

    if (visitDetails) fetchPrescriptions();
  }, [visitDetails, visitID]);

  if (!visitDetails) return <p>Loading...</p>;

  return (
    <div className="visit-details-page">
      <DoctorSidebar />
      <div className="visit-details-content">
        <h3 className="section-title">Personal Information</h3>
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

       
        <h3 className="section-title">X-ray Information</h3>
        <div className="info-box">
          {xRays.length > 0 ? (
            xRays.map((xray) => (
              <div key={xray.xrayId} className="item-box">
                <p><strong>Title:</strong> {xray.title}</p>
                <p><strong>Date/Time:</strong> {xray.xrayDate} / {xray.xrayTime}</p>
                

                <div>
                  <p><strong>Details:</strong> 
                    {xray.xrayDetails ? xray.xrayDetails : (
                      <input 
                        type="text" 
                        placeholder="Enter details" 
                        value={xray.newDetails || ""} 
                        onChange={(e) => setXRays(prev => prev.map(item => item.xrayId === xray.xrayId ? { ...item, newDetails: e.target.value } : item))}
                      />
                    )}
                  </p>

                  <p><strong>Result:</strong> 
                    {xray.xrayResult ? xray.xrayResult : (
                      <input 
                        type="text" 
                        placeholder="Enter result" 
                        value={xray.newResult || ""} 
                        onChange={(e) => setXRays(prev => prev.map(item => item.xrayId === xray.xrayId ? { ...item, newResult: e.target.value } : item))}
                      />
                    )}
                  </p>

                  <p><strong>Remark:</strong> 
                    {xray.remark ? xray.remark : (
                      <input 
                        type="text" 
                        placeholder="Enter remark" 
                        value={xray.newRemark || ""} 
                        onChange={(e) => setXRays(prev => prev.map(item => item.xrayId === xray.xrayId ? { ...item, newRemark: e.target.value } : item))}
                      />
                    )}
                  </p>

                  {(!xray.xrayDetails || !xray.xrayResult || !xray.remark) && (
                    <button 
                      className="save-button"
                      onClick={() => handleUpdateXRay(xray.xrayId, xray)}
                    >
                      Save
                    </button>
                  )}
                </div>

                {!xray.resultFilePath ? (
                  <input 
                  type="file" 
                  onChange={(e) => handleUploadFile(e.target.files[0], xray.xrayId, "x-rays")}
                />

                ) : (
                  <button 
                    className="file-button" 
                    onClick={() => handleViewFile(`/x-rays/${xray.xrayId}/download-result`)}
                  >
                    View File
                  </button>
                  )}


                {isFileOverlayOpen && (
          <div className="file-overlay" onClick={() => setIsFileOverlayOpen(false)}>
            <div className="file-content">
              <img src={fileUrl} alt="File Preview" className="file-image" />
            </div>
          </div>
        )}

              </div>
            ))
          ) : (
            <p>No X-rays this visit.</p>
          )}
        </div>

        
        <h3 className="section-title">Lab Test Information</h3>
        <div className="info-box">
          {labTests.length > 0 ? (
            labTests.map((test) => (
              <div key={test.testId} className="item-box">
                <p><strong>Title:</strong> {test.title}</p>
                <p><strong>Date/Time:</strong> {test.testDate} / {test.testTime}</p>
                
                <div>
                  <p><strong>Details:</strong> 
                    {test.testDetails ? test.testDetails : (
                      <input 
                        type="text" 
                        placeholder="Enter details" 
                        value={test.newDetails || ""} 
                        onChange={(e) => setLabTests(prev => prev.map(item => item.testId === test.testId ? { ...item, newDetails: e.target.value } : item))}
                      />
                    )}
                  </p>

                  <p><strong>Result:</strong> 
                    {test.testResult ? test.testResult : (
                      <input 
                        type="text" 
                        placeholder="Enter result" 
                        value={test.newResult || ""} 
                        onChange={(e) => setLabTests(prev => prev.map(item => item.testId === test.testId ? { ...item, newResult: e.target.value } : item))}
                      />
                    )}
                  </p>

                  <p><strong>Remark:</strong> 
                    {test.remark ? test.remark : (
                      <input 
                        type="text" 
                        placeholder="Enter remark" 
                        value={test.newRemark || ""} 
                        onChange={(e) => setLabTests(prev => prev.map(item => item.testId === test.testId ? { ...item, newRemark: e.target.value } : item))}
                      />
                    )}
                  </p>

                  {(!test.testDetails || !test.testResult || !test.remark) && (
                    <button 
                      className="save-button"
                      onClick={() => handleUpdateLabTest(test.testId, test)}
                    >
                      Save
                    </button>
                  )}
                </div>

              
                {!test.resultFilePath ? (
                  <input 
                    type="file" 
                    onChange={(e) => handleUploadFile(e.target.files[0], test.testId, "lab-tests")}
                  />

                  ) : (
                    <button 
                      className="file-button" 
                      onClick={() => handleViewFile(`/lab-tests/${test.testId}/download-result`)}
                    >
                      View File
                    </button>
                  )}


                {isFileOverlayOpen && (
          <div className="file-overlay" onClick={() => setIsFileOverlayOpen(false)}>
            <div className="file-content">
              <img src={fileUrl} alt="File Preview" className="file-image" />
            </div>
          </div>
        )}

                
              </div>
            ))
          ) : (
            <p>No lab tests in this visit.</p>
          )}
        </div>

        <h3 className="section-title">Procedure Information</h3>
        <div className="info-box">
          {procedures.length > 0 ? (
            procedures.map((procedure) => (
              <div key={procedure.procedureVisitId} className="item-box">
                <p><strong>Name:</strong> {procedure.procedureName}</p>
                <p><strong>Date/Time:</strong> {procedure.procedureDate} / {procedure.procedureTime}</p>
                <p><strong>Description:</strong> {procedure.procedureMaster?.procedure_description || "N/A"}</p>
                <p><strong>Remarks:</strong> {procedure.remarks || "N/A"}</p>
              </div>
            ))
          ) : (
            <p>No procedures in this visit.</p>
          )}
        </div>

        <h3 className="section-title">Prescriptions</h3>
        <div className="info-box">
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <div key={prescription.prescriptionId} className="item-box">
                <p><strong>Medication:</strong> {prescription.medication.scientificName}</p>
                <p><strong>International Name:</strong> {prescription.medication.internationalName}</p>
                <p><strong>Dose Type:</strong> {prescription.doseType}</p>
                <p><strong>Dose Amount:</strong> {prescription.doseAmount}</p>
                <p><strong>Start Date:</strong> {prescription.startDate}</p>
                <p><strong>Total Days:</strong> {prescription.totalDays}</p>
                <p>
                  <strong>Status:</strong> 
                  <span className={prescription.active ? "status-active" : "status-inactive"}>
                    {prescription.active ? "Active" : "Stopped"}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p>No prescriptions in this visit.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default VisitDetailsPage;
