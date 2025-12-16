import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../utils/data';

const EditCouponContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const UpdateButton = {
  backgroundColor: '#007bff',
  color: 'white',
};

const EditCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    validFrom: '',
    validUntil: '',
    maxUsage: 1,
  });

  useEffect(() => {
    fetchCouponData();
  }, []);

  const fetchCouponData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/coupon/${id}`);
      const { code, discount, validFrom, validUntil, maxUsage } = res.data.data;
      const formattedValidFrom = new Date(validFrom).toISOString().split('T')[0];
      const formattedValidUntil = new Date(validUntil).toISOString().split('T')[0];
      setFormData({ code, discount, validFrom: formattedValidFrom, validUntil: formattedValidUntil, maxUsage });
    } catch (error) {
      console.error('Error fetching coupon data:', error);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { code, discount, validFrom, validUntil, maxUsage } = formData;

      if (!code || !discount || !validFrom || !validUntil) {
        alert('Code, discount, validFrom, and validUntil are required.');
        return;
      }

      await axios.put(`${baseUrl}/coupon/${id}`, { code, discount, validFrom, validUntil, maxUsage });

      alert('Coupon Updated successfully.');
      navigate(-1);
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  return (
    <div style={EditCouponContainer}>
      <h2>Edit Coupon</h2>
      <Box component="form" onSubmit={handleSubmit} style={{ padding: '2rem', width: '100%' }}>
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
              Update Coupon
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditCoupon;
