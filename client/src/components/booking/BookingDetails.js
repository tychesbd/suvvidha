import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Avatar,
  Rating,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

// Styled components
const StatusChip = styled(Chip)(({ theme, status }) => {
  let color = theme.palette.info.main;
  let backgroundColor = theme.palette.info.light;
  
  if (status === 'completed') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success.light;
  } else if (status === 'cancelled') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error.light;
  } else if (status === 'in-progress') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning.light;
  } else if (status === 'pending') {
    color = theme.palette.info.main;
    backgroundColor = theme.palette.info.light;
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

const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box sx={{ color: 'primary.main', mr: 2 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

// Sample data - this would come from an API in a real application
const sampleBooking = {
  id: 'BK-001',
  serviceName: 'Home Cleaning',
  dateTime: '2023-10-15 10:00 AM',
  status: 'pending',
  customer: {
    name: 'John Doe',
    phone: '9876543210',
    pincode: '400001',
    location: '123 Main Street, Mumbai, Maharashtra'
  },
  service: {
    id: 'SRV-001',
    name: 'Home Cleaning',
    description: 'Professional home cleaning services',
    price: '₹1,200'
  },
  createdAt: '2023-10-10 09:30 AM'
};

// Sample vendors data
const sampleVendors = [
  {
    id: 'V-001',
    name: 'Rahul Sharma',
    rating: 4.8,
    reviews: 24,
    pincode: '400001',
    distance: '2.5 km',
    phone: '9876543210'
  },
  {
    id: 'V-002',
    name: 'Priya Patel',
    rating: 4.5,
    reviews: 18,
    pincode: '400002',
    distance: '3.2 km',
    phone: '9876543211'
  },
  {
    id: 'V-003',
    name: 'Amit Kumar',
    rating: 4.9,
    reviews: 32,
    pincode: '400001',
    distance: '1.8 km',
    phone: '9876543212'
  },
  {
    id: 'V-004',
    name: 'Sneha Gupta',
    rating: 4.2,
    reviews: 15,
    pincode: '400003',
    distance: '4.5 km',
    phone: '9876543213'
  }
];

const BookingDetails = ({ bookingId }) => {
  // In a real application, you would fetch the booking details using the bookingId
  const [booking, setBooking] = useState(sampleBooking);
  const [loading, setLoading] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignVendorDialogOpen, setAssignVendorDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [vendors, setVendors] = useState(sampleVendors);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorFilters, setVendorFilters] = useState({
    pincode: '',
    minRating: 0
  });
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Handle status change dialog open
  const handleStatusChangeClick = () => {
    setNewStatus(booking.status);
    setStatusNote('');
    setStatusDialogOpen(true);
  };

  // Handle status dialog close
  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  // Handle status update
  const handleStatusUpdate = () => {
    if (!newStatus) return;
    
    setLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setBooking({
        ...booking,
        status: newStatus
      });
      setLoading(false);
      setStatusDialogOpen(false);
    }, 1000);
  };

  // Handle assign vendor dialog open
  const handleAssignVendorClick = () => {
    setSelectedVendor(null);
    setVendorSearchQuery('');
    setVendorFilters({
      pincode: '',
      minRating: 0
    });
    setAssignVendorDialogOpen(true);
  };

  // Handle assign vendor dialog close
  const handleAssignVendorDialogClose = () => {
    setAssignVendorDialogOpen(false);
  };

  // Handle vendor selection
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
  };

  // Handle vendor assignment
  const handleAssignVendor = () => {
    if (!selectedVendor) return;
    
    setLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setBooking({
        ...booking,
        vendor: selectedVendor,
        status: 'in-progress'
      });
      setLoading(false);
      setAssignVendorDialogOpen(false);
    }, 1000);
  };

  // Handle vendor search
  const handleVendorSearch = (e) => {
    setVendorSearchQuery(e.target.value);
  };

  // Handle filter dialog open
  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

  // Handle filter dialog close
  const handleFilterDialogClose = () => {
    setFilterDialogOpen(false);
  };

  // Handle filter apply
  const handleApplyFilters = () => {
    // In a real application, this would filter vendors from the API
    setFilterDialogOpen(false);
  };

  // Filter vendors based on search query and filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(vendorSearchQuery.toLowerCase());
    const matchesPincode = !vendorFilters.pincode || vendor.pincode === vendorFilters.pincode;
    const matchesRating = vendor.rating >= vendorFilters.minRating;
    
    return matchesSearch && matchesPincode && matchesRating;
  });

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Booking Details</Typography>
          <StatusChip 
            label={booking.status} 
            status={booking.status} 
          />
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Booking Information</Typography>
            
            <InfoItem 
              icon={<CalendarTodayIcon />}
              label="Booking ID"
              value={booking.id}
            />
            
            <InfoItem 
              icon={<MiscellaneousServicesIcon />}
              label="Service"
              value={booking.serviceName}
            />
            
            <InfoItem 
              icon={<AccessTimeIcon />}
              label="Date & Time"
              value={booking.dateTime}
            />
            
            <InfoItem 
              icon={<CalendarTodayIcon />}
              label="Created On"
              value={booking.createdAt}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Customer Information</Typography>
            
            <InfoItem 
              icon={<PersonIcon />}
              label="Name"
              value={booking.customer.name}
            />
            
            <InfoItem 
              icon={<PhoneIcon />}
              label="Phone"
              value={booking.customer.phone}
            />
            
            <InfoItem 
              icon={<LocationOnIcon />}
              label="Pincode"
              value={booking.customer.pincode}
            />
            
            <InfoItem 
              icon={<LocationOnIcon />}
              label="Location"
              value={booking.customer.location}
            />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {booking.vendor ? (
          <Box>
            <Typography variant="h6" gutterBottom>Assigned Vendor</Typography>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {booking.vendor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">{booking.vendor.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={booking.vendor.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({booking.vendor.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAssignVendorClick}
              disabled={booking.status !== 'pending'}
            >
              Assign Vendor
            </Button>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={handleStatusChangeClick}
          >
            Change Status
          </Button>
          
          {!booking.vendor && booking.status === 'pending' && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleAssignVendorClick}
            >
              Assign Vendor
            </Button>
          )}
        </Box>
      </Paper>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Change Booking Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Notes (Optional)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            color="primary" 
            variant="contained"
            disabled={!newStatus || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Processing...
              </>
            ) : (
              'Update Status'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Vendor Dialog */}
      <Dialog 
        open={assignVendorDialogOpen} 
        onClose={handleAssignVendorDialogClose} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Assign Vendor</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Booking: {booking.id} - {booking.serviceName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {booking.customer.name} | Location: {booking.customer.pincode}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 2 }}>
            <TextField
              placeholder="Search vendors by name"
              value={vendorSearchQuery}
              onChange={handleVendorSearch}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={handleFilterDialogOpen}
              sx={{ ml: 1 }}
            >
              Filter
            </Button>
          </Box>
          
          <Typography variant="subtitle2" gutterBottom>
            Available Vendors ({filteredVendors.length})
          </Typography>
          
          {filteredVendors.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
              No vendors found matching your criteria.
            </Typography>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {filteredVendors.map((vendor) => (
                <Grid item xs={12} sm={6} key={vendor.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedVendor?.id === vendor.id ? '2px solid' : '1px solid',
                      borderColor: selectedVendor?.id === vendor.id ? 'primary.main' : 'divider',
                    }}
                    onClick={() => handleVendorSelect(vendor)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                            {vendor.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">{vendor.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={vendor.rating} precision={0.1} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                ({vendor.reviews} reviews)
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        {selectedVendor?.id === vendor.id && (
                          <CheckCircleIcon color="primary" />
                        )}
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Pincode: {vendor.pincode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Distance: {vendor.distance}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAssignVendorDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAssignVendor} 
            color="primary" 
            variant="contained"
            disabled={!selectedVendor || loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Processing...
              </>
            ) : (
              'Assign Vendor'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onClose={handleFilterDialogClose}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Filter Vendors</Typography>
            <IconButton onClick={handleFilterDialogClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Pincode"
            value={vendorFilters.pincode}
            onChange={(e) => setVendorFilters({ ...vendorFilters, pincode: e.target.value })}
            fullWidth
            margin="normal"
          />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Minimum Rating
            </Typography>
            <Rating
              value={vendorFilters.minRating}
              onChange={(event, newValue) => {
                setVendorFilters({ ...vendorFilters, minRating: newValue });
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setVendorFilters({
                pincode: '',
                minRating: 0
              });
            }} 
            color="inherit"
          >
            Clear All
          </Button>
          <Button 
            onClick={handleApplyFilters} 
            color="primary" 
            variant="contained"
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingDetails;