const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error(`Only files of type ${allowedTypes.toString()} are allowed!`), false);
    }
  };
};

const upload = (allowedTypes,fieldName = "file", maxFiles = 5) => {
  return {
    uploadMultiple: multer({
      storage: storage,
      fileFilter: fileFilter(allowedTypes),
    }).array(fieldName, maxFiles),

    uploadSingle: multer({
      storage: storage,
      fileFilter: fileFilter(allowedTypes),
    }).single(fieldName),
  };
};

module.exports = upload;