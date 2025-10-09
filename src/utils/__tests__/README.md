# Formatter Utility Tests

This directory contains comprehensive unit tests for the `formatter.js` utility module.

## Running Tests

```bash
# Run all tests
npm test

# Run only formatter tests
npm run test:formatter

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests directly with Node.js
node --test src/utils/__tests__/formatter.test.js
```

## Test Coverage

The test suite includes **66 comprehensive tests** covering:

### formatQuizForDisplay
- ✅ Happy path scenarios (8 tests)
- ✅ Error handling (6 tests)
- ✅ Edge cases (6 tests)

### formatQuizForExport
- ✅ JSON format export (5 tests)
- ✅ CSV format export with various delimiters (9 tests)
- ✅ TXT format export (7 tests)
- ✅ Error handling (10 tests)
- ✅ Edge cases (11 tests)
- ✅ Integration tests (3 tests)
- ✅ Performance tests (1 test)

## Test Scenarios

### Happy Path Tests
- Single and multiple quiz questions
- Empty arrays
- Special characters and unicode
- Long content handling
- Various option structures

### Error Handling Tests
- Invalid input types (null, undefined, strings, numbers, objects, booleans)
- Empty arrays for export functions
- Unsupported export formats
- Case sensitivity validation

### Edge Cases
- Missing fields
- Extra fields
- Null values
- Very large datasets (1000+ questions)
- Dynamic option keys (not just A, B, C, D)
- Various delimiters (comma, semicolon, tab, pipe, multi-character)
- Unicode and emoji content
- Newlines in questions and answers

### Integration Tests
- Cross-format consistency
- Data integrity across conversions
- Idempotency checks

### Performance Tests
- Large dataset handling (1000 questions)
- Execution time verification

## Test Framework

Tests use Node.js built-in test runner (available in Node.js 18+):
- `node:test` for test execution
- `node:assert/strict` for assertions
- No external dependencies required

## Adding New Tests

When adding new tests, follow the existing structure:

```javascript
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatQuizForDisplay, formatQuizForExport } from '../formatter.js';

describe('Your Test Suite', () => {
  it('should do something specific', () => {
    const input = [...];
    const result = formatQuizForDisplay(input);
    assert.equal(result.length, expectedLength);
  });
});
```

## Test Statistics

- **Total Tests**: 66
- **Passing**: 66
- **Coverage**: All public functions
- **Execution Time**: ~140ms

## Future Enhancements

Potential areas for additional testing:
- Stress tests with extremely large datasets
- Concurrent execution tests
- Memory leak detection
- More complex CSV escaping scenarios