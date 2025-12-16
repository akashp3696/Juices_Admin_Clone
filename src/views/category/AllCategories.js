import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Link } from 'react-router-dom';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category/all`);
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setOpenModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/category/delete/${selectedCategory}`);
      fetchCategories(); // Refresh categories after deletion
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div>
      <h2>All Categories</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/edit-category/${category._id}`} variant="contained">
                    Edit
                  </Button> &nbsp;
                  {'  '}
                  <Button variant="contained" onClick={() => handleDelete(category._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <div style={{ padding: '20px' }}>
          <h3>Are you sure you want to delete this category?</h3>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleConfirmDelete}>Delete</Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AllCategories;
