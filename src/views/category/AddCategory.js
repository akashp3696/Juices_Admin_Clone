import React, { useState } from 'react';
import { Box, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';

const AddCategory = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

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

            const res = await axios.post(`${baseUrl}/category/create`, { name, description });

            if (res?.status === 200) {
                alert('Category created successfully.');
                // Optionally: Reset form fields after successful submission
                setFormData({ name: '', description: '' });
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div>
            <h2>Add New Category</h2>
            <Box component="form" onSubmit={handleSubmit}>
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
                        <Button variant="contained" type="submit">
                            Add Category
                        </Button>
                    </Grid>
                </Grid>
                {/* <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                />
                <Button variant="contained" type="submit">
                    Add Category
                </Button> */}
            </Box>
        </div>
    );
};

export default AddCategory;
