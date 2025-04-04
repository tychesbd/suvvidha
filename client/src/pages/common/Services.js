import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Card, CardContent, CardMedia, CardActionArea, Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getServices } from '../../features/services/serviceSlice';

// Fallback services in case API fails
const fallbackServices = [
  {
    id: 1,
    title: 'Home Cleaning',
    description: 'Professional home cleaning services for a spotless living space.',
    image: 'https://source.unsplash.com/random/300x200/?cleaning',
  },
  {
    id: 2,
    title: 'Plumbing',
    description: 'Expert plumbing services for all your repair and installation needs.',
    image: 'https://source.unsplash.com/random/300x200/?plumbing',
  },
  {
    id: 3,
    title: 'Electrical Work',
    description: 'Reliable electrical services for your home and office.',
    image: 'https://source.unsplash.com/random/300x200/?electrical',
  },
  {
    id: 4,
    title: 'Painting',
    description: 'Transform your space with our professional painting services.',
    image: 'https://source.unsplash.com/random/300x200/?painting',
  },
  {
    id: 5,
    title: 'Carpentry',
    description: 'Custom carpentry solutions for your furniture and woodwork needs.',
    image: 'https://source.unsplash.com/random/300x200/?carpentry',
  },
  {
    id: 6,
    title: 'Gardening',
    description: 'Professional gardening services to keep your outdoor space beautiful.',
    image: 'https://source.unsplash.com/random/300x200/?gardening',
  },
];

const Services = () => {
  const dispatch = useDispatch();
  const { services: apiServices, isLoading, isError } = useSelector((state) => state.services);
  const [services, setServices] = useState([]);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (apiServices && apiServices.length > 0) {
      setServices(apiServices);
    } else if (isError) {
      setServices(fallbackServices);
    }
  }, [apiServices, isError]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Our Services
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover the wide range of services we offer to make your life easier
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
              }}
              elevation={2}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="140"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {service.title || service.name}
                  </Typography>
                  <Typography>
                    {service.description}
                  </Typography>
                  {service.minPrice && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Starting from ₹{service.minPrice}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Need a Custom Service?
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Contact us to discuss your specific requirements and get a personalized solution.
        </Typography>
      </Box>
    </Container>
  );
};

export default Services;