import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';

const CompleteOrder = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${baseUrl}/subscription/today/place/order`);
      setOrders(res?.data?.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleUpdate = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handleConfirmUpdate = async () => {
    // Implement your update logic here
    try {
      await axios.put(`${baseUrl}/subscription/update/${selectedOrder?._id}`);
      fetchOrder();
      handleCloseModal();
    } catch (error) {}
  };

  return (
    <div>
      <h2>Complete Order</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>User Mobile</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order?.user?.name}</TableCell>
                <TableCell>{order?.user?.mobile}</TableCell>
                <TableCell>{order?.product?.name}</TableCell>
                <TableCell>{order?.deliveryAddress}</TableCell>
                <TableCell>{order?.quantity}</TableCell>
                <TableCell>{order?.lastDeliveryDate && new Date(order.lastDeliveryDate).toLocaleDateString()}</TableCell>
                <TableCell>{"Delivered"}</TableCell>
                {/* <TableCell>
                  <Button variant="contained" onClick={() => handleUpdate(order)}>
                    Update
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
          }}
        >
          <h3>Update Order</h3>
          {/* Add your update form or confirmation dialog here */}
          <Button onClick={handleConfirmUpdate}>Update</Button>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CompleteOrder;
