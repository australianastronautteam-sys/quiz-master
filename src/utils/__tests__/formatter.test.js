import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatQuizForDisplay, formatQuizForExport } from '../formatter.js';

describe('formatQuizForDisplay', () => {
  describe('Happy Path', () => {
    it('should format a single quiz question with all required fields', () => {
      const quiz = [
        {
          question: 'What is the capital of France?',
          options: {
            A: 'London',
            B: 'Berlin',
            C: 'Paris',
            D: 'Madrid'
          },
          correct_answer: 'C'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result.length, 1);
      assert.equal(result[0].id, 1);
      assert.equal(result[0].question, 'What is the capital of France?');
      assert.deepEqual(result[0].options, quiz[0].options);
      assert.equal(result[0].correctAnswer, 'C');
    });

    it('should format multiple quiz questions with sequential IDs', () => {
      const quiz = [
        {
          question: 'Question 1?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 'A'
        },
        {
          question: 'Question 2?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 'B'
        },
        {
          question: 'Question 3?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 'C'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result.length, 3);
      assert.equal(result[0].id, 1);
      assert.equal(result[1].id, 2);
      assert.equal(result[2].id, 3);
      result.forEach((item, index) => {
        assert.equal(item.question, quiz[index].question);
        assert.deepEqual(item.options, quiz[index].options);
        assert.equal(item.correctAnswer, quiz[index].correct_answer);
      });
    });

    it('should handle empty array', () => {
      const quiz = [];
      const result = formatQuizForDisplay(quiz);
      assert.deepEqual(result, []);
    });

    it('should handle quiz with special characters in questions', () => {
      const quiz = [
        {
          question: 'What is "JavaScript"\'s purpose?',
          options: {
            A: 'Web & mobile',
            B: 'Server-side',
            C: 'Both A & B',
            D: 'None'
          },
          correct_answer: 'C'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].question, 'What is "JavaScript"\'s purpose?');
      assert.equal(result[0].options.C, 'Both A & B');
    });

    it('should handle quiz with unicode characters', () => {
      const quiz = [
        {
          question: '¿Cuál es la capital de España?',
          options: {
            A: 'Barcelona',
            B: 'Madrid',
            C: 'Valencia',
            D: 'Sevilla'
          },
          correct_answer: 'B'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].question, '¿Cuál es la capital de España?');
      assert.equal(result[0].correctAnswer, 'B');
    });

    it('should preserve option structure with varying keys', () => {
      const quiz = [
        {
          question: 'Test question?',
          options: {
            A: 'Option A',
            B: 'Option B',
            C: 'Option C'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.deepEqual(result[0].options, {
        A: 'Option A',
        B: 'Option B',
        C: 'Option C'
      });
    });

    it('should handle quiz with long questions and answers', () => {
      const longQuestion = 'This is a very long question that contains multiple clauses and goes on for quite some time to test how the formatter handles lengthy text content in questions. '.repeat(3);
      const longOption = 'This is a very long answer option that also contains extensive text to ensure proper handling of lengthy content.'.repeat(2);

      const quiz = [
        {
          question: longQuestion,
          options: {
            A: longOption,
            B: 'Short option',
            C: 'Another short',
            D: 'Final option'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].question, longQuestion);
      assert.equal(result[0].options.A, longOption);
    });

    it('should handle numeric correct_answer values', () => {
      const quiz = [
        {
          question: 'Test?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 1
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].correctAnswer, 1);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when quiz is not an array', () => {
      assert.throws(
        () => formatQuizForDisplay('not an array'),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });

    it('should throw error when quiz is null', () => {
      assert.throws(
        () => formatQuizForDisplay(null),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });

    it('should throw error when quiz is undefined', () => {
      assert.throws(
        () => formatQuizForDisplay(undefined),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });

    it('should throw error when quiz is a number', () => {
      assert.throws(
        () => formatQuizForDisplay(42),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });

    it('should throw error when quiz is an object', () => {
      assert.throws(
        () => formatQuizForDisplay({ question: 'test' }),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });

    it('should throw error when quiz is a boolean', () => {
      assert.throws(
        () => formatQuizForDisplay(true),
        {
          name: 'Error',
          message: 'Quiz data must be an array.'
        }
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle quiz with missing question field', () => {
      const quiz = [
        {
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].question, undefined);
      assert.equal(result[0].id, 1);
    });

    it('should handle quiz with missing options field', () => {
      const quiz = [
        {
          question: 'Test question?',
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].options, undefined);
    });

    it('should handle quiz with missing correct_answer field', () => {
      const quiz = [
        {
          question: 'Test question?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' }
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].correctAnswer, undefined);
    });

    it('should handle quiz with extra fields', () => {
      const quiz = [
        {
          question: 'Test question?',
          options: { A: 'Opt1', B: 'Opt2', C: 'Opt3', D: 'Opt4' },
          correct_answer: 'A',
          extraField: 'should be ignored',
          anotherExtra: 123
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].id, 1);
      assert.equal(result[0].question, 'Test question?');
      assert.equal(result[0].correctAnswer, 'A');
      assert.equal(result[0].extraField, undefined);
      assert.equal(result[0].anotherExtra, undefined);
    });

    it('should handle quiz with null values in fields', () => {
      const quiz = [
        {
          question: null,
          options: null,
          correct_answer: null
        }
      ];

      const result = formatQuizForDisplay(quiz);

      assert.equal(result[0].question, null);
      assert.equal(result[0].options, null);
      assert.equal(result[0].correctAnswer, null);
    });

    it('should handle very large quiz arrays', () => {
      const quiz = Array.from({ length: 1000 }, (_, i) => ({
        question: `Question ${i + 1}?`,
        options: { A: 'A', B: 'B', C: 'C', D: 'D' },
        correct_answer: 'A'
      }));

      const result = formatQuizForDisplay(quiz);

      assert.equal(result.length, 1000);
      assert.equal(result[0].id, 1);
      assert.equal(result[999].id, 1000);
    });
  });
});

describe('formatQuizForExport', () => {
  const sampleQuiz = [
    {
      question: 'What is JavaScript?',
      options: {
        A: 'A programming language',
        B: 'A markup language',
        C: 'A database',
        D: 'An operating system'
      },
      correct_answer: 'A'
    },
    {
      question: 'What does HTML stand for?',
      options: {
        A: 'Hyper Text Markup Language',
        B: 'High Tech Modern Language',
        C: 'Home Tool Markup Language',
        D: 'Hyperlinks and Text Markup Language'
      },
      correct_answer: 'A'
    }
  ];

  describe('JSON Format', () => {
    it('should export quiz as JSON by default', () => {
      const result = formatQuizForExport(sampleQuiz);
      const parsed = JSON.parse(result);

      assert.equal(Array.isArray(parsed), true);
      assert.equal(parsed.length, 2);
      assert.deepEqual(parsed, sampleQuiz);
    });

    it('should export quiz as JSON when format is explicitly "json"', () => {
      const result = formatQuizForExport(sampleQuiz, 'json');
      const parsed = JSON.parse(result);

      assert.deepEqual(parsed, sampleQuiz);
    });

    it('should format JSON with proper indentation', () => {
      const result = formatQuizForExport(sampleQuiz, 'json');

      assert.equal(result.includes('\n'), true);
      assert.equal(result.includes('  '), true);
    });

    it('should handle single question quiz in JSON', () => {
      const singleQuiz = [sampleQuiz[0]];
      const result = formatQuizForExport(singleQuiz, 'json');
      const parsed = JSON.parse(result);

      assert.equal(parsed.length, 1);
      assert.deepEqual(parsed[0], sampleQuiz[0]);
    });

    it('should handle quiz with special characters in JSON', () => {
      const specialQuiz = [
        {
          question: 'What is "JSON"?',
          options: {
            A: 'JavaScript Object Notation',
            B: 'Java\'s Standard Object Notation',
            C: 'Just Some Old Notation',
            D: 'None of the above'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(specialQuiz, 'json');
      const parsed = JSON.parse(result);

      assert.equal(parsed[0].question, 'What is "JSON"?');
      assert.equal(parsed[0].options.B, 'Java\'s Standard Object Notation');
    });
  });

  describe('CSV Format', () => {
    it('should export quiz as CSV with default comma delimiter', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv');

      assert.equal(result.includes('Question,Option A,Option B,Option C,Option D,Correct Answer\n'), true);
      assert.equal(result.includes('"What is JavaScript?"'), true);
      assert.equal(result.includes('"A programming language"'), true);
    });

    it('should export quiz as CSV with custom delimiter', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', ';');

      assert.equal(result.includes('Question;Option A;Option B;Option C;Option D;Correct Answer\n'), true);
      assert.equal(result.includes('"What is JavaScript?"'), true);
      assert.equal(result.split(';').length > result.split(',').length, true);
    });

    it('should export quiz as CSV with tab delimiter', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', '\t');

      assert.equal(result.includes('Question\tOption A'), true);
      assert.equal(result.includes('"What is JavaScript?"'), true);
    });

    it('should export quiz as CSV with pipe delimiter', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', '|');

      assert.equal(result.includes('Question|Option A|Option B'), true);
      assert.equal(result.includes('"What is JavaScript?"'), true);
    });

    it('should handle CSV with single question', () => {
      const singleQuiz = [sampleQuiz[0]];
      const result = formatQuizForExport(singleQuiz, 'csv');
      const lines = result.split('\n').filter(line => line.trim());

      assert.equal(lines.length, 2); // Header + 1 question
    });

    it('should properly quote CSV fields with commas', () => {
      const quizWithCommas = [
        {
          question: 'What is a list, array, or collection?',
          options: {
            A: 'A data structure, used for storing',
            B: 'A function, method, or procedure',
            C: 'A variable, constant, or value',
            D: 'None of the above, below, or beside'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(quizWithCommas, 'csv');

      assert.equal(result.includes('"What is a list, array, or collection?"'), true);
      assert.equal(result.includes('"A data structure, used for storing"'), true);
    });

    it('should handle CSV with quotes in content', () => {
      const quizWithQuotes = [
        {
          question: 'What is "Node.js"?',
          options: {
            A: 'A "runtime" environment',
            B: 'A programming language',
            C: 'A database',
            D: 'An editor'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(quizWithQuotes, 'csv');

      assert.equal(result.includes('"What is "Node.js"?"'), true);
    });

    it('should handle dynamic option keys in CSV', () => {
      const quizWithDifferentOptions = [
        {
          question: 'Test question?',
          options: {
            X: 'Option X',
            Y: 'Option Y',
            Z: 'Option Z'
          },
          correct_answer: 'X'
        }
      ];

      const result = formatQuizForExport(quizWithDifferentOptions, 'csv');

      assert.equal(result.includes('Option X,Option Y,Option Z'), true);
      assert.equal(result.includes('"Option X","Option Y","Option Z"'), true);
    });

    it('should handle varying number of options in CSV', () => {
      const quizWithVaryingOptions = [
        {
          question: 'Binary question?',
          options: {
            A: 'True',
            B: 'False'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(quizWithVaryingOptions, 'csv');

      assert.equal(result.includes('Option A,Option B'), true);
      assert.equal(result.includes('"True","False"'), true);
    });
  });

  describe('TXT Format', () => {
    it('should export quiz as plain text', () => {
      const result = formatQuizForExport(sampleQuiz, 'txt');

      assert.equal(result.includes('1. What is JavaScript?'), true);
      assert.equal(result.includes('2. What does HTML stand for?'), true);
      assert.equal(result.includes('A) A programming language'), true);
      assert.equal(result.includes('Answer: A'), true);
    });

    it('should format text with proper spacing and indentation', () => {
      const result = formatQuizForExport(sampleQuiz, 'txt');

      assert.equal(result.includes('   A)'), true);
      assert.equal(result.includes('   B)'), true);
      assert.equal(result.includes('   Answer:'), true);
      assert.equal(result.includes('\n\n'), true);
    });

    it('should handle single question in text format', () => {
      const singleQuiz = [sampleQuiz[0]];
      const result = formatQuizForExport(singleQuiz, 'txt');

      assert.equal(result.includes('1. What is JavaScript?'), true);
      assert.equal(result.includes('2.'), false);
    });

    it('should handle text with special characters', () => {
      const specialQuiz = [
        {
          question: 'What\'s the "best" language?',
          options: {
            A: 'JavaScript & TypeScript',
            B: 'Python',
            C: 'Java',
            D: 'C++'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(specialQuiz, 'txt');

      assert.equal(result.includes('What\'s the "best" language?'), true);
      assert.equal(result.includes('JavaScript & TypeScript'), true);
    });

    it('should handle dynamic option keys in text format', () => {
      const quizWithDifferentOptions = [
        {
          question: 'Test question?',
          options: {
            X: 'Option X',
            Y: 'Option Y',
            Z: 'Option Z'
          },
          correct_answer: 'X'
        }
      ];

      const result = formatQuizForExport(quizWithDifferentOptions, 'txt');

      assert.equal(result.includes('X) Option X'), true);
      assert.equal(result.includes('Y) Option Y'), true);
      assert.equal(result.includes('Z) Option Z'), true);
    });

    it('should maintain correct numbering for multiple questions in text', () => {
      const result = formatQuizForExport(sampleQuiz, 'txt');
      const lines = result.split('\n');

      const question1Line = lines.find(line => line.includes('1. What is JavaScript?'));
      const question2Line = lines.find(line => line.includes('2. What does HTML stand for?'));

      assert.notEqual(question1Line, undefined);
      assert.notEqual(question2Line, undefined);
    });

    it('should handle long questions in text format', () => {
      const longQuiz = [
        {
          question: 'This is a very long question that spans multiple lines and contains a lot of text to test how the formatter handles lengthy content in the text export format?',
          options: {
            A: 'Short answer',
            B: 'Another short answer',
            C: 'Yet another short answer',
            D: 'Final short answer'
          },
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(longQuiz, 'txt');

      assert.equal(result.includes('This is a very long question'), true);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when quiz is not an array', () => {
      assert.throws(
        () => formatQuizForExport('not an array'),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });

    it('should throw error when quiz is an empty array', () => {
      assert.throws(
        () => formatQuizForExport([]),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });

    it('should throw error when quiz is null', () => {
      assert.throws(
        () => formatQuizForExport(null),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });

    it('should throw error when quiz is undefined', () => {
      assert.throws(
        () => formatQuizForExport(undefined),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });

    it('should throw error for unsupported format', () => {
      assert.throws(
        () => formatQuizForExport(sampleQuiz, 'xml'),
        {
          name: 'Error',
          message: 'Unsupported format: xml. Use one of: json, csv, txt'
        }
      );
    });

    it('should throw error for unsupported format - pdf', () => {
      assert.throws(
        () => formatQuizForExport(sampleQuiz, 'pdf'),
        {
          name: 'Error',
          message: 'Unsupported format: pdf. Use one of: json, csv, txt'
        }
      );
    });

    it('should throw error for unsupported format - html', () => {
      assert.throws(
        () => formatQuizForExport(sampleQuiz, 'html'),
        {
          name: 'Error',
          message: 'Unsupported format: html. Use one of: json, csv, txt'
        }
      );
    });

    it('should throw error for empty string format', () => {
      assert.throws(
        () => formatQuizForExport(sampleQuiz, ''),
        {
          name: 'Error',
          message: 'Unsupported format: . Use one of: json, csv, txt'
        }
      );
    });

    it('should throw error when quiz is a number', () => {
      assert.throws(
        () => formatQuizForExport(123),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });

    it('should throw error when quiz is an object', () => {
      assert.throws(
        () => formatQuizForExport({ question: 'test' }),
        {
          name: 'Error',
          message: 'Quiz data must be a non-empty array.'
        }
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle quiz with missing options field in CSV', () => {
      const incompleteQuiz = [
        {
          question: 'Test question?',
          correct_answer: 'A'
        }
      ];

      assert.throws(
        () => formatQuizForExport(incompleteQuiz, 'csv'),
        {
          name: 'TypeError'
        }
      );
    });

    it('should handle quiz with empty options object in CSV', () => {
      const emptyOptionsQuiz = [
        {
          question: 'Test question?',
          options: {},
          correct_answer: 'A'
        }
      ];

      const result = formatQuizForExport(emptyOptionsQuiz, 'csv');

      assert.equal(result.includes("Question,,Correct Answer"), true);
    });

    it('should handle quiz with undefined fields in text format', () => {
      const incompleteQuiz = [
        {
          question: undefined,
          options: { A: 'Opt1', B: 'Opt2' },
          correct_answer: undefined
        }
      ];

      const result = formatQuizForExport(incompleteQuiz, 'txt');

      assert.equal(result.includes('1. undefined'), true);
      assert.equal(result.includes('Answer: undefined'), true);
    });

    it('should handle very large quiz exports', () => {
      const largeQuiz = Array.from({ length: 100 }, (_, i) => ({
        question: `Question ${i + 1}?`,
        options: { A: 'A', B: 'B', C: 'C', D: 'D' },
        correct_answer: 'A'
      }));

      const jsonResult = formatQuizForExport(largeQuiz, 'json');
      const csvResult = formatQuizForExport(largeQuiz, 'csv');
      const txtResult = formatQuizForExport(largeQuiz, 'txt');

      assert.equal(JSON.parse(jsonResult).length, 100);
      assert.equal(csvResult.split('\n').filter(l => l.trim()).length, 101); // Header + 100 questions
      assert.equal(txtResult.includes('100. Question 100?'), true);
    });

    it('should handle quiz with newlines in questions', () => {
      const quizWithNewlines = [
        {
          question: 'What is this?\nA test question?',
          options: {
            A: 'Option A\nwith newline',
            B: 'Option B',
            C: 'Option C',
            D: 'Option D'
          },
          correct_answer: 'A'
        }
      ];

      const txtResult = formatQuizForExport(quizWithNewlines, 'txt');
      const jsonResult = formatQuizForExport(quizWithNewlines, 'json');

      assert.equal(txtResult.includes('What is this?'), true);
      assert.equal(JSON.parse(jsonResult)[0].question.includes('\n'), true);
    });

    it('should handle quiz with unicode characters', () => {
      const unicodeQuiz = [
        {
          question: '¿Qué es JavaScript? 日本語',
          options: {
            A: 'Lenguaje de programación',
            B: 'プログラミング言語',
            C: 'Both',
            D: 'Neither'
          },
          correct_answer: 'C'
        }
      ];

      const jsonResult = formatQuizForExport(unicodeQuiz, 'json');
      const csvResult = formatQuizForExport(unicodeQuiz, 'csv');
      const txtResult = formatQuizForExport(unicodeQuiz, 'txt');

      assert.equal(JSON.parse(jsonResult)[0].question, '¿Qué es JavaScript? 日本語');
      assert.equal(csvResult.includes('¿Qué es JavaScript? 日本語'), true);
      assert.equal(txtResult.includes('¿Qué es JavaScript? 日本語'), true);
    });

    it('should handle quiz with emoji in content', () => {
      const emojiQuiz = [
        {
          question: 'What emoji represents JavaScript? 🚀',
          options: {
            A: '💻 Computer',
            B: '📱 Mobile',
            C: '🌐 Web',
            D: '✨ Magic'
          },
          correct_answer: 'C'
        }
      ];

      const jsonResult = formatQuizForExport(emojiQuiz, 'json');
      const txtResult = formatQuizForExport(emojiQuiz, 'txt');

      assert.equal(jsonResult.includes('🚀'), true);
      assert.equal(txtResult.includes('💻'), true);
    });

    it('should handle case sensitivity in format parameter', () => {
      // Should fail with uppercase format
      assert.throws(
        () => formatQuizForExport(sampleQuiz, 'JSON'),
        {
          name: 'Error',
          message: 'Unsupported format: JSON. Use one of: json, csv, txt'
        }
      );

      assert.throws(
        () => formatQuizForExport(sampleQuiz, 'CSV'),
        {
          name: 'Error',
          message: 'Unsupported format: CSV. Use one of: json, csv, txt'
        }
      );
    });

    it('should handle null delimiter in CSV', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', null);

      // Should use null as string delimiter
      assert.equal(typeof result, 'string');
    });

    it('should handle empty string delimiter in CSV', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', '');

      // Should concatenate without delimiter
      assert.equal(typeof result, 'string');
      assert.equal(result.includes('QuestionOption A'), true);
    });

    it('should handle multi-character delimiter in CSV', () => {
      const result = formatQuizForExport(sampleQuiz, 'csv', ' | ');

      assert.equal(result.includes('Question | Option A'), true);
      assert.equal(result.includes(' | Correct Answer'), true);
    });
  });

  describe('Integration Tests', () => {
    it('should format and export the same quiz in all three formats', () => {
      const testQuiz = [
        {
          question: 'Integration test question?',
          options: {
            A: 'Answer A',
            B: 'Answer B',
            C: 'Answer C',
            D: 'Answer D'
          },
          correct_answer: 'B'
        }
      ];

      const jsonResult = formatQuizForExport(testQuiz, 'json');
      const csvResult = formatQuizForExport(testQuiz, 'csv');
      const txtResult = formatQuizForExport(testQuiz, 'txt');

      // Verify all formats contain the question
      assert.equal(JSON.parse(jsonResult)[0].question, 'Integration test question?');
      assert.equal(csvResult.includes('Integration test question?'), true);
      assert.equal(txtResult.includes('Integration test question?'), true);

      // Verify all formats contain the correct answer
      assert.equal(JSON.parse(jsonResult)[0].correct_answer, 'B');
      assert.equal(csvResult.includes('"B"'), true);
      assert.equal(txtResult.includes('Answer: B'), true);
    });

    it('should maintain data integrity across format conversions', () => {
      const originalQuiz = [
        {
          question: 'Data integrity test?',
          options: {
            A: 'First option',
            B: 'Second option',
            C: 'Third option',
            D: 'Fourth option'
          },
          correct_answer: 'C'
        }
      ];

      // Export to JSON and parse back
      const jsonExport = formatQuizForExport(originalQuiz, 'json');
      const parsedQuiz = JSON.parse(jsonExport);

      assert.deepEqual(parsedQuiz, originalQuiz);
    });

    it('should handle consecutive exports without side effects', () => {
      const testQuiz = [sampleQuiz[0]];

      const result1 = formatQuizForExport(testQuiz, 'json');
      const result2 = formatQuizForExport(testQuiz, 'json');
      const result3 = formatQuizForExport(testQuiz, 'csv');
      const result4 = formatQuizForExport(testQuiz, 'csv');

      assert.equal(result1, result2);
      assert.equal(result3, result4);
    });
  });

  describe('Performance Tests', () => {
    it('should handle export of large quiz efficiently', () => {
      const largeQuiz = Array.from({ length: 1000 }, (_, i) => ({
        question: `Performance test question ${i + 1}?`,
        options: {
          A: `Option A for question ${i + 1}`,
          B: `Option B for question ${i + 1}`,
          C: `Option C for question ${i + 1}`,
          D: `Option D for question ${i + 1}`
        },
        correct_answer: ['A', 'B', 'C', 'D'][i % 4]
      }));

      const startTime = Date.now();
      const result = formatQuizForExport(largeQuiz, 'json');
      const endTime = Date.now();

      assert.equal(JSON.parse(result).length, 1000);
      assert.equal(endTime - startTime < 1000, true); // Should complete within 1 second
    });
  });
});