import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Delete, Edit, Add } from '@mui/icons-material';
import imageCompression from 'browser-image-compression';


const SubProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [subProducts, setSubProducts] = useState([]);
  const [selectedSubProduct, setSelectedSubProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openSubProductModal, setOpenSubProductModal] = useState(false);
  const [subProductForm, setSubProductForm] = useState({
    name: '',
    description: '',
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

  useEffect(() => {
    fetchProduct();
    fetchSubProducts();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product/single/${id}`);
      setProduct(res?.data?.data || null);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchSubProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/subProduct/all/${id}`);
      setSubProducts(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching sub-products:', error);
    }
  };

  const handleEdit = (subProductId) => {
    const subProduct = subProducts.find(sp => sp._id === subProductId);
    if (subProduct) {
      setSubProductForm(subProduct);
      setImagePreviews(subProduct.images);
      setSelectedSubProduct(subProductId);
      setOpenSubProductModal(true);
    }
  };

  const handleDelete = (subProductId) => {
    setSelectedSubProduct(subProductId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedSubProduct(null);
    setOpenModal(false);
  };

  const handleCloseSubProductModal = () => {
    setSubProductForm({
      name: '',
      description: '',
      images: {
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        image5: '',
      },
    });
    setImagePreviews({
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      image5: '',
    });
    setSelectedSubProduct(null);
    setOpenSubProductModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/subProduct/delete/${selectedSubProduct}`);
      fetchSubProducts(); // Refresh sub-products after deletion
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting sub-product:', error);
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
        console.log(compressedFile);
        // Set the compressed image to show preview and form data
        setImagePreviews({ ...imagePreviews, [img]: objectUrl });
        setSubProductForm({ ...subProductForm, images: { ...subProductForm.images, [img]: compressedFile } });
      }
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };


  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith('image')) {
      handleImage(e, name);
      // const file = files[0];
      // setSubProductForm(prevState => ({
      //   ...prevState,
      //   images: {
      //     ...prevState.images,
      //     [name]: file,
      //   }
      // }));

      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setImagePreviews(prevState => ({
      //     ...prevState,
      //     [name]: reader.result,
      //   }));
      // };
      // reader.readAsDataURL(file);
    } else {
      setSubProductForm({
        ...subProductForm,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', subProductForm.name);
    formData.append('description', subProductForm.description);
    formData.append('product', id);
    Object.keys(subProductForm.images).forEach(imageKey => {
      if (subProductForm.images[imageKey]) {
        formData.append(imageKey, subProductForm.images[imageKey]);
      }
    });
    try {
      if (selectedSubProduct) {
        await axios.put(`${baseUrl}/subProduct/update/${selectedSubProduct}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${baseUrl}/subProduct/create`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchSubProducts(); // Refresh sub-products after add/edit
      handleCloseSubProductModal();
    } catch (error) {
      console.error('Error saving sub-product:', error);
    }
  };

  const handleMarkAsToday = async (subProductId) => {
    try {
      await axios.put(`${baseUrl}/product/todayproduct/update/${id}/${subProductId}`);
      fetchProduct(); // Refresh product to get updated todayProduct
    } catch (error) {
      console.error('Error marking sub-product as today\'s product:', error);
    }
  };

  return (
    <div>
      <h2>Sub Products for {product?.name}</h2>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenSubProductModal(true)}
      >
        Add Sub Product
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Mark as Today</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subProducts.map((subProduct) => (
              <TableRow key={subProduct._id}>
                <TableCell>{subProduct.name}</TableCell>
                <TableCell>{subProduct.description}</TableCell>
                <TableCell>
                  {subProduct?.images && Object.values(subProduct?.images).map((image, index) =>
                    image ? <img key={index} src={image} alt={`sub-product-${index}`} style={{ width: '50px', height: '50px', marginRight: '5px' }} /> : null
                  )}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(subProduct._id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(subProduct._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
                <TableCell>
                  {product?.todayProduct === subProduct._id ? (
                    <span>Marked</span>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleMarkAsToday(subProduct._id)}
                    >
                      Mark as Today
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Delete Sub Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this sub product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openSubProductModal} onClose={handleCloseSubProductModal}>
        <DialogTitle>{selectedSubProduct ? 'Edit Sub Product' : 'Add Sub Product'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            name="name"
            value={subProductForm.name}
            onChange={handleFormChange}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            name="description"
            value={subProductForm.description}
            onChange={handleFormChange}
          />
          {['image1', 'image2', 'image3', 'image4', 'image5'].map((image, index) => (
            <div key={index}>
              <input
                type="file"
                name={image}
                onChange={handleFormChange}
                accept="image/*"
              />
              {imagePreviews[image] && (
                <img
                  src={imagePreviews[image]}
                  alt={`preview-${image}`}
                  style={{ width: '100px', height: '100px', display: 'block', marginTop: '10px' }}
                />
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            {selectedSubProduct ? 'Update' : 'Add'}
          </Button>
          <Button onClick={handleCloseSubProductModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SubProducts;
