import React, { useState, useEffect } from 'react';
import axios from './axiosConfig'; // Axios instance
import Sidebar from './Sidebar'; // Sidebar component
import './SpecializationsPage.css'; // CSS file for styling

const SpecializationsPage = () => {
  const [specializations, setSpecializations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSpecialization, setNewSpecialization] = useState({
    special_name: '',
    category_id: '',
  });

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/admin/categories');
      setCategories(response.data); // Assuming the data is an array
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories.');
    }
  };

  // Fetch specializations
  const fetchSpecializations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/specializations', {
        params: {
          search: searchTerm, // Include search term for filtering
        },
      });
      setSpecializations(response.data); // Assuming the data is an array
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setError('Failed to load specializations.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new specialization
  const handleAddSpecialization = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/admin/specializations', {
        special_name: newSpecialization.special_name,
        category_id: newSpecialization.category_id, // Send category_id instead of category_name
      });
  
      console.log('Specialization added successfully:', response.data);
      alert("Specialization added successfully!");
  
      // Reset form and refresh the list
      setNewSpecialization({ special_name: '', category_id: '' });
      fetchSpecializations();
    } catch (err) {
      console.error('Error adding specialization:', err);
      alert('Failed to add specialization.');
    }
  };
  

  useEffect(() => {
    fetchCategories(); // Load categories for the dropdown
    fetchSpecializations(); // Load specializations
  }, [searchTerm]);

  if (loading) return <p>Loading specializations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="specializations-page">
      <Sidebar />
      <div className="content">
        {/* Header with search bar and add specialization button */}
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by specialization name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
        </div>

        {/* Specializations Table */}
        <h2>Specializations List</h2>
        <table className="specializations-table">
          <thead>
            <tr>
              <th>Specialization Name</th>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
  {specializations.map((specialization, index) => (
    <tr key={specialization.id || index}>
      <td>{specialization.special_name}</td>
      <td>{specialization.category?.category_name || "N/A"}</td> 
    </tr>
  ))}
</tbody>


        </table>

        {/* Add Specialization Form */}
        <div className="add-specialization-form">
          <h2>Add New Specialization</h2>
          <form onSubmit={handleAddSpecialization}>
            <div className="form-group">
              <label>Specialization Name</label>
              <input
                type="text"
                name="special_name"
                value={newSpecialization.special_name}
                onChange={(e) =>
                  setNewSpecialization({ ...newSpecialization, special_name: e.target.value })
                }
                placeholder="Enter specialization name"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category_id"
                value={newSpecialization.category_id}
                onChange={(e) =>
                  setNewSpecialization({ ...newSpecialization, category_id: e.target.value })
                }
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id || category.category_name} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="add-button">
              Add Specialization
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpecializationsPage;
