import express from 'express';
import cors from 'cors';
import passport from 'passport';
import mongoose from 'mongoose';
import './config/passport';
import userRoutes from './routes/user.routes';
import { runProfileWorker } from './temporal/workers/profile.worker';

const app = express();

//change urls as per your requirement
const allowedOrigins: string[] = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000'
];

// Setup CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(passport.initialize());

// Mount all routes at root level first
app.use('/', userRoutes);

// Mount API routes with /api prefix
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    runProfileWorker();
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
