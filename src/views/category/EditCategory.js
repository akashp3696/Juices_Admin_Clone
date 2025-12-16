import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../utils/data';

const EditCategoryContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const UpdateButton = {
  backgroundColor: '#007bff',
  color: 'white',
};

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [allCategory, setAllCategory] = useState(null);

  useEffect(() => {
    getCategoryData();
    getAllCategory();
  }, []);

  const getCategoryData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category/single/${id}`);
      const { name, description } = res.data.data;
      setFormData({ name, description });
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const getAllCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category/all`);
      setAllCategory(res?.data?.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, description } = formData;

      if (!name) {
        alert('Category name is required.');
        return;
      }

      await axios.put(`${baseUrl}/category/update/${id}`, { name, description });

      alert('Category Updated successfully.');
      navigate(-1);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    <div style={EditCategoryContainer}>
      <h2>Edit Category</h2>
      <Box component="form" onSubmit={handleSubmit} style={{ padding: '2rem', width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained"  type="submit">
              Update Category
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditCategory;
