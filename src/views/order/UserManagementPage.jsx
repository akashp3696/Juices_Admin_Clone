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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddressDialog from './AddressDialog';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  // const [ananlysis, setAnanlysis] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUserData();
    // fetchAnanlysisData();
  }, []);

  // const fetchAnanlysisData = async () => {
  //   try {
  //     const res = await axios.get(`${baseUrl}/ananlysis/analysis`);
  //     if (res?.status == 200) {
  //       setAnanlysis(res?.data?.data);
  //     }
  //   } catch (error) {}
  // };

  // console.log(ananlysis);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/all`);
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleViewCalendar = (user) => {
    // Redirect to calendar page with userId as a query parameter
    navigate(`/user-subscription/${user?._id}`);
  };

  const handleSearch = (event) => {
    const value = event?.target?.value?.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(
      (user) =>
        user?.name?.toLowerCase()?.includes(value) || user?.mobile?.toString()?.includes(value),
    );
    setFilteredUsers(filtered);
  };

  const handleAddAddress = (user)=>{
    console.log(user);
    setSelectedUser(user)
    setOpenDialog(true)
  } 

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>User Management</h2>
        <Button variant="contained" onClick={() => navigate('/add-user')}>
          Add USER
        </Button>
      </Box>
      <br />
      <br />
      {/* <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div
          style={{
            backgroundColor: 'green',
            width: '100px',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          Green {ananlysis?.Green || 0}
        </div>
        <div
          style={{
            backgroundColor: 'red',
            width: '100px',
            color: 'white',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          Pause {ananlysis?.Pause || 0}
        </div>
        <div
          style={{
            backgroundColor: 'yellow',
            width: '100px',
            color: 'balck',
            padding: '10px',
            textAlign: 'center',
          }}
        >
          Stale {ananlysis?.Stale || 0}
        </div>
      </div> */}
      <TextField
        label="Search by name or number"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Add Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers?.length > 0 &&
              filteredUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewCalendar(user)}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleAddAddress(user)}>
                      Add Address
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddressDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        fetchAddresses={fetchUserData}
        addresses={selectedUser?.deliveryAddress||[]}
        userId={selectedUser?._id}
      />
    </div>
  );
};

export default UserManagementPage;
