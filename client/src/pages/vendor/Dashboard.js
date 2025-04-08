import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getVendorSubscription } from '../../features/subscriptions/subscriptionSlice';

// Material UI imports
import { Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';
import SubscriptionCard from '../../components/subscription/SubscriptionCard';

// Dashboard sub-pages
import Profile from './Profile';

// Common pages
import Home from '../common/Home';
import Services from '../common/Services';
import AboutUs from '../common/AboutUs';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const StatsCard = ({ title, value, icon }) => {
  return (
    <Item elevation={3}>
      <Box sx={{ fontSize: '3rem', color: 'secondary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

const VendorHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { vendorSubscription, loading } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();

  // Fetch vendor subscription when component mounts
  useEffect(() => {
    dispatch(getVendorSubscription());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage your bookings and analytics
      </Typography>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Subscription Status
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <SubscriptionCard 
              subscription={vendorSubscription}
              onBuyClick={() => console.log('Buy subscription clicked')}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Service Metrics</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Total Services</Typography>
                  <Typography variant="h4" color="secondary.main">12</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Active Services</Typography>
                  <Typography variant="h4" color="secondary.main">8</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Avg. Rating</Typography>
                  <Typography variant="h4" color="secondary.main">4.7</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'background.default',
                    textAlign: 'center',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">Reviews</Typography>
                  <Typography variant="h4" color="secondary.main">32</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const VendorDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/vendor',
    },
    {
      text: 'Booking',
      icon: <ShoppingCartIcon />,
      path: '/vendor/booking',
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/vendor/analytics',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/vendor/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <VendorHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />

      <Route path="/booking" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <React.Suspense fallback={<Typography>Loading...</Typography>}>
            {/* Lazy load the Bookings component */}
            {React.createElement(React.lazy(() => import('./Bookings')))} 
          </React.Suspense>
        </DashboardLayout>
      } />
      <Route path="/analytics" element={
        <DashboardLayout title="Vendor Dashboard" menuItems={menuItems}>
          <Typography variant="h4">Analytics Page</Typography>
        </DashboardLayout>
      } />
      
      {/* Common Pages - without sidebar */}
      <Route path="/home" element={
        <SimpleLayout title="Home">
          <Home />
        </SimpleLayout>
      } />
      <Route path="/services" element={
        <SimpleLayout title="Services">
          <Services />
        </SimpleLayout>
      } />
      <Route path="/about" element={
        <SimpleLayout title="About Us">
          <AboutUs />
        </SimpleLayout>
      } />
    </Routes>
  );
};

export default VendorDashboard;