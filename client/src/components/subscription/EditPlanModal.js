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
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const EditPlanModal = ({ open, onClose, plan, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    duration: '',
    durationDays: 0,
    features: [],
    description: '',
    offers: '',
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        id: plan.id || '',
        planId: plan.planId || plan.id || '',
        name: plan.name || '',
        price: plan.price || 0,
        duration: plan.duration || '',
        durationDays: plan.durationDays || 0,
        features: plan.features || [],
        description: plan.description || '',
        offers: plan.offers || '',
        isActive: plan.isActive !== undefined ? plan.isActive : true,
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'durationDays' ? Number(value) : value,
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== '') {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {plan ? `Edit ${plan.name}` : 'Create New Subscription Plan'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price (₹)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration Display (e.g., '30 days')"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration in Days"
              name="durationDays"
              type="number"
              value={formData.durationDays}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Special Offers"
              name="offers"
              value={formData.offers}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="E.g., '20% off for first-time vendors'"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Features
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Add Feature"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFeature}
                startIcon={<AddIcon />}
                sx={{ ml: 1, height: 40 }}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => handleRemoveFeature(index)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlanModal;