import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../utils/data";

const BusinessLeads = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [customLeadType, setCustomLeadType] = useState(""); // Custom lead type ke liye state

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${baseUrl}/businessLead/all`);
      const data = res?.data?.data || [];
      setLeads(data);
      setFilteredLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = leads.filter(
      (lead) => lead.name.toLowerCase().includes(value) || lead.phoneNumber.includes(value)
    );
    setFilteredLeads(filtered);
  };

  const handleOpenModal = (lead = null) => {
    setCurrentLead(lead || { name: "", phoneNumber: "", leadType: "", status: "", notes: "" });
    setCustomLeadType("");
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentLead(null);
    setCustomLeadType(""); // Reset custom lead type input
  };

  const handleSubmit = async () => {
    try {
      let leadData = { ...currentLead };

      // Agar "Others" select kiya hai to custom input ka value use karein
      if (leadData.leadType === "Others") {
        leadData.leadType = customLeadType;
      }

      if (currentLead?._id) {
        await axios.put(`${baseUrl}/businessLead/update/${currentLead._id}`, leadData);
      } else {
        await axios.post(`${baseUrl}/businessLead/create`, leadData);
      }

      fetchLeads();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`${baseUrl}/businessLead/delete/${id}`);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  return (
    <div>
      <h2>Business Leads Management</h2>

      <TextField
        label="Search by Name or Phone"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
            style={{ marginBottom: '15px' }}
      />

      <Button variant="contained" color="primary" onClick={() => handleOpenModal()}>
        Add Lead
      </Button>

        <TableContainer component={Paper} style={{ marginTop: '15px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Lead Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name?.length > 20 ? `${lead.name.substring(0, 20)}...` : lead.name}</TableCell>
                <TableCell>{lead.phoneNumber}</TableCell>
                <TableCell>{lead.leadType}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead?.notes?.length > 20 ? `${lead.notes.substring(0, 20)}...` : lead.notes}</TableCell>
                <TableCell>
                                <Button variant="contained" onClick={() => handleOpenModal(lead)}>
                                    Edit
                                </Button>{' '}
                                <Button variant="contained" color="secondary" onClick={() => handleDelete(lead._id)}>
                                    Delete
                                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>{currentLead?._id ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
                    value={currentLead?.name || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })}
                    style={{ marginBottom: '10px' }}
          />
          <TextField
            label="Phone Number"
            fullWidth
                    value={currentLead?.phoneNumber || ''}
            onChange={(e) => setCurrentLead({ ...currentLead, phoneNumber: e.target.value })}
                    style={{ marginBottom: '10px' }}
          />

          {/* Lead Type Selection */}
          <Select
            fullWidth
            value={currentLead?.leadType || ""}
            onChange={(e) => {
              setCurrentLead({ ...currentLead, leadType: e.target.value });
              if (e.target.value !== "Others") setCustomLeadType(""); // Reset custom input if "Others" not selected
            }}
            displayEmpty
            style={{ marginBottom: "10px" }}
          >
            <MenuItem value="" disabled>Select Lead Type</MenuItem>
            <MenuItem value="BulkOrders">Bulk Orders</MenuItem>
            <MenuItem value="Vendors">Vendors</MenuItem>
            <MenuItem value="Packaging">Packaging</MenuItem>
            <MenuItem value="Investors">Investors</MenuItem>
            <MenuItem value="Influencer">Influencer</MenuItem>
            <MenuItem value="Collaborator">Collaborator</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>

          {/* If "Others" selected, show custom input */}
          {currentLead?.leadType === "Others" && (
            <TextField
              label="Enter Lead Type"
              fullWidth
              value={customLeadType}
              onChange={(e) => setCustomLeadType(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          )}

          <Select
            fullWidth
            value={currentLead?.status || ""}
            onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
            displayEmpty
            style={{ marginBottom: "10px" }}
          >
            <MenuItem value="" disabled>Select Status</MenuItem>
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Neutral">Neutral</MenuItem>
            <MenuItem value="NotInterested">Not Interested</MenuItem>
          </Select>
                <TextField
                    label="Note"
                    fullWidth
                    value={currentLead?.notes || ''}
                    onChange={(e) => setCurrentLead({ ...currentLead, notes: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
          <Button onClick={handleCloseModal} variant="contained" color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BusinessLeads;
