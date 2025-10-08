/**
 * Formats quiz data for display, adding an ID to each question.
 * @param {Array} quiz - Array of quiz questions.
 * @returns {Array} Formatted quiz with IDs.
 */
export function formatQuizForDisplay(quiz) {
  if (!Array.isArray(quiz)) {
    throw new Error("Quiz data must be an array.");
  }
  return quiz.map((question, index) => ({
    id: index + 1,
    question: question.question,
    options: question.options,
    correctAnswer: question.correct_answer
  }));
}

/**
 * Formats quiz data for export in JSON, CSV, or plain text.
 * @param {Array} quiz - Array of quiz questions.
 * @param {string} format - Export format: 'json', 'csv', or 'txt'.
 * @param {string} delimiter - Delimiter for CSV (default: ',').
 * @returns {string} Formatted quiz data.
 */
export function formatQuizForExport(quiz, format = 'json', delimiter = ',') {
  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new Error("Quiz data must be a non-empty array.");
  }

  const validFormats = ['json', 'csv', 'txt'];
  if (!validFormats.includes(format)) {
    throw new Error(`Unsupported format: ${format}. Use one of: ${validFormats.join(', ')}`);
  }

  switch (format) {
    case 'csv': {
      const optionKeys = Object.keys(quiz[0].options);
      let csv = 'Question' + delimiter + optionKeys.map(opt => `Option ${opt}`).join(delimiter) + delimiter + 'Correct Answer\n';
      quiz.forEach(q => {
        const options = optionKeys.map(key => `"${q.options[key]}"`).join(delimiter);
        csv += `"${q.question}"${delimiter}${options}${delimiter}"${q.correct_answer}"\n`;
      });
      return csv;
    }

    case 'txt': {
      let txt = '';
      quiz.forEach((q, index) => {
        txt += `${index + 1}. ${q.question}\n`;
        Object.entries(q.options).forEach(([key, value]) => {
          txt += `   ${key}) ${value}\n`;
        });
        txt += `   Answer: ${q.correct_answer}\n\n`;
      });
      return txt;
    }

    default: // 'json'
      return JSON.stringify(quiz, null, 2);
  }
}
