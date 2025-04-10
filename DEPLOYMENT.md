# Deployment Guide for Suvvidha Application

## Deploying to Render

This guide will walk you through deploying your Suvvidha application to Render and connecting it with your GoDaddy domain.

### Prerequisites

1. A Render account (sign up at https://render.com if you don't have one)
2. Your GoDaddy domain and access to its DNS settings
3. Your application code pushed to a Git repository (GitHub, GitLab, etc.)

### Step 1: Prepare Your Application

Your application has been prepared for deployment with the necessary configuration files:

- `render.yaml` - Defines the services to be deployed on Render
- `server/production.js` - Configures the server to serve the React frontend in production

### Step 2: Deploy to Render

1. Log in to your Render account
2. Click on "New" and select "Blueprint" from the dropdown menu
3. Connect your Git repository where your application code is hosted
4. Render will detect the `render.yaml` file and suggest services to deploy
5. Configure the environment variables:
   - `MONGO_URI`: Your MongoDB connection string (use MongoDB Atlas for production)
   - `JWT_SECRET`: A secure random string for JWT token generation
6. Click "Apply" to start the deployment

### Step 3: Connect Your GoDaddy Domain

1. Once your services are deployed, Render will provide URLs for each service
2. In your Render dashboard, go to your web service
3. Navigate to the "Settings" tab and scroll down to "Custom Domain"
4. Click "Add Custom Domain" and enter your domain (e.g., yourdomain.com)
5. Render will provide DNS records that you need to add to your GoDaddy account

### Step 4: Configure DNS in GoDaddy

1. Log in to your GoDaddy account
2. Navigate to your domain's DNS management page
3. Add the DNS records provided by Render:
   - For the root domain (@), add an A record pointing to Render's IP address
   - For the www subdomain, add a CNAME record pointing to your Render service URL

   Example:
   ```
   Type    Name    Value                           TTL
   A       @       76.76.21.21                     600
   CNAME   www     yourapplication.onrender.com    600
   ```

4. Save your changes

### Step 5: Verify the Connection

1. DNS changes can take up to 48 hours to propagate, but often happen within a few hours
2. Once propagated, your application will be accessible via your custom domain
3. Test both the root domain (yourdomain.com) and www subdomain (www.yourdomain.com)

### Troubleshooting

- If your domain isn't connecting, verify your DNS settings in GoDaddy
- Check Render's logs for any deployment issues
- Ensure your environment variables are correctly set in Render

## Maintaining Your Deployment

- Render automatically deploys when you push changes to your repository
- Monitor your application's performance in the Render dashboard
- Set up alerts for any issues with your deployment

For more detailed information, refer to Render's documentation at https://render.com/docs