import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Link } from 'react-router-dom';

const AllCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${baseUrl}/coupon`);
      setCoupons(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleDelete = (couponId) => {
    setSelectedCoupon(couponId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCoupon(null);
    setOpenModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${baseUrl}/coupon/${selectedCoupon}`);
      fetchCoupons(); // Refresh coupons after deletion
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div>
      <h2>All Coupons</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Max Usage</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discount}</TableCell>
                <TableCell>{new Date(coupon?.validFrom)?.toLocaleDateString()}</TableCell>
                <TableCell>{new Date(coupon?.validUntil)?.toLocaleDateString()}</TableCell>
                <TableCell>{coupon.maxUsage}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/edit-coupon/${coupon?._id}`} variant="contained">
                    Edit
                  </Button> &nbsp;
                  {'  '}
                  <Button variant="contained" onClick={() => handleDelete(coupon._id)}>
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
          <h3>Are you sure you want to delete this coupon?</h3>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleConfirmDelete}>Delete</Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AllCoupons;
