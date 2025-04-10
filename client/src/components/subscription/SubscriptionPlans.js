import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const StyledCard = styled(Card)(({ theme, selected }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid rgba(0, 0, 0, 0.12)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
}));

const SubscriptionPlans = ({ plans, selectedPlan, onSelectPlan }) => {
  // Helper function to get plan ID (handles both id and planId formats)
  const getPlanId = (plan) => plan.planId || plan.id;
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Select a Subscription Plan
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="plan-select-label">Select Plan</InputLabel>
        <Select
          labelId="plan-select-label"
          value={selectedPlan}
          onChange={(e) => onSelectPlan(e.target.value)}
          label="Select Plan"
        >
          {plans.map((plan) => (
            <MenuItem value={getPlanId(plan)} key={getPlanId(plan)}>
              {plan.name} - ₹{plan.price}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={getPlanId(plan)}>
            <Card 
              variant="outlined" 
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: selectedPlan === getPlanId(plan) ? 'primary.main' : 'divider',
                borderWidth: selectedPlan === getPlanId(plan) ? 2 : 1,
                boxShadow: selectedPlan === getPlanId(plan) ? 3 : 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 2,
                  borderColor: 'primary.light',
                },
              }}
              onClick={() => onSelectPlan(getPlanId(plan))}
            >
              <CardHeader
                title={
                  <Typography variant="h6" component="div">
                    {plan.name}
                  </Typography>
                }
                subheader={
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
                    ₹{plan.price}
                  </Typography>
                }
                action={
                  <Chip 
                    label={`Duration: ${plan.duration}`}
                    size="small"
                    color="secondary"
                    sx={{ mt: 1 }}
                  />
                }
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button 
                  fullWidth 
                  variant={selectedPlan === getPlanId(plan) ? "contained" : "outlined"}
                  color="primary"
                  size="large"
                  onClick={() => onSelectPlan(getPlanId(plan))}
                >
                  {selectedPlan === getPlanId(plan) ? "Selected" : "Select Plan"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubscriptionPlans;