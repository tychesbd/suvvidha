import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

// Sample categories for dropdown
const categories = [
  'Cleaning',
  'Plumbing',
  'Electrical',
  'Painting',
  'Carpentry',
  'Gardening',
  'Home Repair',
  'Appliance Repair',
  'Other'
];

// Sample initial services data (would come from API in real app)
const initialServices = [
  {
    id: 1,
    name: 'Home Cleaning',
    category: 'Cleaning',
    minPrice: 499,
    description: 'Professional home cleaning services for a spotless living space.',
    image: 'https://source.unsplash.com/random/300x200/?cleaning',
  },
  {
    id: 2,
    name: 'Plumbing',
    category: 'Plumbing',
    minPrice: 299,
    description: 'Expert plumbing services for all your repair and installation needs.',
    image: 'https://source.unsplash.com/random/300x200/?plumbing',
  },
  {
    id: 3,
    name: 'Electrical Work',
    category: 'Electrical',
    minPrice: 399,
    description: 'Reliable electrical services for your home and office.',
    image: 'https://source.unsplash.com/random/300x200/?electrical',
  },
  {
    id: 4,
    name: 'Painting',
    category: 'Painting',
    minPrice: 1999,
    description: 'Transform your space with our professional painting services.',
    image: 'https://source.unsplash.com/random/300x200/?painting',
  },
  {
    id: 5,
    name: 'Carpentry',
    category: 'Carpentry',
    minPrice: 599,
    description: 'Custom carpentry solutions for your furniture and woodwork needs.',
    image: 'https://source.unsplash.com/random/300x200/?carpentry',
  },
  {
    id: 6,
    name: 'Gardening',
    category: 'Gardening',
    minPrice: 349,
    description: 'Professional gardening services to keep your outdoor space beautiful.',
    image: 'https://source.unsplash.com/random/300x200/?gardening',
  },
];

const AdminServices = () => {
  const [services, setServices] = useState(initialServices);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minPrice: '',
    description: '',
    image: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open dialog for adding new service
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      category: '',
      minPrice: '',
      description: '',
      image: ''
    });
    setOpenDialog(true);
  };

  // Open dialog for editing service
  const handleEdit = (service) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      minPrice: service.minPrice,
      description: service.description,
      image: service.image
    });
    setOpenDialog(true);
  };

  // Open confirmation dialog for deleting service
  const handleDeleteConfirm = (service) => {
    setCurrentService(service);
    setOpenDeleteDialog(true);
  };

  // Close all dialogs
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
  };

  // Save new or edited service
  const handleSave = () => {
    // Validate form
    if (!formData.name || !formData.category || !formData.minPrice || !formData.description) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    if (isEditing && currentService) {
      // Update existing service
      const updatedServices = services.map(service => 
        service.id === currentService.id ? { ...service, ...formData } : service
      );
      setServices(updatedServices);
      setSnackbar({
        open: true,
        message: 'Service updated successfully',
        severity: 'success'
      });
    } else {
      // Add new service with auto-generated ID
      const newId = Math.max(...services.map(service => service.id), 0) + 1;
      const newService = {
        id: newId,
        ...formData
      };
      setServices([...services, newService]);
      setSnackbar({
        open: true,
        message: 'Service added successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  // Delete service
  const handleDelete = () => {
    if (currentService) {
      const filteredServices = services.filter(service => service.id !== currentService.id);
      setServices(filteredServices);
      setSnackbar({
        open: true,
        message: 'Service deleted successfully',
        severity: 'success'
      });
      setOpenDeleteDialog(false);
    }
  };

  // Handle image upload (mock function - would connect to backend in real app)
  const handleImageUpload = (e) => {
    // In a real app, this would upload to a server and get a URL back
    // For now, we'll just use a placeholder
    setFormData({
      ...formData,
      image: `https://source.unsplash.com/random/300x200/?${formData.category.toLowerCase() || 'service'}`
    });
    setSnackbar({
      open: true,
      message: 'Image uploaded successfully',
      severity: 'success'
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Services Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New Service
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Min Price (₹)</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.id}</TableCell>
                <TableCell>
                  <Avatar
                    src={service.image}
                    alt={service.name}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </TableCell>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>₹{service.minPrice}</TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  <Typography noWrap>{service.description}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton color="primary" onClick={() => handleEdit(service)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteConfirm(service)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Service Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Service Name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="minPrice"
                label="Minimum Price (₹)"
                type="number"
                fullWidth
                value={formData.minPrice}
                onChange={handleInputChange}
                required
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Service Image
                  </Typography>
                  <Box
                    sx={{
                      border: '1px dashed grey',
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      mb: 2,
                      height: 150,
                      backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {!formData.image && (
                      <Typography variant="body2" color="text.secondary" align="center">
                        No image selected
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    onClick={handleImageUpload}
                  >
                    Upload Image
                    <input type="file" hidden accept="image/*" />
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SaveIcon />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the service "{currentService?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminServices;