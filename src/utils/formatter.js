// Utility functions for formatting quiz data

export function formatQuizForDisplay(quiz) {
  return quiz.map((question, index) => ({
    id: index + 1,
    question: question.question,
    options: question.options,
    correctAnswer: question.correct_answer
  }));
}

export function formatQuizForExport(quiz, format = 'json') {
  switch (format) {
    case 'csv':
      // Convert to CSV format
      let csv = 'Question,Option A,Option B,Option C,Option D,Correct Answer\n';
      quiz.forEach(q => {
        csv += `"${q.question}","${q.options.A}","${q.options.B}","${q.options.C}","${q.options.D}","${q.correct_answer}"\n`;
      });
      return csv;
    
    case 'txt':
      // Convert to plain text format
      let txt = '';
      quiz.forEach((q, index) => {
        txt += `${index + 1}. ${q.question}\n`;
        txt += `   A) ${q.options.A}\n`;
        txt += `   B) ${q.options.B}\n`;
        txt += `   C) ${q.options.C}\n`;
        txt += `   D) ${q.options.D}\n`;
        txt += `   Answer: ${q.correct_answer}\n\n`;
      });
      return txt;
    
    default:
      return JSON.stringify(quiz, null, 2);
  }
}
