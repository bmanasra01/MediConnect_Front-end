import React, { useState, useEffect } from 'react';
import axios from './axiosConfig'; // Adjust the path to your axios configuration file
import Sidebar from './Sidebar'; // Adjust the path to your Sidebar component
import './CategoriesPage.css'; // Create a CSS file for styling this page

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    setError(null); // Reset error message
    try {
      const response = await axios.get('/admin/categories', {
        params: { search: searchTerm },
      });
      setCategories(response.data); // Assuming the response data is an array
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]); // Re-fetch categories when the search term changes

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/admin/categories/', {
        category_name: newCategory,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess('Category added successfully!');
        setNewCategory(''); // Clear input field
        fetchCategories(); // Refresh category list
      }
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again later.');
    }
  };

  return (
    <div className="categories-page">
      <Sidebar />
      <div className="content">
        {/* Header with search bar */}
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search categories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
        </div>

        {/* Add category input and button */}
        <div className="add-category-section">
          <input
            type="text"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="new-category-input"
          />
          <button onClick={handleAddCategory} className="add-category-button">
            + Add Category
          </button>
        </div>

        {/* Display errors or success messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Categories Table */}
        <h2>Categories List</h2>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.category_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesPage;
