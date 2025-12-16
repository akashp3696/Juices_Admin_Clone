import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { IconCoins } from '@tabler/icons';
import styled from 'styled-components';
import img1 from '../../views/sample-page/assets/images/busi.png';

const userList = [
  {
    id: 1,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 100,
  },
  {
    id: 2,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 200,
  },
  {
    id: 3,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 300,
  },
  {
    id: 4,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 400,
  },
  {
    id: 5,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 500,
  },
  {
    id: 6,
    name: 'Barnagar Iron Works',
    image: img1,
    amount: 600,
  },
];

// Define the styled components with the desired styles
const OuterCard = styled.div`
  width: 169px;
  height: 170px;
  position: relative;
`;

const InnerCard = styled(DashboardCard)`
  position: absolute;
  top: 0;
  left: 20px;
  border-radius: 5px;
`;

const ImageCard = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px 20px 0 0;
  object-fit: cover;
`;

const AllBusinesses = () => {
  return (
    <PageContainer title="Sample Page" description="This is a Sample page">
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={1}>
        {userList.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <OuterCard>
              <InnerCard title="">
                <ImageCard src={user.image} alt={user.name} />
                <Typography variant="h6">{user.name}</Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '123px',
                    height: '36px',
                    borderRadius: '20px',
                    backgroundColor: '#F7F6FD',
                    padding: '0 8px',
                    color: '#5B4899',
                    marginTop: '25px',
                  }}
                >
                  <IconCoins size={18} />
                  <Typography variant="subtitle1" style={{ marginLeft: '8px' }}>
                    {user.amount}
                  </Typography>
                </div>
              </InnerCard>
            </OuterCard>
          </Grid>
        ))}
      </Box>
    </PageContainer>
  );
};

export default AllBusinesses;
