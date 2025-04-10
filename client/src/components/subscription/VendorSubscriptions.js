import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAllSubscriptions } from '../../features/subscriptions/subscriptionSlice';

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'active') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'expired') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error.light;
  } else if (status === 'pending') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
  }
  
  return {
    color: color,
    backgroundColor: backgroundColor,
    fontWeight: 'bold',
    '& .MuiChip-label': {
      textTransform: 'capitalize',
    },
  };
});

const VendorSubscriptions = ({ onViewDetails, onVerifyPayment }) => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.subscriptions);
  
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [filters, setFilters] = useState({
    plan: '',
    status: '',
    paymentStatus: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all subscriptions when component mounts
  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);
  
  // Apply filters
  useEffect(() => {
    if (!subscriptions) return;
    
    let result = [...subscriptions];
    
    if (filters.plan) {
      result = result.filter(sub => sub.plan === filters.plan);
    }
    
    if (filters.status) {
      result = result.filter(sub => sub.status === filters.status);
    }
    
    if (filters.paymentStatus) {
      result = result.filter(sub => sub.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sub => 
        (sub.vendor.name && sub.vendor.name.toLowerCase().includes(searchLower)) ||
        (sub.vendor.email && sub.vendor.email.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredSubscriptions(result);
  }, [filters, subscriptions]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      plan: '',
      status: '',
      paymentStatus: '',
      search: '',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading subscriptions: {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Search by vendor name or email"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          color="primary"
          variant="outlined"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </Box>

      {showFilters && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Plan</InputLabel>
              <Select
                name="plan"
                value={filters.plan}
                onChange={handleFilterChange}
                label="Plan"
              >
                <MenuItem value="">All Plans</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                label="Payment Status"
              >
                <MenuItem value="">All Payment Statuses</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="text" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell>
                    <Typography variant="body2">{subscription.vendor.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {subscription.vendor.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{subscription.plan}</TableCell>
                  <TableCell>₹{subscription.price}</TableCell>
                  <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={subscription.status} 
                      status={subscription.status} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <StatusChip 
                      label={subscription.paymentStatus} 
                      status={subscription.paymentStatus === 'paid' ? 'active' : 
                             subscription.paymentStatus === 'pending' ? 'pending' : 'expired'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => onViewDetails(subscription)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {subscription.paymentStatus === 'pending' && (
                      <Tooltip title="Verify Payment">
                        <IconButton 
                          size="small" 
                          color="success" 
                          onClick={() => onVerifyPayment(subscription)}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No subscriptions found matching the filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VendorSubscriptions;