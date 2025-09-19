import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import metricsRoutes from './routes/metrics.js';
import reportsRoutes from './routes/reports.js';
import usersRoutes from './routes/users.js';
import notificationsRoutes from './routes/notifications.js';

const app = express();
const server = http.createServer(app);

// ✅ Setup socket.io
const io = new Server(server, {
  cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
});

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes(io)); // pass io
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/notifications', notificationsRoutes(io)); // pass io

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('🚀 Server running on', PORT));

// ✅ Socket.io events
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});
