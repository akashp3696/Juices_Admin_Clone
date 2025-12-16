import React from 'react';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconAdjustmentsHorizontal } from '@tabler/icons';

const AllUser = () => {
  const tableData = [
    {
      Srno: '1',
      role: 'user',
      Nameofuser: 'A',
      Username: 'User1',
      Password: 'A12User',
      Mobileno: '7896452317',
      City: 'Gurgaon',
    },
    {
        Srno: '2',
        role: 'Business',
        Nameofuser: 'B',
        Username: 'User2',
        Password: 'B12User',
        Mobileno: '8796452317',
        City: 'Gurgaon',
      },
  ];

  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <DashboardCard title="All User">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField style={{ flex: 1 }} placeholder="Search" />
          <Button>
            <IconAdjustmentsHorizontal />
          </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no.</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map table data */}
            {tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.Srno}</TableCell>
                <TableCell>{data.role}</TableCell>
                <TableCell>{data.Nameofuser}</TableCell>
                <TableCell>{data.Username}</TableCell>
                <TableCell>{data.Password}</TableCell>
                <TableCell>{data.Mobileno}</TableCell>
                <TableCell>{data.City}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </PageContainer>
  );
};

export default AllUser;
