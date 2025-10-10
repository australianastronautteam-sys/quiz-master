import fs from 'fs';
import path from 'path';

// Try multiple PDF parsing approaches
export async function parsePDF(filePath) {
  console.log("Starting PDF parsing...");
  console.log("File path:", filePath);
  
  try {
    // Check if file exists
    // Use the path module already imported at line 2
    const baseDir = path.resolve('/your/allowed/base/directory');
    const resolvedPath = path.resolve(baseDir, filePath);
    if (!resolvedPath.startsWith(baseDir + path.sep)) {
      throw new Error('Invalid file path');
    }
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }

    console.log("File exists, reading...");
    const dataBuffer = fs.readFileSync(resolvedPath);
    console.log("File read successfully, buffer length:", dataBuffer.length);

    // Try Method 1: Standard pdf-parse import
    try {
      console.log("📦 Attempting Method 1: Standard pdf-parse import...");
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(dataBuffer);
      console.log("✅ Method 1 successful!");
      return await handleParseResult(data, resolvedPath);
    } catch (method1Error) {
      console.log("Method 1 failed:", method1Error.message);
    }

    // Try Method 2: Dynamic require with createRequire
    try {
      console.log("Attempting Method 2: Dynamic require...");
      const { createRequire } = await import('module');
      const require = createRequire(import.meta.url);
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(dataBuffer);
      console.log("✅ Method 2 successful!");
      return await handleParseResult(data, resolvedPath);
    } catch (method2Error) {
      console.log("Method 2 failed:", method2Error.message);
    }

    // Try Method 3: Alternative import syntax
    try {
      console.log("Attempting Method 3: Alternative import...");
      const pdfParseModule = await import('pdf-parse');
      const pdfParse = pdfParseModule.default || pdfParseModule;
      if (typeof pdfParse === 'function') {
        const data = await pdfParse(dataBuffer);
        console.log("✅ Method 3 successful!");
        return await handleParseResult(data, resolvedPath);
      }
    } catch (method3Error) {
      console.log("Method 3 failed:", method3Error.message);
    }

    // Try Method 4: Using pdfjs-dist (alternative library)
    try {
      console.log("Attempting Method 4: pdfjs-dist...");
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
      const text = await parsePDFWithPDFJS(dataBuffer, pdfjsLib);
      console.log("Method 4 successful!");
      
      // Clean up file
      fs.unlinkSync(resolvedPath);
      console.log("🗑️ Temporary file cleaned up");
      
      return text;
    } catch (method4Error) {
      console.log("Method 4 failed:", method4Error.message);
    }

    throw new Error("All PDF parsing methods failed. Please check your PDF file and try again.");

  } catch (error) {
    console.error("PDF parsing completely failed:", error.message);
    
    // Clean up file on error
    // Use the path module already imported at line 2
    const baseDir = path.resolve('/your/allowed/base/directory');
    const resolvedPath = path.resolve(baseDir, filePath);
    if (fs.existsSync(resolvedPath)) {
      try {
        fs.unlinkSync(resolvedPath);
        console.log("🗑️ File cleaned up after error");
      } catch (cleanupError) {
        console.warn("Could not clean up file:", cleanupError.message);
      }
    }
    
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
}

async function handleParseResult(data, filePath) {
  // Clean up the uploaded file after successful parsing
  try {
    fs.unlinkSync(filePath);
    console.log("🗑️ Temporary file cleaned up");
  } catch (cleanupError) {
    console.warn("Warning: Could not clean up file:", cleanupError.message);
  }
  
  if (!data.text || data.text.trim().length === 0) {
    throw new Error('No text content found in PDF - the PDF might be image-based or corrupted');
  }

  console.log("PDF processing completed successfully");
  console.log("Text length:", data.text.length);
  return data.text.trim();
}

async function parsePDFWithPDFJS(buffer, pdfjsLib) {
  console.log("Using pdfjs-dist to parse PDF...");
  
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  if (!fullText.trim()) {
    throw new Error('No text content found in PDF using pdfjs-dist');
  }
  
  return fullText.trim();
}

export function validateText(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }
  
  if (text.trim().length < 50) {
    throw new Error('Text must be at least 50 characters long to generate meaningful questions');
  }
  
  return text.trim();
}