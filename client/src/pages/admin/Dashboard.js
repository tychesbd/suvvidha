import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

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

// Components
import DashboardLayout from '../../components/layout/DashboardLayout';

// Dashboard sub-pages
import Profile from './Profile';

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
          <StatsCard title="Users" value="42" icon={<PeopleIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Orders" value="156" icon={<ShoppingCartIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Categories" value="18" icon={<CategoryIcon fontSize="large" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Vendors" value="12" icon={<PeopleIcon fontSize="large" />} />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        Recent Users
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Joined
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" color="text.secondary" align="center">
          No recent users to display.
        </Typography>
      </Paper>

      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>
        System Statistics
      </Typography>
      <Grid container spacing={3}>
        {['Total Revenue', 'Active Products', 'Pending Orders', 'System Health'].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                height: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {item}
              </Typography>
              <Typography variant="h4" color="error.main">
                {index === 0 ? '₹45,250' : index === 1 ? '324' : index === 2 ? '18' : '98%'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
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
      text: 'Products',
      icon: <CategoryIcon />,
      path: '/admin/products',
    },
    {
      text: 'Orders',
      icon: <ShoppingCartIcon />,
      path: '/admin/orders',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/admin/profile',
    },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<Typography variant="h4">Users Management</Typography>} />
        <Route path="/products" element={<Typography variant="h4">Products Management</Typography>} />
        <Route path="/orders" element={<Typography variant="h4">Orders Management</Typography>} />
        <Route path="/settings" element={<Typography variant="h4">System Settings</Typography>} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;