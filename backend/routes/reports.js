import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Metric from '../models/Metric.js';
import { createObjectCsvStringifier } from 'csv-writer';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Export CSV
router.get('/csv', protect(['admin', 'manager']), async (req, res) => {
  try {
    const metrics = await Metric.find();
    const csvWriter = createObjectCsvStringifier({
      header: [
        { id: 'name', title: 'Metric' },
        { id: 'value', title: 'Value' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    const csv = csvWriter.getHeaderString() + csvWriter.stringifyRecords(metrics);
    res.header('Content-Type', 'text/csv');
    res.attachment('metrics.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export PDF
router.get('/pdf', protect(['admin', 'manager']), async (req, res) => {
  try {
    const metrics = await Metric.find();
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=metrics.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('📊 Metrics Report', { align: 'center' });
    doc.moveDown();

    metrics.forEach((m) => {
      doc.fontSize(14).text(`${m.name}: ${m.value} (Updated: ${m.updatedAt.toDateString()})`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
