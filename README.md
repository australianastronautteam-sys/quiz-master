# 🧠 AI Quiz Generator

An intelligent quiz generator that creates multiple choice questions from PDF documents or text input using Google Gemini AI.

## 🚀 Features

- **PDF Upload**: Extract text from PDF files and generate quizzes
- **Text Input**: Generate quizzes from raw text input
- **Customizable**: Specify number of questions to generate
- **Smart Validation**: Input validation and error handling
- **JSON Output**: Clean, structured quiz data
- **File Cleanup**: Automatic cleanup of uploaded files

## 📦 Tech Stack

- **Backend**: Node.js with Express.js
- **AI**: Google Gemini 1.5 Flash API
- **File Processing**: Multer + pdf-parse
- **Environment**: dotenv for configuration

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/australianastronautteam-sys/quiz-master.git
cd quiz-master
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3008
```

4. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:3008`

## 🔧 API Endpoints

### Health Check
```http
GET /health
```

### Test Quiz API
```http
GET /api/quiz/test
```

### Generate Quiz from PDF
```http
POST /api/quiz/generate
Content-Type: multipart/form-data

{
  "file": "your-pdf-file.pdf",
  "questions": 5  // optional, defaults to 5
}
```

### Generate Quiz from Text
```http
POST /api/quiz/text
Content-Type: application/json

{
  "text": "Your text content here...",
  "questions": 5  // optional, defaults to 5
}
```

## 📝 Example Response

```json
{
  "success": true,
  "quiz": [
    {
      "question": "What is the main function of photosynthesis?",
      "options": {
        "A": "To produce oxygen for animals",
        "B": "To convert light energy into chemical energy",
        "C": "To absorb carbon dioxide from air",
        "D": "To create chlorophyll in plants"
      },
      "correct_answer": "B"
    }
  ],
  "metadata": {
    "textLength": 1250,
    "questionsGenerated": 5
  }
}
```

## 🧪 Testing the API

### Using curl:

**Test endpoint:**
```bash
curl http://localhost:3008/api/quiz/test
```

**Generate from text:**
```bash
curl -X POST http://localhost:3008/api/quiz/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Photosynthesis is the process by which plants convert sunlight into energy. It occurs in chloroplasts and involves two main stages: light-dependent reactions and the Calvin cycle. During photosynthesis, plants absorb carbon dioxide from the air and water from the soil, using sunlight to convert these into glucose and oxygen.", "questions": 3}'
```

**Generate from PDF:**
```bash
curl -X POST http://localhost:3008/api/quiz/generate \
  -F "file=@sample.pdf" \
  -F "questions=3"
```

## 🛠️ Troubleshooting

### Common Issues:

1. **"GEMINI_API_KEY is not set"**
   - Make sure your `.env` file contains a valid Gemini API key
   - Restart the server after adding the key

2. **"No text content found in PDF"**
   - Ensure the PDF contains selectable text (not just images)
   - Try with a different PDF file

3. **"Text must be at least 50 characters long"**
   - Provide more substantial text content for better question generation

4. **Port already in use**
   - Change the PORT in your `.env` file or kill the process using port 3008

5. **"Content was blocked by safety filters"**
   - Try with different, more neutral text content
   - Gemini has built-in safety filters for harmful content

## 📋 TODO

- [ ] Add frontend interface
- [ ] Support for multiple file formats (DOCX, TXT)
- [ ] Question difficulty levels
- [ ] Export quizzes to PDF/CSV
- [ ] User authentication
- [ ] Question categorization
- [ ] Batch processing for multiple files

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Made with ❤️ by Antony Raja A**
