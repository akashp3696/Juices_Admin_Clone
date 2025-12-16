import React from 'react';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconAdjustmentsHorizontal } from '@tabler/icons';
import { Link } from 'react-router-dom';

const AllDonation = () => {
  const tableData = [
    {
      donationItem: '1',
      value: 'Apple',
      organization: 'Organization A',
      contactName: 'John Doe',
      contactEmail: 'john@example.com',
      dateReceived: '2023-07-01',
      mob:'9874653212'
      
    },
    {
      donationItem: '2',
      value: 'Apple',
      organization: 'Organization B',
      contactName: 'Jane Smith',
      contactEmail: 'jane@example.com',
      dateReceived: '2023-07-02',
      mob:'9874653212'

   
    }
    // Add more data objects as needed
  ];

  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <DashboardCard title="All Inquiry">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField style={{ flex: 1 }} placeholder="Search" />
          <Button>
            <IconAdjustmentsHorizontal />
          </Button>
          <Link to='/'>

          <button style={{height:"50px" , backgroundColor:'#62B34F', color:'white',border:'none',paddingLeft:'20px',paddingRight:'20px',borderRadius:'15px'}}>Add New</button>
          </Link>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no.</TableCell>
              <TableCell>Inquiry For</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Contact Email</TableCell>
              <TableCell>Date Received</TableCell>
              <TableCell>Mobile No.</TableCell>


            </TableRow>
          </TableHead>
          <TableBody>
            {/* Map table data */}
            {tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell>{data.donationItem}</TableCell>
                <TableCell>{data.value}</TableCell>
                <TableCell>{data.organization}</TableCell>
                <TableCell>{data.contactName}</TableCell>
                <TableCell>{data.contactEmail}</TableCell>
                <TableCell>{data.dateReceived}</TableCell>
                <TableCell>{data.mob}</TableCell>

            
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </PageContainer>
  );
};

export default AllDonation;
