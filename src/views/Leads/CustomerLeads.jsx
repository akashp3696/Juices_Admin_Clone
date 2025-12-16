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
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../utils/data';

const CustomerLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchFilterLeads, setSearchFilterLeads] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    notes: '',
    followUpDate: '',
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${baseUrl}/customerLead/all`);
      const data = res?.data?.data || [];
      setLeads(data);
      let status = selectedStatus;
      let filtered = [];
      if (status === 'All') {
        filtered = data;
      } else if (status === 'NewLead') {
        filtered = data.filter((lead) => lead.status === 'Pending');
      } else {
        filtered = data.filter((lead) => lead.status === status);
      }

      // Follow-up section ke liye sorting (Latest date pehle)
      if (status === 'NeedFollowUp') {
        filtered.sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));
      }

      setFilteredLeads(filtered);
      setSearchFilterLeads(filtered);

      // setFilteredLeads(data);
      // setSearchFilterLeads(data);
      updateStatusCounts(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  //  Status Count Calculation
  const updateStatusCounts = (data) => {
    const counts = {
      //   NewLeads: data?.length,
      NewLead: data.filter((lead) => lead.status === 'Pending')?.length,
      ReadyToSub: data.filter((lead) => lead.status === 'ReadyToSub')?.length,
      NeedFollowUp: data.filter((lead) => lead.status === 'NeedFollowUp')?.length,
      Subscribed: data.filter((lead) => lead.status === 'Subscribed')?.length,
      NotInterested: data.filter((lead) => lead.status === 'NotInterested')?.length,
    };
    setStatusCounts(counts);
  };

  //  Live Search & Filter
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = filteredLeads.filter(
      (lead) => lead.name.toLowerCase().includes(value) || lead.phoneNumber.includes(value),
    );
    setSearchFilterLeads(filtered);
  };

  //  Open Add/Edit Modal
  const handleOpenModal = (lead = null) => {
    setCurrentLead(lead);
    setOpenModal(true);
  };

  //  Close Modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLead(null);
  };

  //  Handle Add/Edit Lead
  const handleSubmit = async () => {
    try {
      currentLead.status = currentLead.status || 'Pending';
      if (currentLead?._id) {
        await axios.put(`${baseUrl}/customerLead/update/${currentLead._id}`, currentLead);
      } else {
        await axios.post(`${baseUrl}/customerLead/create`, currentLead);
      }
      fetchLeads();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  //  Handle Status Update
  const handleStatusChange = async (lead, newStatus) => {
    try {
      const res = await axios.put(`${baseUrl}/customerLead/update/${currentLead._id}`, {
        ...currentLead,
        status: statusUpdate.status,
        notes: statusUpdate.notes,
        followUpDate: statusUpdate.status === 'NeedFollowUp' ? statusUpdate.followUpDate : '',
      });
      fetchLeads();
      handleCloseStatusModal();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  //  Handle Delete Lead
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this lead?');
    if (!confirm) return;
    try {
      await axios.delete(`${baseUrl}/customerLead/delete/${id}`);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleFilterByStatus = (status) => {
    console.log(status);
    setSelectedStatus(status);
    let filtered = [];
    if (status === 'All') {
      filtered = leads;
    } else if (status === 'NewLead') {
      filtered = leads.filter((lead) => lead.status === 'Pending');
    } else {
      filtered = leads.filter((lead) => lead.status === status);
    }

    // Follow-up section ke liye sorting (Latest date pehle)
    if (status === 'NeedFollowUp') {
      filtered.sort((a, b) => new Date(b.followUpDate) - new Date(a.followUpDate));
    }

    setFilteredLeads(filtered);
    setSearchFilterLeads(filtered);
    // if (status === 'All') {
    //   setFilteredLeads(leads);
    //   setSearchFilterLeads(leads);
    // } else if (status === 'NewLead') {
    //     const filterd = leads.filter((lead) => lead.status === "Pending");
    //     setFilteredLeads(filterd);
    //     setSearchFilterLeads(filterd);
    // } else {
    //     const filterd = leads.filter((lead) => lead.status === status);
    //     setFilteredLeads(filterd);
    //     setSearchFilterLeads(filterd);
    // }
  };

  const handleOpenStatusModal = (lead) => {
    setCurrentLead(lead);
    setStatusUpdate({
      status: lead.status,
      notes: lead.notes || '',
      followUpDate: lead.followUpDate || '',
    });
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setCurrentLead(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Customer Leads Management</h2>
        </div>
        <Grid item>
          <Button
            variant={selectedStatus === 'All' ? 'contained' : 'outlined'}
            onClick={() => handleFilterByStatus('All')}
          >
            All
          </Button>
          &nbsp; &nbsp;
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
            Add Lead
          </Button>
        </Grid>
      </div>

      {/*  Status Counts */}
      <Grid container spacing={2} style={{ marginBottom: '15px' }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Grid item key={status}>
            <Button
              variant={selectedStatus === status ? 'contained' : 'outlined'}
              onClick={() => handleFilterByStatus(status)}
            >
              {status.replace(/([A-Z])/g, ' $1')} ({count})
            </Button>
          </Grid>
        ))}
      </Grid>

      {/*  Search Input */}
      <TextField
        label="Search by Name or Phone"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '15px' }}
      />

      {/*  Add Lead Button */}

      {/*  Leads Table */}
      <TableContainer component={Paper} style={{ marginTop: '15px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
              {selectedStatus === 'NeedFollowUp' && <TableCell>Follow-Up Date</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchFilterLeads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.source}</TableCell>
                {/* <TableCell>
                  <Select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead, e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="ReadyToSub">Ready To Sub</MenuItem>
                    <MenuItem value="NeedFollowUp">Need Follow-Up</MenuItem>
                    <MenuItem value="Subscribed">Subscribed</MenuItem>
                    <MenuItem value="NotInterested">Not Interested</MenuItem>
                  </Select>
                </TableCell> */}
                <TableCell>
                  <Button variant="outlined" onClick={() => handleOpenStatusModal(lead)}>
                    {lead.status}
                  </Button>
                </TableCell>
                {selectedStatus === 'NeedFollowUp' && (
                  <TableCell>
                    {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'N/A'}
                  </TableCell>
                )}
                <TableCell>
                  <Button variant="contained" onClick={() => handleOpenModal(lead)}>
                    Edit
                  </Button>{' '}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(lead._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openStatusModal} onClose={handleCloseStatusModal}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          {/* Status Dropdown */}
          <Select
            fullWidth
            value={statusUpdate.status}
            onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
            displayEmpty
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="ReadyToSub">Ready To Sub</MenuItem>
            <MenuItem value="NeedFollowUp">Need Follow-Up</MenuItem>
            <MenuItem value="Subscribed">Subscribed</MenuItem>
            <MenuItem value="NotInterested">Not Interested</MenuItem>
          </Select>

          {/* Notes Field */}
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={statusUpdate.notes}
            onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          {/* Follow-Up Date Field (Only if status is Need Follow-Up) */}
          {statusUpdate.status === 'NeedFollowUp' && (
            <TextField
              label="Follow-Up Date"
              type="date"
              fullWidth
              value={statusUpdate.followUpDate}
              onChange={(e) => setStatusUpdate({ ...statusUpdate, followUpDate: e.target.value })}
              style={{ marginBottom: '10px' }}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusChange} variant="contained">
            Update
          </Button>
          <Button onClick={handleCloseStatusModal} variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/*  Add/Edit Lead Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{currentLead?._id ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
        <DialogContent>
          {/*  Name Field */}
          <TextField
            label="Name"
            fullWidth
            value={currentLead?.name || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          {/*  Phone Field */}
          <TextField
            label="Phone Number"
            fullWidth
            value={currentLead?.phoneNumber || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, phoneNumber: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          {/*  Source Dropdown */}
          <Select
            fullWidth
            value={currentLead?.source || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, source: e.target.value })}
            displayEmpty
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="" disabled>
              Select Source
            </MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
            <MenuItem value="Website">Website</MenuItem>
            <MenuItem value="Forms">Forms</MenuItem>
            <MenuItem value="Social">Social</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>

          {/*  Status Dropdown */}
          {/* <Select
            fullWidth
            value={currentLead?.status || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
            displayEmpty
            style={{ marginBottom: '10px' }}
          >
            <MenuItem value="" disabled>
              Select Status
            </MenuItem>
            <MenuItem value="Pending">Ready To Sub</MenuItem>
            <MenuItem value="ReadyToSub">Ready To Sub</MenuItem>
            <MenuItem value="NeedFollowUp">Need Follow-Up</MenuItem>
            <MenuItem value="Subscribed">Subscribed</MenuItem>
            <MenuItem value="NotInterested">Not Interested</MenuItem>
          </Select> */}

          {/*  Notes Field */}
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={3}
            value={currentLead?.notes || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, notes: e.target.value })}
            style={{ marginBottom: '10px' }}
          />

          {currentLead?.status === 'NeedFollowUp' && (
            <TextField
              label="Follow-Up Date"
              type="date"
              fullWidth
              value={currentLead?.followUpDate ? currentLead.followUpDate.split('T')[0] : ''}
              onChange={(e) => setCurrentLead({ ...currentLead, followUpDate: e.target.value })}
              style={{ marginBottom: '10px' }}
              InputLabelProps={{ shrink: true }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
          <Button onClick={handleCloseModal} variant="contained" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomerLeads;
