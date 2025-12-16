import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';

const DashboardCard = styled(Card)`
  padding: 20px;
  margin: 20px;
`;

const TopList = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer>
      <DashboardCard>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Top Users" />
          <Tab label="Top NGOs" />
          <Tab label="Top Businessmen" />
        </Tabs>
        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>No. of Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Populate the table rows with data for Top Users */}
                {/* Example: */}
                <TableRow>
                  <TableCell>User 1</TableCell>
                  <TableCell>100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>User 2</TableCell>
                  <TableCell>85</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>No. of Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Populate the table rows with data for Top NGOs */}
                {/* Example: */}
                <TableRow>
                  <TableCell>NGO 1</TableCell>
                  <TableCell>1500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NGO 2</TableCell>
                  <TableCell>1200</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {activeTab === 2 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>No. of Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Populate the table rows with data for Top Businessmen */}
                {/* Example: */}
                <TableRow>
                  <TableCell>Businessman 1</TableCell>
                  <TableCell>5000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Businessman 2</TableCell>
                  <TableCell>4200</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default TopList;
