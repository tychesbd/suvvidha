import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SubscriptionPlans from './SubscriptionPlans';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionPlans } from '../../features/subscriptions/subscriptionSlice';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const steps = ['Select Plan', 'Payment Details', 'Confirmation'];

const SubscriptionPurchaseModal = ({ open, onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const { plans, loading, error } = useSelector((state) => state.subscriptions);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    upiId: '',
    paymentDate: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Mock plans data - in a real app, this would come from the Redux store
  const mockPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 999,
      duration: '30 days',
      durationDays: 30,
      features: ['Basic service listing', 'Customer support', '30 days validity'],
      description: 'Perfect for new vendors looking to get started',
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 2499,
      duration: '90 days',
      durationDays: 90,
      features: ['Featured service listing', 'Priority customer support', 'Analytics dashboard', '90 days validity'],
      description: 'Great for established vendors wanting more visibility',
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 4999,
      duration: '180 days',
      durationDays: 180,
      features: ['Premium service listing', 'Dedicated customer support', 'Advanced analytics', 'Marketing tools', '180 days validity'],
      description: 'The ultimate package for serious vendors',
    },
  ];

  // Fetch plans from API when component mounts
  useEffect(() => {
    dispatch(getSubscriptionPlans());
  }, [dispatch]);

  const handleNext = () => {
    if (activeStep === 0 && !selectedPlan) {
      return; // Don't proceed if no plan is selected
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({
      ...paymentDetails,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare the subscription data
      const subscriptionData = {
        plan: selectedPlan,
        ...paymentDetails,
      };

      // Call the onSubmit callback with the subscription data
      await onSubmit(subscriptionData);
      
      // Close the modal after successful submission
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit subscription. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedPlanDetails = () => {
    // Use plans from API if available, otherwise fall back to mock plans
    const allPlans = plans.length > 0 ? plans : mockPlans;
    return allPlans.find(plan => (plan.id === selectedPlan || plan.planId === selectedPlan)) || {};
  };

  const isPaymentFormValid = () => {
    return (
      paymentDetails.transactionId.trim() !== '' &&
      paymentDetails.upiId.trim() !== ''
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Purchase Subscription</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <SubscriptionPlans
            plans={plans.length > 0 ? plans : mockPlans}
            selectedPlan={selectedPlan}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper elevation={2}>
                <Typography variant="h6" gutterBottom>
                  Selected Plan: {getSelectedPlanDetails().name}
                </Typography>
                <Typography variant="body1" color="primary" gutterBottom>
                  Price: ₹{getSelectedPlanDetails().price}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Duration: {getSelectedPlanDetails().duration}
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12}>
              <StyledPaper elevation={2}>
                <Typography variant="h6" gutterBottom>
                  Payment Instructions
                </Typography>
                <Typography variant="body2" paragraph>
                  Please make the payment to the following UPI ID and provide the transaction details below:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                  <Typography variant="body1" fontWeight="bold">
                    UPI ID: suvvidha@ybl
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  After making the payment, please fill in the details below. Your subscription will be activated once the payment is verified by our team.
                </Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Transaction ID"
                name="transactionId"
                value={paymentDetails.transactionId}
                onChange={handlePaymentDetailsChange}
                fullWidth
                required
                margin="normal"
                helperText="Enter the UPI transaction ID"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Your UPI ID"
                name="upiId"
                value={paymentDetails.upiId}
                onChange={handlePaymentDetailsChange}
                fullWidth
                required
                margin="normal"
                helperText="Enter the UPI ID you used for payment"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={paymentDetails.paymentDate}
                onChange={handlePaymentDetailsChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                name="notes"
                value={paymentDetails.notes}
                onChange={handlePaymentDetailsChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                helperText="Any additional information you want to provide"
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box>
            <StyledPaper elevation={2}>
              <Typography variant="h6" gutterBottom>
                Subscription Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Plan:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getSelectedPlanDetails().name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Price:</Typography>
                  <Typography variant="body1" gutterBottom>
                    ₹{getSelectedPlanDetails().price}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Duration:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getSelectedPlanDetails().duration}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Features:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getSelectedPlanDetails().features?.join(', ')}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Payment Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Transaction ID:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {paymentDetails.transactionId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">UPI ID:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {paymentDetails.upiId}
                  </Typography>
                </Grid>
                {paymentDetails.paymentDate && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Payment Date:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {paymentDetails.paymentDate}
                    </Typography>
                  </Grid>
                )}
                {paymentDetails.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Additional Notes:</Typography>
                    <Typography variant="body1" gutterBottom>
                      {paymentDetails.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </StyledPaper>
            <Alert severity="info" sx={{ mt: 2 }}>
              Your subscription will be activated once our team verifies your payment. This usually takes 1-2 business days.
            </Alert>
            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} color="inherit">
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button 
            onClick={handleNext} 
            variant="contained" 
            color="primary"
            disabled={activeStep === 0 && !selectedPlan || activeStep === 1 && !isPaymentFormValid()}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionPurchaseModal;