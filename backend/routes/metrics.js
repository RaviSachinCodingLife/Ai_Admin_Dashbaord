import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Metric from '../models/Metric.js';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default (io) => {
  const router = express.Router();

  router.get('/', protect(), async (req, res) => {
    const metrics = await Metric.find();
    res.json(metrics);
  });

  // Add metric
  router.post('/', protect(['admin', 'manager']), async (req, res) => {
    try {
      const metric = new Metric(req.body);
      await metric.save();

      // ✅ Emit new metric event
      io.emit('metric:new', metric);

      res.json(metric);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete metric
  router.delete('/:id', protect(['admin', 'manager']), async (req, res) => {
    await Metric.findByIdAndDelete(req.params.id);
    io.emit('metric:delete', req.params.id);
    res.json({ success: true });
  });

  // AI explain
  router.post('/explain', protect(), async (req, res) => {
    try {
      const { metricName, value } = req.body;
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `Explain ${metricName} with value ${value}` }],
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
