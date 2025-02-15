import React, { useEffect, useState } from "react";
import axios from "./axiosConfig";
import DoctorSidebar from "../doctor-components/DoctorSidebar";
import { FaUserCircle } from "react-icons/fa"; 
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQualificationModal, setShowQualificationModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);

  // State for new qualification
  const [qualificationData, setQualificationData] = useState({ name: "", yearObtained: "", institution: "" });

  // State for new experience
  const [experienceData, setExperienceData] = useState({ institution: "", role: "", startDate: "", endDate: "" });

  useEffect(() => {
    axios.get("/doctors/auth/me")
      .then((response) => setDoctor(response.data))
      .catch(() => setError("Failed to load doctor information"));

    axios.get("/doctors/qualifications/my")
      .then((response) => setQualifications(response.data))
      .catch(() => setQualifications([]));

    axios.get("/doctors/experiences/my")
      .then((response) => setExperiences(response.data))
      .catch(() => setExperiences([]));

    setLoading(false);
  }, []);

  const addQualification = (e) => {
    e.preventDefault();
    axios.post("/doctors/qualifications/", qualificationData)
      .then(() => {
        setQualifications([...qualifications, qualificationData]);
        setShowQualificationModal(false);
      })
      .catch(() => alert("Failed to add qualification"));
  };

  const addExperience = (e) => {
    e.preventDefault();
    axios.post("/doctors/experiences/", experienceData)
      .then(() => {
        setExperiences([...experiences, experienceData]);
        setShowExperienceModal(false);
      })
      .catch(() => alert("Failed to add experience"));
  };

  if (loading) return <div className="loading">Loading doctor information...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!doctor) return <div className="error">Failed to load doctor data.</div>;

  return (
    <div className="doctor-profile-container">
      <DoctorSidebar />
      <div className="profile-content">
        <div className="profile-header">
          <FaUserCircle className="user-photo" />
          <h2>{doctor?.user?.firstName} {doctor?.user?.lastName}</h2>
          <p>{doctor?.specialization?.special_name}</p>
        </div>

        <div className="profile-details">
          <p><strong>Email:</strong> {doctor?.user?.email}</p>
          <p><strong>Phone:</strong> {doctor?.user?.phone}</p>
          <p><strong>Specialization:</strong> {doctor?.specialization?.special_name} ({doctor?.specialization?.category_name})</p>
          <p><strong>Gender:</strong> {doctor?.gender === "MALE" ? "Male" : "Female"}</p>
        </div>

        {/* Qualifications Section */}
        <div className="additional-info">
          <h3>Qualifications</h3>
          {qualifications.length > 0 ? (
            <ul>
              {qualifications.map((q, index) => (
                <li key={index}>
                  {q.name} - {q.institution} ({q.yearObtained})
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No data</p>
          )}
          <button className="q-add-btn" onClick={() => setShowQualificationModal(true)}>+ Add Qualification</button>
        </div>

        {/* Experiences Section */}
        <div className="additional-info">
          <h3>Experiences</h3>
          {experiences.length > 0 ? (
            <ul>
              {experiences.map((e, index) => (
                <li key={index}>
                  {e.role} at {e.institution} ({e.startDate} - {e.endDate})
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">No data</p>
          )}
          <button className="q-add-btn" onClick={() => setShowExperienceModal(true)}>+ Add Experience</button>
        </div>
      </div>

      {/* Qualification Modal */}
      {showQualificationModal && (
        <div className="q-modal">
          <div className="q-modal-content">
            <h2>Add Qualification</h2>
            <form onSubmit={addQualification}>
              <input type="text" placeholder="Qualification Name" value={qualificationData.name} onChange={(e) => setQualificationData({ ...qualificationData, name: e.target.value })} required />
              <input type="number" placeholder="Year Obtained" value={qualificationData.yearObtained} onChange={(e) => setQualificationData({ ...qualificationData, yearObtained: e.target.value })} required />
              <input type="text" placeholder="Institution" value={qualificationData.institution} onChange={(e) => setQualificationData({ ...qualificationData, institution: e.target.value })} required />
              <button type="submit">Submit</button>
              <button className="q-close-btn" onClick={() => setShowQualificationModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="q-modal">
          <div className="q-modal-content">
            <h2>Add Experience</h2>
            <form onSubmit={addExperience}>
              <input type="text" placeholder="Institution" value={experienceData.institution} onChange={(e) => setExperienceData({ ...experienceData, institution: e.target.value })} required />
              <input type="text" placeholder="Role" value={experienceData.role} onChange={(e) => setExperienceData({ ...experienceData, role: e.target.value })} required />
              <input type="date" value={experienceData.startDate} onChange={(e) => setExperienceData({ ...experienceData, startDate: e.target.value })} required />
              <input type="date" value={experienceData.endDate} onChange={(e) => setExperienceData({ ...experienceData, endDate: e.target.value })} required />
              <button type="submit">Submit</button>
              <button className="q-close-btn" onClick={() => setShowExperienceModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;



// import React, { useEffect, useState } from "react";
// import axios from "./axiosConfig"; // Using axiosConfig.js
// import DoctorSidebar from "../doctor-components/DoctorSidebar";
// import { FaUserCircle } from "react-icons/fa"; // Default profile icon
// import "./DoctorProfile.css"; // Styles

// const DoctorProfile = () => {
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("/doctors/auth/me")
//       .then((response) => {
//         setDoctor(response.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to load doctor information.");
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div className="loading">Loading doctor information...</div>;
//   if (error) return <div className="error">{error}</div>;

//   return (
//     <div className="doctor-profile">
//       <DoctorSidebar />
//       <div className="profile-content">
//         <div className="profile-header">
//           <FaUserCircle className="user-photo" />
//           <h2>
//             {doctor.user.firstName} {doctor.user.lastName}
//           </h2>
//           <p>{doctor.specialization.special_name}</p>
//         </div>

//         <div className="profile-details">
//           <p><strong>Email:</strong> {doctor.user.email}</p>
//           <p><strong>Phone:</strong> {doctor.user.phone}</p>
//           <p><strong>Specialization:</strong> {doctor.specialization.special_name} ({doctor.specialization.category_name})</p>
//           <p><strong>Gender:</strong> {doctor.gender === "MALE" ? "Male" : "Female"}</p>
//         </div>

//         <div className="additional-info">
//           <h3>Qualifications</h3>
//           <p className="empty">Not added yet</p>

//           <h3>Experiences</h3>
//           <p className="empty">Not added yet</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorProfile;

