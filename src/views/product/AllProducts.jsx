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
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Delete, Edit } from '@mui/icons-material';

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product/all`);
      setProducts(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (productId) => {
    // Redirect to edit page
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = (productId) => {
    setSelectedProduct(productId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setOpenModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/product/delete/${selectedProduct}`);
      fetchProducts(); // Refresh products after deletion
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const truncateDescription = (text, length = 20) => {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
};


  return (
    <div>
      <h2>All Products</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Today Product</TableCell>
              <TableCell>Add Sub Product</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product?.imageUrl}
                    alt={product?.name}
                    style={{ width: '100px', height: 'auto' }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{truncateDescription(product?.description||"")}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product?.todayProduct?.name}</TableCell>
                <TableCell><Button variant='contained' onClick={()=>navigate(`/sub-product/${product?._id}`)} >Add Sub</Button></TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(product._id)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(product._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product?
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
    </div>
  );
};

export default AllProducts;
