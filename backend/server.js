import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Routes
import metricsRoutes from './routes/metrics.js';
app.use('/api/metrics', metricsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on', PORT));
