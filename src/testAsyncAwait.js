// src/testAsyncAwait.js

// ❌ Bad example: raw Promise, no async/await, no error handling
function fetchDataBad() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("data");
    }, 1000);
  });
}

// ❌ Bad example: async function but no try/catch
async function fetchDataNoCatch() {
  const data = await fetchDataBad();
  console.log(data);
}

// ✅ Good example: async/await with proper error handling
async function fetchDataGood() {
  try {
    const data = await fetchDataBad();
    console.log("Fetched data:", data);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Test calls
fetchDataBad();
fetchDataNoCatch();
fetchDataGood();
