import React from 'react';
import styled from 'styled-components';
import { Card, Button } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import { IconArrowLeft } from '@tabler/icons';
import img1 from '../../views/sample-page/assets/images/opplogo.png';
import img2 from '../../views/sample-page/assets/images/oppmain.png';
import { Link } from 'react-router-dom';

const opportunities = [
  {
    id: 1,
    organization: 'THE JUICES',
    title: 'Product 1',
    Prise: '150 Rs.',

    description: 'Lorem',
    datePosted: '26 Jan 2023',
    image: img2,
    logo:img1,
  },
  {
    id: 2,
    organization: 'THE JUICES',
    title: 'Product 2',
    Prise: '150 Rs.',
    description: 'Lorem',
    datePosted: '26 Jan 2023',
    image: img2,
    logo:img1,
  },
  
  // Add more opportunities here
];

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
    width: 1rem;
    height: 2.5rem;
   
  }
`;

const OpportunityCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const OpportunityCard = styled(Card)`
  && {
    position: relative;
    border-radius: var(--br-xs);
    background-color: var(--color-white);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    width: 25rem;
    height: 24rem;
    margin: 1rem;
  }
`;

const MaskGroupIcon = styled.img`
  position: absolute;

  object-fit: cover;
`;

const OrganizationName = styled.div`
  position: absolute;
  top: 1rem;
  left: 1.88rem;

  font-weight: 500;
`;

const OpportunityTitle = styled.div`
  position: absolute;
  top: 5rem;
  left: 1.88rem;
  font-weight: 500;
`;

const OpportunityDescription = styled.div`
  position: absolute;
  top: 18rem;
  left: 1.88rem;
  font-weight: 500;
  color: var(--color-black);
  display: inline-block;
  width: 20rem;
`;

const CompleteButton = styled(Button)`
  && {
    position: absolute;
    top: 21rem;
    left: 18.13rem;
    font-weight: 600;
    color: white;
  
  }
`;

const DatePosted = styled.div`
  position: absolute;
  top: 2.4rem;
  left: 1.88rem;

  font-size: var(--font-size-4xs);
  font-weight: 500;
  color: var(--color-gray-100);
`;

const OpportunityImage = styled.img`
  position: absolute;
  top: 7rem;
  left: 1.56rem;
  border-radius: var(--br-xs);
  width: 21.25rem;
  height: 10.13rem;
  object-fit: cover;
`;

const AllOpportunities = () => {
  return (
    <PageContainer>
      <MyOpportunities>
        <BackIcon component={IconArrowLeft} />
        <TextWrapper>All Products</TextWrapper>
<Link to='/webinarform'>

<button style={{height:"50px" , backgroundColor:'#62B34F', color:'white',border:'none',paddingLeft:'20px',paddingRight:'20px',borderRadius:'15px'}}>Add New</button>
</Link>
      
      </MyOpportunities>
      {/* <OpportunityCardContainer>
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id}>
          <CompleteButton variant="contained">Complete</CompleteButton>

            <OpportunityImage alt="" src={opportunity.image} />
            
            <OrganizationName>{opportunity.organization}</OrganizationName>
            <OpportunityTitle>{opportunity.title}</OpportunityTitle>
            <OpportunityDescription>{opportunity.description}</OpportunityDescription>
            <DatePosted>{opportunity.datePosted}</DatePosted>
          </OpportunityCard>
        ))}
      </OpportunityCardContainer> */}

      <div style={{display:'flex' , flexDirection:'row' , gap:'30px'}}>
      {opportunities.map((opportunity) => (
        <div className='allpd-card' style={{width:'50%' }} key={opportunity.id}>

        <img style={{width:'100%' }} src={opportunity.image}/>
<h1>{opportunity.title}</h1>
<h2>{opportunity.Prise}</h2>
<p>{opportunity.description}</p>
      


        </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default AllOpportunities;
