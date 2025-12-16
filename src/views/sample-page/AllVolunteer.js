import React from 'react';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconAdjustmentsHorizontal } from '@tabler/icons';

const AllVolunteer = () => {
  const tableData = [
    {
      Srno: '1',
      NameofVolunteer: 'A',
      Mobileno: '7896452317',
      contactEmail: 'john@example.com',
      dateJoined: '2023-07-01',
      City: 'Gurgaon',
    },
    {
        Srno: '2',
        NameofVolunteer: 'B',
        Mobileno: '8796452317',
        contactEmail: 'john@example.com',
        dateJoined: '2023-07-01',
        City: 'Gurgaon',
      },
  ];

  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <DashboardCard title="All Volunteer">
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
              <TableCell>Volunteer Name</TableCell>
               <TableCell>Mobile No</TableCell>
               <TableCell>Contact Email</TableCell>
               <TableCell>Date Joined</TableCell>
              <TableCell>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map table data */}
            {tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.Srno}</TableCell>
                <TableCell>{data.NameofVolunteer}</TableCell>
                 <TableCell>{data.Mobileno}</TableCell>
                 <TableCell>{data.contactEmail}</TableCell>
                 <TableCell>{data.dateJoined}</TableCell>
                <TableCell>{data.City}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </PageContainer>
  );
};

export default AllVolunteer;
