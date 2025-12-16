import React from 'react';
import styled from 'styled-components';
import { Card, Button } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import { IconArrowLeft, IconAdjustmentsHorizontal } from '@tabler/icons';
import img1 from '../../views/sample-page/assets/images/ngo.png';
import { Link } from 'react-router-dom';

const MyOpportunities = styled.div`
  font-size: clamp(1.5rem, 5vw, 2rem);
  font-weight: 500;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const TextWrapper = styled.div`
  flex: 1;
  text-align: center;
`;

const BackIcon = styled(Button)`
  && {
    padding: 0;
    margin-right: 1rem;
    color: var(--color-gray-200);
    font-size: inherit;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-gray-200);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const ContainerDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SearchBar = styled.input`
  width: 100%;
  height: 100%;
  padding: 0.5rem;
  font-size: 14px;
`;

const FilterButton = styled(Button)`
  && {
    /* Styles for the filter button */
  }
`;

const GridContainer = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  margin-bottom: 1rem;
`;

const GridCard = styled(Card)`
  position: relative; /* Add position relative to the grid card */
  width: 100%;
  height: 500px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:20px;
`;

const NgoLogo = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
`;

const NgoInfo = styled.div`
  margin-left: 1rem; /* Adjust the margin as needed */
  flex-grow: 1; /* Allow the info div to grow and occupy remaining space */
`;

const NgoName = styled.div`
  font-family: Poppins;
  font-size: 35px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0em;
  text-align: left;
  
`;

const NgoAddress = styled.div`
  font-family: Poppins;
  font-size: 20px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
`;

const NgoNumber = styled.div`
  font-family: Poppins;
  font-size: 9px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0em;
  text-align: left;
`;

const ViewMapButton = styled(Button)`
  && {
    width: 89px;
    height: 30px;
    border-radius: 6px;
    background: #5B4899;
    box-shadow: 0px 0px 10px 0px #00000040;
    color: white;
    font-family: Poppins;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
    position: absolute;
    bottom: 8px; /* Position the button at the bottom */
    right: 8px; /* Position the button at the right */
  }
`;

const ngoList = [
  {
    id: 1,
    logo: img1,
    name: "Blog1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
   
  },
  {
    id: 2,
    logo: img1,
    name: "Blog2",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",


  },
  // Add more objects for additional NGOs
];

const AllNgo = () => {
  return (
    <PageContainer>
      <MyOpportunities>
        <BackIcon component={IconArrowLeft} />
        <TextWrapper>Ngo List</TextWrapper>
      </MyOpportunities>

      <ContainerDiv>
        <SearchBar placeholder="Search" />

        <FilterButton>
          <IconAdjustmentsHorizontal />
        </FilterButton>
       <Link to='/blogform'>

<button style={{height:"50px" , backgroundColor:'#62B34F', color:'white',border:'none',paddingLeft:'10px',paddingRight:'10px',borderRadius:'15px'}}>Add New</button>
</Link>
      </ContainerDiv>

      <GridContainer>
       
        {ngoList.map((ngo) => (



          <GridCard key={ngo.id}>
          <div className='blogcard' style={{width:'100%' , height:'300px' }}>
    

            <NgoLogo src={ngo.logo} alt="Ngo Logo" />
            <br/>
            <br/>
            <NgoName>{ngo.name}</NgoName>
            <br/>

              <NgoAddress>{ngo.description}</NgoAddress>
          </div>
            {/* <NgoInfo>
              <NgoName>{ngo.name}</NgoName>
              <NgoAddress>{ngo.address}</NgoAddress>
              <NgoNumber>{ngo.number}</NgoNumber>
              <ViewMapButton>View Map</ViewMapButton>
            </NgoInfo> */}
          </GridCard>
        ))}
      </GridContainer>
      <div className='blogcards'>

      <div className='blogcard'>
      

      </div>

      </div>
    </PageContainer>
  );
};

export default AllNgo;
