import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import { getSubscriptionPlans, updateSubscriptionPlan, resetSubscriptionSuccess } from '../../features/subscriptions/subscriptionSlice';
import EditPlanModal from './EditPlanModal';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const PlanManagement = () => {
  const dispatch = useDispatch();
  const { plans, loading, error, success } = useSelector((state) => state.subscriptions);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock plans data - in a real app, this would come from the Redux store
  const [mockPlans, setMockPlans] = useState([
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 999,
      duration: '30 days',
      durationDays: 30,
      features: ['Basic service listing', 'Customer support', '30 days validity'],
      description: 'Perfect for new vendors looking to get started',
      offers: '',
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 2499,
      duration: '90 days',
      durationDays: 90,
      features: ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'],
      description: 'Great for established vendors wanting more visibility',
      offers: '10% off for renewals',
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 4999,
      duration: '180 days',
      durationDays: 180,
      features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
      description: 'The ultimate package for serious vendors',
      offers: '20% off for annual commitment',
    },
  ]);

  // Fetch plans from API when component mounts
  useEffect(() => {
    // In a real app, uncomment this to fetch from API
    // dispatch(getSubscriptionPlans());
  }, [dispatch]);

  // Reset success state after showing success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(resetSubscriptionSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleSavePlan = (updatedPlan) => {
    // In a real app, dispatch the update action
    // dispatch(updateSubscriptionPlan(updatedPlan));
    
    // For now, update the mock data
    const updatedPlans = mockPlans.map(plan => 
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setMockPlans(updatedPlans);
  };

  // Use plans from Redux store if available, otherwise use mock data
  const displayPlans = plans.length > 0 ? plans : mockPlans;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Subscription Plans</Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Plan updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {displayPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.id}>
              <StyledCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {plan.name}
                    </Typography>
                    <Chip
                      label={`₹${plan.price}`}
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description || `${plan.duration} subscription plan`}
                  </Typography>

                  {plan.offers && (
                    <Chip
                      label={plan.offers}
                      color="secondary"
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                  )}

                  <Typography variant="subtitle2" gutterBottom>
                    Duration: {plan.duration}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    {plan.features.map((feature, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions>
                  <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    fullWidth
                    onClick={() => handleEditPlan(plan)}
                  >
                    Edit Plan
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}

      <EditPlanModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        plan={selectedPlan}
        onSave={handleSavePlan}
      />
    </Box>
  );
};

export default PlanManagement;