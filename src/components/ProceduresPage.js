import React, { useState, useEffect } from "react";
import axios from "./axiosConfig"; // Axios instance with auth header
import "./ProceduresPage.css"; // CSS for styling
import Sidebar from './Sidebar';


const ProceduresPage = () => {
  const [procedures, setProcedures] = useState([]); // Stores all procedures
  const [filteredProcedures, setFilteredProcedures] = useState([]); // Stores filtered search results
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [procedureName, setProcedureName] = useState(""); // New procedure name input
  const [procedureDescription, setProcedureDescription] = useState(""); // New procedure description input
  const [loading, setLoading] = useState(false); // Loading state

  // 🔹 Fetch All Procedures From API
  const fetchProcedures = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/procedures/");
      setProcedures(response.data || []); // Store all procedures
      setFilteredProcedures(response.data || []); // Initially show all
    } catch (error) {
      console.error("Error fetching procedures:", error);
      setProcedures([]);
      setFilteredProcedures([]);
    }
    setLoading(false);
  };

  // 🔹 Handle Search (Real-time Filtering)
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);

    if (!value) {
      setFilteredProcedures(procedures); // Show all if search is empty
    } else {
      const filtered = procedures.filter((procedure) =>
        procedure.procedure_name.toLowerCase().includes(value)
      );
      setFilteredProcedures(filtered);
    }
  };

  // 🔹 Handle Adding a New Procedure
  const handleAddProcedure = async (e) => {
    e.preventDefault();
    const newProcedure = {
      procedure_name: procedureName,
      procedure_description: procedureDescription,
    };
  
    try {
      await axios.post("/admin/procedures/", newProcedure, {
        headers: { "Content-Type": "application/json" },
      });
  
      setProcedureName("");
      setProcedureDescription("");
  
      // 🔹 Fetch updated list from the API
      fetchProcedures();
    } catch (error) {
      console.error("Error adding procedure:", error);
    }
  };
  

  // 🔹 Fetch Procedures When Component Loads
  useEffect(() => {
    fetchProcedures();
  }, []);

  return (
    <div className="procedures-page">
                  <Sidebar />

      <h1>Procedures</h1>

      <div className="procedures-page-content">{/* 🔹 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search procedures..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* 🔹 Add Procedure Form */}
      <form className="add-procedure-form" onSubmit={handleAddProcedure}>
        <input
          type="text"
          placeholder="Enter procedure name"
          value={procedureName}
          onChange={(e) => setProcedureName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter procedure description"
          value={procedureDescription}
          onChange={(e) => setProcedureDescription(e.target.value)}
          required
        />
        <button type="submit" className="add-button">
          + Add Procedure
        </button>
      </form>

      {/* 🔹 Procedures Table */}
      <div className="procedures-table">
        <h2>Procedures List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Procedure Name</th>
                <th>Procedure Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcedures.length > 0 ? (
                filteredProcedures.map((procedure, index) => (
                  <tr key={index}>
                    <td>{procedure.procedure_name}</td>
                    <td>{procedure.procedure_description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No procedures found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div> </div>


      
    </div>
  );
};

export default ProceduresPage;
