import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const UserSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/subscription/byuser/${userId}`);
      if (response?.status === 200) {
        setSubscriptions(response?.data?.data);
        setUser(response?.data?.data[0]?.user);  // Assuming all subscriptions have the same user data
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const handleViewMore = (subscriptionId) => {
    navigate(`/single-subscription/${subscriptionId}`)
  };

  return (
    <div>
      {user && (
        <Paper style={{ padding: '20px', marginBottom: '20px' }}>
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="body1">Mobile: {user.mobile}</Typography>
        </Paper>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Delivery Person</TableCell>
              <TableCell>Subscription Type</TableCell>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell>{subscription.subscriptionCode}</TableCell>
                  <TableCell>{new Date(subscription?.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{subscription.product.name}</TableCell>
                  <TableCell>{subscription.slot}</TableCell>
                  <TableCell>{subscription.deliveryPerson || 'N/A'}</TableCell>
                  <TableCell>{subscription.packageType}</TableCell>
                  <TableCell>{subscription.couponcode}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewMore(subscription._id)}>
                      View More
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No subscriptions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserSubscriptions;
