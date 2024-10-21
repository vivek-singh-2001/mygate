const multer = require("multer");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

// Create upload middleware for multiple files
const uploadMultiple = multer({ storage: storage }).array("files", 5); 
// Create upload middleware for a single file
const uploadSingle = multer({ storage: storage }).single("file");


module.exports = { uploadMultiple, uploadSingle };
