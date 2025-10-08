import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory already exists');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Setting destination to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    console.log('📝 Original filename:', file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 Checking file type:', file.mimetype);
  if (file.mimetype === 'application/pdf') {
    console.log('✅ PDF file accepted');
    cb(null, true);
  } else {
    console.log('❌ File rejected, not a PDF');
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Add middleware to log file info after upload
const uploadWithLogging = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('❌ Upload error:', err.message);
        return next(err);
      }
      
      if (req.file) {
        console.log('✅ File uploaded successfully:');
        console.log('  - Original name:', req.file.originalname);
        console.log('  - Saved as:', req.file.filename);
        console.log('  - Full path:', req.file.path);
        console.log('  - Size:', req.file.size, 'bytes');
        console.log('  - File exists:', fs.existsSync(req.file.path));
      }
      
      next();
    });
  };
};

export default upload;
export { uploadWithLogging };