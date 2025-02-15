


import React, { useEffect, useState } from "react";
import axios from "./axiosConfig"; // Uses axios with auth headers
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./ClinicDoctorsPage.css";

const ClinicDoctorsPage = () => {
  const { clinicId } = useParams(); // Get clinicId from URL
  const [doctors, setDoctors] = useState([]); // Doctors assigned to the clinic
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Store selected doctor

  // Fetch doctors assigned to this clinic
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/admin/doctor-clinics/doctors/${clinicId}`);
        setDoctors(response.data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please check your authentication.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [clinicId]);

  // Fetch doctors based on search query
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) {
      setSearchResults([]); // Clear results if query is empty
      return;
    }

    try {
      const response = await axios.get("/admin/doctors/getAllDoctors", {
        params: { page: 1, size: 100, search: query },
      });

      // Extract only doctorId and full name
      const formattedResults = response.data.content.map((doctor) => ({
        doctorId: doctor.doctorId,
        fullName: `${doctor.user.firstName} ${doctor.user.lastName}`,
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching doctors:", error);
      setSearchResults([]);
    }
  };

const handleAddDoctor = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor first.");
      return;
    }
  
    try {
      await axios.post("/admin/doctor-clinics/", {
        clinicId: clinicId,
        doctorId: selectedDoctor.doctorId,
      });
  
      alert("Doctor added successfully!");
  
      // Reload the page to fetch the updated doctor list
      window.location.reload();
  
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor.");
    }
  };
  
  

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-clinic-page">
      <Sidebar />
      <div className="doctor-clinic-content">
        <h2>Doctors in Clinic {clinicId}</h2>

        {/* Search Bar for Finding Doctors */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a doctor..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Dropdown for Search Results */}
          {searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((doctor) => (
                <li key={doctor.doctorId} onClick={() => setSelectedDoctor(doctor)}>
                  {doctor.fullName} - ID: {doctor.doctorId}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Show Selected Doctor */}
        {selectedDoctor && (
          <div className="selected-doctor">
            <p>
              <strong>Selected Doctor:</strong> {selectedDoctor.fullName} - ID: {selectedDoctor.doctorId}
            </p>
            <button onClick={handleAddDoctor} className="add-button">Add Doctor</button>
          </div>
        )}

        {/* Doctors Table */}
        <table className="doctors-table">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Specialization</th>
            </tr>
          </thead>
         

<tbody>
  {doctors.length > 0 ? (
    doctors.map((doctor) => (
      <tr key={doctor.doctorId}>
        <td>{doctor.doctorId}</td>
        <td>{doctor.user?.firstName || "N/A"} {doctor.user?.lastName || "N/A"}</td>
        <td>{doctor.user?.email || "N/A"}</td>
        <td>{doctor.special_name || "N/A"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6">No doctors found for this clinic.</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default ClinicDoctorsPage;

