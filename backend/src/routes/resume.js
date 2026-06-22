import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { analyzeResume, extractResume } from '../controllers/resumeController.js';

const router = express.Router();

// POST /api/resumes/upload - Upload and analyze a resume
// Protected route - requires authentication
router.post(
  '/upload',
  authenticate,
  upload.single('resume'),
  (req, res, next) => {
    console.log('Request body:', req.body);
    next();
  },
  analyzeResume
);

// POST /api/resumes/extract - Extract structured data from resume
router.post(
  '/extract',
  authenticate,
  upload.single('resume'),
  extractResume
);

// GET /api/resumes/history - Get user's analysis history
router.get('/history', authenticate, (req, res) => {
  // TODO: Implement history retrieval
  res.json({ message: 'History endpoint - to be implemented' });
});

// GET /api/resumes/:id - Get specific analysis
router.get('/:id', authenticate, (req, res) => {
  // TODO: Implement get by ID
  res.json({ message: 'Get analysis endpoint - to be implemented' });
});

export default router;