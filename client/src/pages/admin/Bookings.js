import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogContent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Import booking components
import BookingDetails from '../../components/booking/BookingDetails';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
}));

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

// Sample data - this would come from an API in a real application
const sampleBookings = [
  {
    id: 'BK-001',
    customerName: 'John Doe',
    serviceName: 'Home Cleaning',
    dateTime: '2023-10-15 10:00 AM',
    status: 'pending',
    pincode: '400001'
  },
  {
    id: 'BK-002',
    customerName: 'Jane Smith',
    serviceName: 'Plumbing Repair',
    dateTime: '2023-10-18 02:30 PM',
    status: 'in-progress',
    pincode: '400002'
  },
  {
    id: 'BK-003',
    customerName: 'Mike Johnson',
    serviceName: 'Electrical Work',
    dateTime: '2023-10-10 09:15 AM',
    status: 'completed',
    pincode: '400003'
  },
  {
    id: 'BK-004',
    customerName: 'Sarah Williams',
    serviceName: 'Painting Service',
    dateTime: '2023-10-05 11:00 AM',
    status: 'cancelled',
    pincode: '400001'
  },
  {
    id: 'BK-005',
    customerName: 'Robert Brown',
    serviceName: 'Appliance Repair',
    dateTime: '2023-10-20 01:00 PM',
    status: 'pending',
    pincode: '400004'
  },
];

const Bookings = () => {
  const [bookings, setBookings] = useState(sampleBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle view details
  const handleViewDetails = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDetailsDialogOpen(true);
  };

  // Handle details dialog close
  const handleDetailsDialogClose = () => {
    setDetailsDialogOpen(false);
  };

  // Filter bookings based on search query and active tab
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pincode.includes(searchQuery);
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && booking.status === 'pending') ||
      (activeTab === 'in-progress' && booking.status === 'in-progress') ||
      (activeTab === 'completed' && booking.status === 'completed') ||
      (activeTab === 'cancelled' && booking.status === 'cancelled');
    
    return matchesSearch && matchesTab;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Booking Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage all customer bookings and assign vendors
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            placeholder="Search by ID, customer, service or pincode"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Bookings" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="In Progress" value="in-progress" />
          <Tab label="Completed" value="completed" />
          <Tab label="Cancelled" value="cancelled" />
        </Tabs>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Booking ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Service</StyledTableCell>
              <StyledTableCell>Date & Time</StyledTableCell>
              <StyledTableCell>Pincode</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>{booking.customerName}</TableCell>
                  <TableCell>{booking.serviceName}</TableCell>
                  <TableCell>{booking.dateTime}</TableCell>
                  <TableCell>{booking.pincode}</TableCell>
                  <TableCell>
                    <StatusChip 
                      label={booking.status} 
                      status={booking.status} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      size="small"
                      onClick={() => handleViewDetails(booking.id)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                    No bookings found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Booking Details Dialog */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={handleDetailsDialogClose} 
        maxWidth="md" 
        fullWidth
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={handleDetailsDialogClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          {selectedBookingId && (
            <BookingDetails bookingId={selectedBookingId} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Bookings;