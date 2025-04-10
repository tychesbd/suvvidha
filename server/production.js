// Production server configuration
const path = require('path');
const express = require('express');

/**
 * Configure Express to serve static files in production
 * @param {express.Application} app - Express application instance
 */
const configureForProduction = (app) => {
  // Serve static files from the React app build directory
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle any requests that don't match the API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  console.log('Server configured for production mode');
};

module.exports = configureForProduction;