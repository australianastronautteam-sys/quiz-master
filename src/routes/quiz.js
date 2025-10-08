import express from 'express';
import upload from '../middleware/upload.js';
import { parsePDF, validateText } from '../services/parser.js';
import { generateQuizFromText, testGeminiConnection } from '../services/gemini.js';

const router = express.Router();

// Generate quiz from PDF file
router.post('/generate', upload.single('file'), async (req, res) => {
  console.log('\n🚀 Starting PDF quiz generation...');
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        success: false, 
        error: 'No PDF file uploaded' 
      });
    }

    console.log('📋 Upload details:');
    console.log('  - Original name:', req.file.originalname);
    console.log('  - Saved filename:', req.file.filename);
    console.log('  - File path:', req.file.path);
    console.log('  - File size:', req.file.size, 'bytes');
    console.log('  - MIME type:', req.file.mimetype);
    
    // Verify file exists immediately after upload
    const fs = await import('fs');
    const fileExists = fs.default.existsSync(req.file.path);
    console.log('  - File exists check:', fileExists);
    
    if (!fileExists) {
      console.error('❌ File not found immediately after upload!');
      return res.status(500).json({
        success: false,
        error: `Uploaded file not found at: ${req.file.path}`
      });
    }

    console.log('🔄 Processing PDF...');
    const startTime = Date.now();
    
    const text = await parsePDF(req.file.path);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ PDF processed in ${processingTime}ms`);
    console.log('📝 Extracted text length:', text.length);
    console.log('🔤 First 100 characters:', text.substring(0, 100) + '...');
    
    const numberOfQuestions = parseInt(req.body.questions) || 5;
    console.log('🎯 Generating', numberOfQuestions, 'questions...');
    
    const quiz = await generateQuizFromText(text, numberOfQuestions);
    console.log('✅ Quiz generated successfully with', quiz.length, 'questions');
    
    res.json({ 
      success: true, 
      quiz,
      metadata: {
        filename: req.file.originalname,
        textLength: text.length,
        questionsGenerated: quiz.length,
        processingTime: processingTime
      }
    });
    
  } catch (error) {
    console.error('\n❌ PDF Quiz Generation Error:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    if (req.file) {
      console.error('File info at error:');
      console.error('  - Path:', req.file.path);
      console.error('  - Original name:', req.file.originalname);
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        fileInfo: req.file
      } : undefined
    });
  }
});

// Generate quiz from raw text
router.post('/text', async (req, res) => {
  try {
    const { text, questions } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: 'Text is required' 
      });
    }

    const validatedText = validateText(text);
    const numberOfQuestions = parseInt(questions) || 5;
    
    console.log('Processing text, length:', validatedText.length);
    
    const quiz = await generateQuizFromText(validatedText, numberOfQuestions);
    
    res.json({ 
      success: true, 
      quiz,
      metadata: {
        textLength: validatedText.length,
        questionsGenerated: quiz.length
      }
    });
  } catch (error) {
    console.error('Text Quiz Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    const isConnected = await testGeminiConnection();
    res.json({ 
      success: true, 
      message: 'Quiz API is working!',
      gemini_status: isConnected ? 'Connected' : 'Not Connected',
      endpoints: {
        'POST /api/quiz/generate': 'Upload PDF file',
        'POST /api/quiz/text': 'Send text directly'
      }
    });
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Quiz API loaded but Gemini connection failed',
      error: error.message,
      endpoints: {
        'POST /api/quiz/generate': 'Upload PDF file',
        'POST /api/quiz/text': 'Send text directly'
      }
    });
  }
});

export default router;