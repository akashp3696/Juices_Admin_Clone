import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { baseUrl } from 'src/utils/data';
import { useNavigate } from 'react-router';

const UserAnalysis = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Green');
  console.log(analysisData);
  console.log(filteredUsers);
  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const fetchAnalysisData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/ananlysis/user`); // Replace with your actual API endpoint
      if (response.status === 200) {
        setAnalysisData(response?.data?.data);
        setFilteredUsers(response?.data?.data?.GreenUsers || []);
      }
    } catch (error) {
      console.error('Error fetching user analysis data:', error);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setFilteredUsers(analysisData[filter] || []);
    setSearchTerm('');
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const allUsers = analysisData?.[activeFilter] || [];
    const filtered = allUsers.filter(
      (user) =>
        user?.name?.toLowerCase().includes(value) || user?.email?.toLowerCase().includes(value),
    );
    setFilteredUsers(filtered);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>User Analysis</h2>
      </Box>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <Button
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '10px',
          }}
          onClick={() => handleFilterChange('GreenUsers')}
        >
          Green ({analysisData?.Green || 0})
        </Button>
        <Button
          style={{
            backgroundColor: 'orange',
            color: 'white',
            padding: '10px',
          }}
          onClick={() => handleFilterChange('PauseUsers')}
        >
          Pause ({analysisData?.Pause || 0})
        </Button>
        <Button
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px',
          }}
          onClick={() => handleFilterChange('StealUsers')}
        >
          Steal ({analysisData?.Steal || 0})
        </Button>
      </div>

      {/* Search Bar */}
      <TextField
        label="Search by name or email"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{activeFilter}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => navigate(`/user-subscription/${user._id}`)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserAnalysis;
