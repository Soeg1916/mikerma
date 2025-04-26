# Deployment Guide

This application is configured for deployment on Vercel with a PostgreSQL database connection.

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: Set to `production` for deployment

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. Configure the environment variables
3. Deploy using the following command:
```
vercel --prod
```

## Vercel Configuration

The application uses a serverless approach with the following files:

- `vercel.json`: Configures routing, build settings, and serverless function options
- `api/index.js`: The serverless function entry point for API routes
- `.vercel/project.json`: Additional project configuration

## Database

The application uses a PostgreSQL database (via Neon or any other provider). Make sure to:

1. Create a PostgreSQL database
2. Run the seeding script to initialize the database schema and data
3. Set the `DATABASE_URL` environment variable in Vercel

## Common Issues and Solutions

- If API routes aren't working, check that the `/api` route is correctly forwarded to the serverless function
- If you see CORS errors, check that the frontend URL is allowed in the API cors configuration
- For database connection issues, verify that the `DATABASE_URL` is correctly set and accessible from Vercel's servers

## Other Notes

- The default admin credentials are: username `admin` with password `admin123`
- The application frontend is built using Vite and the backend with Express
- All static assets are served from the `/dist` directory