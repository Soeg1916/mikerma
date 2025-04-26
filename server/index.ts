import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Setup routes and error handler
let server: any;

const setup = async () => {
  if (!server) {
    server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      console.error(err);
    });

    // Setup based on environment
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      // In production (Vercel), serve static files
      serveStatic(app);
      
      // Add a catch-all route for SPA
      app.get('*', (req, res) => {
        // Don't handle API routes with the catch-all
        if (req.path.startsWith('/api/')) return;
        
        // Send the main index.html for client-side routing
        res.sendFile('index.html', { root: './dist' });
      });
    }
  }
  return { app, server };
};

// For local development
if (process.env.NODE_ENV === 'development') {
  setup().then(({ server }) => {
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  });
} else {
  // In production, just set up the app for Vercel serverless
  setup();
}

// Export for Vercel serverless deployment
export default app;
