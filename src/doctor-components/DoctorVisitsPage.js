import React, { useState, useEffect } from "react";
import Sidebar from "./DoctorSidebar";
import axios from "./axiosConfig";
import "./DoctorVisitsPage.css";
import "./tables.css";
import { useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";

const DoctorVisitsPage = () => {
  const [visits, setVisits] = useState([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/visits/doctor/visits", {
        params: {
          page: 1,
          size: 100,
          month: month || "",
          year: year || "",
          search: searchQuery,
        },
      });

      setVisits(response.data.content);
      setTotalVisits(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [searchQuery, month, year]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const navigate = useNavigate();
  const handleRowClick = (visitID) => {
    navigate(`/visit/${visitID}`);
  };

  return (
    <div className="doctor-visits-page">
      <Sidebar />
      <div className="doctor-visits-content">
        <h1 className="visits-header">Doctor Visits</h1>

        {/* Header Section */}
        <div className="visits-header-section">
          {/* <div className="visits-total-box">
            <h3>Visits</h3>
            <p>{totalVisits}</p>
            <div className="percentage">
              <span>▲</span> <span>+5.11%</span>
            </div>
            <FaClipboardList className="total-icon" />
          </div> */}

          <div className="filters-container">
            <input
              type="text"
              className="visits-search"
              placeholder="Search by patient ID or name..."
              value={searchQuery}
              onChange={handleSearchChange}
            />

            <div className="filters-subsection">
              <select
                className="visits-month-filter"
                value={month}
                onChange={handleMonthChange}
              >
                <option value="">Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>

              <input
                type="number"
                className="visits-year-filter"
                placeholder="Year"
                value={year}
                onChange={handleYearChange}
              />
            </div>
          </div>
        </div>

        {/* Visits Table */}
        {loading ? (
          <p>Loading visits...</p>
        ) : (
          <div className="table-container">
          <table className="common-table">
            <thead>
              <tr>
                <th>Visit ID</th>
                <th>Visit Date</th>
                <th>Visit Time</th>
                <th>Patient Full Name</th>
                <th>Patient ID</th>
              </tr>
            </thead>
            <tbody>
              {visits.length > 0 ? (
                visits.map((visit) => (
                  <tr key={visit.visitID} onClick={() => handleRowClick(visit.visitID)}>
                    <td>{visit.visitID}</td>
                    <td>{visit.visitDate}</td>
                    <td>{visit.visitTime}</td>
                    <td>
                      {visit.patient.user.firstName} {visit.patient.user.lastName}
                    </td>
                    <td>{visit.patient.patientId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No visits found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
};

export default DoctorVisitsPage;



