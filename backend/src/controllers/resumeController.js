import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

/**
 * Analyze a resume
 * 1. Receive uploaded file
 * 2. Forward to AI service for text extraction + analysis
 * 3. Return results to frontend
 */
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobDescription = req.body.jobDescription || req.body.job_description;

    console.log(`Processing resume for user: ${req.user.uid}`);
    console.log(`File: ${req.file.originalname}, Size: ${req.file.size}bytes`);
    console.log(`Job description: ${jobDescription ? 'provided' : 'none'}`);

    const formData = new FormData();
    formData.append('resume', new Blob([req.file.buffer], {
      type: req.file.mimetype
    }), req.file.originalname);

    if (jobDescription) {
      formData.append('job_description', jobDescription);
    }

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/analyze`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      }
    );

    res.json({
      success: true,
      data: response.data,
      metadata: {
        filename: req.file.originalname,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Analysis error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.error || 'AI service error'
      });
    }

    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

/**
 * Extract structured information from resume
 * Returns skills, education, experience, projects
 */
export const extractResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(`Extracting from resume for user: ${req.user.uid}`);

    const formData = new FormData();
    formData.append('resume', new Blob([req.file.buffer], {
      type: req.file.mimetype
    }), req.file.originalname);

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/extract`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      }
    );

    res.json({
      success: true,
      data: response.data,
      metadata: {
        filename: req.file.originalname,
        extractedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Extraction error:', error.message);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.error || 'AI service error'
      });
    }

    res.status(500).json({ error: 'Failed to extract resume data' });
  }
};