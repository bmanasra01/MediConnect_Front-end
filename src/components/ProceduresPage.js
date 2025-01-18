import React, { useState, useEffect } from "react";
import axios from "./axiosConfig"; // Axios instance with auth header
import "./ProceduresPage.css"; // Add styling as needed

const ProceduresPage = () => {
  const [procedures, setProcedures] = useState([]); // State for all procedures
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [procedureName, setProcedureName] = useState(""); // State for new procedure name
  const [procedureDescription, setProcedureDescription] = useState(""); // State for description
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch All Procedures
  const fetchProcedures = () => {
    setLoading(true);
    axios
      .get(`/admin/procedures/?search=${searchQuery}&page=1&size=1000`) // Large size to fetch all
      .then((response) => {
        setProcedures(response.data.content || []); // Update procedures list
      })
      .catch((error) => {
        console.error("Error fetching procedures:", error);
      })
      .finally(() => setLoading(false));
  };

  // Handle Add Procedure
  const handleAddProcedure = (e) => {
    e.preventDefault();
    const data = {
      procedure_name: procedureName,
      procedure_description: procedureDescription,
    };

    axios
      .post("/admin/procedures/", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setProcedures((prev) => [response.data, ...prev]); // Add new procedure to table
        setProcedureName("");
        setProcedureDescription("");
      })
      .catch((error) => {
        console.error("Error adding procedure:", error);
      });
  };

  // Fetch procedures on component mount and search query change
  useEffect(() => {
    fetchProcedures();
  }, [searchQuery]); // Refetch when searchQuery changes

  return (
    <div className="procedures-page">
      <h1>Procedures</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search procedures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add Procedure Form */}
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

      {/* Procedures Table */}
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
              {procedures.length > 0 ? (
                procedures.map((procedure, index) => (
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
      </div>
    </div>
  );
};

export default ProceduresPage;
