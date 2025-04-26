# Deploying to Render

Follow these steps to deploy your application to Render:

## Prerequisites
- A Render account (free tier is fine)
- Your application code on GitHub (or you can deploy directly from your computer)

## Steps to Deploy

### 1. Sign up or log in to Render
Go to [render.com](https://render.com) and create an account or log in.

### 2. Create a new Web Service
- Click on "New +" and select "Web Service"
- Connect your repository or deploy from your local files
- Give your web service a name (e.g., "miker-marketplace")

### 3. Configure your Web Service
Set the following configuration options:
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node server.js`
- **Plan**: Free

### 4. Add Environment Variables
Add the following environment variables:
- `NODE_ENV`: `production`
- `DATABASE_URL`: `postgresql://neondb_owner:npg_IDJ0VO7ixTmk@ep-wispy-butterfly-a4h05ebr-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`

### 5. Deploy
Click "Create Web Service" to start the deployment process.

## Troubleshooting
If you encounter any issues:
- Check the deployment logs in the Render dashboard
- Make sure all environment variables are correctly set
- Verify that the database connection string is correct
- Check that the `server.js` file is at the root of your project

## Notes
- The application uses a custom server.js file to handle production deployments
- The Render configuration handles serving both the API endpoints and the frontend
- You can view logs and monitor your application from the Render dashboard

Your application should be live at `https://[your-service-name].onrender.com` within a few minutes after deployment completes.