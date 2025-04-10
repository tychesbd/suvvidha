import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDashboardStats } from '../../features/dashboard/dashboardSlice';

// Material UI imports
import { Typography, Grid, Paper, Box, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';
import SimpleLayout from '../../components/layout/SimpleLayout';

// Dashboard sub-pages
import Profile from './Profile';
import Users from './Users';
import AdminServices from './Services';
import AdminCategories from './Categories';
import ContentManagement from './ContentManagement';
import Bookings from './Bookings';

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
      <Box sx={{ fontSize: '3rem', color: 'error.main', mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h3" component="div" color="text.primary">
        {value}
      </Typography>
    </Item>
  );
};

const AdminHome = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  // Fetch dashboard stats when component mounts
  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        System overview and management
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Users" 
            value={loading ? '...' : stats.users.toString()} 
            icon={<PeopleIcon fontSize="large" />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Bookings" 
            value={loading ? '...' : stats.bookings.toString()} 
            icon={<CalendarTodayIcon fontSize="large" />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Services" 
            value={loading ? '...' : stats.services.toString()} 
            icon={<MiscellaneousServicesIcon fontSize="large" />} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            title="Vendors" 
            value={loading ? '...' : stats.vendors.toString()} 
            icon={<StorefrontIcon fontSize="large" />} 
          />
        </Grid>
      </Grid>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Error loading dashboard statistics: {error}
        </Typography>
      )}
    </Box>
  );
};

const AdminDashboard = () => {
  // Define sidebar menu items
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
    },
    {
      text: 'Services',
      icon: <MiscellaneousServicesIcon />,
      path: '/admin/services',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: '/admin/categories',
    },
    {
      text: 'Content',
      icon: <HomeIcon />,
      path: '/admin/content',
    },
    {
      text: 'Bookings',
      icon: <CalendarTodayIcon />,
      path: '/admin/bookings',
    },
    {
      text: 'Subscriptions',
      icon: <StorefrontIcon />,
      path: '/admin/subscriptions',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/admin/profile',
    },
  ];

  return (
    <Routes>
      {/* Dashboard Pages - with sidebar */}
      <Route path="/" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminHome />
        </DashboardLayout>
      } />
      <Route path="/profile" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Profile />
        </DashboardLayout>
      } />
      <Route path="/users" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Users />
        </DashboardLayout>
      } />
      <Route path="/services" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminServices />
        </DashboardLayout>
      } />
      <Route path="/categories" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <AdminCategories />
        </DashboardLayout>
      } />
      <Route path="/content" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <ContentManagement />
        </DashboardLayout>
      } />
      <Route path="/bookings" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <Bookings />
        </DashboardLayout>
      } />
      <Route path="/subscriptions" element={
        <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
          <React.Suspense fallback={<Typography>Loading...</Typography>}>
            {React.createElement(React.lazy(() => import('./Subscriptions')))}
          </React.Suspense>
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

export default AdminDashboard;