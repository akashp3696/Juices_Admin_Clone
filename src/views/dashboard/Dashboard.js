import React, { useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';
import axios from 'axios';
import { baseUrl } from '../../utils/data';


const Dashboard = () => {
  const [subscription, setSubscription]= useState(null)
  const [yearlyEarnings, setYearlyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const getData = async()=>{
    try {
      const res = await axios.get(`${baseUrl}/subscription/all`)
      setSubscription(res?.data?.data)
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    getData()
  },[])
  // console.log(subscription);
  useEffect(() => {
    if (subscription) {
      calculateYearlyEarnings();
      calculateMonthlyEarnings();
    }
  }, [subscription]);

  const calculateYearlyEarnings = () => {
    const currentYear = new Date().getFullYear();
    const yearlyEarningsTotal = subscription.reduce((total, sub) => {
      const startDate = new Date(sub.startDate);
      if (startDate.getFullYear() === currentYear) {
        total += sub.product ? sub.product.price : 0;
      }
      return total;
    }, 0);
    setYearlyEarnings(yearlyEarningsTotal);
  };

  const calculateMonthlyEarnings = () => {
    const currentMonth = new Date().getMonth() + 1; // Adding 1 because months are zero-based
    const currentYear = new Date().getFullYear();
    const monthlyEarningsTotal = subscription.reduce((total, sub) => {
      const startDate = new Date(sub.startDate);
      if (startDate.getMonth() + 1 === currentMonth && startDate.getFullYear() === currentYear) {
        total += sub.product ? sub.product.price : 0;
      }
      return total;
    }, 0);
    setMonthlyEarnings(monthlyEarningsTotal);
  };

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview subscriptions={subscription} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup yearlyEarnings={yearlyEarnings} />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings monthlyEarnings={monthlyEarnings} />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
