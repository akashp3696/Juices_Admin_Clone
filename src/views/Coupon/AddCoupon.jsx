import React, { useState } from 'react';
import { Box, TextField, Button, Grid } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';

const AddCoupon = () => {
    const [formData, setFormData] = useState({
        code: '',
        discount: 0,
        validFrom: '',
        validUntil: '',
        maxUsage: 1,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { code, discount, validFrom, validUntil, maxUsage } = formData;

            if (!code || !validFrom || !validUntil) {
                alert('Code, discount, validFrom, and validUntil are required.');
                return;
            }
            if( discount <=0 ){
                alert("Discount should greater than zero.")
            }
            if( maxUsage <=0 ){
                alert("maxUsage should greater than zero.")
            }

            const res = await axios.post(`${baseUrl}/coupon`, { code, discount, validFrom, validUntil, maxUsage });

            if (res?.status === 200) {
                alert('Coupon created successfully.');
                // Optionally: Reset form fields after successful submission
                setFormData({ code: '', discount: 0, validFrom: '', validUntil: '', maxUsage: 1 });
            }
        } catch (error) {
            console.error('Error adding coupon:', error);
        }
    };

    return (
        <div>
            <h2>Add New Coupon</h2>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Discount"
                            name="discount"
                            type="number"
                            value={formData.discount}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Valid From"
                            name="validFrom"
                            type="date"
                            value={formData.validFrom}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Valid Until"
                            name="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={handleChange}
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Max Usage"
                            name="maxUsage"
                            type="number"
                            value={formData.maxUsage}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" type="submit">
                            Add Coupon
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default AddCoupon;
