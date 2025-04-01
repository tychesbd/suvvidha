import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI imports
import { Typography, Grid, Paper, Box } from '@mui/material';
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

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Here's an overview of your activity
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Orders" value="5" icon={<ShoppingCartIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Wishlist" value="12" icon={<FavoriteIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Recent Views" value="24" icon={<HistoryIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Profile" value="1" icon={<PersonIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Orders
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          You don't have any recent orders.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recommended for You
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'grey.200',
                  mb: 2,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Product {item}
                </Typography>
              </Box>
              <Typography variant="subtitle1">Product Name {item}</Typography>
              <Typography variant="body2" color="text.secondary">
                $99.99
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
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
      text: 'Orders',
      icon: <ShoppingCartIcon />,
      path: '/customer/orders',
    },
    {
      text: 'Wishlist',
      icon: <FavoriteIcon />,
      path: '/customer/wishlist',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/customer/profile',
    },
  ];

  return (
    <DashboardLayout title="Customer Dashboard" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<CustomerHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Typography variant="h4">Orders Page</Typography>} />
        <Route path="/wishlist" element={<Typography variant="h4">Wishlist Page</Typography>} />
        
        {/* Common Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </DashboardLayout>
  );
};

export default CustomerDashboard;