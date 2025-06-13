# User Profile Management System

A full-stack application for user profile management with Google OAuth authentication.

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    ├── script.js
    └── styles.css
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Google Cloud Platform account for OAuth credentials

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/user-profile
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/google/callback
   FRONTEND_URL=http://localhost:3000
   ```

4. Build and run the application:
   ```bash
   npm run build
   npm start
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Open `index.html` in your browser or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Using Node.js
   npx serve
   ```

## API Routes

### Authentication Routes
- `GET /google` - Initiate Google OAuth login
- `GET /google/callback` - Google OAuth callback URL
- `GET /auth/failure` - Authentication failure handler

### Profile Routes
- `GET /api/profile` - Get user profile
  - Requires: JWT token in Authorization header
  - Response: User profile data

- `PUT /api/profile` - Update user profile
  - Requires: JWT token in Authorization header
  - Body: 
    ```json
    {
      "firstName": "string",
      "lastName": "string",
      "phoneNumber": "string",
      "pincode": "string",
      "city": "string"
    }
    ```
  - Response: Update confirmation

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials
5. Create OAuth 2.0 Client ID
6. Add authorized redirect URI: `http://localhost:5000/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/user-profile |
| JWT_SECRET | Secret key for JWT tokens | your-secret-key |
| GOOGLE_CLIENT_ID | Google OAuth client ID | your-client-id.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | your-client-secret |
| GOOGLE_CALLBACK_URL | OAuth callback URL | http://localhost:5000/google/callback |
| FRONTEND_URL | Frontend application URL | http://localhost:3000 |

## Development

### Backend Development
```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development
The frontend is a static application. You can modify the files directly:
- `index.html` - Main HTML structure
- `styles.css` - Styling
- `script.js` - Frontend logic

## Security Considerations

1. Never commit `.env` file to version control
2. Use strong JWT secret
3. Keep Google OAuth credentials secure
4. Implement rate limiting in production
5. Use HTTPS in production

## Error Handling

The application includes error handling for:
- Authentication failures
- Invalid tokens
- Database errors
- Network issues
- Invalid requests

