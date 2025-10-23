// src/test/test.js

const fs = require('fs');

// ❌ Violation: using raw promise instead of async/await
function readFilePromise(filePath) {
  const path = require('path');
  const baseDir = path.resolve(__dirname, 'safe_directory');
  const resolvedPath = path.resolve(baseDir, filePath);
  if (!resolvedPath.startsWith(baseDir)) {
    return Promise.reject(new Error('Invalid file path'));
  }
  return fs.promises.readFile(resolvedPath, 'utf-8')
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });
}

// ❌ Violation: missing error handling in async function
async function writeFileAsync(filePath, content) {
  await fs.promises.writeFile(filePath, content); // no try/catch
}

// ❌ Violation: hardcoded secret
const API_KEY = '12345-secret-key';

module.exports = { readFilePromise, writeFileAsync, API_KEY };

