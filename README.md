# Suvvidha - MERN Stack Application

## Deployment Guide for Render

This guide will help you deploy the Suvvidha application on Render's free tier.

### Prerequisites

1. A [Render](https://render.com/) account
2. A MongoDB database (you can use MongoDB Atlas free tier)

### Deployment Steps

#### 1. Set up MongoDB Atlas (if not already done)

- Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Set up a database user with password
- Whitelist all IP addresses (0.0.0.0/0) for simplicity (you can restrict this later)
- Get your MongoDB connection string

#### 2. Deploy to Render

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository or use the public GitHub URL
4. Configure the following settings:
   - **Name**: suvvidha (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run install-client && cd client && npm run build`
   - **Start Command**: `npm start`

5. Add the following environment variables:
   - `NODE_ENV`: production
   - `PORT`: 10000 (Render will automatically assign a port, but this is used internally)
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string for JWT token generation

6. Click "Create Web Service"

### Important Notes

- The application is configured to serve the React frontend from the server in production mode
- The `render.yaml` file in the repository can be used for automatic deployments
- Free tier on Render has some limitations:
  - The service will spin down after 15 minutes of inactivity
  - Limited bandwidth and compute hours per month

### Troubleshooting

If you encounter issues during deployment:

1. Check the Render logs for any error messages
2. Verify that all environment variables are correctly set
3. Ensure your MongoDB connection string is correct and the database is accessible

#### Memory Issues During Build

If you see errors like `npm install` being killed during the build process, this is likely due to memory limitations on Render's free tier. The application has been configured to handle this by:

- Setting `NODE_OPTIONS="--max_old_space_size=512"` to limit Node.js memory usage
- Using `npm ci` instead of `npm install` for more efficient installation
- Splitting the build process into smaller steps
- Pruning development dependencies after build

If you still encounter memory issues:

1. Consider upgrading to a paid Render tier with more resources
2. Try deploying the frontend and backend as separate services
3. Reduce the size of your node_modules by removing unnecessary dependencies

### Local Development

To run the application locally:

```bash
# Install dependencies for server and client
npm install

# Run both server and client (development mode)
npm run dev
```

The server will run on http://localhost:5000 and the client on http://localhost:3000.