import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set in environment variables');
  console.log('Please check your .env file and make sure it contains:');
  console.log('GEMINI_API_KEY=your_gemini_api_key_here');
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuizFromText(text, numberOfQuestions = 5) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text is required to generate quiz');
    }

    // Use Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Create exactly ${numberOfQuestions} multiple choice questions based on the following text. 
Each question must have exactly 4 options (A, B, C, D) with only one correct answer.

Text to analyze: "${text}"

IMPORTANT: Return ONLY a valid JSON array with NO additional text, markdown, or explanations.

Required JSON format:
[
  {
    "question": "Your question here?",
    "options": {
      "A": "First option",
      "B": "Second option", 
      "C": "Third option",
      "D": "Fourth option"
    },
    "correct_answer": "A"
  }
]

Rules:
- Questions must be clear and specific to the provided text
- All 4 options must be plausible but only one correct
- correct_answer must be exactly "A", "B", "C", or "D"
- Return valid JSON only, no markdown code blocks
- Generate exactly ${numberOfQuestions} questions
`;

    console.log(`🤖 Generating ${numberOfQuestions} questions with Gemini...`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text().trim();

    console.log('📝 Raw Gemini response length:', content.length);

    // Clean up the response to ensure it's valid JSON
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/, '').replace(/\n?```$/, '');
    }
    if (content.startsWith('```')) {
      content = content.replace(/```\n?/, '').replace(/\n?```$/, '');
    }
    
    // Remove any potential markdown formatting
    content = content.replace(/^\s*```.*?\n/, '').replace(/\n```\s*$/, '');
    
    let quiz;
    try {
      quiz = JSON.parse(content);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError.message);
      console.error('📄 Content that failed to parse:', content.substring(0, 500));
      throw new Error('Failed to parse quiz JSON. The AI response was not properly formatted.');
    }
    
    if (!Array.isArray(quiz)) {
      throw new Error('Generated quiz is not in the expected array format');
    }

    if (quiz.length === 0) {
      throw new Error('No questions were generated');
    }

    // Validate quiz structure
    quiz.forEach((q, index) => {
      if (!q.question || !q.options || !q.correct_answer) {
        throw new Error(`Question ${index + 1} is missing required fields (question, options, or correct_answer)`);
      }
      
      if (typeof q.options !== 'object' || !q.options.A || !q.options.B || !q.options.C || !q.options.D) {
        throw new Error(`Question ${index + 1} does not have all required options (A, B, C, D)`);
      }
      
      if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
        throw new Error(`Question ${index + 1} has invalid correct_answer: ${q.correct_answer}. Must be A, B, C, or D.`);
      }
    });

    console.log(`✅ Successfully generated ${quiz.length} questions using Gemini`);
    return quiz;

  } catch (error) {
    console.error('🚨 Gemini API Error:', error);
    
    if (error.message.includes('API_KEY')) {
      throw new Error('Invalid Gemini API key. Please check your API key configuration.');
    }
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      throw new Error('Gemini API quota exceeded or rate limited. Please try again later.');
    }
    
    if (error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error('Failed to generate properly formatted quiz. Please try again with different text.');
    }

    if (error.message.includes('SAFETY')) {
      throw new Error('Content was blocked by safety filters. Please try with different text.');
    }
    
    throw new Error(`Quiz generation failed: ${error.message}`);
  }
}

// Test function to verify API connectivity
export async function testGeminiConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello");
    const response = await result.response;
    console.log('✅ Gemini API connection successful');
    return true;
  } catch (error) {
    console.error('❌ Gemini API connection failed:', error.message);
    return false;
  }
}
