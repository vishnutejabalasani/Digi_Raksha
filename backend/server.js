import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/game.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/digiraksha';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Digi Raksha Express MERN Backend is live!' });
});

// Connect to MongoDB & Start Server
const startServer = async () => {
  try {
    console.log('[MERN Backend] Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[MERN Backend] Local MongoDB Connected Successfully!');
  } catch (err) {
    console.warn('[MERN Backend] Local MongoDB not detected. Starting in-memory MongoDB server for instant zero-config execution...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('[MERN Backend] In-Memory MongoDB Connected Successfully!');
    } catch (memErr) {
      console.error('[MERN Backend] In-Memory MongoDB error:', memErr);
    }
  }

  app.listen(PORT, () => {
    console.log(`[MERN Backend] Express Server running on http://localhost:${PORT}`);
  });
};

startServer();
