import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Paper, Typography, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material';

const ProductsWithSubProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedSubProducts, setSelectedSubProducts] = useState({});

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/product/subproduct/all`);
      if (response.status === 200) {
        setProducts(response.data.data);
        // Initialize selectedSubProducts state
        const initialSelectedSubProducts = response.data.data.reduce((acc, product) => {
          acc[product._id] = product.todayProduct || '';
          return acc;
        }, {});
        setSelectedSubProducts(initialSelectedSubProducts);
      }
    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  const handleSubProductChange = (productId, subProductId) => {
    setSelectedSubProducts({
      ...selectedSubProducts,
      [productId]: subProductId,
    });
  };

  const handleSave = async (productId) => {
    const subProductId = selectedSubProducts[productId];
    try {
      await axios.put(`${baseUrl}/product/todayproduct/update/${productId}/${subProductId}`);
      alert('Subproduct updated successfully');
    } catch (error) {
      console.error('Error updating subproduct:', error);
      alert('Failed to update subproduct');
    }
  };

  return (
    <div>
      {products.map((product) => (
        <Paper key={product._id} style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h5">{product.name}</Typography>
          <Typography variant="body1">{product.description}</Typography>
          <FormControl fullWidth style={{ marginTop: '20px', marginBottom: '20px' }}>
            <InputLabel>Select Subproduct</InputLabel>
            <Select
              value={selectedSubProducts[product._id]}
              onChange={(e) => handleSubProductChange(product._id, e.target.value)}
            >
              {product.SubProducts.map((subProduct) => (
                <MenuItem key={subProduct._id} value={subProduct._id}>
                  {subProduct.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={() => handleSave(product._id)}>
            Save
          </Button>
        </Paper>
      ))}
    </div>
  );
};

export default ProductsWithSubProducts;
