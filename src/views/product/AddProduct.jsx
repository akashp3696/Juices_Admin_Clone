import React, { useEffect, useState } from 'react';
import { Card, Button, TextField, Box, Grid, MenuItem } from '@mui/material';
import { IconArrowLeft } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../utils/data';
import axios from 'axios';
import imageCompression from 'browser-image-compression';


const AddProductContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const BackIcon = {
  marginBottom: '1rem',
};

const ProductForm = {
  padding: '2rem',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const CreateButton = {
  backgroundColor: '#62B34F',
  color: 'white',
};

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    days: '',
    image: null,
    images: {
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
    },
  });
  const [imagePreviews, setImagePreviews] = useState({
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    image5: '',
  });
  const [allCategory, setAllCategory] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category/all`);
      setAllCategory(res?.data?.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleImage = async (e, img) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const options = {
          maxSizeMB: 1.0,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const objectUrl = URL.createObjectURL(compressedFile);
        setImagePreviews({ ...imagePreviews, [img]: objectUrl });
        setFormData({ ...formData, images: { ...formData.images, [img]: compressedFile } });
      }
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, description, price, category, trialPack, packageCharge, image, images } = formData;

      if (!name || !price || !description ) {
        alert('Please enter all details.');
        return;
      }

      if(!images.image1 || !images.image2){
        return alert("Please Add At least 2 Images")
      }

      const formDataPayload = new FormData();
      formDataPayload.append('name', name);
      formDataPayload.append('description', description);
      formDataPayload.append('price', price);
      formDataPayload.append('category', category||"");
      formDataPayload.append('trialPack', trialPack||0);
      formDataPayload.append('packageCharge', packageCharge||0);
       Object.keys(formData.images).forEach(imageKey => {
        if (formData.images[imageKey]) {
          formDataPayload.append(imageKey, formData.images[imageKey]);
        }
      });

      const res = await axios.post(`${baseUrl}/product/create`, formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res?.status === 200) {
        alert('Product Added successfully.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div style={AddProductContainer}>
      <h2>Add New Product</h2>
      <Box style={ProductForm} component="form" onSubmit={handleSubmit}>
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
              label="Price"
              name="price"
              value={formData.price}
              onChange={(e)=>setFormData({...formData, price:e.target.value.replace(/\D/g, "")})}
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
              multiline
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              fullWidth
              select
            >
              {allCategory?.length > 0 &&
                allCategory.map((ele, i) => (
                  <MenuItem key={`cat-product-${i}`} value={ele?._id}>
                    {ele?.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Trial Pack Charge"
              name="trialPack"
              value={formData.trialPack}
              onChange={(e)=>setFormData({...formData, trialPack:e.target.value.replace(/\D/g, "")})}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Packaging Charge"
              name="packageCharge"
              value={formData.packageCharge}
              onChange={(e)=>setFormData({...formData, packageCharge:e.target.value.replace(/\D/g, "")})}
              required
              fullWidth
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              name="image"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {imagePreview && (
              <img src={imagePreview} alt="Product Preview" style={{ width: '180px', height:"200px" }} />
            )}
          </Grid> */}
           {['image1', 'image2', 'image3', 'image4', 'image5'].map((image, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <input
                type="file"
                name={image}
                accept="image/*"
                onChange={(e) => handleImage(e, image)}
              />
              {imagePreviews[image] && (
                <img
                  src={imagePreviews[image]}
                  alt={`preview-${image}`}
                  style={{ width: '100px', height: '100px', display: 'block', marginTop: '10px' }}
                />
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained"  type="submit">
              Add Product
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AddProduct;
