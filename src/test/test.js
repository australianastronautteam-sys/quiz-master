// src/test/test.js

const fs = require('fs');

// ❌ Violation: using raw promise instead of async/await
function readFilePromise(filePath) {
  return fs.promises.readFile(filePath, 'utf-8')
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });
}

// ❌ Violation: missing error handling in async function
async function writeFileAsync(filePath, content) {
  fs.promises.writeFile(filePath, content); // no try/catch
}

// ❌ Violation: hardcoded secret
const API_KEY = '12345-secret-key';

module.exports = { readFilePromise, writeFileAsync, API_KEY };

