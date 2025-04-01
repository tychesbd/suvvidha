import React from 'react';
import { Typography, Container, Box, Grid, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  padding: theme.spacing(8, 0, 6),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const Home = () => {
  return (
    <Container maxWidth="lg">
      <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Suvvidha
          </Typography>
          <Typography variant="h5" paragraph>
            Your one-stop solution for all your service needs
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Explore Services
          </Button>
        </Container>
      </HeroSection>

      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        Why Choose Us?
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {[
          {
            title: 'Quality Service',
            description: 'We provide top-notch services with guaranteed customer satisfaction.',
          },
          {
            title: 'Expert Professionals',
            description: 'Our team consists of skilled and experienced professionals.',
          },
          {
            title: '24/7 Support',
            description: 'We offer round-the-clock customer support for all your queries.',
          },
        ].map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard elevation={2}>
              <Typography variant="h5" component="h3" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" paragraph>
          Join thousands of satisfied customers today.
        </Typography>
        <Button variant="contained" color="primary" size="large">
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;