import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import {
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
  Input,
  MenuItem,
  Select,
} from '@mui/material';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const DailySheet = () => {
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState(null);
  const [morningOperation, setMorningOperation] = useState([]);
  const [eveningOperation, setEveningOperation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsData();
    const today = new Date();
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + 1); // Default to tomorrow's date
    setDate(nextDate.toISOString().split('T')[0]); // Format as "YYYY-MM-DD"
  }, []);

  const fetchProductsData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/product/subproduct/all`);
      if (response.status === 200) {
        setProducts(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleOperationChange = (e, timeOfDay, productId) => {
    const { name, value } = e.target;
    const operationState = timeOfDay === 'morning' ? morningOperation : eveningOperation;

    const existingOperation = operationState.find((operation) => operation.product === productId);

    if (existingOperation) {
      const updatedOperations = operationState.map((operation) =>
        operation.product === productId ? { ...operation, [name]: value } : operation,
      );
      timeOfDay === 'morning'
        ? setMorningOperation(updatedOperations)
        : setEveningOperation(updatedOperations);
    } else {
      const newOperation = { product: productId, [name]: value };
      timeOfDay === 'morning'
        ? setMorningOperation([...operationState, newOperation])
        : setEveningOperation([...operationState, newOperation]);
    }
  };

  const handleUpdateAndGenerate = async () => {
    if (!date) {
      return toast.error('Please select a date.');
    }
    if (morningOperation.length === 0 || eveningOperation.length === 0) {
      return toast.error('Both morning and evening operations must be filled.');
    }

    const payload = {
      date: moment(date).format('YYYY-MM-DD'),
      morningOperations: morningOperation,
      eveningOperations: eveningOperation,
    };

    try {
      const updateResponse = await axios.post(`${baseUrl}/dailysheet/create`, payload);
      if (updateResponse.status === 200) {
        toast.success('Operations updated successfully.');

        // Automatically generate sheet after successful update
        const generateResponse = await axios.post(`${baseUrl}/dailysheet/generatesheet`, { date });
        if (generateResponse.status === 200) {
          toast.success('Sheet generated successfully.');
        }
      }
    } catch (error) {
      console.error('Error updating or generating the sheet:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <h2>Daily Sheet Management</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Select Date</Typography>
          <Input type="date" value={date} onChange={handleDateChange} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Morning Update</Typography>
          {products.map((product) => (
            <FormControl fullWidth sx={{ mb: 2 }} key={product._id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>{product.name}</Typography>
                <Select
                  name="subProduct"
                  value={
                    morningOperation.find((op) => op.product === product._id)?.subProduct || ''
                  }
                  onChange={(e) => handleOperationChange(e, 'morning', product._id)}
                  sx={{ ml: 2 }}
                >
                  {product.SubProducts.map((subProduct) => (
                    <MenuItem key={subProduct._id} value={subProduct._id}>
                      {subProduct.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>
          ))}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Evening Update</Typography>
          {products.map((product) => (
            <FormControl fullWidth sx={{ mb: 2 }} key={product._id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 2 }}>{product.name}</Typography>
                <Select
                  name="subProduct"
                  value={
                    eveningOperation.find((op) => op.product === product._id)?.subProduct || ''
                  }
                  onChange={(e) => handleOperationChange(e, 'evening', product._id)}
                  sx={{ ml: 2 }}
                >
                  {product.SubProducts.map((subProduct) => (
                    <MenuItem key={subProduct._id} value={subProduct._id}>
                      {subProduct.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </FormControl>
          ))}
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleUpdateAndGenerate}>
        Update & Generate Sheet
      </Button>
      <hr />
      <Button variant="contained" color="primary" onClick={() => navigate(`/getsheet`)}>
        Get Sheet
      </Button>
    </Box>
  );
};

export default DailySheet;
