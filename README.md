# Social Media Services Marketplace

A comprehensive digital services marketplace for social media engagement and gift cards, offering seamless order management across multiple platforms.

## Features

- Browse services by category (TikTok, YouTube, Instagram, Facebook, Twitter, etc.)
- Order social media services (followers, likes, views, etc.)
- Process payments through multiple payment methods (Telebirr, Bank Transfer, etc.)
- Admin dashboard for order management
- Responsive design for mobile and desktop

## Technology Stack

- Frontend: React.js, TypeScript, Tailwind CSS, shadcn/ui components
- Backend: Express.js, PostgreSQL database (optional)
- State Management: TanStack Query
- Routing: Wouter
- Form Handling: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=your_postgresql_connection_string (optional)
```

## Deployment

See the [DEPLOYMENT.md](./DEPLOYMENT.md) file for detailed deployment instructions.

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/pages` - Application pages
  - `/src/lib` - Utility functions
- `/server` - Backend Express.js API
  - `/routes.ts` - API endpoints
  - `/storage.ts` - Data storage interface
  - `/database-storage.ts` - Database implementation
- `/shared` - Shared code between frontend and backend
  - `/schema.ts` - Database schema and types

## Admin Access

Access the admin panel at `/admin` with the following credentials:
- Username: admin
- Password: admin123

## License

This project is licensed under the MIT License.#   m i k e r m a  
 