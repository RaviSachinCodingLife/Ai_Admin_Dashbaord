// routes/metrics.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Metric from '../models/Metric.js';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default (io) => {
  const router = express.Router();

  // Get metrics
  router.get('/', protect(), async (req, res) => {
    const metrics = await Metric.find();
    res.json(metrics);
  });

  // Add metric
  router.post('/', protect(['admin', 'manager']), async (req, res) => {
    try {
      const metric = new Metric(req.body);
      await metric.save();

      // ✅ Emit update to all connected clients
      io.emit('metric:new', metric);

      res.json(metric);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI explanation
  router.post('/explain', protect(), async (req, res) => {
    try {
      const { metricName, value } = req.body;
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Explain what ${metricName} with value ${value} means in a business context.`,
          },
        ],
      });

      res.json({ explanation: response.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI prediction
  router.post('/predict', protect(), async (req, res) => {
    try {
      const metrics = await Metric.find();
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Based on these metrics: ${JSON.stringify(
              metrics
            )}, predict the trend for next month.`,
          },
        ],
      });

      res.json({ prediction: response.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
