import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Paper,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SettingsIcon from '@mui/icons-material/Settings';
import ListAltIcon from '@mui/icons-material/ListAlt';

// Import components
import PlanManagement from '../../components/subscription/PlanManagement';
import VendorSubscriptions from '../../components/subscription/VendorSubscriptions';
import { getAllSubscriptions, verifySubscription } from '../../features/subscriptions/subscriptionSlice';



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

const Subscriptions = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.subscriptions);
  
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);

  // Fetch subscriptions when component mounts
  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };


  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setDetailsOpen(true);
  };

  const handleVerifyPayment = (subscription) => {
    setSelectedSubscription(subscription);
    setVerifyDialogOpen(true);
  };

  const confirmVerifyPayment = async () => {
    if (selectedSubscription) {
      // Dispatch action to verify payment
      await dispatch(verifySubscription({
        id: selectedSubscription._id,
        paymentStatus: 'paid'
      }));
      
      // Refresh subscriptions list
      dispatch(getAllSubscriptions());
      setVerifyDialogOpen(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Subscription Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage vendor subscriptions, payment verifications, and subscription plans
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="subscription management tabs"
        >
          <Tab 
            icon={<ListAltIcon />} 
            label="Vendor Subscriptions" 
            id="subscriptions-tab" 
            aria-controls="subscriptions-panel" 
          />
          <Tab 
            icon={<SettingsIcon />} 
            label="Plan Management" 
            id="plans-tab" 
            aria-controls="plans-panel" 
          />
        </Tabs>
      </Box>

      {/* Vendor Subscriptions Tab */}
      <div
        role="tabpanel"
        hidden={activeTab !== 0}
        id="subscriptions-panel"
        aria-labelledby="subscriptions-tab"
      >
        {activeTab === 0 && (
          <VendorSubscriptions 
            onViewDetails={handleViewDetails} 
            onVerifyPayment={handleVerifyPayment} 
          />
        )}
      </div>

      {/* Plan Management Tab */}
      <div
        role="tabpanel"
        hidden={activeTab !== 1}
        id="plans-panel"
        aria-labelledby="plans-tab"
      >
        {activeTab === 1 && (
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <PlanManagement />
          </Paper>
        )}
      </div>

      {/* Subscription Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent dividers>
          {selectedSubscription && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                {selectedSubscription.plan} Plan
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Vendor</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.vendor.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography variant="body2" gutterBottom>
                    {selectedSubscription.vendor.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Price</Typography>
                  <Typography variant="body2" gutterBottom>
                    ₹{selectedSubscription.price}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Status</Typography>
                  <StatusChip 
                    label={selectedSubscription.status} 
                    status={selectedSubscription.status} 
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Start Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(selectedSubscription.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">End Date</Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(selectedSubscription.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Features</Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {selectedSubscription.features.map((feature, index) => (
                      <Typography component="li" variant="body2" key={index}>
                        {feature}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Verify Payment Dialog */}
      <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
        <DialogTitle>Verify Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to verify the payment for this subscription?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will mark the payment as paid and activate the subscription.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmVerifyPayment} color="success" variant="contained">
            Verify Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Subscriptions;