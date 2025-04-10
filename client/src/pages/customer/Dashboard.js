import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBookingCounts } from '../../features/bookings/bookingSlice';

// Material UI imports
import { Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';
import BookingList from '../../components/booking/BookingList';

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
      <Box sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

const CustomerHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { counts, loading, error } = useSelector((state) => state.bookings);
  const dispatch = useDispatch();

  // Fetch booking counts when component mounts
  useEffect(() => {
    dispatch(getBookingCounts());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Here's an overview of your booking activity
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Active Bookings" 
            value={loading ? '...' : counts.active.toString()} 
            icon={<ShoppingCartIcon fontSize="large" />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Completed" 
            value={loading ? '...' : counts.completed.toString()} 
            icon={<CheckCircleIcon fontSize="large" />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Cancelled" 
            value={loading ? '...' : counts.cancelled.toString()} 
            icon={<CancelIcon fontSize="large" />} 
          />
        </Grid>
      </Grid>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error loading booking counts: {error}
        </Typography>
      )}
    </Box>
  );
};

const CustomerDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/customer',
    },
    {
      text: 'Booking',
      icon: <ShoppingCartIcon />,
      path: '/customer/booking',
    },
    {
      text: 'Booking History',
      icon: <HistoryIcon />,
      path: '/customer/booking-history',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/customer/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <CustomerHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />
      <Route path="/booking" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Typography variant="h4">Booking</Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            View your in-progress bookings
          </Typography>
          <BookingList type="active" />
        </DashboardLayout>
      } />
      <Route path="/booking-history" element={
        <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
          <Typography variant="h4">Booking History</Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            View your completed and cancelled bookings
          </Typography>
          <BookingList type="history" />
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

export default CustomerDashboard;