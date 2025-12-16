import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  TextField,
  Popover,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard'; // Import DashboardCard component

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SearchInput = styled(TextField)`
  flex-grow: 1;
  max-width: 150px;
  .MuiInputBase-root {
    border: none;
  }
`;

const ActionButton = styled(Button)`
  text-transform: capitalize;
`;

const VerifyNgo = () => {
    const [ngoList, setNgoList] = useState([
      { id: 1, name: 'NGO 1', mobile: '123-456-7890', city: 'City 1', address: 'Address 1', status: 'Pending', verify: false },
      { id: 2, name: 'NGO 2', mobile: '987-654-3210', city: 'City 2', address: 'Address 2', status: 'Pending', verify: false },
      // Add more NGO data here
    ]);

  const [selectedAction, setSelectedAction] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleVerifyToggle = (id) => {
    setNgoList((prevNgoList) =>
      prevNgoList.map((ngo) => (ngo.id === id ? { ...ngo, verify: !ngo.verify } : ngo))
    );
  };

  const handleActionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
    handleActionClose();
  };

  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <DashboardCard title="Verify Ngo">
        <SearchBarContainer>
          <SearchInput
            label="Search"
            variant="outlined"
            size="small"
            sx={{ maxWidth: '1000px' }}
          />
          <ActionButton onClick={handleActionClick} variant="outlined">
            {selectedAction || 'Action'}
          </ActionButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleActionClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <ActionButton onClick={() => handleActionSelect('edit')}>Edit</ActionButton>
            <ActionButton onClick={() => handleActionSelect('update')}>Update</ActionButton>
            <ActionButton onClick={() => handleActionSelect('delete')}>Delete</ActionButton>
          </Popover>
        </SearchBarContainer>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Mobile no</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Ngo Status</TableCell>
                <TableCell>Verify Ngo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ngoList.map((ngo) => (
                <TableRow key={ngo.id}>
                  <TableCell>{ngo.name}</TableCell>
                  <TableCell>{ngo.mobile}</TableCell>
                  <TableCell>{ngo.city}</TableCell>
                  <TableCell>{ngo.address}</TableCell>
                  <TableCell>{ngo.status}</TableCell>
                  <TableCell>
                    <Checkbox checked={ngo.verify} onChange={() => handleVerifyToggle(ngo.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default VerifyNgo;
