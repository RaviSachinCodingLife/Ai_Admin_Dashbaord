import express from 'express';
import { getMetrics, explainMetric } from '../controllers/metricsController.js';

const router = express.Router();

router.get('/', getMetrics);
router.post('/explain', explainMetric);

export default router;
