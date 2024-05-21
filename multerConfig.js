const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { bucket } = require("./firebaseConfig");

// Multer storage configuration
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).fields([
  { name: "backgroundImage", maxCount: 1 },
  { name: "eventLogo", maxCount: 1 },
]);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Upload file to Firebase Storage
const uploadToFirebase = async (file) => {
  const blob = bucket.file(uuidv4() + path.extname(file.originalname));
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      reject(err);
    });

    blobStream.on("finish", async () => {
      // Make the file public
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { upload, uploadToFirebase };
