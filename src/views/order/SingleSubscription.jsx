import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import CalendarDialog from './CalendarDialog';

const SingleSubscription = () => {
  const navigate = useNavigate();
  const { subscriptionId } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    slot: '',
    packageType: '',
    // Payment_status: '',
    // Paymentstatus: false
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/subscription/single/${subscriptionId}`);
      if (response?.status === 200) {
        setSubscription(response?.data?.data);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleUpdateSubscription = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/subscription/admin/update/${subscriptionId}`,
        formData,
      );
      if (response?.status === 200) {
        setSubscription(response?.data?.data);
        handleClose();
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  if (!subscription) {
    return <div>Loading...</div>;
  }

  const { user, product, _id, slot, packageType, subscriptionCode } = subscription;

  return (
    <div>
      <Paper style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="body1">Mobile: {user.mobile}</Typography>
        <Button onClick={handleClickOpen} variant="contained">
          Edit
        </Button>
        &nbsp; &nbsp;
        <Button onClick={() => handleOpenDialog()} variant="contained" >Open Calendar</Button>
      </Paper>
      <Paper style={{ padding: '20px' }}>
        <List>
          <ListItem>
            <ListItemText primary="1. Subscription ID" secondary={subscriptionCode} />
          </ListItem>
          <ListItem>
            <ListItemText primary="2. Product Name" secondary={product.name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="3. Slot" secondary={slot} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="4. Delivery Person"
              secondary={subscription.deliveryPerson || 'N/A'}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="5. Subscription Type" secondary={packageType} />
          </ListItem>
          <ListItem>
            <ListItemText primary="6. Delivery Address" secondary={subscription?.deliveryAddress} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="7. Start Date"
              secondary={new Date(subscription?.startDate).toLocaleDateString()}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="8. Pause Date"
              secondary={
                subscription?.pauseDates?.length > 0
                  ? subscription.pauseDates
                      .map((date) => new Date(date).toLocaleDateString())
                      .join(', ')
                  : 'No pause dates'
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="9. Number of Pause"
              secondary={subscription?.pauseDates?.length || 0}
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="10. Days Completed" secondary={subscription?.juiceCount || 0} />
          </ListItem>
          <ListItem>
            <ListItemText primary="11. Days Remaining" secondary={subscription?.remain || 0} />
          </ListItem>
          <ListItem>
            <ListItemText primary="12. Coupon Code" secondary={subscription?.couponCode || 'NA'} />
          </ListItem>
        </List>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Subscription</DialogTitle>
        <DialogContent>
          <form>
            <TextField
              margin="dense"
              name="startDate"
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Slot</InputLabel>
              <Select name="slot" value={formData.slot} onChange={handleInputChange}>
                <MenuItem value="Morning">Morning</MenuItem>
                <MenuItem value="Evening">Evening</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Package Type</InputLabel>
              <Select name="packageType" value={formData.packageType} onChange={handleInputChange}>
                <MenuItem value="resualbe">Reusable</MenuItem>
                <MenuItem value="onetimeuse">One Time Use</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl fullWidth margin="dense">
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="Payment_status"
                value={formData.Payment_status}
                onChange={handleInputChange}
              >
                <MenuItem value="COMPLETE">Complete</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Paymentstatus</InputLabel>
              <Select
                name="Paymentstatus"
                value={formData.Paymentstatus}
                onChange={handleInputChange}
              >
                <MenuItem value="true">Complete</MenuItem>
                <MenuItem value="false">Pending</MenuItem>
              </Select>
            </FormControl> */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubscription} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <CalendarDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        subscriptionId={subscriptionId}
        fetchSubscriptionData={fetchSubscriptionData}
      />
    </div>
  );
};

export default SingleSubscription;
