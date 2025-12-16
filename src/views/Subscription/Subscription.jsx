import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/data';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Subscription = () => {
  const [ananlysis, setAnanlysis] = useState(null);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Green');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [slotFilter, setSlotFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnanlysisData();
  }, []);

  const fetchAnanlysisData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/ananlysis/analysis`);
      if (res?.status === 200) {
        setAnanlysis(res?.data?.data);
        setFilteredSubscriptions(res?.data?.data?.GreenSubscriptions || []);
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    }
  };

  const handleViewCalendar = (user) => {
    navigate(`/single-subscription/${user?._id}`);
  };

  const handleSearch = (event) => {
    const value = event?.target?.value?.toLowerCase();
    setSearchTerm(value);
    const allSubscriptions = ananlysis?.[`${activeFilter}Subscriptions`] || [];
    const filtered = allSubscriptions.filter(
      (subscription) =>
        subscription.user?.name?.toLowerCase()?.includes(value) ||
        subscription.user?.mobile?.toString()?.includes(value),
    );
    setFilteredSubscriptions(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setFilteredSubscriptions(ananlysis?.[`${filter}Subscriptions`] || []);
    setSearchTerm('');
  };

  const handleSlotFilterChange = (slot) => {
    setSlotFilter(slot);
    applyFilters(ananlysis?.[`${activeFilter}Subscriptions`] || [], searchTerm, slot);
  };

  const applyFilters = (subscriptions, search = searchTerm, slot = slotFilter) => {
    let filtered = subscriptions.filter(
      (subscription) =>
        subscription.user?.name?.toLowerCase()?.includes(search) ||
        subscription.user?.mobile?.toString()?.includes(search)
    );

    if (slot !== 'All') {
      filtered = filtered.filter((subscription) => subscription.slot === slot);
    }

    setFilteredSubscriptions(filtered);
  };


  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      const selectableSubscriptions = filteredSubscriptions
        .filter(sub => isSelectable(sub))
        .map(sub => sub._id);
      setSelectedSubscriptions(selectableSubscriptions);
    } else {
      setSelectedSubscriptions([]);
    }
  };
  

  const handleSelectSubscription = (id) => {
    setSelectedSubscriptions((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((subId) => subId !== id) : [...prevSelected, id]
    );
  };

  const handleUpdateSelected = async () => {
    try {
      const response = await axios.post(`${baseUrl}/subscription/admin/markdeliverd`, {
        subscriptionIds: selectedSubscriptions
      });
      if (response.status === 200) {
        fetchAnanlysisData();
      }
    } catch (error) {
      console.error('Error updating subscriptions:', error);
    }
  };

  const handleRevertSubscription = async (id) => {
    try {
      const response = await axios.put(`${baseUrl}/subscription/admin/revertdeleverd/${id}`);
      if (response.status === 200) {
        fetchAnanlysisData();
      }
    } catch (error) {
      console.error('Error reverting subscription:', error);
    }
  };

  const isRevertable = (subscription) => {
    const today = new Date().toDateString();
    const lastDeliveryDate = new Date(subscription.lastDeliveryDate).toDateString();
    // console.log(today, lastDeliveryDate, subscription.juiceCount);
    return lastDeliveryDate === today && subscription.juiceCount != 0
  };

  const isSelectable = (subscription) => {
    const today = new Date().toDateString();
    const lastDeliveryDate = new Date(subscription.lastDeliveryDate).toDateString();
    return !(lastDeliveryDate === today && subscription.juiceCount !== 0);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Subscription Management</h2>
        <Button
          variant='contained'
          onClick={() => navigate('/add-subscription')}
        >
          Add Subscription
        </Button>
      </Box>
      <br /><br />
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <Button
          style={{
            backgroundColor: 'green',
            width: '100px',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
          }}
          onClick={() => handleFilterChange('Green')}
        >
          Green {ananlysis?.Green || 0}
        </Button>
        <Button
          style={{
            backgroundColor: 'red',
            width: '100px',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
          }}
          onClick={() => handleFilterChange('Pause')}
        >
          Pause {ananlysis?.Pause || 0}
        </Button>
        <Button
          style={{
            backgroundColor: 'yellow',
            width: '100px',
            color: 'black',
            padding: '10px',
            textAlign: 'center',
          }}
          onClick={() => handleFilterChange('Stale')}
        >
          Stale {ananlysis?.Stale || 0}
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <Button
          variant={slotFilter === 'All' ? 'contained' : 'outlined'}
          onClick={() => handleSlotFilterChange('All')}
        >
          All
        </Button>
        <Button
          variant={slotFilter === 'Morning' ? 'contained' : 'outlined'}
          onClick={() => handleSlotFilterChange('Morning')}
        >
          Morning
        </Button>
        <Button
          variant={slotFilter === 'Evening' ? 'contained' : 'outlined'}
          onClick={() => handleSlotFilterChange('Evening')}
        >
          Evening
        </Button>
      </div>

      <TextField
        label="Search by name or number"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <Button
        variant='contained'
        onClick={handleUpdateSelected}
        disabled={selectedSubscriptions.length === 0 || activeFilter !="Green"}
      >
        Update Selected
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{display:activeFilter =="Green"?"block":"none"}}>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Subscription Id</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Subscription Type</TableCell>
              <TableCell>Action</TableCell>
              <TableCell sx={{display:activeFilter =="Green"?"block":"none"}}>Revert</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions?.length > 0 &&
              filteredSubscriptions?.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell sx={{display:activeFilter =="Green"?"block":"none"}}>
                    <Checkbox
                      checked={selectedSubscriptions.includes(subscription._id)}
                      onChange={() => handleSelectSubscription(subscription._id)}
                      disabled={!isSelectable(subscription)}
                    />
                  </TableCell>
                  <TableCell>{subscription.subscriptionCode}</TableCell>
                  <TableCell>{subscription?.user?.name}</TableCell>
                  <TableCell>{subscription.product.name}</TableCell>
                  <TableCell>{subscription.slot}</TableCell>
                  <TableCell>{subscription?.isTrial ? 'Trial' : 'Monthly'}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewCalendar(subscription)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell sx={{display:activeFilter =="Green"?"block":"none"}}>
                    {isRevertable(subscription) && (
                      <Button variant="contained" onClick={() => handleRevertSubscription(subscription._id)}>
                        Revert
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Subscription;
