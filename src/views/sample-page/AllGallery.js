import React from 'react';
import styled from 'styled-components';
import { Card } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import img1 from '../../views/sample-page/assets/images/opplogo.png';
import img2 from '../../views/sample-page/assets/images/oppmain.png';

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const CardWrapper = styled(Card)`
  max-width: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EmptyCard = styled(Card)`
  max-width: 200px;
  height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AllGallery = () => {
  return (
    <PageContainer>
      <CardGrid>
        <CardWrapper>
          <CardImage src={img1} alt="Image 1" />
        </CardWrapper>
        <CardWrapper>
          <CardImage src={img2} alt="Image 2" />
        </CardWrapper>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        <EmptyCard>No Image</EmptyCard>
        {/* Add more CardWrapper or EmptyCard components for additional cards */}
      </CardGrid>
    </PageContainer>
  );
};

export default AllGallery;
