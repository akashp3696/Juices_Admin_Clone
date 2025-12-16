import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import CustomCalendar from './CustomCalendar';
import 'react-calendar/dist/Calendar.css';
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams } from 'react-router';

const CalendarDialog = ({ isOpen, onClose, subscriptionId, fetchSubscriptionData }) => {
  const {subscriptionId:id} = useParams()
  const [calendarDates, setCalendarDates] = useState({
    deliveryDates: [],
    pauseDates: [],
    upcomingDeliveryDates: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectMultiple, setSelectMultiple] = useState(false);
  const [selectableDates, setSelectableDates] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [action, setAction] = useState('');
  console.log(selectedImage);
  useEffect(() => {
    if (isOpen && subscriptionId) {
      getData(subscriptionId);
      getAllSubProductData();
    }
  }, [isOpen, subscriptionId]);

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/subscription/single/${id}`);
      if (response?.status === 200) {
        const processedData = processSubscriptionData(response?.data?.data);
        setCalendarDates(processedData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAllSubProductData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/subproduct/allsub`);
      if (res.status === 200) {
        setAllProduct(res?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const processSubscriptionData = (item) => {
    const pauseDates = item.pauseDates.map((date) => new Date(date).toDateString());
    const deliveryDates = item.deliveryDates.map((date) => new Date(date).toDateString());
    const remain = item.remain;

    const upcomingDeliveryDates = generateUpcomingDeliveryDates(
      pauseDates,
      remain,
      item?.startDate,
    ).map((date) => date.toDateString());

    return {
      ...item,
      id: item._id,
      pauseDates: pauseDates,
      deliveryDates: deliveryDates,
      upcomingDeliveryDates: upcomingDeliveryDates,
    };
  };

  const generateUpcomingDeliveryDates = (pauseDates, remain, startDate) => {
    let upcomingDeliveryDates = [];
    let today = new Date();
    while (upcomingDeliveryDates.length < remain) {
      today.setDate(today.getDate() + 1);
      if (today.getDay() === 0) continue;
      if (today < new Date(startDate)) continue;

      let isPauseDate = pauseDates.some((pauseDate) => {
        let date = new Date(pauseDate);
        return date.toDateString() === today.toDateString();
      });

      if (isPauseDate) continue;

      upcomingDeliveryDates.push(new Date(today));
    }
    return upcomingDeliveryDates;
  };

  const handleConfirm = () => {
    if (selectedDates.length > 0) {
      updateSubscription(subscriptionId, selectedDates, action);
      onClose();
    }
  };

  const updateSubscription = async (id, dates, action) => {
    let payload = {};

    if (action === 'pause') {
      payload = { isActive: true, pauseDates: dates };
    } else if (action === 'resume') {
      payload = { isActive: false, pauseDates: dates };
    } else if (action === 'add') {
      const { targetDate } = dates[0]; // Assumes single date select for adding delivery
      payload = { targetDate, productName: selectedProduct, productImg: selectedImage, action: 'add' };
    } else if (action === 'revert') {
      payload = { targetDate: dates[0], action: 'revert' }; // Revert delivery
    }

    try {
      let res;
      if(action=="add" || action=="revert"){
        res = await axios.put(`${baseUrl}/subscription/admin/modifydelivery/${id}/${action}`, payload);
      }else{
        res = await axios.put(`${baseUrl}/subscription/admin/updateorder/${id}`, payload);
      }
      if (res?.status === 200) {
        fetchSubscriptionData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateSelect = (dates) => {
    const dateString = new Date(dates[0]).toDateString();
    if (calendarDates.pauseDates.includes(dateString)) {
      setAction('resume');
      setSelectedDates(dates);
      setSelectMultiple(true);
      setSelectableDates(calendarDates.pauseDates);
    } else if (calendarDates.upcomingDeliveryDates.includes(dateString)) {
      setAction('pause');
      setSelectedDates(dates);
      setSelectMultiple(true);
      setSelectableDates(calendarDates.upcomingDeliveryDates);
    } else if (!calendarDates.deliveryDates.includes(dateString)) {
      setAction('add');
      setSelectedDates([{ targetDate: dates[0], productName: '', productImg: '' }]); // Initialize new delivery
    } else {
      setAction('revert');
      setSelectedDates(dates);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Manage Subscription Calendar</DialogTitle>
      <DialogContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <CustomCalendar
              dates={calendarDates}
              onClose={onClose}
              onSelectDates={handleDateSelect}
              selectMultiple={selectMultiple}
              selectableDates={selectableDates}
              action={action}
              setAction={setAction}
            />
            {action === 'add' && (
              <FormControl fullWidth style={{ marginTop: '20px' }}>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProduct}
                  onChange={(e) => {
                    const selected = allProduct.find(product => product.name === e.target.value);
                    setSelectedProduct(selected.name);
                    setSelectedImage(selected.images);
                  }}
                >
                  {allProduct.map((product) => (
                    <MenuItem key={product.id} value={product.name}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {action === 'pause' && (
          <Button
            onClick={handleConfirm}
            disabled={selectedDates.length === 0}
            color="primary"
            variant="contained"
          >
            Pause
          </Button>
        )}
        {action === 'resume' && (
          <Button
            onClick={handleConfirm}
            disabled={selectedDates.length === 0}
            color="secondary"
            variant="contained"
          >
            Resume
          </Button>
        )}
        {action === 'add' && (
          <Button
            onClick={handleConfirm}
            disabled={selectedDates.length === 0 || !selectedProduct}
            color="primary"
            variant="contained"
          >
            Add Delivery
          </Button>
        )}
        {action === 'revert' && (
          <Button
            onClick={handleConfirm}
            disabled={selectedDates.length === 0}
            color="secondary"
            variant="contained"
          >
            Remove Delivery
          </Button>
        )}
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarDialog;
